import { test, expect } from '@playwright/test';
import { content, team } from './helpers';

// Names and order come from site-config, as rewritten by the verification script.
const names = team().map((m) => m.name);
// The script reverses the roster and renames Christine: prove both reached the site.
if (process.env.TEAM_EDITING && names.at(-1) !== 'Christine — recette') throw new Error('verify-team-editing.mjs fixture not applied');

// Run only through scripts/verify-team-editing.mjs, which restores the source files.
if (process.env.TEAM_EDITING) {
  for (const lang of ['fr', 'en', 'it', 'nl']) {
    test(`${lang}: édition, identité et listes facultatives après reconstruction`, async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator('#profil h3')).toHaveText(names);
      await expect(page.locator(`#profil a[href="/${lang}/equipe/christine-rizzo/"]`)).toContainText('Christine — recette');
      await expect(page.locator(`#profil a[href="/${lang}/equipe/romain-archalaus/"] img`)).toHaveAttribute('src', '/assets/images/christine-optimized.webp');
      // fr/nl promises are rewritten by the verification script; en/it come from the CMS as is.
      await expect(page.locator('main')).toContainText(content('home/home.yml')[lang].hero.description);
      await page.goto(`/${lang}/equipe/`);
      await expect(page.locator('main h2')).toHaveText(names);
      await page.goto(`/${lang}/equipe/christine-rizzo/`);
      await expect(page.locator('main h1')).toHaveText('Christine — recette');
      const christineProfile = content('profile/profile.yml')[lang].lawyers.find((l) => l.id === 'christine-rizzo');
      await expect(page.locator('main')).toContainText(christineProfile.careerPath[0].event);
      const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent())['@graph'];
      const people = graph.filter(node => node['@type'] === 'Person');
      expect(people).toHaveLength(4);
      const person = people.find(node => node.name === 'Christine — recette');
      expect(person.email).toBe('christine@rizzoavocate.be');
      expect(person.url).toBe(`https://rizzo-michiels.be/${lang}/equipe/christine-rizzo/`);
      const christine = team().find((m) => m.id === 'christine-rizzo');
      expect(person.image).toContain(christine.profileImage || christine.image);
      const sectionNames = {fr:['Conférences','Publications'],en:['Conferences','Publications'],it:['Conferenze','Pubblicazioni'],nl:['Conferenties','Publicaties']};
      if (process.env.TEAM_EDITING === 'empty') {
        for (const name of sectionNames[lang]) await expect(page.locator('main').getByRole('heading',{name,exact:true})).toHaveCount(0);
      } else {
        await expect(page.locator('main')).toContainText('Conférence de recette');
        await expect(page.locator('main')).toContainText('Publication de recette');
      }
      await page.goto(`/${lang}/equipe/romain-archalaus/`);
      await expect(page.locator('main img').first()).toHaveAttribute('src','/assets/images/christine-optimized.webp');
    });
  }
}
