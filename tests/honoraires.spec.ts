import { test, expect } from '@playwright/test';
import { BASE_URL, content, ctaLabel, languages } from './helpers';
import { bookableLawyers, calEmbedTarget } from '../src/utils/calendar.js';

const honoraires = content('honoraires/honoraires.yml');
const agendas = bookableLawyers(content('config/site-config.yml').lawyers).map((lawyer) => calEmbedTarget(lawyer.calendarLink));

for (const lang of languages) {
  test(`${lang}: honoraires renders CMS markdown and its own meta description (RM-18)`, async ({ page }) => {
    await page.goto(`${BASE_URL}/${lang}/honoraires/`);
    await expect(page.locator('main main')).not.toContainText('**');
    for (const link of await page.locator('main main .prose a[href^="http"]').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
    }
    const description = honoraires[lang].seo?.description || honoraires[lang].subtitle;
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
  });

  test(`${lang}: « first opinion » block offers booking with each agenda (RM-20)`, async ({ page }) => {
    await page.goto(`${BASE_URL}/${lang}/honoraires/`);
    const booking = page.locator('details.booking');
    await booking.locator('summary').filter({ hasText: ctaLabel(lang, 'appointment') }).click();
    await expect(booking.locator('a[data-cal-link]')).toHaveCount(agendas.length);
    for (const agenda of agendas) {
      await expect(booking.locator(`a[data-cal-link="${agenda}"]`)).toBeVisible();
    }
  });
}
