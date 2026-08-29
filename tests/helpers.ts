export { LOCALES as languages } from '../src/config/locales';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

/**
 * The published roster. Adding a third lawyer (#12) should be one edit here plus
 * site-config.yml, not an edit in every spec that names them.
 */
export const lawyers = [
  {
    name: 'Christine Rizzo',
    slug: 'christine-rizzo',
    email: 'christine@rizzoavocate.be',
    phone: '+32 488 40 45 49',
    calSlug: 'c.rizzo-avocat.be/rendez-vous',
    careerEntry: 'Barreau de Bruxelles',
  },
  {
    name: 'Stephanie Michiels',
    slug: 'stephanie-michiels',
    email: 'stephanie@michielsavocate.be',
    phone: '+32 498 50 29 01',
    calSlug: 'stephanie-michiels-v76dvl',
    careerEntry: 'Barreau de Bruxelles',
  },
];

/** Lawyers who should get a booking row in the header (#9). */
export const bookableLawyers = lawyers.filter((lawyer) => lawyer.calSlug);

export const address = 'Chaussée de Waterloo 1151';
