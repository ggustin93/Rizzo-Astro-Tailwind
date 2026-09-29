import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

const siteConfig = load(readFileSync(new URL('../src/content/config/site-config.yml', import.meta.url), 'utf8'));
const romainEmail = siteConfig.lawyers.find(lawyer => lawyer.id === 'romain-archalaus').email;

test('Romain can be called from his profile without a booking control', async ({ page }) => {
  await page.goto('/fr/equipe/romain-archalaus/');
  await expect(page.getByRole('link', { name: '+32 495 69 31 91', exact: true })).toHaveAttribute('href', 'tel:+32495693191');
  await expect(page.locator('[data-cal-link*="romain"]')).toHaveCount(0);
});

for (const lang of ['fr', 'en', 'it', 'nl']) {
  test(`${lang}: team offers three direct calendars and Romain's own contact`, async ({ page }) => {
    await page.route('https://cal.com/**', route => route.abort());
    await page.goto(`/${lang}/equipe/`);
    const main = page.locator('main');
    await expect(main.locator('[data-cal-link]')).toHaveCount(3);
    await expect(main.locator('a[href="https://cal.com/arnaudvanderhoeven"]')).toBeVisible();
    const romain = main.locator('.team-entry').filter({ has: page.locator(`a[href="/${lang}/equipe/romain-archalaus/"]`) });
    await expect(romain.locator('a[href="tel:+32495693191"]')).toBeVisible();
    await expect(romain.locator('a[href^="mailto:"]')).toHaveCount(romainEmail ? 1 : 0);
    await expect(romain.locator('[data-cal-link]')).toHaveCount(0);
  });
}
