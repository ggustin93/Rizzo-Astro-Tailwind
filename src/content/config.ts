import { defineCollection, z } from 'astro:content';
import { LOCALES, type Locale } from '../config/locales';

/**
 * Wraps a schema in one required entry per shipped locale.
 *
 * Adding a language to LOCALES therefore fails the build with
 * `nl: Required` until the YAML is translated, instead of falling back to
 * French at runtime (issue #15).
 */
const perLocale = <T extends z.ZodTypeAny>(schema: T) =>
  z.object(Object.fromEntries(LOCALES.map((locale) => [locale, schema])) as Record<Locale, T>);

/**
 * A locale's content, whatever its shape. `z.any()` would accept a *missing*
 * locale, which is the failure this whole mechanism exists to catch.
 */
const localeContent = z.record(z.string(), z.any());

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.any(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()).nonempty(),
    description: z.string().max(320),
    highlights: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

// Collection Configuration
const configCollection = defineCollection({
  type: 'data',
  schema: z.object({
    seo: z.object({
      siteUrl: z.string().url(),
      siteName: z.string(),
      siteDescription: z.string(),
      defaultSocialImage: z.string(),
    }),
    sectionsVisibility: z.boolean(),
    showContactForm: z.boolean().optional().default(true),
    allowIndexing: z.boolean(),
    lawyers: z.array(z.object({
      name: z.string(),
      phone: z.string(),
      whatsapp: z.string().optional(),
      email: z.string(),
      linkedin: z.string(),
      calendarLink: z.string(),
    })),
    address: z.string(),
    copyrightText: z.string().optional(),
  }),
});

// Collection Navigation
const navigationSchema = z.object({
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
    }).optional(),
    menuLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
    legalLinks: z.array(
      z.object({
        label: z.string(),
        url: z.string()
      })
    ),
    ecoDesignTitle: z.string(),
    ecoDesignText: z.string(),
    ecoDesignUrl: z.string(),
    pwablo: z.object({
      pwabloText: z.string(),
      pwabloUrl: z.string()
    }),
    copyrightText: z.string().optional()
  })
});

const navigationCollection = defineCollection({
  type: 'data',
  schema: perLocale(navigationSchema)
});

// Collection UI Translations — every string the interface renders.
const uiTranslationsSchema = z.object({
  readMore: z.string(),
  blogTitle: z.string(),
  noArticles: z.string(),
  allCategories: z.string(),
  header: z.object({
    bookWith: z.string(),
    contactForm: z.string()
  }),
  cta: z.object({
    title: z.string(),
    email: z.string(),
    appointment: z.string(),
    call: z.string(),
    bookAction: z.string()
  }),
  contactForm: z.object({
    formTitle: z.string(),
    nameLabel: z.string(),
    namePlaceholder: z.string(),
    emailLabel: z.string(),
    emailPlaceholder: z.string(),
    phoneLabel: z.string(),
    phonePlaceholder: z.string(),
    subjectLabel: z.string(),
    subjectPlaceholder: z.string(),
    messageLabel: z.string(),
    messagePlaceholder: z.string(),
    submitButton: z.string(),
    sending: z.string(),
    successMessage: z.string(),
    errorMessage: z.string()
  }),
  contactSuccess: z.object({
    title: z.string(),
    heading: z.string(),
    message: z.string(),
    info: z.string(),
    backToHome: z.string(),
    backToContact: z.string()
  }),
  blog: z.object({
    seoTitle: z.string(),
    seoDescription: z.string(),
    seoKeywords: z.array(z.string()),
    backToArticles: z.string(),
    keyPoints: z.string(),
    readTime: z.string()
  }),
  team: z.object({
    title: z.string(),
    viewProfile: z.string(),
    backToTeam: z.string(),
    languages: z.string(),
    career: z.string(),
    conferences: z.string(),
    publications: z.string(),
    inCollaborationWith: z.string()
  }),
  notFound: z.object({
    title: z.string(),
    message: z.string(),
    backHome: z.string()
  })
});

export type UiTranslations = z.infer<typeof uiTranslationsSchema>;

const uiTranslationsCollection = defineCollection({
  type: 'data',
  schema: perLocale(uiTranslationsSchema)
});

// Profile: only the shared, locale-independent keys are typed. Per-locale lawyer
// content stays free-form, but a missing slug must fail the build rather than
// surface as a runtime throw when a profile route is generated.
const profileCollection = defineCollection({
  type: 'data',
  schema: perLocale(localeContent).extend({
    lawyerSlugs: z.array(z.object({
      name: z.string(),
      slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens'),
    })),
  }).catchall(z.any()),
});

// Page content whose shape is free-form but whose locales are not: every one of
// these is read as `data[lang] || data.fr`, so an untranslated locale would
// publish French body copy under a `lang`/`hreflang` that claims otherwise.
const dataCollection = defineCollection({
  type: 'data',
  schema: perLocale(localeContent)
});

export const collections = {
  'blog': blog,
  'config': configCollection,
  'navigation': navigationCollection,
  'ui-translations': uiTranslationsCollection,
  // Add all other data collections here
  'home': dataCollection,
  'profile': profileCollection,
  'contact': dataCollection,
  'honoraires': dataCollection,
  'employeurs': dataCollection,
  'travailleurs': dataCollection,
  'europeennes': dataCollection,
  'legal': dataCollection,
};