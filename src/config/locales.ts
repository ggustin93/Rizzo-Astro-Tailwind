/**
 * Single source of truth for the locales the site ships.
 *
 * Adding a language means editing LOCALES here and translating content —
 * not touching every page's getStaticPaths (issue #8).
 */
export const LOCALES = ['fr', 'en', 'it'] as const;

/** Union of the locale codes the site ships, e.g. 'fr' | 'en' | 'it'. */
export type Locale = (typeof LOCALES)[number];

/** French is the default locale and the hreflang x-default target. */
export const DEFAULT_LOCALE = 'fr';

/** getStaticPaths() helper for pages that vary only by language. */
export const localePaths = () => LOCALES.map((lang) => ({ params: { lang } }));

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** Alternation group for URL matching, e.g. /^\/(fr|en|it)/ */
export const LOCALE_PATTERN = LOCALES.join('|');
