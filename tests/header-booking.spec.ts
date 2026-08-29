import { test, expect } from '@playwright/test';
import { BASE_URL, bookableLawyers } from './helpers';

// Issue #9: booking moves into the header so visitors do not have to scroll to
// the footer CTA. Items come from the lawyers array in site-config.yml.

test.describe('Header appointment dropdown — desktop', () => {
  // The desktop nav is `hidden lg:flex`; these assertions are meaningless on a
  // phone-sized project, which has its own suite below.
  test.skip(({ isMobile }) => !!isMobile, 'desktop-only interaction');

  const trigger = (page) => page.locator('header a[href="/fr/contact"]').first();
  const menu = (page) => page.locator('#header-booking-desktop');

  test('lists one booking row per lawyer with a calendar, plus the contact form', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    await trigger(page).hover();

    for (const lawyer of bookableLawyers) {
      const row = menu(page).locator(`[data-cal-link*="${lawyer.calSlug}"]`);
      await expect(row).toHaveCount(1);
      await expect(row).toBeVisible();
      await expect(row).toContainText(lawyer.name);
    }

    // Last item is the contact form, so writing stays possible.
    const formLink = menu(page).locator('a[href="/fr/contact"]');
    await expect(formLink).toHaveCount(1);
    await expect(formLink).toBeVisible();
  });

  test('never renders a booking row without a valid cal.com URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const rows = menu(page).locator('[data-cal-link]');
    await expect(rows).toHaveCount(bookableLawyers.length);

    for (const row of await rows.all()) {
      expect(await row.getAttribute('data-cal-link')).toBeTruthy();
    }
  });

  test('booking rows carry the lawyer name for assistive tech', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const first = menu(page).locator('[data-cal-link]').first();
    await expect(first).toHaveAttribute('aria-label', /Christine Rizzo/);
  });

  // The menu ships `invisible opacity-0` until hover, so counting rows in the DOM
  // proves nothing about whether a visitor can ever reach them.
  test('is hidden until hover, then opens', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const firstRow = menu(page).locator('[data-cal-link]').first();

    await expect(firstRow).toBeHidden();
    await trigger(page).hover();
    await expect(firstRow).toBeVisible();
  });

  test('opens on keyboard focus, not only on hover', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);
    const firstRow = menu(page).locator('[data-cal-link]').first();

    await expect(firstRow).toBeHidden();
    // focus-within is what makes the menu reachable without a pointer.
    await trigger(page).focus();
    await expect(firstRow).toBeVisible();
  });
});

test.describe('Header appointment dropdown — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const openMenu = async (page) => {
    await page.goto(`${BASE_URL}/fr/`);
    await page.locator('#menu-toggle').click();
  };

  test('booking links are reachable without hover', async ({ page }) => {
    await openMenu(page);

    const menu = page.locator('#header-booking-mobile');
    await expect(menu).toBeVisible();

    // Same rows as desktop, visible in the always-open submenu pattern.
    for (const lawyer of bookableLawyers) {
      await expect(menu.locator(`[data-cal-link*="${lawyer.calSlug}"]`)).toBeVisible();
    }
    await expect(menu.locator('a.mobile-submenu-link[href="/fr/contact"]')).toBeVisible();
  });

  test('keeps the contact CTA button next to the booking rows', async ({ page }) => {
    await openMenu(page);

    // The booking rows were added *beside* the contact CTA, not in place of it:
    // the CTA is the bordered Button, distinct from the submenu text link.
    const cta = page.locator('#header-booking-mobile a[aria-label]:not([data-cal-link])');
    await expect(cta).toHaveCount(1);
    await expect(cta).toBeVisible();
    await expect(cta).toHaveClass(/border/);
    await expect(cta).toHaveAttribute('href', '/fr/contact');
  });
});
