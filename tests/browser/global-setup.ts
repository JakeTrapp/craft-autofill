import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export default async function globalSetup() {
  const root = process.cwd();
  const lockPath = path.join(root, 'testbench', '.test-run.lock');
  try {
    fs.mkdirSync(lockPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      const ownerPath = path.join(lockPath, 'owner');
      const owner = fs.existsSync(ownerPath) ? fs.readFileSync(ownerPath, 'utf8').trim() : 'owner details unavailable';
      throw new Error(`Another Autofill test suite owns ${lockPath} (${owner}). Confirm that process and its test server have stopped before removing a stale lock.`);
    }
    throw error;
  }
  fs.writeFileSync(path.join(lockPath, 'owner'), `browser pid ${process.pid}\n`);

  let server: ChildProcess | undefined;
  let fixturePath: string | undefined;
  const releaseLock = () => {
    fs.rmSync(path.join(lockPath, 'owner'), { force: true });
    try { fs.rmdirSync(lockPath); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  };

  try {
    execFileSync('bash', [path.join(root, 'testbench/bin/materialize')], { cwd: root, stdio: 'inherit' });
    const host = process.env.AUTOFILL_BROWSER_DB_HOST ?? '127.0.0.1';
    const port = process.env.AUTOFILL_BROWSER_DB_PORT ?? resolveDdevDatabasePort();
    const webPort = process.env.AUTOFILL_BROWSER_PORT ?? '8097';
    fixturePath = process.env.AUTOFILL_BROWSER_FIXTURE ?? path.join(os.tmpdir(), 'autofill-browser-fixture.json');
    const env = {
      ...process.env,
      AUTOFILL_BROWSER_DB_HOST: host,
      AUTOFILL_BROWSER_DB_PORT: port,
      AUTOFILL_BROWSER_PORT: webPort,
      CRAFT_DB_SERVER: host,
      CRAFT_DB_PORT: port,
      CRAFT_DB_DATABASE: 'db_test',
      CRAFT_DB_USER: 'db',
      CRAFT_DB_PASSWORD: 'db',
      CRAFT_TEST_DB_DATABASE: 'db_test',
      AUTOFILL_TEST_DB_IDENTITY: 'craft-autofill-testbench:db_test',
      PRIMARY_SITE_URL: `http://127.0.0.1:${webPort}`,
      CRAFT_ENVIRONMENT: 'dev',
      CRAFT_DEV_MODE: 'true',
      CRAFT_ALLOW_ADMIN_CHANGES: 'true',
      CRAFT_SECURITY_KEY: 'autofill-testbench-not-for-production',
      AUTOFILL_TEST_PROVIDER_FIXTURE: '1',
    };
    const seedOutput = execFileSync('php', [path.join(root, 'tests/browser/prepare-browser.php')], {
      cwd: root,
      env,
      encoding: 'utf8',
    });
    fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
    fs.writeFileSync(fixturePath, seedOutput.trim() + '\n');
    process.env.AUTOFILL_BROWSER_FIXTURE = fixturePath;

    server = spawn('php', ['-S', `127.0.0.1:${webPort}`, '-t', 'testbench/web'], {
      cwd: root,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let serverOutput = '';
    server.stdout?.on('data', chunk => { serverOutput += String(chunk); });
    server.stderr?.on('data', chunk => { serverOutput += String(chunk); });
    const baseUrl = `http://127.0.0.1:${webPort}`;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) break;
      try {
        const response = await fetch(`${baseUrl}/admin/login`);
        if (response.ok) { ready = true; break; }
      } catch { /* server is starting */ }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (!ready) throw new Error(`The isolated Craft test server did not start.\n${serverOutput}`);
  } catch (error) {
    if (server && server.exitCode === null) server.kill('SIGTERM');
    if (fixturePath) fs.rmSync(fixturePath, { force: true });
    releaseLock();
    throw error;
  }

  return async () => {
    if (server && server.exitCode === null) server.kill('SIGTERM');
    await new Promise<void>(resolve => {
      if (!server || server.exitCode !== null) return resolve();
      server.once('exit', () => resolve());
      setTimeout(resolve, 3000).unref();
    });
    if (fixturePath) fs.rmSync(fixturePath, { force: true });
    releaseLock();
  };
}

function resolveDdevDatabasePort(): string {
  let output: string;
  try {
    output = execFileSync('ddev', ['describe', '--json-output'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    throw new Error(`Could not discover DDEV's published database port. Set AUTOFILL_BROWSER_DB_PORT explicitly. ${String(error)}`);
  }
  let description: any;
  try { description = JSON.parse(output); }
  catch { throw new Error('DDEV did not return JSON from `ddev describe --json-output`. Set AUTOFILL_BROWSER_DB_PORT explicitly.'); }
  const port = description?.raw?.dbinfo?.published_port ?? description?.dbinfo?.published_port;
  if (!Number.isInteger(Number(port)) || Number(port) <= 0) {
    throw new Error('DDEV did not report raw.dbinfo.published_port. Set AUTOFILL_BROWSER_DB_PORT explicitly.');
  }
  return String(port);
}
