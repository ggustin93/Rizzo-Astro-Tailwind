// Build boundary: malformed editorial content must fail before publication.
// Run alone from the repository root. Original bytes are always restored.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';
const path = 'src/content/travailleurs/travailleurs.yml';
const original = readFileSync(path, 'utf8');
const cases = [
  ['answer', 'answer', content => { delete content.fr.sections[0].situations[0].answer; }],
  ['question', 'Question', content => { content.fr.sections[0].situations[0].question = '  '; }],
  ['title', 'Titre', content => { content.fr.sections[0].title = ''; }],
  ['ctaDestination', 'ctaDestination', content => { content.fr.ctaDestination = 'javascript:alert(1)'; }],
];
try {
  for (const [field, diagnostic, mutate] of cases) {
    const content = yaml.load(original);
    mutate(content);
    writeFileSync(path, yaml.dump(content));
    const build = spawnSync('npm', ['exec', 'astro', 'build'], { encoding: 'utf8' });
    assert.ok(build.status > 0, `Build must refuse invalid ${field}`);
    assert.ok((build.stdout + build.stderr).includes(diagnostic), `Diagnostic must identify ${field}: ${build.stdout} ${build.stderr}`);
    console.log(`PASS: build refuses invalid ${field}`);
  }
} finally {
  writeFileSync(path, original);
}
