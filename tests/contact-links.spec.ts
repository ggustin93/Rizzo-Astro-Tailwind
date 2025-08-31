import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const siteConfig = {
  email: 'christine@rizzoavocate.be',
  phone: '+32 488 40 45 49',
  whatsapp: '32488404549',
  linkedin: 'https://www.linkedin.com/in/christine-rizzo-352b2b1b/',
  address: 'Chaussée de Waterloo 1151, 1180 Bruxelles',
};

test.describe('Contact Page Link Functionality', () => {
  const languages = ['fr', 'en', 'it'];

  for (const lang of languages) {
    test(`should have correct href attributes on /${lang}/contact`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/contact`);

      // Email link
      await expect(page.locator(`a[href="mailto:${siteConfig.email}"]`)).toBeVisible();

      // Phone link
      await expect(page.locator(`a[href="tel:${siteConfig.phone}"]`)).toBeVisible();

      // WhatsApp link
      await expect(page.locator(`a[href="https://wa.me/${siteConfig.whatsapp}"]`)).toBeVisible();

      // LinkedIn link
      await expect(page.locator(`a[href="${siteConfig.linkedin}"]`)).toBeVisible();

      // Google Maps link
      const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;
      await expect(page.locator(`a[href="${mapsHref}"]`)).toBeVisible();
    });
  }
});

