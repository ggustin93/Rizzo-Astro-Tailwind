import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const lawyers = {
  christine: {
    email: 'christine@rizzoavocate.be',
    phone: '+32 488 40 45 49',
  },
  stephanie: {
    email: 'stephanie@michielsavocate.be',
    phone: '+32 498 50 29 01',
  },
};

const address = 'Chaussée de Waterloo 1151';

test.describe('Contact Information Verification', () => {

  test.describe('Contact Page', () => {
    const languages = ['fr', 'en', 'it'];
    for (const lang of languages) {
      test(`should display correct info on /${lang}/contact`, async ({ page }) => {
        await page.goto(`${BASE_URL}/${lang}/contact`);

        // Check for both lawyers' contact info
        await expect(page.locator('body')).toContainText(lawyers.christine.email);
        await expect(page.locator('body')).toContainText(lawyers.christine.phone);
        await expect(page.locator('body')).toContainText(lawyers.stephanie.email);
        await expect(page.locator('body')).toContainText(lawyers.stephanie.phone);
      });
    }
  });

  test('Footer should display correct info', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);

    const footer = page.locator('footer');
    await expect(footer).toContainText(lawyers.christine.email);
    await expect(footer).toContainText(lawyers.christine.phone);
    // Check for address parts to be resilient to formatting
    await expect(footer).toContainText(address);
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
        await expect(mainContent).toContainText(lawyers.christine.email);
        await expect(mainContent).toContainText(lawyers.christine.phone);
        await expect(mainContent).toContainText(address);
      });
    }
  });
});
