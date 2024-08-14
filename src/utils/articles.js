// src/utils/articles.js

const dummyArticles = {
  fr: [
    {
      data: {
        title: "Les nouveautés du droit du travail en 2024",
        description: "Découvrez les changements majeurs qui affecteront les employeurs et les employés cette année.",
        pubDate: new Date("2024-01-15"),
        thumbnail: "https://picsum.photos/seed/article1fr/800/600",
        slug: "nouveautes-droit-travail-2024"
      }
    },
    {
      data: {
        title: "Comment gérer le télétravail efficacement",
        description: "Conseils pratiques pour les employeurs et les employés dans un monde du travail de plus en plus distant.",
        pubDate: new Date("2023-12-10"),
        thumbnail: "https://picsum.photos/seed/article2fr/800/600",
        slug: "gerer-teletravail-efficacement"
      }
    },
    {
      data: {
        title: "Les droits des travailleurs freelance",
        description: "Un aperçu complet des droits et des protections pour les travailleurs indépendants en France.",
        pubDate: new Date("2023-11-20"),
        thumbnail: "https://picsum.photos/seed/article3fr/800/600",
        slug: "droits-travailleurs-freelance"
      }
    }
  ],
  en: [
    {
      data: {
        title: "Labor Law Updates for 2024",
        description: "Explore the major changes that will affect employers and employees this year.",
        pubDate: new Date("2024-01-15"),
        thumbnail: "https://picsum.photos/seed/article1en/800/600",
        slug: "labor-law-updates-2024"
      }
    },
    {
      data: {
        title: "Effective Remote Work Management",
        description: "Practical advice for employers and employees in an increasingly remote work world.",
        pubDate: new Date("2023-12-10"),
        thumbnail: "https://picsum.photos/seed/article2en/800/600",
        slug: "effective-remote-work-management"
      }
    },
    {
      data: {
        title: "Freelancer Rights in the Workplace",
        description: "A comprehensive overview of rights and protections for independent workers in the UK.",
        pubDate: new Date("2023-11-20"),
        thumbnail: "https://picsum.photos/seed/article3en/800/600",
        slug: "freelancer-rights-workplace"
      }
    }
  ],
  it: [
    {
      data: {
        title: "Aggiornamenti del diritto del lavoro per il 2024",
        description: "Esplora i principali cambiamenti che influenzeranno datori di lavoro e dipendenti quest'anno.",
        pubDate: new Date("2024-01-15"),
        thumbnail: "https://picsum.photos/seed/article1it/800/600",
        slug: "aggiornamenti-diritto-lavoro-2024"
      }
    },
    {
      data: {
        title: "Gestione efficace del lavoro a distanza",
        description: "Consigli pratici per datori di lavoro e dipendenti in un mondo del lavoro sempre più remoto.",
        pubDate: new Date("2023-12-10"),
        thumbnail: "https://picsum.photos/seed/article2it/800/600",
        slug: "gestione-efficace-lavoro-distanza"
      }
    },
    {
      data: {
        title: "I diritti dei lavoratori freelance",
        description: "Una panoramica completa dei diritti e delle tutele per i lavoratori autonomi in Italia.",
        pubDate: new Date("2023-11-20"),
        thumbnail: "https://picsum.photos/seed/article3it/800/600",
        slug: "diritti-lavoratori-freelance"
      }
    }
  ]
};
  
export async function getArticles(lang) {
  // Simuler un délai pour imiter une requête asynchrone
  await new Promise(resolve => setTimeout(resolve, 100));
    
  return dummyArticles[lang] || [];
}