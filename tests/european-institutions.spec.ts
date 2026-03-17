import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const languages = ['fr', 'en', 'it'];

test.describe('European Institutions Service Page', () => {
  const expectedTitles: Record<string, string> = {
    fr: 'Accompagnement et défense des fonctionnaires et agents des institutions et agences européennes',
    en: 'Support and defense for European institution employees',
    it: 'Supporto e difesa dei funzionari e agenti delle istituzioni e agenzie europee',
  };

  for (const lang of languages) {
    test(`should load europeennes page for /${lang}/`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/services/europeennes`);

      // Page loads with correct h1
      await expect(page.locator('h1')).toContainText(expectedTitles[lang]);

      // Services section is present
      await expect(page.locator('text="BriefCase"').or(page.locator('h2'))).toBeVisible();

      // CTA link to honoraires exists
      await expect(page.locator(`a[href="/${lang}/honoraires"]`)).toBeVisible();
    });
  }
});

test.describe('Homepage Expertise Grid', () => {
  const expertiseBlocks: Record<string, { employeurs: string; travailleurs: string; europeennes: string }> = {
    fr: {
      employeurs: 'Vous êtes une entreprise',
      travailleurs: 'Vous êtes un.e travailleur·euse',
      europeennes: 'Institutions européennes',
    },
    en: {
      employeurs: 'You are an employer',
      travailleurs: 'You are an employee',
      europeennes: 'European Institutions',
    },
    it: {
      employeurs: 'Aziende',
      travailleurs: 'Lavoratori',
      europeennes: 'Istituzioni europee',
    },
  };

  for (const lang of languages) {
    test(`should show 3 expertise blocks in correct order for /${lang}/`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/`);

      const expertiseSection = page.locator('#expertise');
      await expect(expertiseSection).toBeVisible();

      // 3-column grid exists
      const grid = expertiseSection.locator('.grid');
      await expect(grid).toBeVisible();

      // All three blocks are present with correct titles
      const blocks = expertiseSection.locator('.grid h3');
      await expect(blocks).toHaveCount(3);

      // Correct order: Employeurs > Travailleurs > Europeennes
      const titles = expertiseBlocks[lang];
      await expect(blocks.nth(0)).toContainText(titles.employeurs);
      await expect(blocks.nth(1)).toContainText(titles.travailleurs);
      await expect(blocks.nth(2)).toContainText(titles.europeennes);

      // Links to service pages exist
      await expect(expertiseSection.locator(`a[href="/${lang}/services/employeurs"]`)).toBeVisible();
      await expect(expertiseSection.locator(`a[href="/${lang}/services/travailleurs"]`)).toBeVisible();
      await expect(expertiseSection.locator(`a[href="/${lang}/services/europeennes"]`)).toBeVisible();
    });
  }
});

test.describe('Honoraires Intro Block Removed from Homepage', () => {
  test('should NOT show honoraires intro block on homepage (FR)', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);

    const expertiseSection = page.locator('#expertise');

    // Only 3 expertise blocks, no standalone honoraires block
    const blocks = expertiseSection.locator('.grid h3');
    await expect(blocks).toHaveCount(3);

    // No CheckCircle advantages list on homepage
    await expect(expertiseSection.locator('text="Tarifs horaires"')).not.toBeVisible();
  });
});

test.describe('Navigation Dropdown - European Institutions Link', () => {
  const navLabels: Record<string, string> = {
    fr: 'INSTITUTIONS EUROPÉENNES',
    en: 'EUROPEAN INSTITUTIONS',
    it: 'ISTITUZIONI EUROPEE',
  };

  for (const lang of languages) {
    test(`should have European Institutions link in nav for /${lang}/`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/`);

      // The dropdown link to europeennes exists in the header
      const header = page.locator('header');
      const euroLink = header.locator(`a[href="/${lang}/services/europeennes"]`);
      await expect(euroLink).toHaveCount(1);
      await expect(euroLink).toContainText(navLabels[lang]);
    });
  }
});

test.describe('Logo in Header', () => {
  test('should render the logo image in the header', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`);

    const logo = page.locator('header img[alt="Christine Rizzo Logo"]');
    await expect(logo).toBeVisible();

    // Logo src should reference the SVG asset
    const src = await logo.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toContain('logo_crizzo_calli3');
  });
});
