import { test, expect } from '@playwright/test';
import { languages } from './helpers';

const phones = ['+32488404549', '+32498502901', '+32498797356', '+32495693191'];
const labels = { fr: ['Appelez-nous', 'Rendez-vous', 'E-mail'], en: ['Call us', 'Appointment', 'Email'], it: ['Chiamateci', 'Appuntamento', 'E-mail'], nl: ['Bel ons', 'Afspraak', 'E-mail'] };
const documentWords = /document|pièce|stukken/i;

// #25: no form anywhere, and the e-mail is labelled plainly, without inviting documents.
for (const lang of languages) {
  test(`${lang}: contact page offers only the contact block, no form`, async ({ page }) => {
    await page.goto(`/${lang}/contact/`);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('a[href*="#contact-form"]')).toHaveCount(0);
    const banner = page.locator('#contact');
    await expect(banner.locator('a[href="mailto:info@rizzo-michiels.be"]')).toHaveAccessibleName(`${labels[lang][2]} info@rizzo-michiels.be`);
    await expect(banner).not.toContainText(documentWords);
    await expect(page.locator('header')).not.toContainText(/Formulaire de contact|Contact form|Modulo di contatto|Contactformulier/);
    await page.goto(`/${lang}/`);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('#contact')).not.toContainText(documentWords);
  });
}
for (const lang of languages) {
  test(`${lang}: contact menus open by keyboard and lead to central destinations`, async ({ page, isMobile }) => {
    await page.route('https://app.cal.com/**', route => route.abort());
    await page.route('https://cal.com/arnaudvanderhoeven', route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<h1>Calendar preview</h1>' }));
    await page.goto(`/${lang}/contact/`);
    const banner = page.locator('#contact');
    await expect(banner.locator('a[href="mailto:info@rizzo-michiels.be"]')).toBeVisible();
    const call = banner.locator('summary').filter({ hasText: labels[lang][0] });
    await expect(banner.locator('a[href="tel:+32495693191"]')).toBeHidden();
    if (isMobile) await call.tap();
    else {
      await call.focus();
      await page.keyboard.press('Enter');
    }
    for (const phone of phones) await expect(banner.locator(`a[href="tel:${phone}"]`)).toBeVisible();
    if (!isMobile) {
      await page.keyboard.press('Tab');
      await expect(banner.locator('a[href="tel:+32488404549"]')).toBeFocused();
    }
    await call.click();
    await expect(banner.locator('a[href="tel:+32495693191"]')).toBeHidden();
    const book = banner.locator('summary').filter({ hasText: labels[lang][1] });
    await book.click();
    await expect(banner.locator('[data-cal-link]')).toHaveCount(3);
    await expect(banner.getByRole('link', { name: 'Arnaud Vanderhoeven Jacobs', exact: true })).toHaveAttribute('href', 'https://cal.com/arnaudvanderhoeven');
    await expect(banner.locator('[data-cal-link*="romain"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ((lang === 'fr' && !isMobile) || (lang === 'nl' && isMobile)) {
      await page.screenshot({ path: `/tmp/issue19-${lang}-${isMobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
    }
    await banner.getByRole('link', { name: 'Arnaud Vanderhoeven Jacobs', exact: true }).click();
    await expect(page).toHaveURL('https://cal.com/arnaudvanderhoeven');
    await expect(page.getByRole('heading', { name: 'Calendar preview' })).toBeVisible();
  });
}
