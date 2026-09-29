import { test, expect } from '@playwright/test';
import { BASE_URL, bookableLawyers, content, ctaLabel, languages } from './helpers';

const honoraires = content('honoraires/honoraires.yml');

for (const lang of languages) {
  test(`${lang}: honoraires renders CMS markdown and its own meta description (RM-18)`, async ({ page }) => {
    await page.goto(`${BASE_URL}/${lang}/honoraires/`);
    await expect(page.locator('main main')).not.toContainText('**');
    const description = honoraires[lang].seo?.description || honoraires[lang].subtitle;
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
  });

  test(`${lang}: « first opinion » block offers booking with each agenda (RM-20)`, async ({ page }) => {
    await page.goto(`${BASE_URL}/${lang}/honoraires/`);
    const booking = page.locator('details.booking');
    await booking.locator('summary').filter({ hasText: ctaLabel(lang, 'appointment') }).click();
    for (const lawyer of bookableLawyers) {
      await expect(booking.locator(`a[data-cal-link^="${lawyer.calSlug}"]`)).toBeVisible();
    }
  });
}
