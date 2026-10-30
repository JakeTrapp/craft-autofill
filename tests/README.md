# Tests

The repository has separate local and Craft-backed suites:

- `composer test:unit` runs fast PHPUnit tests without Craft or a database.
- `composer test:integration` uses the ignored `testbench/` runtime and DDEV MySQL 8 to install Craft into a disposable marked database, then runs the Craft persistence suite. It does not contact AI providers.
- `npm run test:browser` runs Playwright from the repository root, separately from Codeception.

For root unit tests, install PHP 8.2+ and Composer, then run `composer install` in the repository. Integration tests also need Docker and DDEV. Browser tests need Node/npm, Chromium installed by Playwright, and host PHP with Craft's required extensions, including `pdo_mysql` and GD. The browser server uses host PHP to connect to DDEV's published MySQL port. Rebuilding the optional frontend sources requires Node 20.19+ or 22.12+; customer sites use the shipped compiled assets.

For asset inputs, the configured maximum file count applies to both selected metadata and attached file contents. For example, a maximum of three sends descriptors and files for the first three selected assets, in field order.

## First-time integration setup

Docker and DDEV are required. The testbench runtime is generated from the small tracked recipe in `tests/environment/testbench/`:

```bash
testbench/bin/materialize
```

The DDEV configuration is local and ignored by Git. On a fresh checkout, create it from the repository root before running integration tests:

```bash
ddev config --project-name=craft-autofill-testbench --project-type=php \
  --docroot=testbench/web --php-version=8.2 --database=mysql:8.0 \
  --composer-root=testbench \
  --web-environment-add="CRAFT_ENVIRONMENT=dev,CRAFT_DB_SERVER=db,CRAFT_DB_DATABASE=db,CRAFT_DB_USER=db,CRAFT_DB_PASSWORD=db,CRAFT_TEST_DB_DATABASE=db_test,AUTOFILL_TEST_DB_IDENTITY=craft-autofill-testbench:db_test,CRAFT_SECURITY_KEY=autofill-testbench-not-for-production,PRIMARY_SITE_URL=https://craft-autofill-testbench.ddev.site"
composer test:integration
```

The database credentials and security key above are disposable local-development values. Keep real credentials in ignored local environment files.

The integration command starts DDEV, installs the generated site's dependencies, creates the guarded test database, and runs the suite. It does not require installing the manual site first. For optional manual control-panel browsing, `testbench/bin/setup` checks the separate manual Craft site but never installs, wipes, or replaces its database. Set `AUTOFILL_TESTBENCH_SEED=1` only when you want it to add sample content to that installed manual site.

The default automated database is `db_test`. A new, absent `db_test` is created with its identity marker by the integration runner. If `db_test` already exists, mark it before the first run, and only after confirming it is the disposable integration database:

```bash
testbench/bin/mark-test-database
```

The marker identifies the DDEV project and database. Every test database recreate checks the exact marker first. An unmarked or differently marked database is refused. Automated scripts never reset the normal `db` site.

## Running suites

```bash
composer test:unit
composer test:integration
```

The compatibility wrapper `testbench/bin/test` delegates to the integration suite. Unit tests run separately with `composer test:unit`, without starting Craft or Docker. `testbench/bin/test-live` is the only wrapper that sends a real OpenAI request.

## Browser tests

The Playwright suite uses the marked `db_test` database and a deterministic provider registered only by the testbench module. It starts Craft with PHP's local server on `127.0.0.1:8097`; it does not change the DDEV web database setting.

```bash
npm install
npm run test:browser:install
testbench/bin/test-integration
npm run test:browser
```

The browser setup checks the `craft-autofill-testbench:db_test` marker before it seeds its administrator and entry. It discovers the published DDEV MySQL port automatically. Set `AUTOFILL_BROWSER_DB_PORT` to override it, or `AUTOFILL_BROWSER_PORT` to change the local Craft port. Browser screenshots and traces are written to the ignored `tests/browser/artifacts/` directory.

Integration, live, and browser suites share `db_test` and acquire an exclusive `testbench/.test-run.lock` directory. A second suite refuses to start while the first owns it. Normal exit releases the lock. After an interrupted process, inspect the lock's `owner` file and confirm that process and its test server have stopped before removing a stale lock.

The browser server stops automatically after its suite. Run `ddev stop` from this repository when you want to stop the retained local Craft containers.

The ignored runtime can be rebuilt from the tracked recipe at any time with `testbench/bin/materialize`. It uses the current plugin source through a local Composer path repository.
