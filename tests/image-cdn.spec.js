import { test, expect } from '@playwright/test';
import { cdnImage } from '../src/utils/imageHelpers.js';

// #42: CMS uploads are served resized by the Netlify Image CDN, never as the raw upload.
// Fixtures are real files in public/: photo-4370.jpg is 2462 × 3080, christine-optimized.webp 500 × 500.
test.describe('cdnImage', () => {
  test('a large CMS photo is resized and cropped, with a 2x variant for sharp screens', async () => {
    expect(await cdnImage('/assets/images/photo-4370.jpg', { width: 600, height: 750, enabled: true })).toEqual({
      src: '/.netlify/images?url=%2Fassets%2Fimages%2Fphoto-4370.jpg&w=600&h=750&fit=cover',
      srcset:
        '/.netlify/images?url=%2Fassets%2Fimages%2Fphoto-4370.jpg&w=600&h=750&fit=cover 1x, ' +
        '/.netlify/images?url=%2Fassets%2Fimages%2Fphoto-4370.jpg&w=1200&h=1500&fit=cover 2x',
      width: 600,
      height: 750,
    });
  });

  test('a photo too small for 2x gets no upscaled variant', async () => {
    expect(await cdnImage('/assets/images/christine-optimized.webp', { width: 500, height: 500, enabled: true })).toEqual({
      src: '/.netlify/images?url=%2Fassets%2Fimages%2Fchristine-optimized.webp&w=500&h=500&fit=cover',
      width: 500,
      height: 500,
    });
  });

  test('a width alone keeps the whole image', async () => {
    expect((await cdnImage('/assets/images/equipe.png', { width: 1200, enabled: true })).src).toBe(
      '/.netlify/images?url=%2Fassets%2Fimages%2Fequipe.png&w=1200',
    );
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
