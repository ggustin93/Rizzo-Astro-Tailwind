import { test, expect } from '@playwright/test';

// Run via scripts/verify-contact-editing.mjs. YAML round-trip, not a Decap login/save.
if (process.env.CONTACT_EDITING) {
  for (const lang of ['fr', 'en', 'it', 'nl']) {
    test(`${lang}: rebuilt contacts, visibility and editorial settings`, async ({ page }) => {
      await page.goto(`/${lang}/contact/`);
      const banner = page.locator('#contact');
      await expect(banner.locator('a[href*="#contact-form"]')).toHaveCount(0);
      await expect(page.locator('form[name="contact-form"]')).toHaveCount(0);
      await expect(page.locator('#header-booking-desktop [data-cal-link]')).toHaveCount(2);
      await expect(banner.locator('[data-cal-link]')).toHaveCount(2);
      await expect(banner.locator('[data-cal-link="arnaudvanderhoeven"]')).toHaveCount(0);
      await expect(banner.locator('img')).toHaveAttribute('src', '/assets/images/team-placeholder.svg');
      if (lang === 'fr') await expect(banner).toContainText('Écrivez au cabinet — recette');
      if (lang === 'nl') await expect(banner).toContainText('Schrijf het kantoor — controle');
      await page.goto(`/${lang}/equipe/arnaud-vanderhoeven-jacobs/`);
      await expect(page.locator('#coordonnees a[href="tel:+32498790000"]')).toHaveText('+32 498 79 00 00');
      await page.goto(`/${lang}/equipe/`);
      await expect(page.locator('main [data-cal-link]')).toHaveCount(2);
    });
  }
}
