import { test, expect } from '@playwright/test';
import { content } from './helpers';

// The cabinet edits this copy in the CMS: read expectations from the content, never hard-code them.
const services = (audience) => content(`${audience}/${audience}.yml`);

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

test('Employeurs FR presents its sections, situations and fees', async ({ page }) => {
  await page.goto('/fr/services/employeurs/');
  const sections = page.locator('main section');
  await expect(sections.locator('h2')).toHaveText(services('employeurs').fr.sections.map((section) => section.title));
  const expected = services('employeurs').fr.sections;
  // Each section shows the start of its CMS text; the situations section lists every situation.
  for (const [i, section] of expected.entries()) {
    const opening = (text) => text.split(/\s+/).slice(0, 8).join(' ');
    if (section.description) await expect(sections.nth(i)).toContainText(opening(section.description));
    if (section.situations) {
      await expect(sections.nth(i).locator('li')).toHaveCount(section.situations.length);
      await expect(sections.nth(i)).toContainText(opening(section.situations[0].question));
    }
  }
  await expect(page.locator('main a[href="/fr/honoraires/"]')).toBeVisible();
});

// Translations must keep the French structure (same sections and situations); headings come from each language's CMS copy.
const situationCount = (sections) => sections.reduce((count, section) => count + (section.situations?.length ?? 0), 0);
for (const lang of ['en', 'it', 'nl']) {
  for (const audience of ['travailleurs', 'employeurs']) {
    test(`${audience} ${lang} offers the complete translated service structure`, async ({ page }) => {
      const { fr, [lang]: translated } = services(audience);
      await page.goto(`/${lang}/services/${audience}/`);
      const sections = page.locator('main section');
      await expect(sections).toHaveCount(fr.sections.length);
      await expect(sections.locator('h2')).toHaveText(translated.sections.map((section) => section.title));
      await expect(sections.locator('li')).toHaveCount(situationCount(fr.sections));
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
