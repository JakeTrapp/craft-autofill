<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\base\Model;
use craft\elements\User;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\records\WorkflowRunRecord;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\openai\OpenAiProvider;
use Tests\Support\TestProject;

final class WorkflowRunLifecycleTest extends Unit
{
    public function testLiteQueuesRestoresAndAppliesOnlyOnceWithoutInbox(): void
    {
        $fixture = TestProject::create(new PlainText(['name' => 'Background target', 'handle' => 'backgroundTarget']), AutofillPlugin::EDITION_LITE);
        $plugin = AutofillPlugin::getInstance();
        $actor = User::find()->admin()->one();
        self::assertNotNull($actor);
        $settings = $plugin->getSettings();
        $previous = $settings->modelConfigs;
        $provider = new BackgroundFixtureProvider();
        $settings->modelConfigs = [['uid' => 'background-fixture', 'provider' => 'openai', 'modelId' => 'fixture', 'apiKeyEnv' => '$OPENAI_API_KEY', 'enabled' => true]];
        $plugin->getAiService()->registerProvider($provider);
        try {
            $workflow = new Workflow([
                'handle' => 'background-lite', 'name' => 'Background Lite', 'ownerId' => (int)$actor->id,
                'entryTypeUid' => (string)$fixture['entry']->getType()->uid, 'modelConfigUid' => 'background-fixture',
                'rows' => [['targetFieldUid' => $fixture['targetUid'], 'requiresApproval' => true, 'prompt' => 'Generate a value.']],
            ]);
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $initialNotifications = $service->notificationState($actor);
            $run = $service->start($workflow, $fixture['entry'], $actor);
            self::assertSame('queued', $run->status);
            self::assertSame($initialNotifications, $service->notificationState($actor));
            self::assertSame((int)$run->id, (int)$service->start($workflow, $fixture['entry'], $actor)->id);
            $service->process((int)$run->id);
            $run = WorkflowRunRecord::findOne($run->id);
            self::assertSame('ready', $run->status, $run->errorMessage ?? '');
            self::assertSame([
                'count' => $initialNotifications['count'] + 1,
                'latestId' => (int)$run->id,
            ], $service->notificationState($actor));
            self::assertSame(1, $provider->calls);
            self::assertSame((int)$run->id, (int)$service->start($workflow, $fixture['entry'], $actor)->id);
            $payload = $service->payload($run, $actor);
            self::assertTrue($payload['canReview']);
            self::assertCount(1, $payload['suggestions']);
            $service->decide((int)$run->id, 0, $actor, true);
            self::assertSame('Background fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('backgroundTarget'));
            $service->process((int)$run->id);
            self::assertSame(1, $provider->calls);
            self::assertSame('completed', WorkflowRunRecord::findOne($run->id)->status);
            self::assertSame($initialNotifications, $service->notificationState($actor));

            $repeat = $service->start($workflow, $fixture['entry'], $actor);
            self::assertNotSame((int)$run->id, (int)$repeat->id);
            $service->process((int)$repeat->id);
            $repeat = WorkflowRunRecord::findOne($repeat->id);
            self::assertSame('completed', $repeat->status, $repeat->errorMessage ?? '');
            self::assertSame(['unchanged'], array_column($service->payload($repeat, $actor)['suggestions'], 'state'));
            self::assertSame($initialNotifications, $service->notificationState($actor));
        } finally {
            $settings->modelConfigs = $previous;
            $plugin->getAiService()->registerProvider(new OpenAiProvider());
        }
    }

    public function testMixedRunAppliesAutomaticOutputAndPreservesReviewOutput(): void
    {
        $fixture = TestProject::create(new PlainText(['name' => 'Mixed target', 'handle' => 'backgroundTarget']));
        $plugin = AutofillPlugin::getInstance();
        $actor = User::find()->admin()->one();
        $settings = $plugin->getSettings();
        $previous = $settings->modelConfigs;
        $provider = new BackgroundFixtureProvider();
        $provider->response = '{"suggestions":[{"fieldName":"backgroundTarget","value":"Automatic value"},{"fieldName":"title","value":"Review this title"}]}';
        $settings->modelConfigs = [['uid' => 'mixed-fixture', 'provider' => 'openai', 'modelId' => 'fixture', 'apiKeyEnv' => '$OPENAI_API_KEY', 'enabled' => true]];
        $plugin->getAiService()->registerProvider($provider);
        try {
            $workflow = new Workflow([
                'handle' => 'background-mixed', 'name' => 'Mixed background', 'ownerId' => (int)$actor->id,
                'entryTypeUid' => (string)$fixture['entry']->getType()->uid, 'modelConfigUid' => 'mixed-fixture',
                'rows' => [
                    ['targetFieldUid' => $fixture['targetUid'], 'requiresApproval' => false, 'prompt' => 'Generate a value.'],
                    ['targetFieldUid' => '__native__:title', 'requiresApproval' => true, 'prompt' => 'Generate a title.'],
                ],
            ]);
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $service->process((int)$run->id);
            $run = WorkflowRunRecord::findOne($run->id);
            self::assertSame('ready', $run->status, $run->errorMessage ?? '');
            $entry = TestProject::reloadEntry($fixture['entry']);
            self::assertSame('Automatic value', $entry->getFieldValue('backgroundTarget'));
            self::assertSame('Before Autofill', $entry->title);
            $payload = $service->payload($run, $actor);
            self::assertSame(['applied', 'pending'], array_column($payload['suggestions'], 'state'));
            self::assertFalse($payload['stale']['context']);
            $entry->setFieldValue('backgroundTarget', 'Edited by a person after automatic application');
            self::assertTrue(Craft::$app->getElements()->saveElement($entry));
            $payload = $service->payload($run, $actor);
            self::assertTrue($payload['stale']['context'], 'Later edits to an already-applied context field must warn the remaining reviewer.');
            $service->decide((int)$run->id, 1, $actor, false);
            self::assertSame('completed', WorkflowRunRecord::findOne($run->id)->status);
        } finally {
            $settings->modelConfigs = $previous;
            $plugin->getAiService()->registerProvider(new OpenAiProvider());
        }
    }
}

final class BackgroundFixtureProvider implements AiProviderInterface
{
    public int $calls = 0;
    public string $response = '{"suggestions":[{"fieldName":"backgroundTarget","value":"Background fixture value"}]}';
    public function getProviderKey(): string { return 'openai'; }
    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        $this->calls++;
        return ['output_text' => $this->response];
    }
}
