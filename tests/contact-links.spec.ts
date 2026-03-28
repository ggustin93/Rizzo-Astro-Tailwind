import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const lawyers = {
  christine: {
    name: 'Christine Rizzo',
    email: 'christine@rizzoavocate.be',
    phone: '+32 488 40 45 49',
  },
  stephanie: {
    name: 'Stephanie Michiels',
    email: 'stephanie@michielsavocate.be',
    phone: '+32 498 50 29 01',
  },
};

test.describe('Contact Page Link Functionality', () => {
  const languages = ['fr', 'en', 'it'];

  for (const lang of languages) {
    test(`should have correct contact actions on /${lang}/contact`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/contact`);

      // Christine's contact buttons
      await expect(page.getByRole('button', { name: `Email ${lawyers.christine.name}` })).toBeVisible();
      await expect(page.getByRole('button', { name: `Call ${lawyers.christine.name}` })).toBeVisible();
      await expect(page.getByRole('button', { name: lawyers.christine.email })).toBeVisible();
      await expect(page.getByRole('button', { name: lawyers.christine.phone })).toBeVisible();

      // Stephanie's contact buttons
      await expect(page.getByRole('button', { name: `Email ${lawyers.stephanie.name}` })).toBeVisible();
      await expect(page.getByRole('button', { name: `Call ${lawyers.stephanie.name}` })).toBeVisible();
      await expect(page.getByRole('button', { name: lawyers.stephanie.email })).toBeVisible();
      await expect(page.getByRole('button', { name: lawyers.stephanie.phone })).toBeVisible();
    });
  }
});
