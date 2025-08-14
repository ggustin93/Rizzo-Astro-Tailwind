import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const siteConfig = {
  email: 'christine@rizzoavocate.be',
  phone: '+32 488 40 45 49',
  address: 'Chaussée de Waterloo 1151, 1180 Bruxelles',
};

test.describe('Contact Information Verification', () => {

  test.describe('Contact Page', () => {
    const languages = ['fr', 'en', 'it'];
    for (const lang of languages) {
      test(`should display correct info on /${lang}/contact`, async ({ page }) => {
        await page.goto(`${BASE_URL}/${lang}/contact`);

        // Check for correct email and phone
        await expect(page.locator('body')).toContainText(siteConfig.email);
        await expect(page.locator('body')).toContainText(siteConfig.phone);
        await expect(page.locator('body')).toContainText(siteConfig.address);
        
        // Check that the promotional text is gone
        await expect(page.locator('text="Le premier contact est gratuit"')).not.toBeVisible();
        await expect(page.locator('text="The first appointment is free"')).not.toBeVisible();
        await expect(page.locator('text="Il primo appuntamento è gratuito"')).not.toBeVisible();
      });
    }
  });

  test('Footer should display correct info', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);

    const footer = page.locator('footer');
    await expect(footer).toContainText(siteConfig.email);
    await expect(footer).toContainText(siteConfig.phone);
    // Check for address parts to be resilient to formatting
    await expect(footer).toContainText('Chaussée de Waterloo 1151');
    await expect(footer).toContainText('1180 Bruxelles');
  });

  test.describe('Legal Pages (FR)', () => {
    const legalPages = [
      'legal/notice',
      'legal/privacy',
      'legal/informations-legales'
    ];

    for (const pagePath of legalPages) {
      test(`should display correct info on /fr/${pagePath}`, async ({ page }) => {
        await page.goto(`${BASE_URL}/fr/${pagePath}`);
        
        // Target the specific main content area of the legal pages
        const mainContent = page.locator('div.bg-white > main');
        await expect(mainContent).toContainText(siteConfig.email);
        await expect(mainContent).toContainText(siteConfig.phone);
        await expect(mainContent).toContainText(siteConfig.address);
      });
    }
  });
});
