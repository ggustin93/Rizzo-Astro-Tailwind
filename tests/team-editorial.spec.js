import { test, expect } from '@playwright/test';

test('la présentation complète de Christine est distincte de son profil', async ({ page }) => {
  await page.goto('/fr/equipe/');
  await expect(page.locator('main')).toContainText("Elle copréside la Commission Bien-être psychosociale");
  await expect(page.locator('main')).toContainText("l'Association des Juristes Praticiens du Droit Social");
  await page.locator('main a[href="/fr/equipe/christine-rizzo/"] img').click();
  await expect(page.locator('main')).not.toContainText('Je suis actuellement membre');
  await expect(page.locator('main')).toContainText('2025-2027');
});

for (const lang of ['fr', 'en', 'it', 'nl']) {
  test(`${lang} : quatre profils intégraux, LinkedIn et navigation`, async ({ page, request }) => {
    const members = [
      ['christine-rizzo', 'Christine Rizzo', 'Reliance Littler'],
      ['stephanie-michiels', 'Stephanie Michiels', 'Fulbright'],
      ['arnaud-vanderhoeven-jacobs', 'Arnaud Vanderhoeven Jacobs', 'Castiaux & Partners'],
      ['romain-archalaus', 'Romain Archalaüs', 'ELSA'],
    ];
    await page.goto(`/${lang}/equipe/`);
    await expect(page.locator('main h2')).toHaveText(members.map(x => x[1]));
    for (const [slug, name, career] of members) {
      await expect(page.locator(`main a[href="/${lang}/equipe/${slug}/"]`)).toHaveCount(2);
      const response = await request.get(`/${lang}/equipe/${slug}/`);
      expect(response.status()).toBe(200);
      await page.goto(`/${lang}/equipe/${slug}/`);
      await expect(page.locator('main h1')).toHaveText(name);
      await expect(page.locator('main')).toContainText(career);
      await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toBeVisible();
      await page.goto(`/${lang}/equipe/`);
    }
  });
}

test('accueil : promesse fournie, réunion sous équipe et quatre mini-portraits', async ({ page }) => {
  await page.goto('/fr/');
  await expect(page.locator('main')).toContainText('Cabinet d’avocats en droit du travail belge et droit de la fonction publique européenne');
  await expect(page.locator('#profil h3')).toHaveText(['Christine Rizzo','Stephanie Michiels','Arnaud Vanderhoeven Jacobs','Romain Archalaüs']);
  await expect(page.locator('#profil')).toContainText('Rizzo & Michiels est une équipe de quatre avocats');
  await expect(page.locator('#profil img[alt="Réunion de travail"]')).toBeVisible();
  await expect(page.locator('#expertise img')).toHaveCount(0);
  await expect(page.locator('#profil a')).toHaveCount(5);
  await expect(page.locator('#profil a[href="/fr/equipe/"]')).toBeVisible();
  await page.locator('#profil a[href="/fr/equipe/romain-archalaus/"] img').click();
  await expect(page).toHaveURL(/\/fr\/equipe\/romain-archalaus\//);
  await page.goBack();
  await expect(page.locator('#profil')).toContainText('Découvrir l’équipe');
});

for (const lang of ['fr','en','it','nl']) {
  test(`${lang} : parcours équipe au clavier et médias accessibles`, async ({ page, isMobile }) => {
    await page.goto(`/${lang}/equipe/`);
    const link=page.locator(`main a.profile-link[href="/${lang}/equipe/arnaud-vanderhoeven-jacobs/"]`);
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${lang}/equipe/arnaud-vanderhoeven-jacobs/$`));
    await expect(page.locator('main h1')).toHaveText('Arnaud Vanderhoeven Jacobs');
    await page.goto(`/${lang}/`);
    await page.locator('#profil').scrollIntoViewIfNeeded();
    for (const img of await page.locator('#profil img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toBeVisible();
      await expect.poll(()=>img.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    if (isMobile) await expect(page.locator('#profil h3')).toHaveCount(4);
  });
}

for (const lang of ['fr','en','it','nl']) {
  test(`${lang} : contributions et références bibliographiques complètes`, async ({ page }) => {
    await page.goto(`/${lang}/equipe/arnaud-vanderhoeven-jacobs/`);
    await expect(page.locator('main')).toContainText('Tome 2. La preuve du motif grave et ses particularités');
    await expect(page.locator('main')).toContainText('Tome 3. Les différents cas d’espèce du motif grave');
    await expect(page.locator('main')).toContainText('Tome 1. Evolution, aspects techniques et applications diverses');
    await page.goto(`/${lang}/equipe/romain-archalaus/`);
    const heading={fr:'Publications',en:'Publications',it:'Pubblicazioni',nl:'Publicaties'}[lang];
    await expect(page.locator('main').getByRole('heading',{name:heading,exact:true})).toBeVisible();
    await expect(page.locator('main')).toContainText('Le contrat de travail : aspects théoriques et pratiques');
  });
}
