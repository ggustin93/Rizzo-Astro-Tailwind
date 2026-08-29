import { getEntry } from 'astro:content';
import type { Locale } from '../config/locales';

/**
 * Header and footer navigation for one locale.
 *
 * One accessor per collection, like getTeam() and getContactInfo(). There is no
 * French fallback: the collection schema requires a block per locale in LOCALES,
 * so a missing translation is a build failure naming the locale rather than a
 * page that silently serves French (#15).
 */
export async function getNavigation(lang: Locale) {
  const entry = await getEntry('navigation', 'navigation');
  const navigation = entry?.data?.[lang];

  if (!navigation) {
    throw new Error(
      `No "${lang}" block in src/content/navigation/navigation.yml — add it before shipping ${lang}.`
    );
  }

  return navigation;
}
