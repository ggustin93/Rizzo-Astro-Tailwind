import { test, expect } from '@playwright/test';
import { cdnImage } from '../src/utils/imageHelpers.js';

// #42: CMS uploads are served resized by the Netlify Image CDN, never as the raw upload.
// Fixtures are real files in public/: photo-4370.jpg is 2462 × 3080, romain-portrait.webp 880 × 1321, smichiels-optimized.webp 500 × 500, dscf3258.jpg 1600 × 1066.
test.describe('cdnImage', () => {
  test('a large CMS photo is resized and cropped, with a 2x variant for sharp screens', async () => {
    expect(await cdnImage('/assets/images/photo-4370.jpg', { width: 600, height: 750, enabled: true })).toEqual({
      src: '/.netlify/images?url=%2Fassets%2Fimages%2Fphoto-4370.jpg&w=600&h=750&fit=cover&q=85',
      srcset:
        '/.netlify/images?url=%2Fassets%2Fimages%2Fphoto-4370.jpg&w=600&h=750&fit=cover&q=85 1x, ' +
        '/.netlify/images?url=%2Fassets%2Fimages%2Fphoto-4370.jpg&w=1200&h=1500&fit=cover&q=85 2x',
      width: 600,
      height: 750,
    });
  });

  test('a photo between 1x and 2x gets a high-density variant as large as the source allows', async () => {
    expect((await cdnImage('/assets/images/romain-portrait.webp', { width: 600, height: 750, enabled: true })).srcset).toBe(
      '/.netlify/images?url=%2Fassets%2Fimages%2Fromain-portrait.webp&w=600&h=750&fit=cover&q=85 1x, ' +
        '/.netlify/images?url=%2Fassets%2Fimages%2Fromain-portrait.webp&w=876&h=1095&fit=cover&q=85 1.46x',
    );
  });

  test('a crop taller than the source allows limits the high-density variant by height', async () => {
    expect((await cdnImage('/assets/images/dscf3258.jpg', { width: 1000, height: 1000, enabled: true })).srcset).toBe(
      '/.netlify/images?url=%2Fassets%2Fimages%2Fdscf3258.jpg&w=1000&h=1000&fit=cover&q=85 1x, ' +
        '/.netlify/images?url=%2Fassets%2Fimages%2Fdscf3258.jpg&w=1060&h=1060&fit=cover&q=85 1.06x',
    );
  });

  test('a photo no wider than its display size gets no upscaled variant', async () => {
    expect(await cdnImage('/assets/images/smichiels-optimized.webp', { width: 500, height: 500, enabled: true })).toEqual({
      src: '/.netlify/images?url=%2Fassets%2Fimages%2Fsmichiels-optimized.webp&w=500&h=500&fit=cover&q=85',
      width: 500,
      height: 500,
    });
  });

  test('a width alone keeps the whole image', async () => {
    expect((await cdnImage('/assets/images/equipe.png', { width: 1200, enabled: true })).src).toBe(
      '/.netlify/images?url=%2Fassets%2Fimages%2Fequipe.png&w=1200',
    );
  });

  test('an illustration keeps its whole image but still declares its display size', async () => {
    expect(await cdnImage('/assets/images/equipe.png', { width: 1200, height: 600, crop: false, enabled: true })).toEqual({
      src: '/.netlify/images?url=%2Fassets%2Fimages%2Fequipe.png&w=1200',
      width: 1200,
      height: 600,
    });
  });

  test('file names with spaces or accents survive', async () => {
    expect((await cdnImage('/assets/images/Photo équipe.jpg', { width: 500, enabled: true })).src).toBe(
      '/.netlify/images?url=%2Fassets%2Fimages%2FPhoto%20%C3%A9quipe.jpg&w=500',
    );
  });

  for (const [why, src, enabled] of [
    ['SVG is already light and scalable', '/assets/images/illustration_cta_2.svg', true],
    ['remote images are optimised by Astro at build', 'https://images.pexels.com/photos/1.jpeg', true],
    ['outside Netlify (dev, preview, tests) there is no CDN', '/assets/images/photo-4370.jpg', false],
  ]) {
    test(`served as-is when ${why}`, async () => {
      expect(await cdnImage(src, { width: 500, height: 500, enabled })).toEqual({ src, width: 500, height: 500 });
    });
  }
});
