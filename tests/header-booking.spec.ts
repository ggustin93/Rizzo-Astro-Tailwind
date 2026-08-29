import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

// Issue #9: booking moves into the header so visitors do not have to scroll to
// the footer CTA. Items come from the lawyers array in site-config.yml.
const bookableLawyers = [
  { name: 'Christine Rizzo', calSlug: 'c.rizzo-avocat.be/rendez-vous' },
  { name: 'Stephanie Michiels', calSlug: 'stephanie-michiels-v76dvl' },
];

test.describe('Header appointment dropdown', () => {
  test('lists one booking row per lawyer with a calendar, plus the contact form', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const menu = page.locator('#header-booking-desktop');

    for (const lawyer of bookableLawyers) {
      const row = menu.locator(`[data-cal-link*="${lawyer.calSlug}"]`);
      await expect(row).toHaveCount(1);
      await expect(row).toContainText(lawyer.name);
    }

    // Last item is the contact form, so writing stays possible.
    await expect(menu.locator('a[href="/fr/contact"]')).toHaveCount(1);
  });

  test('never renders a booking row without a valid cal.com URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const rows = page.locator('#header-booking-desktop [data-cal-link]');
    await expect(rows).toHaveCount(bookableLawyers.length);

    for (const row of await rows.all()) {
      expect(await row.getAttribute('data-cal-link')).toBeTruthy();
    }
  });

  test('booking rows carry the lawyer name for assistive tech', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const first = page.locator('#header-booking-desktop [data-cal-link]').first();
    await expect(first).toHaveAttribute('aria-label', /Christine Rizzo/);
  });
});

test.describe('Header appointment dropdown — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('booking links are reachable without hover', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    await page.locator('#menu-toggle').click();

    const menu = page.locator('#header-booking-mobile');
    await expect(menu).toBeVisible();

    // Same rows as desktop, visible in the always-open submenu pattern.
    for (const lawyer of bookableLawyers) {
      await expect(menu.locator(`[data-cal-link*="${lawyer.calSlug}"]`)).toBeVisible();
    }
    await expect(menu.locator('a[href="/fr/contact"]')).toBeVisible();
  });
});
