// src/utils/ui-translations.js

export const uiTranslations = {
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

      // Ajoutez d'autres traductions UI nécessaires ici
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
      // Ajoutez d'autres traductions UI nécessaires ici
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
      // Ajoutez d'autres traductions UI nécessaires ici
    }
  };
  
  export function getUiTranslations(lang) {
    return uiTranslations[lang] || uiTranslations.fr; // Fallback to French if language not found
  }