#!/usr/bin/env python3
"""Calls Autofill's MCP tools through Craft's stdio MCP server in the DDEV testbench, the way an agent would.

Usage:
  tests/mcp/mcp-call.py <user> --list
  tests/mcp/mcp-call.py <user> <tool> '<json arguments>' [<tool> '<json>' ...]

Set MCP_CALL_JSON=1 to print one JSON array of results (used by the tests). Set AUTOFILL_TEST_PROVIDER_FIXTURE=1 to
answer runs with the testbench's deterministic fixture provider instead of a real AI provider.
Requires `ddev start`. It uses `docker exec -i`, because `ddev exec` doesn't forward stdin.
"""
import json, os, subprocess, sys

container = os.environ.get('MCP_CONTAINER', 'ddev-craft-autofill-testbench-web')
workdir = os.environ.get('MCP_WORKDIR', '/var/www/html/testbench')
env_args = []
for name in ('AUTOFILL_TEST_PROVIDER_FIXTURE', 'CRAFT_DB_DATABASE'):
    if os.environ.get(name):
        env_args += ['-e', f'{name}={os.environ[name]}']
if os.environ.get('AUTOFILL_TEST_PROVIDER_FIXTURE') == '1':
    env_args += ['-e', 'AUTOFILL_FIXTURE_API_KEY=fixture']

user, calls = sys.argv[1], sys.argv[2:]
proc = subprocess.Popen(
    ['docker', 'exec', '-i', '-u', str(os.getuid()), '-w', workdir, *env_args, container, 'php', 'craft', 'mcp/serve', f'--user={user}'],
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1,
)
next_id = 0

def send(method, params=None, notify=False):
    global next_id
    message = {'jsonrpc': '2.0', 'method': method}
    if params is not None:
        message['params'] = params
    if not notify:
        next_id += 1
        message['id'] = next_id
    proc.stdin.write(json.dumps(message) + '\n')
    proc.stdin.flush()
    if notify:
        return None
    while True:
        line = proc.stdout.readline()
        if not line:
            raise SystemExit('Server closed: ' + proc.stderr.read())
        reply = json.loads(line)
        if reply.get('id') == next_id:
            return reply

init = send('initialize', {'protocolVersion': '2025-06-18', 'capabilities': {}, 'clientInfo': {'name': 'autofill-mcp-test', 'version': '1'}})
send('notifications/initialized', notify=True)

if calls == ['--list']:
    tools, cursor = [], None
    while True:
        page = send('tools/list', {'cursor': cursor} if cursor else {})['result']
        tools += page['tools']
        cursor = page.get('nextCursor')
        if not cursor:
            break
    if os.environ.get('MCP_CALL_JSON') == '1':
        print(json.dumps({'instructions': init['result'].get('instructions', ''), 'tools': tools}))
    else:
        print('\n'.join(sorted(tool['name'] for tool in tools)))
else:
    machine = os.environ.get('MCP_CALL_JSON') == '1'
    results = []
    for tool, args in zip(calls[0::2], calls[1::2]):
        reply = send('tools/call', {'name': tool, 'arguments': json.loads(args)})
        result = reply.get('result', reply)
        entry = {'tool': tool, 'isError': bool(result.get('isError')) or 'error' in reply, 'content': result.get('structuredContent'), 'text': [c.get('text') for c in result.get('content', []) if isinstance(c, dict)]}
        if 'error' in reply:
            entry['text'] = [reply['error'].get('message')]
        if machine:
            results.append(entry)
            continue
        print(f'--- {tool}' + (' (error)' if entry['isError'] else ''))
        print(json.dumps(entry['content'], indent=2) if entry['content'] is not None else '\n'.join(t or '' for t in entry['text']))
    if machine:
        print(json.dumps(results))
proc.stdin.close()
proc.terminate()
