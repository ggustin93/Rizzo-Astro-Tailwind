import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

// Issue #8: profile pages come from one slug-driven route, but the public URLs
// visitors and search engines already know must not move.
const languages = ['fr', 'en', 'it'];

const profiles = [
  { slug: 'christine-rizzo', name: 'Christine Rizzo' },
  { slug: 'stephanie-michiels', name: 'Stephanie Michiels' },
];

test.describe('Team profile routes', () => {
  for (const lang of languages) {
    for (const profile of profiles) {
      test(`/${lang}/equipe/${profile.slug} still resolves`, async ({ page }) => {
        const response = await page.goto(`${BASE_URL}/${lang}/equipe/${profile.slug}/`);
        expect(response?.status()).toBe(200);

        await expect(page.locator('main h1')).toContainText(profile.name);
        // Career timeline is part of the shared canvas.
        await expect(page.locator('main')).toContainText('20');
        // Back-link returns to the team listing in the same language.
        await expect(page.locator(`main a[href="/${lang}/equipe/"]`).first()).toBeVisible();
      });
    }

    test(`/${lang}/equipe links to every profile`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/equipe/`);
      for (const profile of profiles) {
        await expect(
          page.locator(`main a[href="/${lang}/equipe/${profile.slug}/"]`)
        ).toHaveCount(1);
      }
    });
  }

  test('empty sections are omitted from the profile canvas', async ({ page }) => {
    // Stephanie has `conferences: []` but a non-empty publications list.
    await page.goto(`${BASE_URL}/fr/equipe/stephanie-michiels/`);
    const main = page.locator('main');
    await expect(main.locator('h3', { hasText: /^Parcours$/ })).toHaveCount(1);
    await expect(main.locator('h3', { hasText: /^Publications$/ })).toHaveCount(1);
    await expect(main.locator('h3', { hasText: /^Conférences$/ })).toHaveCount(0);
  });
});
