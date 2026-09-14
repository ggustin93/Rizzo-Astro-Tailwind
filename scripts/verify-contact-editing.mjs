/** Local YAML/build round-trip only. Does not demonstrate Decap authentication or saving. */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';

const configPath = 'src/content/config/site-config.yml';
const uiPath = 'src/content/ui-translations/ui-translations.yml';
const originals = new Map([configPath, uiPath].map(path => [path, readFileSync(path, 'utf8')]));
function run(command, args, env = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
}
try {
  const config = yaml.load(originals.get(configPath));
  const ui = yaml.load(originals.get(uiPath));
  const arnaud = config.lawyers.find(member => member.id === 'arnaud-vanderhoeven-jacobs');
  arnaud.phone = '+32 498 79 00 00';
  arnaud.calendarLink = '';
  config.showContactForm = false;
  config.contactIllustration = '/assets/images/team-placeholder.svg';
  ui.fr.cta.actions.find(action => action.type === 'email').label = 'Écrivez au cabinet — recette';
  ui.nl.cta.actions.find(action => action.type === 'email').label = 'Schrijf het kantoor — controle';
  ui.fr.cta.actions.reverse();
  writeFileSync(configPath, yaml.dump(config));
  writeFileSync(uiPath, yaml.dump(ui));
  run('npm', ['run', 'build']);
  run('npx', ['playwright', 'test', 'tests/contact-editing.spec.js', '--workers=2', '--retries=0'], { CONTACT_EDITING: '1', BASE_URL: 'http://127.0.0.1:4322' });
} finally {
  for (const [path, source] of originals) writeFileSync(path, source);
  run('npm', ['run', 'build']);
}
