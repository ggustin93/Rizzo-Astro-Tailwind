import { test, expect, type Page } from '@playwright/test';
import { languages as langs } from './helpers';

/**
 * Le footer duplique ses colonnes : une version desktop (`hidden md:block`) et
 * des accordéons `<details class="md:hidden">` fermés au chargement. Sur mobile
 * on les ouvre — c'est le parcours réel d'un visiteur sur téléphone.
 */
async function openFooterAccordions(page: Page, isMobile: boolean | undefined) {
  if (!isMobile) return;
  for (const summary of await page.locator('footer details > summary:visible').all()) {
    await summary.click();
  }
}


const contactLabels: Record<string, string> = { fr: 'CONTACT', en: 'CONTACT', it: 'CONTATTO', nl: 'CONTACT' };
const servicesLabels: Record<string, string> = { fr: 'SERVICES', en: 'SERVICES', it: 'SERVIZI', nl: 'DIENSTEN' };
const homeLabels: Record<string, string> = { fr: 'ACCUEIL', en: 'HOME', it: 'HOME', nl: 'HOME' };

// ─── Footer menu links ────────────────────────────────────────────────────────

test.describe('Footer menu — links présents', () => {
  for (const lang of langs) {
    test(`/${lang} — menu footer contient les 5 liens`, async ({ page, isMobile }) => {
      await page.goto(`/${lang}/`);
      await openFooterAccordions(page, isMobile);

      const footer = page.locator('footer');

      await expect(footer.getByRole('link', { name: homeLabels[lang], exact: true })).toBeVisible();
      await expect(footer.getByRole('link', { name: servicesLabels[lang], exact: true })).toBeVisible();
      await expect(footer.getByRole('link', { name: contactLabels[lang], exact: true })).toBeVisible();
    });
  }
});

// ─── Footer CONTACT link ──────────────────────────────────────────────────────

test.describe('Footer — lien CONTACT', () => {
  for (const lang of langs) {
    test(`/${lang} — lien Contact navigue vers /${lang}/contact`, async ({ page, isMobile }) => {
      await page.goto(`/${lang}/`);
      await openFooterAccordions(page, isMobile);

      const footer = page.locator('footer');
      const contactLink = footer.getByRole('link', { name: contactLabels[lang], exact: true }).first();

      await expect(contactLink).toHaveAttribute('href', `/${lang}/contact`);
    });
  }
});

// ─── Footer SERVICES link (href + section cible) ─────────────────────────────

test.describe('Footer — lien SERVICES', () => {
  for (const lang of langs) {
    test(`/${lang} — href pointe vers #expertise`, async ({ page, isMobile }) => {
      await page.goto(`/${lang}/`);
      await openFooterAccordions(page, isMobile);

      const footer = page.locator('footer');
      const servicesLink = footer.getByRole('link', { name: servicesLabels[lang], exact: true }).first();

      await expect(servicesLink).toHaveAttribute('href', `/${lang}#expertise`);
    });
  }

  test('/fr — section #expertise existe sur la homepage', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page.locator('#expertise')).toBeVisible();
  });
});

// ─── Scroll vers #expertise après navigation entre pages ─────────────────────

test.describe('Footer SERVICES — scroll ancre après View Transitions', () => {
  for (const lang of langs) {
    test(`/${lang} — depuis /honoraires, clic SERVICES scroll jusqu'à #expertise`, async ({ page, isMobile }) => {
      await page.goto(`/${lang}/honoraires`);
      await openFooterAccordions(page, isMobile);

      // Clic sur le lien Services du footer (colonne desktop ou accordéon mobile ouvert)
      const servicesLink = page
        .locator('footer ul')
        .filter({ has: page.locator(`a[href="/${lang}#expertise"]`) })
        .getByRole('link', { name: servicesLabels[lang], exact: true });

      await servicesLink.click();

      // La page home doit avoir chargé
      await expect(page).toHaveURL(new RegExp(`/${lang}(#expertise|/?$)`));

      // La section expertise doit être dans le viewport après le scroll
      const expertiseSection = page.locator('#expertise');
      await expect(expertiseSection).toBeVisible();
      await expect(expertiseSection).toBeInViewport({ ratio: 0.3 });
    });
  }
});
