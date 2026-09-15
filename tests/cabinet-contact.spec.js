import { test, expect } from '@playwright/test';

test('Romain can be called from his profile without a booking control', async ({ page }) => {
  await page.goto('/fr/equipe/romain-archalaus/');
  await expect(page.getByRole('link', { name: '+32 495 69 31 91', exact: true })).toHaveAttribute('href', 'tel:+32495693191');
  await expect(page.locator('[data-cal-link*="romain"]')).toHaveCount(0);
});

for (const lang of ['fr', 'en', 'it', 'nl']) {
  test(`${lang}: team offers three direct calendars and Romain's own contact`, async ({ page }) => {
    await page.route('https://cal.com/**', route => route.abort());
    await page.goto(`/${lang}/equipe/`);
    const main = page.locator('main');
    await expect(main.locator('[data-cal-link]')).toHaveCount(3);
    await expect(main.locator('a[href="https://cal.com/arnaudvanderhoeven"]')).toBeVisible();
    const romain = main.locator('.team-entry').filter({ has: page.locator(`a[href="/${lang}/equipe/romain-archalaus/"]`) });
    await expect(romain.locator('a[href="tel:+32495693191"]')).toBeVisible();
    await expect(romain.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(romain.locator('[data-cal-link]')).toHaveCount(0);
  });
}

test('form validates locally, recovers from failure and redirects after mocked success', async ({ page }) => {
  let submissions = 0;
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route('**/fr/contact/success/', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    submissions++;
    expect(route.request().postData()).toContain('form-name=contact-form');
    expect(route.request().postData()).not.toContain('recipient');
    if (submissions === 1) {
      await pending;
      return route.fulfill({ status: 500, body: 'Simulated failure' });
    }
    return route.fulfill({ status: 200, body: 'Simulated success' });
  });
  await page.goto('/fr/contact/');
  const form = page.locator('form[name="contact-form"]');
  const submit = form.getByRole('button', { name: 'Envoyer le message' });
  await submit.click();
  expect(submissions).toBe(0);
  await form.locator('#name').fill('Recette locale');
  await form.locator('#email').fill('invalide');
  await form.locator('#subject').fill('Test local');
  await form.locator('#message').fill('Aucun envoi réel');
  await submit.click();
  expect(submissions).toBe(0);
  await form.locator('#email').fill('local@example.com');
  await submit.click();
  await expect(form.getByRole('button', { name: 'Envoi en cours...' })).toBeDisabled();
  release();
  await expect(form.getByRole('status')).toContainText("Une erreur s'est produite");
  await expect(form.locator('#subject')).toHaveValue('Test local');
  await submit.click();
  await expect(page).toHaveURL(/\/fr\/contact\/success\/$/);
  await expect(page.getByRole('heading', { name: 'Merci pour votre message !' })).toBeVisible();
  expect(submissions).toBe(2);
});
