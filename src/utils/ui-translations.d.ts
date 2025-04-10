export interface UiTranslations {
  readMore: string;
  viewAllArticles: string;
  contactCta: string;
  navigation: string;
  legalPages: string;
  ecoDesignPwablo: string;
  copyright: string;
  blogTitle: string;
  noArticles: string;
  allCategories: string;
  ctaTitle: string;
  ctaSubtitle: string;
  takeAppointment: string;
  call: string;
  whatsapp: string;
  email: string;
  learnMore: string;
  additionalTranslations: {
    activePage: string;
    submit: string;
    cancel: string;
    search: string;
    close: string;
  };
}

export type SupportedLanguage = 'fr' | 'en' | 'it';

export function getUiTranslations(lang: SupportedLanguage): UiTranslations; 