/**
 * Replays the cabinet's photo change in a real Decap CMS, on a scratch copy of the repo:
 * local backend (decap-server), upload from « Page Équipe → Membres », publish, then a
 * Netlify-like build (NETLIFY=true). The working tree is never touched.
 */
import { cpSync, readdirSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { extname, join, resolve } from 'node:path';

const root = resolve('.');
// Inside the repo (ignored .cache), so the copy resolves this repo's node_modules like a normal build.
mkdirSync(join(root, '.cache'), { recursive: true });
const repo = mkdtempSync(join(root, '.cache', 'cms-photo-'));
const skip = new Set(['node_modules', '.git', 'dist', '.cache', '.astro', '.netlify']);
for (const entry of readdirSync(root)) if (!skip.has(entry)) cpSync(join(root, entry), join(repo, entry), { recursive: true });

const DECAP_PORT = 8082;
const CMS_PORT = 4390;
const configPath = join(repo, 'public/admin/config.yml');
writeFileSync(configPath, `local_backend:\n  url: http://localhost:${DECAP_PORT}/api/v1\n${readFileSync(configPath, 'utf8')}`);

const types = { '.html': 'text/html', '.yml': 'text/yaml', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const cms = createServer((req, res) => {
  const file = join(repo, 'public', decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(join(repo, 'public')) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(CMS_PORT);
const decap = spawn('npx', ['--yes', 'decap-server@3.11.3'], { cwd: repo, env: { ...process.env, PORT: String(DECAP_PORT) }, stdio: 'ignore' });

let status = 1;
try {
  await new Promise((ok) => setTimeout(ok, 5000));
  // Async on purpose: the CMS server above lives in this process and must keep answering.
  const tests = spawn('npx', ['playwright', 'test', 'tests/cms-photo-upload.spec.js', '--project=chromium', '--retries=0'], {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: `http://localhost:${CMS_PORT}`, CMS_REPO: repo },
  });
  status = await new Promise((done) => tests.on('exit', done));
} finally {
  decap.kill();
  cms.close();
  rmSync(repo, { recursive: true, force: true });
}
process.exit(status);
