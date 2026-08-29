import { test, expect } from '@playwright/test';

import { BASE_URL, languages, lawyers as roster } from './helpers';

const lawyers = {
  christine: roster[0],
  stephanie: roster[1],
};

test.describe('Contact Page Link Functionality', () => {

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
