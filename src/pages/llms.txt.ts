import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { LOCALES, DEFAULT_LOCALE } from '../config/locales';
import { getTeam, profilePath } from '../utils/team.js';
import { getContactInfo } from '../utils/contact-info.js';
import { getNavigation } from '../utils/navigation';

export const prerender = true;

/**
 * Generative engines read llms.txt as the canonical summary of the cabinet, so
 * it is built from the same collections the site renders rather than
 * hand-maintained: a lawyer (#12) or a locale (#11) is one content edit, not a
 * second edit here that someone will forget (issue #16).
 */
export const GET: APIRoute = async () => {
  const { seo } = (await getEntry('config', 'site-config'))!.data;
  const { address } = await getContactInfo();
  const navigation = await getNavigation(DEFAULT_LOCALE);
  const team = await getTeam(DEFAULT_LOCALE);

  const url = (path: string) => new URL(path.replace(/\/?$/, '/'), seo.siteUrl).href;

  // Locale names in the file's own language, so a new locale needs no table here.
  const localeName = new Intl.DisplayNames([DEFAULT_LOCALE], { type: 'language' });
  const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

  const profileUrl = (lawyer: { slug: string }) => url(profilePath(DEFAULT_LOCALE, lawyer));

  // Header links plus the footer menu, so the pages the site itself considers
  // primary are the pages crawlers are pointed at. Anchors are not pages, and
  // the roster below already owns the profile links.
  const profileUrls = new Set(team.map(profileUrl));
  const pages = new Map<string, string>();
  for (const link of [
    ...navigation.header.mainLinks.flatMap((link) => [link, ...(link.dropdownItems ?? [])]),
    ...(navigation.footer.menuLinks ?? [])
  ]) {
    const href = url(link.url);
    if (link.url.includes('#') || profileUrls.has(href) || pages.has(href)) continue;
    pages.set(href, link.label);
  }

  const body = `# ${seo.siteName}

> ${seo.siteDescription}

Adresse : ${address}, Belgique.

## Avocates

${team.map((lawyer) => `- [${lawyer.name}](${profileUrl(lawyer)}) — ${lawyer.title}. ${lawyer.languages}`).join('\n')}

## Pages principales

${[...pages].map(([href, label]) => `- [${label}](${href})`).join('\n')}

## Langues du site

${LOCALES.map((locale) => `- [${capitalise(localeName.of(locale) ?? locale)}](${url(`/${locale}`)})`).join('\n')}

## Notes

- Le contenu du site est fourni à titre informatif et ne constitue pas un conseil juridique.
- Pour une question personnelle, prenez rendez-vous via la page Contact.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
