import { test, expect } from '@playwright/test';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { randomFillSync } from 'node:crypto';
import { load } from 'js-yaml';
import sharp from 'sharp';
import { resized } from './helpers';

// Run only through scripts/verify-cms-photo.mjs: a real Decap CMS on a scratch copy of the repo.
// The cabinet's path: « Page Équipe → Membres » → square portrait → upload → publish → team page.
const repo = process.env.CMS_REPO;
const siteConfig = () => load(readFileSync(`${repo}/src/content/config/site-config.yml`, 'utf8'));

/**
 * Every scalar of a YAML tree by its path, to prove a save changed one field only. Values, not lines:
 * Decap re-serialises the whole file on save (key order, quotes, line wrapping).
 */
const leaves = (node, path = '', out = {}) => {
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) leaves(v, path ? `${path}.${k}` : k, out);
  else out[path] = node;
  return out;
};

/** A phone-like JPEG of random pixels: incompressible, so its size follows `side` (about 0.83 byte per pixel). */
const photo = async (name, side) => {
  const file = `${repo}/${name}`;
  await sharp(randomFillSync(Buffer.alloc(side * side * 3)), { raw: { width: side, height: side, channels: 3 } })
    .jpeg({ quality: 90 })
    .toFile(file);
  return { file, name, size: statSync(file).size };
};

/** Opens the media library from a member's square portrait, as the cabinet does. */
const openSquarePortrait = async (page, memberId) => {
  await page.goto('/admin/index.html');
  await page.getByText('Se connecter').click();
  await page.goto('/admin/index.html#/collections/profile/entries/membres');
  const index = siteConfig().team.findIndex((m) => m.id === memberId);
  expect(index, `member ${memberId} in site-config.yml`).toBeGreaterThan(-1);
  // Each member has two image fields (square, then individual portrait).
  await page.getByRole('button', { name: /^Choisir une image/ }).nth(index * 2).click();
  await expect(page.getByRole('button', { name: 'Téléverser une nouvelle ressource' })).toBeVisible();
};

/** Uploads through the « Téléverser une nouvelle ressource » button, as the cabinet does. */
const upload = async (page, file) => {
  const chooser = page.waitForEvent('filechooser');
  await page.getByText('Téléverser une nouvelle ressource').click();
  await (await chooser).setFiles(file);
};

if (repo) {
  test.describe.serial('Changing a portrait in the CMS', () => {
    test.setTimeout(240_000);
    const member = 'romain-archalaus';
    const photoName = 'portrait-romain-e2e.jpg';
    const photoPath = `/assets/images/${photoName}`;

    test('a photo over 5 MB is refused', async ({ page }) => {
      const big = await photo('too-big-e2e.jpg', 2800);
      expect(big.size).toBeGreaterThan(5_000_000);
      await openSquarePortrait(page, member);
      // Decap refuses with a browser alert, which blocks the page until it is dismissed.
      let refusal = '';
      page.once('dialog', (dialog) => ((refusal = dialog.message()), dialog.dismiss()));
      await upload(page, big.file);
      expect(refusal).toContain('Le fichier est trop volumineux.');
      expect(existsSync(`${repo}/public/assets/images/${big.name}`)).toBe(false);
    });

    test('a 4.7 MB photo becomes the square portrait, and nothing else changes', async ({ page }) => {
      const ok = await photo(photoName, 2380);
      expect(ok.size).toBeGreaterThan(4_000_000);
      expect(ok.size).toBeLessThan(5_000_000);
      const before = leaves(siteConfig());
      await openSquarePortrait(page, member);
      await upload(page, ok.file);
      await page.getByRole('button', { name: 'Choisir les éléments sélectionnés' }).click();
      await page.getByRole('button', { name: /^Publier/ }).first().click();
      await page.getByText('Publier maintenant').click();
      await expect(page.getByText('Modifications enregistrées', { exact: false })).toBeVisible();

      expect(existsSync(`${repo}/public${photoPath}`)).toBe(true);
      const index = siteConfig().team.findIndex((m) => m.id === member);
      const after = leaves(siteConfig());
      const changed = Object.keys({ ...before, ...after }).filter((k) => before[k] !== after[k]);
      expect(changed).toEqual([`team.${index}.image`]);
      expect(after[`team.${index}.image`]).toBe(photoPath);
    });

    test('the team page serves it resized by the Netlify Image CDN', () => {
      execFileSync('npx', ['astro', 'build', '--outDir', 'dist-netlify'], { cwd: repo, env: { ...process.env, NETLIFY: 'true' }, stdio: 'pipe' });
      const html = readFileSync(`${repo}/dist-netlify/fr/equipe/index.html`, 'utf8').replace(/&#38;|&amp;/g, '&');
      expect(existsSync(`${repo}/dist-netlify${photoPath}`), 'source photo shipped for the CDN').toBe(true);
      expect(html).toContain(`src="${resized(photoPath, 500, 500)}"`);
    });
  });
}
