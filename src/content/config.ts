import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.any(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()).nonempty(),
    description: z.string().max(200),
    highlights: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

// Collection Configuration
const configCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sectionsVisibility: z.object({
      articlesSection: z.boolean().optional().default(false)
    }).optional(),
    calendarConfig: z.object({
      calendarLink: z.string().optional().default("https://cal.com/pwablo/30min")
    }).optional()
  })
});

// Collection Navigation
const navigationCollection = defineCollection({
  type: 'data',
  schema: z.record(
    z.object({
      header: z.object({
        mainLinks: z.array(
          z.object({
            label: z.string(),
            url: z.string(),
            hasDropdown: z.boolean().optional().default(false),
            dropdownItems: z.array(
              z.object({
                label: z.string(),
                url: z.string()
              })
            ).optional()
          })
        ),
        contactButtonText: z.string()
      }),
      footer: z.object({
        menuTitle: z.string(),
        contactTitle: z.string(),
        contactInfo: z.object({
          phone: z.string(),
          email: z.string(),
          linkedin: z.string(),
          address: z.string()
        }),
        legalLinks: z.array(
          z.object({
            label: z.string(),
            url: z.string()
          })
        ),
        ecoDesignTitle: z.string(),
        ecoDesignText: z.string(),
        ecoDesignUrl: z.string(),
        pwabloText: z.string(),
        pwabloUrl: z.string(),
        copyrightText: z.string()
      })
    })
  )
});

// Collection UI Translations
const uiTranslationsCollection = defineCollection({
  type: 'data',
  schema: z.record(
    z.object({
      readMore: z.string(),
      viewAllArticles: z.string(),
      contactCta: z.string(),
      navigation: z.string(),
      legalPages: z.string(),
      ecoDesignPwablo: z.string(),
      copyright: z.string(),
      blogTitle: z.string(),
      noArticles: z.string(),
      allCategories: z.string(),
      ctaTitle: z.string(),
      ctaSubtitle: z.string(),
      takeAppointment: z.string(),
      call: z.string(),
      whatsapp: z.string(),
      email: z.string(),
      learnMore: z.string(),
      additionalTranslations: z.object({
        activePage: z.string(),
        submit: z.string(),
        cancel: z.string(),
        search: z.string(),
        close: z.string(),
        menu: z.string().optional(),
        backToTop: z.string().optional(),
        share: z.string().optional(),
        readingTime: z.string().optional(),
        minutes: z.string().optional(),
        publishedOn: z.string().optional(),
        categories: z.string().optional(),
        nextArticle: z.string().optional(),
        previousArticle: z.string().optional(),
        relatedArticles: z.string().optional(),
        lastUpdated: z.string().optional(),
        contactMe: z.string().optional(),
        bookAppointment: z.string().optional()
      }).optional()
    })
  )
});

export const collections = {
  'blog': blog,
  'config': configCollection,
  'navigation': navigationCollection,
  'ui-translations': uiTranslationsCollection,
};