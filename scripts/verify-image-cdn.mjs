/** Builds the site as Netlify does (NETLIFY=true) into a scratch folder and checks image URLs (#42). */
import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const outDir = '.cache/dist-netlify';
function run(command, args, env = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status})`);
}
try {
  run('npx', ['astro', 'build', '--outDir', outDir], { NETLIFY: 'true' });
  run('npx', ['playwright', 'test', 'tests/image-cdn-build.spec.js', '--project=chromium', '--retries=0'], { IMAGE_CDN_DIST: outDir });
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
