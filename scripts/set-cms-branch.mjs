// Points Decap CMS at the branch being deployed (Netlify branch deploys and deploy previews).
// The committed config stays on `main` for production.
import { readFileSync, writeFileSync } from 'node:fs';

const branch = process.env.HEAD ?? '';
// Git refs allow shell/YAML metacharacters; only accept plain names.
if (!/^[\w.\/-]+$/.test(branch)) {
  throw new Error(`Refusing unsupported branch name for the CMS: ${JSON.stringify(branch)}`);
}

const file = 'public/admin/config.yml';
const source = readFileSync(file, 'utf8');
const updated = source.replace(/^  branch: main$/m, `  branch: ${branch}`);
if (updated === source) throw new Error(`No "branch: main" line found in ${file}`);

writeFileSync(file, updated);
console.log(`Decap CMS branch set to ${branch}`);
