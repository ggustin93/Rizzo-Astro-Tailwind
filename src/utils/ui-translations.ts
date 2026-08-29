import { getEntry } from 'astro:content';

export interface UiTranslations {
  readMore: string;
  viewAllArticles: string;
  contactCta: string;
  navigation: string;
  legalPages: string;
  ecoDesignPwablo: string;
  copyright?: string;
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
  additionalTranslations?: {
    activePage: string;
    submit: string;
    cancel: string;
    search: string;
    close: string;
    menu?: string;
    backToTop?: string;
    share?: string;
    readingTime?: string;
    minutes?: string;
    publishedOn?: string;
    categories?: string;
    nextArticle?: string;
    previousArticle?: string;
    relatedArticles?: string;
    lastUpdated?: string;
    contactMe?: string;
    bookAppointment?: string;
    bookWith?: string;
    contactForm?: string;
  };
}

import type { Locale } from '../config/locales';

export type SupportedLanguage = Locale;

// Fonction pour récupérer les traductions UI depuis le CMS
export async function getUiTranslations(lang: SupportedLanguage): Promise<UiTranslations> {
  try {
    // Récupérer les traductions depuis le CMS
    const uiTranslationsEntry = await getEntry('ui-translations', 'ui-translations');
    
    // Utiliser les traductions pour la langue spécifiée ou par défaut en français
    return uiTranslationsEntry?.data?.[lang] || uiTranslationsEntry?.data?.fr || defaultTranslations[lang] || defaultTranslations.fr;
  } catch (error) {
    console.error("Erreur lors de la récupération des traductions UI:", error);
    return defaultTranslations[lang] || defaultTranslations.fr; 
  }
}

// Traductions par défaut en cas de problème avec le CMS
const defaultTranslations: Record<SupportedLanguage, UiTranslations> = {
  fr: {
    readMore: "Lire la suite",
    viewAllArticles: "Voir tous les articles",
    contactCta: "Prendre rendez-vous",
    navigation: "Navigation",
    legalPages: "Pages légales",
    ecoDesignPwablo: "Eco-design & Pwablo",
    blogTitle: "Articles",
    noArticles: "Aucun article trouvé.",
    allCategories: "Toutes catégories",
    ctaTitle: "Une question en droit du travail?",
    ctaSubtitle: "Contactez-moi. Je suis à votre écoute.",
    takeAppointment: "Prendre RDV",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "Email",
    learnMore: "En savoir plus",
    additionalTranslations: {
      activePage: "Page active",
      submit: "Soumettre",
      cancel: "Annuler",
      search: "Rechercher",
      close: "Fermer"
    }
  },
  en: {
    readMore: "Read more",
    viewAllArticles: "View all articles",
    contactCta: "Book an appointment",
    navigation: "Navigation",
    legalPages: "Legal pages",
    ecoDesignPwablo: "Eco-design & Pwablo",
    blogTitle: "Blog Posts",
    noArticles: "No articles found.",
    allCategories: "All categories",
    ctaTitle: "Do you have a question about labor law?",
    ctaSubtitle: "Contact me. I'm here to listen.",
    takeAppointment: "Schedule Appointment",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    learnMore: "Learn more",
    additionalTranslations: {
      activePage: "Active page",
      submit: "Submit",
      cancel: "Cancel",
      search: "Search",
      close: "Close"
    }
  },
  it: {
    readMore: "Leggi di più",
    viewAllArticles: "Vedi tutti gli articoli",
    contactCta: "Prenota un appuntamento",
    navigation: "Navigazione",
    legalPages: "Pagine legali",
    ecoDesignPwablo: "Eco-design & Pwablo",
    blogTitle: "Articoli",
    noArticles: "Nessun articolo trovato.",
    allCategories: "Tutte le categorie",
    ctaTitle: "Hai una domanda sul diritto del lavoro?",
    ctaSubtitle: "Contattami. Sono qui per ascoltarti.",
    takeAppointment: "Prendere Appuntamento",
    call: "Chiamare",
    whatsapp: "WhatsApp",
    email: "Email",
    learnMore: "Scopri di più",
    additionalTranslations: {
      activePage: "Pagina attiva",
      submit: "Inviare",
      cancel: "Annulla",
      search: "Cerca",
      close: "Chiudi"
    }
  }
}; 