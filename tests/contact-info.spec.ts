import { test, expect } from '@playwright/test';

import { BASE_URL, languages, lawyers as roster, address } from './helpers';

const lawyers = {
  christine: roster[0],
  stephanie: roster[1],
};

// Legal pages expose the firm's shared editor mailbox, not a lawyer's personal address.
const editorEmail = 'info@rizzo-michiels.be';

test.describe('Contact Information Verification', () => {

  test.describe('Contact Page', () => {
    for (const lang of languages) {
      test(`should display correct info on /${lang}/contact`, async ({ page }) => {
        await page.goto(`${BASE_URL}/${lang}/contact`);

        // Check for both lawyers' contact info
        await expect(page.locator('body')).toContainText(editorEmail);
        await expect(page.locator('body')).toContainText(lawyers.christine.phone);
        await expect(page.locator('body')).toContainText(lawyers.stephanie.phone);
      });
    }
  });

  test('Footer should display correct info', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);

    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: editorEmail, exact: true })).toHaveAttribute('href', `mailto:${editorEmail}`);
    await expect(footer.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(footer).toContainText('Nos bureaux');
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
        await expect(mainContent).toContainText(editorEmail);
        await expect(mainContent).toContainText(lawyers.christine.phone);
        await expect(mainContent).toContainText(address);
      });
    }
  });
});
