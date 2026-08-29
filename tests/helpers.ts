export { LOCALES as languages } from '../src/config/locales';

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
export const bookableLawyers = lawyers.filter((lawyer) => lawyer.calSlug);

export const address = 'Chaussée de Waterloo 1151';
