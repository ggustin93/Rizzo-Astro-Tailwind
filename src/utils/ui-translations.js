// src/utils/ui-translations.js
import { getEntryBySlug } from 'astro:content';

// Fonction pour récupérer les traductions UI depuis le CMS
export async function getUiTranslations(lang) {
  try {
    // Récupérer les traductions depuis le CMS
    const uiTranslationsEntry = await getEntryBySlug('ui-translations', 'ui-translations');
    
    // Utiliser les traductions pour la langue spécifiée ou par défaut en français
    return uiTranslationsEntry?.data?.[lang] || uiTranslationsEntry?.data?.fr || defaultTranslations[lang] || defaultTranslations.fr;
  } catch (error) {
    console.error("Erreur lors de la récupération des traductions UI:", error);
    return defaultTranslations[lang] || defaultTranslations.fr; 
  }
}

// Traductions par défaut en cas de problème avec le CMS
const defaultTranslations = {
  fr: {
    readMore: "Lire la suite",
    viewAllArticles: "Voir tous les articles",
    contactCta: "Prendre rendez-vous",
    navigation: "Navigation",
    legalPages: "Pages légales",
    ecoDesignPwablo: "Eco-design & Pwablo",
    copyright: "© 2024 Christine Rizzo",
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
    copyright: "© 2024 Christine Rizzo",
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
    copyright: "© 2024 Christine Rizzo",
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