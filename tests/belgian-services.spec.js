import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

// The cabinet edits this copy in the CMS: read expectations from the content, never hard-code them.
const services = (audience) => load(readFileSync(new URL(`../src/content/${audience}/${audience}.yml`, import.meta.url), 'utf8'));

test('Travailleurs FR presents its sections, situations and fees link', async ({ page }) => {
  const { sections: expected } = services('travailleurs').fr;
  await page.goto('/fr/services/travailleurs/');
  const sections = page.locator('main section');
  await expect(sections.locator('h2')).toHaveText(expected.map((section) => section.title));
  for (const [index, section] of expected.entries()) {
    await expect(sections.nth(index).locator('li')).toHaveCount(section.situations?.length ?? 0);
  }
  await expect(page.locator('main a[href="/fr/honoraires/"]')).toBeVisible();
});

test('Employeurs FR presents five sections, four individual situations and fees', async ({ page }) => {
  await page.goto('/fr/services/employeurs/');
  const sections = page.locator('main section');
  await expect(sections.locator('h2')).toHaveText([
    'Audit – Due Diligence en droit du travail et de la sécurité sociale',
    'Rédaction et révision de vos contrats de travail, règlement de travail et politiques RH et GDPR',
    'Conseils – gestion de la relation individuelle de travail, du recrutement à la rupture',
    "Négociation d'accords amiables",
    "Défense devant les cours et tribunaux du travail et devant les inspections du travail et de l'ONSS",
  ]);
  await expect(sections.nth(2).locator('li')).toHaveCount(4);
  await expect(sections.nth(0)).toContainText('passif social');
  await expect(sections.nth(1)).toContainText('flexi-job');
  await expect(sections.nth(2)).toContainText('éventuelles procédures spéciales de licenciement applicables');
  await expect(sections.nth(3)).toContainText("dans l'intérêt de l'entreprise comme du travailleur");
  await expect(sections.nth(4)).toContainText('Nous vous accompagnons et défendons vos intérêts');
  await expect(page.locator('main a[href="/fr/honoraires/"]')).toBeVisible();
});

const translatedHeadings = {
  en: {
    travailleurs: 'Contract, termination and end of collaboration',
    employeurs: 'Audit – Due diligence in labour and social security law',
  },
  it: {
    travailleurs: 'Contratto, risoluzione e fine della collaborazione',
    employeurs: 'Audit – Due diligence in diritto del lavoro e della sicurezza sociale',
  },
  nl: {
    travailleurs: 'Overeenkomst, beëindiging en einde van de samenwerking',
    employeurs: 'Audit – Due diligence inzake arbeidsrecht en sociale zekerheid',
  },
};
for (const [lang, headings] of Object.entries(translatedHeadings)) {
  for (const [audience, heading] of Object.entries(headings)) {
    test(`${audience} ${lang} offers the complete translated service structure`, async ({ page }) => {
      await page.goto(`/${lang}/services/${audience}/`);
      const sections = page.locator('main section');
      await expect(sections).toHaveCount(5);
      await expect(sections.first().locator('h2')).toHaveText(heading);
      await expect(sections.locator('li')).toHaveCount(audience === 'travailleurs' ? 10 : 4);
      await expect(page.locator('main')).not.toContainText('Nous vous');
      await expect(page.locator(`main a[href="/${lang}/honoraires/"]`)).toBeVisible();
    });
  }
}

for (const lang of ['fr', 'en', 'it', 'nl']) {
  for (const audience of ['travailleurs', 'employeurs']) {
    test(`${audience} ${lang} has clean metadata, readable layout and keyboard fees access`, async ({ page, request, browserName }) => {
      const path = `/${lang}/services/${audience}/`;
      await page.goto(path);
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://rizzo-michiels.be${path}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
      await expect(page).toHaveTitle(/Rizzo/);
      await expect(page.locator('main')).not.toContainText(/STEPH|MINI PHOTO|TODO|à valider|traduction provisoire/);
      await expect(page.locator('script[type="application/ld+json"]')).not.toContainText('FAQPage');
      await expect(page.locator('main details')).toHaveCount(audience === 'travailleurs' ? 10 : 4);
      const disclosure = page.locator('main details').first();
      await disclosure.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(disclosure).toHaveAttribute('open', '');
      await expect(disclosure.locator('p')).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(disclosure).not.toHaveAttribute('open', '');
      const image = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect((await request.get(new URL(image).pathname)).ok()).toBeTruthy();
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /\S/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      const fees = page.locator(`main a[href="/${lang}/honoraires/"]`);
      // Traverse from the document start; no programmatic focus on the target.
      for (let i = 0; i < 60 && !(await fees.evaluate(el => el === document.activeElement)); i++) {
        // Safari uses Option+Tab to include links in sequential focus navigation.
        await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      }
      await expect(fees).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`/${lang}/honoraires/?$`));
    });
  }
}

for (const audience of ['travailleurs', 'employeurs']) {
  test(`${audience} renders every French section title, question and answer`, async ({ page }) => {
    await page.goto(`/fr/services/${audience}/`);
    for (const summary of await page.locator('main details summary').all()) await summary.click();
    for (const section of services(audience).fr.sections) {
      await expect(page.locator('main')).toContainText(section.title);
      for (const { question, answer } of section.situations ?? []) {
        await expect(page.locator('main')).toContainText(question);
        await expect(page.locator('main')).toContainText(answer);
      }
    }
  });
}
