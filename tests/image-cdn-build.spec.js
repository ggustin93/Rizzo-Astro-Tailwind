import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { content, team, resized } from './helpers';

// Run only through scripts/verify-image-cdn.mjs, which builds the site as Netlify does (NETLIFY=true).
const dist = process.env.IMAGE_CDN_DIST;
// Attribute values come back HTML-escaped (&#38; or &amp;): compare plain URLs.
const html = (page) => readFileSync(`${dist}/${page}/index.html`, 'utf8').replace(/&#38;|&amp;/g, '&');
const imgFor = (page, path) => html(page).match(new RegExp(`<img[^>]*url=${encodeURIComponent(path).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`))?.[0];

if (dist) {
  test.describe('CMS photos go through the Netlify Image CDN (#42)', () => {
    for (const member of team()) {
      test(`${member.name}: home, team and profile portraits are resized`, () => {
        // Display sizes: home card about 241 px wide, team portrait capped at 22rem.
        for (const [page, size] of [['fr', 250], ['fr/equipe', 352]]) {
          const img = imgFor(page, member.image);
          expect(img, `${page}: portrait of ${member.name}`).toContain(`src="${resized(member.image, size, size)}"`);
        }
        const portrait = member.profileImage || member.image;
        expect(imgFor(`fr/equipe/${member.slug}`, portrait)).toContain(`src="${resized(portrait, 600, 750)}"`);
      });
    }

    test('a local blog thumbnail is resized, with 2x since the source is 2462 px wide', () => {
      expect(html('fr/blog/test')).toContain(`${resized('/assets/images/photo-4370.jpg', 2400, 1200)} 2x`);
      expect(html('fr/blog/test')).not.toContain('src="/assets/images/photo-4370.jpg"');
    });

    test('SVG illustrations are served as they are', () => {
      const { media } = content('home/home.yml');
      expect(html('fr')).toContain(`src="${media.team}"`);
      expect(html('fr')).not.toContain(`url=${encodeURIComponent(media.team)}`);
    });
  });
}
