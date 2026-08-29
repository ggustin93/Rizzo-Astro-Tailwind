import { getEntry } from 'astro:content';
import type { Locale } from '../config/locales';
import type { UiTranslations } from '../content/config';

export type { UiTranslations };
export type SupportedLanguage = Locale;

/**
 * Every string the interface renders, for one locale.
 *
 * There is no French fallback on purpose: the collection schema requires a
 * block per locale in LOCALES, so a missing translation is a build failure
 * naming the locale rather than a page that silently serves French (#15).
 */
export async function getUiTranslations(lang: SupportedLanguage): Promise<UiTranslations> {
  const entry = await getEntry('ui-translations', 'ui-translations');
  const translations = entry?.data?.[lang];

  if (!translations) {
    throw new Error(
      `No "${lang}" block in src/content/ui-translations/ui-translations.yml — add it before shipping ${lang}.`
    );
  }

  return translations;
}
