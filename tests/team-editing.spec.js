import { test, expect } from '@playwright/test';

// Run only through scripts/verify-team-editing.mjs, which restores the source files.
if (process.env.TEAM_EDITING) {
  for (const lang of ['fr', 'en', 'it', 'nl']) {
    test(`${lang}: édition, identité et listes facultatives après reconstruction`, async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator('#profil h3')).toHaveText(['Romain Archalaüs','Arnaud Vanderhoeven Jacobs','Stephanie Michiels','Christine — recette']);
      await expect(page.locator(`#profil a[href="/${lang}/equipe/christine-rizzo/"]`)).toContainText('Christine — recette');
      await expect(page.locator(`#profil a[href="/${lang}/equipe/romain-archalaus/"] img`)).toHaveAttribute('src', '/assets/images/christine-optimized.webp');
      const promises = {fr:'Texte FR de recette',nl:'Nederlandse controletekst',en:'We advise and represent you with expertise and commitment.',it:'Vi consigliamo e vi difendiamo con competenza e impegno.'};
      await expect(page.locator('main')).toContainText(promises[lang]);
      await page.goto(`/${lang}/equipe/`);
      await expect(page.locator('main h2')).toHaveText(['Romain Archalaüs','Arnaud Vanderhoeven Jacobs','Stephanie Michiels','Christine — recette']);
      await page.goto(`/${lang}/equipe/christine-rizzo/`);
      await expect(page.locator('main h1')).toHaveText('Christine — recette');
      await expect(page.locator('main')).toContainText('Reliance Littler');
      const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent())['@graph'];
      const people = graph.filter(node => node['@type'] === 'Person');
      expect(people).toHaveLength(4);
      const person = people.find(node => node.name === 'Christine — recette');
      expect(person.email).toBe('christine@rizzoavocate.be');
      expect(person.url).toBe(`https://rizzo-michiels.be/${lang}/equipe/christine-rizzo/`);
      expect(person.image).toContain('/assets/images/christine-optimized.webp');
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
