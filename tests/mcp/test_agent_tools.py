"""Autofill's MCP tools, used the way an agent uses them: over Craft's stdio MCP server, as real Craft users.

Run with tests/mcp/run, which prepares db_test and the fixture users. The core promise under test: agents can learn,
configure and run Autofill, but people stay in charge of what gets saved to content.
"""
import json
import os
import subprocess
import unittest
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = json.loads(os.environ.get('AUTOFILL_MCP_FIXTURE', '{}'))
TOOLS = {
    'autofill_guide', 'autofill_targets_list', 'autofill_fields_list', 'autofill_workflows_list',
    'autofill_workflows_get', 'autofill_workflows_create', 'autofill_workflows_update', 'autofill_workflows_archive',
    'autofill_prompt_preview', 'autofill_run', 'autofill_runs_list', 'autofill_runs_get', 'autofill_runs_cancel',
}


def _driver(user, *args):
    output = subprocess.run(
        ['python3', str(ROOT / 'tests/mcp/mcp-call.py'), user, *args],
        cwd=ROOT, env={**os.environ, 'MCP_CALL_JSON': '1'}, capture_output=True, text=True, check=True,
    ).stdout
    return json.loads(output.strip().splitlines()[-1])


def call(user, tool, arguments=None):
    """Calls one tool and returns its result entry ({isError, content, text})."""
    return _driver(user, tool, json.dumps(arguments or {}))[0]


def ok(user, tool, arguments=None):
    result = call(user, tool, arguments)
    if result['isError']:
        raise AssertionError(f'{tool} failed: {result["text"]}')
    return result['content']


def error(user, tool, arguments=None):
    result = call(user, tool, arguments)
    if not result['isError']:
        raise AssertionError(f'{tool} was expected to fail but returned {result["content"]}')
    return ' '.join(text or '' for text in result['text'])


ADMIN = FIXTURE.get('username', 'admin')
MANAGER = FIXTURE.get('managerUsername')
EDITOR = FIXTURE.get('editorUsername')


