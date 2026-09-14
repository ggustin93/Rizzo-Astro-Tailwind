/** Local YAML/build round-trip. This is NOT evidence of a Decap login/save. */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';

const paths = {
  config: 'src/content/config/site-config.yml',
  profile: 'src/content/profile/profile.yml',
  home: 'src/content/home/home.yml',
};
const originals = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, readFileSync(path, 'utf8')]));
const data = Object.fromEntries(Object.entries(originals).map(([key, source]) => [key, yaml.load(source)]));
function run(command, args, env = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status})`);
}
function save() {
  for (const [key, path] of Object.entries(paths)) writeFileSync(path, yaml.dump(data[key], { lineWidth: 100, noRefs: true }));
}
try {
  const christine = data.config.team.find(member => member.id === 'christine-rizzo');
  christine.name = 'Christine — recette';
  data.config.team.reverse();
  data.config.team.find(member => member.id === 'romain-archalaus').image = '/assets/images/christine-optimized.webp';
  data.home.portraitLinks = 'profiles';
  data.home.fr.hero.description = 'Texte FR de recette';
  data.home.nl.hero.description = 'Nederlandse controletekst';
  for (const lang of ['fr', 'en', 'it', 'nl']) {
    // Deliberately different translation order: identity must not depend on position.
    data.profile[lang].lawyers.reverse();
    const profile = data.profile[lang].lawyers.find(member => member.id === 'christine-rizzo');
    profile.conferences = [];
    profile.publications = [];
    profile.publicationsIntro = '';
  }
  save();
  run('npm', ['run', 'build']);
  run('npx', ['playwright', 'test', 'tests/team-editing.spec.js', '--retries=0'], { TEAM_EDITING: 'empty', BASE_URL: 'http://127.0.0.1:4322' });
  for (const lang of ['fr', 'en', 'it', 'nl']) {
    const profile = data.profile[lang].lawyers.find(member => member.id === 'christine-rizzo');
    profile.conferences = ['Conférence de recette'];
    profile.publications = [{ date: '2026', title: 'Publication de recette', publisher: 'Éditeur de recette' }];
  }
  save();
  run('npm', ['run', 'build']);
  run('npx', ['playwright', 'test', 'tests/team-editing.spec.js', '--retries=0'], { TEAM_EDITING: 'restored', BASE_URL: 'http://127.0.0.1:4322' });
} finally {
  for (const [key, path] of Object.entries(paths)) writeFileSync(path, originals[key]);
  run('npm', ['run', 'build']);
}
