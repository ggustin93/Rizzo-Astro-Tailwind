/**
 * Replays the cabinet's photo change in a real Decap CMS, on a scratch copy of the repo:
 * local backend (decap-server), upload from « Page Équipe → Membres », publish, then a
 * Netlify-like build (NETLIFY=true). The working tree is never touched.
 */
import { cpSync, readdirSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { extname, join, resolve, sep } from 'node:path';

// Both servers write or serve the scratch repo: loopback only, never the local network.
const HOST = '127.0.0.1';
const DECAP_PORT = 8082;
const CMS_PORT = 4390;
const root = resolve('.');
// Inside the repo (ignored .cache), so the copy resolves this repo's node_modules like a normal build.
mkdirSync(join(root, '.cache'), { recursive: true });
const repo = mkdtempSync(join(root, '.cache', 'cms-photo-'));
const publicDir = join(repo, 'public');

let cms;
let decap;
const cleanup = () => {
  decap?.kill();
  cms?.close();
  rmSync(repo, { recursive: true, force: true });
};
process.on('SIGINT', () => (cleanup(), process.exit(130)));

let status = 1;
try {
  const skip = new Set(['node_modules', '.git', 'dist', '.cache', '.astro', '.netlify']);
  for (const entry of readdirSync(root)) if (!skip.has(entry)) cpSync(join(root, entry), join(repo, entry), { recursive: true });
  const configPath = join(publicDir, 'admin/config.yml');
  writeFileSync(configPath, `local_backend:\n  url: http://${HOST}:${DECAP_PORT}/api/v1\n${readFileSync(configPath, 'utf8')}`);

  const types = { '.html': 'text/html', '.yml': 'text/yaml', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
  cms = createServer((req, res) => {
    const file = join(publicDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let isFile = false;
    try {
      isFile = file.startsWith(publicDir + sep) && statSync(file).isFile();
    } catch {}
    if (!isFile) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  await new Promise((ok, fail) => cms.once('error', fail).listen(CMS_PORT, HOST, ok));

  decap = spawn('npx', ['--yes', 'decap-server@3.11.3'], { cwd: repo, env: { ...process.env, PORT: String(DECAP_PORT), BIND_HOST: HOST }, stdio: 'ignore' });
  // npx may still be downloading decap-server: wait until it answers, up to a minute.
  const info = { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"action":"info"}' };
  for (const deadline = Date.now() + 60_000; !(await fetch(`http://${HOST}:${DECAP_PORT}/api/v1`, info).then((r) => r.ok, () => false)); ) {
    if (Date.now() > deadline) throw new Error('decap-server did not start');
    await new Promise((ok) => setTimeout(ok, 500));
  }

  // Async on purpose: the CMS server above lives in this process and must keep answering.
  const tests = spawn('npx', ['playwright', 'test', 'tests/cms-photo-upload.spec.js', '--project=chromium', '--retries=0'], {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: `http://${HOST}:${CMS_PORT}`, CMS_REPO: repo },
  });
  // A test run killed by a signal exits with code null: count it as a failure.
  status = await new Promise((done) => tests.on('exit', (code) => done(code ?? 1)));
} finally {
  cleanup();
}
process.exit(status);
