import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

export { LOCALES as languages, DEFAULT_LOCALE } from '../src/config/locales';

/** CMS content, so specs never hard-code copy the cabinet can edit. */
export const content = (file: string): any => load(readFileSync(new URL(`../src/content/${file}`, import.meta.url), 'utf8'));

/** Label of a contact action (email | appointment | phone) from ui-translations. */
export const ctaLabel = (lang: string, type: string): string =>
  content('ui-translations/ui-translations.yml')[lang].cta.actions.find((a) => a.type === type).label;

/** Shared team roster (names, order, portraits) as the cabinet edits it in the CMS. */
export const team = (): any[] => content('config/site-config.yml').team;
export const nameOf = (id: string): string => team().find((m) => m.id === id).name;
/** A member's translated profile entry (role, career, publications) from profile.yml. */
export const profileOf = (lang: string, id: string): any => content('profile/profile.yml')[lang].lawyers.find((l) => l.id === id);

/** Netlify Image CDN URL of a CMS photo resized and cropped to w × h, at photo quality (#42). */
export const resized = (path: string, w: number, h: number): string =>
  `/.netlify/images?url=${encodeURIComponent(path)}&w=${w}&h=${h}&fit=cover&q=85`;

export const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

/**
 * The published roster. Adding a third lawyer (#12) should be one edit here plus
 * site-config.yml, not an edit in every spec that names them.
 *
 * `careerEntry` must be a proper noun that survives translation: the career
 * timeline is translated per locale, so a French phrase would fail on every
 * other language (issue #11).
 */
export const lawyers = [
  {
    name: 'Christine Rizzo',
    slug: 'christine-rizzo',
    email: 'christine@rizzoavocate.be',
    phone: '+32 488 40 45 49',
    calSlug: 'c.rizzo-avocat.be/rendez-vous',
    careerEntry: 'Reliance Littler',
  },
  {
    name: 'Stephanie Michiels',
    slug: 'stephanie-michiels',
    email: 'stephanie@michielsavocate.be',
    phone: '+32 498 50 29 01',
    calSlug: 'stephanie-michiels-v76dvl',
    careerEntry: 'Fulbright',
  },
];

/** Lawyers who should get a booking row in the header (#9). */
export const bookableLawyers = [...lawyers, { name: 'Arnaud Vanderhoeven Jacobs', calSlug: 'arnaudvanderhoeven' }];

export const address = 'Chaussée de Waterloo 1151';