@unittest.skipUnless(FIXTURE, 'Run through tests/mcp/run, which seeds the fixture.')
class AgentToolsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        targets = ok(ADMIN, 'autofill_targets_list')
        section = FIXTURE['sectionHandle']
        cls.entry_type = next(t['handle'] for t in targets['entryTypes'] if any(s['handle'] == section for s in t['sections']))
        cls.field = FIXTURE['targetFieldHandle']

    def create_workflow(self, user=None, **overrides):
        workflow = {
            'name': f'Agent test {uuid.uuid4().hex[:8]}',
            'target': {'entryType': self.entry_type},
            'instructions': 'Agent test instructions.',
            'allowEditorInstructions': True,
            'outputs': [{'field': self.field, 'instructions': 'Write a short value.'}],
            **overrides,
        }
        return ok(user or MANAGER, 'autofill_workflows_create', {'workflow': workflow})['workflow']

    def entry_value(self):
        element = ok(ADMIN, 'elements_get', {'type': 'entries', 'id': FIXTURE['entryId'], 'fields': [self.field]})['element']
        return element.get(self.field)

    # Discovery -----------------------------------------------------------------

    def test_tools_and_connect_instructions_are_offered_to_autofill_users(self):
        listing = _driver(ADMIN, '--list')
        self.assertTrue(TOOLS <= {tool['name'] for tool in listing['tools']})
        self.assertIn('autofill_guide', listing['instructions'])

    def test_users_without_autofill_access_get_no_autofill_tools(self):
        listing = _driver(EDITOR, '--list')
        self.assertFalse({tool['name'] for tool in listing['tools']} & TOOLS)
        self.assertNotIn('autofill_guide', listing['instructions'])

    def test_guide_explains_the_rules_and_the_users_permissions(self):
        guide = ok(MANAGER, 'autofill_guide')
        self.assertTrue(any('requires review' in rule for rule in guide['rules']))
        self.assertTrue(guide['you']['canCreateWorkflows'])
        self.assertFalse(guide['you']['canArchiveWorkflows'])
        fields = ok(MANAGER, 'autofill_fields_list', {'entryType': self.entry_type})['fields']
        self.assertIn(self.field, [field['handle'] for field in fields])

    # Review stays with people ----------------------------------------------------

    def test_outputs_created_by_agents_always_require_review(self):
        workflow = self.create_workflow(outputs=[{
            'field': self.field, 'instructions': 'Try to skip review.', 'requiresApproval': False, 'review': 'automatic',
        }])
        self.assertEqual(workflow['visibility'], 'private')
        self.assertEqual([output['review'] for output in workflow['outputs']], ['required'])

    def test_automatic_outputs_set_up_by_people_cannot_be_changed_by_agents(self):
        handle = FIXTURE['protectedWorkflowHandle']
        message = error(MANAGER, 'autofill_workflows_update', {'handle': handle, 'changes': {
            'outputs': [{'field': self.field, 'instructions': 'Changed by an agent.'}],
        }})
        self.assertIn('applies automatically', message)

        # Reading the workflow, editing a review-required output and sending it all back works.
        workflow = ok(MANAGER, 'autofill_workflows_get', {'handle': handle})['workflow']
        for output in workflow['outputs']:
            if output['field'] == 'title':
                output['instructions'] = 'Edited by an agent.'
        saved = ok(MANAGER, 'autofill_workflows_update', {'handle': handle, 'changes': workflow})['workflow']
        outputs = {output['field']: output for output in saved['outputs']}
        self.assertEqual(outputs['title']['instructions'], 'Edited by an agent.')
        self.assertEqual(outputs[self.field]['instructions'], 'Protected automatic instructions')
        self.assertTrue(outputs[self.field]['review'].startswith('automatic'))

        # Leaving the automatic output out keeps it too.
        saved = ok(MANAGER, 'autofill_workflows_update', {'handle': handle, 'changes': {
            'outputs': [{'field': 'title', 'instructions': 'Only title.'}],
        }})['workflow']
        self.assertIn(self.field, [output['field'] for output in saved['outputs']])

    def test_runs_return_results_for_review_without_changing_content(self):
        before = self.entry_value()
        workflow = self.create_workflow()
        result = ok(MANAGER, 'autofill_run', {'workflow': workflow['handle'], 'elementIds': [FIXTURE['entryId']], 'wait': True})
        run = result['runs'][0]['run']
        self.assertEqual(run['status'], 'ready')
        self.assertIn('/autofill/inbox/', run['reviewUrl'])
        self.assertEqual([item['state'] for item in run['results']], ['pending'])
        self.assertTrue(run['results'][0]['suggestedValue'])
        self.assertEqual(self.entry_value(), before)

        detail = ok(MANAGER, 'autofill_runs_get', {'id': run['id']})['run']
        self.assertEqual(detail['results'][0]['field'], self.field)
        listed = ok(MANAGER, 'autofill_runs_list', {'workflow': workflow['handle']})['runs']
        self.assertEqual([item['id'] for item in listed], [run['id']])

    def test_agents_can_cancel_unfinished_runs_but_not_results_waiting_for_review(self):
        workflow = self.create_workflow()
        queued = ok(MANAGER, 'autofill_run', {'workflow': workflow['handle'], 'elementIds': [FIXTURE['entryId']]})['runs'][0]['run']
        self.assertEqual(queued['status'], 'queued')
        self.assertEqual(ok(MANAGER, 'autofill_runs_cancel', {'id': queued['id']})['run']['status'], 'cancelled')

        ready = ok(MANAGER, 'autofill_run', {'workflow': workflow['handle'], 'elementIds': [FIXTURE['entryId']], 'wait': True})['runs'][0]['run']
        self.assertIn('handled by people', error(MANAGER, 'autofill_runs_cancel', {'id': ready['id']}))

    # Permissions and limits ----------------------------------------------------------

    def test_only_administrators_can_archive_workflows(self):
        workflow = self.create_workflow()
        self.assertIn('Only administrators', error(MANAGER, 'autofill_workflows_archive', {'handle': workflow['handle']}))
        self.assertTrue(ok(ADMIN, 'autofill_workflows_archive', {'handle': workflow['handle']})['archived'])
        self.assertIn('archived', error(MANAGER, 'autofill_run', {'workflow': workflow['handle'], 'elementIds': [FIXTURE['entryId']]}))
        self.assertFalse(ok(ADMIN, 'autofill_workflows_archive', {'handle': workflow['handle'], 'archived': False})['archived'])

    def test_run_instructions_are_refused_when_the_workflow_does_not_allow_them(self):
        workflow = self.create_workflow(allowEditorInstructions=False)
        message = error(MANAGER, 'autofill_run', {
            'workflow': workflow['handle'], 'elementIds': [FIXTURE['entryId']], 'instructions': 'Extra.',
        })
        self.assertIn('doesn’t accept extra instructions', message)

    def test_errors_tell_the_agent_what_to_do_next(self):
        message = error(MANAGER, 'autofill_workflows_create', {'workflow': {
            'name': 'Broken', 'target': {'entryType': self.entry_type},
            'outputs': [{'field': 'doesNotExist', 'instructions': 'x'}],
        }})
        self.assertIn('autofill_fields_list', message)
        self.assertIn('autofill_workflows_list', error(MANAGER, 'autofill_workflows_get', {'handle': 'no-such-workflow'}))

    def test_several_items_run_as_a_bulk_batch(self):
        asset_ids = [FIXTURE['assetId'], FIXTURE['bulkAsset']['id']]
        result = ok(ADMIN, 'autofill_run', {'workflow': FIXTURE['assetWorkflowHandle'], 'elementIds': asset_ids})
        self.assertEqual([run['started'] for run in result['runs']], [True, True])
        self.assertIn('wait only works', error(ADMIN, 'autofill_run', {
            'workflow': FIXTURE['assetWorkflowHandle'], 'elementIds': asset_ids, 'wait': True,
        }))

    def test_prompt_preview_shows_the_instructions_without_running(self):
        workflow = self.create_workflow(instructions='Unique preview marker 4815.')
        prompt = ok(MANAGER, 'autofill_prompt_preview', {'workflow': workflow['handle'], 'elementId': FIXTURE['entryId']})['prompt']
        self.assertIn('Unique preview marker 4815.', prompt)
        self.assertEqual(ok(MANAGER, 'autofill_runs_list', {'workflow': workflow['handle']})['runs'], [])


if __name__ == '__main__':
    unittest.main()
