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
      allCategories: "Tutte le categorie"
      // Ajoutez d'autres traductions UI nécessaires ici
    }
  };
  
  export function getUiTranslations(lang) {
    return uiTranslations[lang] || uiTranslations.fr; // Fallback to French if language not found
  }