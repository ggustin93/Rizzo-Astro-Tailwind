import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { LOCALES, DEFAULT_LOCALE } from '../config/locales';
import { getTeam } from '../utils/team.js';

export const prerender = true;

/**
 * Generative engines read llms.txt as the canonical summary of the cabinet, so
 * it is built from the same collections the site renders rather than
 * hand-maintained: a lawyer (#12) or a locale (#11) is one content edit, not a
 * second edit here that someone will forget (issue #16).
 */
export const GET: APIRoute = async () => {
  const { seo, address } = (await getEntry('config', 'site-config'))!.data;
  const navigation = (await getEntry('navigation', 'navigation'))!.data[DEFAULT_LOCALE];
  const team = await getTeam(DEFAULT_LOCALE);

  const origin = seo.siteUrl.replace(/\/$/, '');
  const url = (path: string) => `${origin}${path.replace(/\/?$/, '/')}`;

  // Locale names in the file's own language, so a new locale needs no table here.
  const localeName = new Intl.DisplayNames([DEFAULT_LOCALE], { type: 'language' });
  const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

  const profileUrl = (lawyer: { slug: string }) =>
    url(`/${DEFAULT_LOCALE}/equipe/${lawyer.slug}`);

  // The roster owns the profile links: a lawyer added to profile.yml but not to
  // the nav must still appear. Seeding `seen` keeps the nav from repeating them.
  const seen = new Set(team.map(profileUrl));

  // Header links plus the footer menu, so the pages the site itself considers
  // primary are the pages crawlers are pointed at. Anchors are not pages.
  const pageLines = [
    ...navigation.header.mainLinks.flatMap((link) => [link, ...(link.dropdownItems ?? [])]),
    ...(navigation.footer.menuLinks ?? [])
  ]
    .filter((link) => !link.url.includes('#'))
    .filter((link) => !seen.has(url(link.url)) && seen.add(url(link.url)))
    .map((link) => `- [${link.label}](${url(link.url)})`);

  const body = `# ${seo.siteName}

> ${seo.siteDescription}

Adresse : ${address}, Belgique.

## Avocates

${team.map((lawyer) => `- [${lawyer.name}](${profileUrl(lawyer)}) — ${lawyer.title}. ${lawyer.languages}`).join('\n')}

## Pages principales

${pageLines.join('\n')}

## Langues du site

${LOCALES.map((locale) => `- [${capitalise(localeName.of(locale) ?? locale)}](${url(`/${locale}`)})`).join('\n')}

## Notes

- Le contenu du site est fourni à titre informatif et ne constitue pas un conseil juridique.
- Pour une question personnelle, prenez rendez-vous via la page Contact.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
