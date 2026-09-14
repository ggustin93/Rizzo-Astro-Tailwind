import { getEntry } from 'astro:content';
import { getTeam, profilePath } from './team.js';
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

  const members = await getTeam(lang);
  const teamPath = `/${lang}/equipe`;
  return {
    ...navigation,
    header: {
      ...navigation.header,
      mainLinks: navigation.header.mainLinks.map(link => {
        if (link.url.replace(/\/$/, '') !== teamPath) return link;
        const overviewLinks = (link.dropdownItems || []).filter(item =>
          item.url.replace(/\/$/, '') === teamPath
        );
        return {
          ...link,
          dropdownItems: [
            ...overviewLinks,
            ...members.map(member => ({ label: member.name, url: profilePath(lang, member) })),
          ],
        };
      }),
    },
  };
}
