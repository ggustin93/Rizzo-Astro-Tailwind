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
    team: z.array(z.object({
      id: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
      name: z.string().min(1),
      image: z.string().min(1),
      profileImage: z.string().optional(),
      linkedin: z.string().url().or(z.literal('')).optional(),
    })).nonempty(),
    lawyers: z.array(z.object({
      id: z.string().min(1),
      phone: z.string().regex(/^\+[1-9][0-9 ]{7,20}$/),
      whatsapp: z.string().regex(/^[1-9][0-9]{7,14}$/).or(z.literal('')).optional(),
      email: z.string().email().or(z.literal('')).optional(),
      calendarLink: z.string().url().regex(/^https:\/\/cal\.com\/[^\s/?#]+(?:[^\s]*)$/).or(z.literal('')).optional().default(''),
    })),
    address: z.string(),
    cabinetEmail: z.string().email(),
    contactIllustration: z.string().min(1),
    copyrightText: z.string().optional(),
  }).superRefine((data, ctx) => {
    for (const key of ['id', 'slug']) {
      if (new Set(data.team.map(member => member[key])).size !== data.team.length)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['team'], message: `Duplicate team ${key}` });
    }
    if (new Set(data.lawyers.map(contact => contact.id)).size !== data.lawyers.length)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lawyers'], message: 'Duplicate contact member' });
    for (const contact of data.lawyers) {
      if (!data.team.some(member => member.id === contact.id))
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lawyers'], message: `Unknown member: ${contact.id}` });
    }
  }).transform(data => ({
    ...data,
    // Existing contact consumers keep their contract; identities are entered once.
    // Publishing a profile does not add a recipient or a contact card.
    lawyers: data.lawyers.map(contact => {
      const member = data.team.find(member => member.id === contact.id);
      if (!member) throw new Error(`Unknown contact member: ${contact.id}`);
      return { ...contact, name: member.name, linkedin: member.linkedin || '' };
    }),
  })),
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
    mapLinkLabel: z.string(),
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
    })
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
    illustrationAlt: z.string().optional().default(''),
    contactLabel: z.string().min(1),
    actions: z.array(z.object({
      type: z.enum(['message', 'email', 'appointment', 'phone']),
      label: z.string().min(1),
    })).length(4).refine(actions => new Set(actions.map(action => action.type)).size === 4, 'Chaque action doit apparaître une seule fois'),
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

const profileSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// Localized editorial content references the shared team by stable ID.
const profileCollection = defineCollection({
  type: 'data',
  schema: perLocale(z.object({
    seo: profileSeoSchema.optional(),
    lawyers: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      role: z.string().min(1),
      imageAlt: z.string().optional(),
      presentation: z.array(z.string().min(1)).nonempty(),
      bio: z.array(z.string().min(1)).default([]),
      languages: z.string(),
      careerPath: z.array(z.object({
        year: z.string().min(1),
        event: z.string().min(1),
      })).default([]),
      conferences: z.array(z.string().min(1)).default([]),
      publicationsIntro: z.string().optional(),
      publications: z.array(z.object({
        date: z.string().min(1),
        title: z.string().min(1),
        publisher: z.string().min(1),
        coAuthors: z.array(z.string()).optional(),
      })).default([]),
      seo: profileSeoSchema.optional(),
    })).nonempty(),
  })),
});

// The CMS offers only existing internal destinations, independently of locale.
const editorialDestination = z.enum([
  '/contact/',
  '/equipe/',
  '/services/employeurs/',
  '/services/travailleurs/',
  '/services/europeennes/',
]);
const homeService = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  cta: z.string().min(1),
  destination: editorialDestination,
});
const homeCollection = defineCollection({
  type: 'data',
  schema: perLocale(z.object({
    seo: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      keywords: z.array(z.string()),
    }),
    articlesTitle: z.string(),
    viewAllArticles: z.string(),
    hero: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      description: z.string().min(1),
      cta: z.string().min(1),
      more: z.string().min(1),
      destination: editorialDestination,
      imageAlt: z.string().min(1),
    }),
    expertise: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      employeurs: homeService,
      travailleurs: homeService,
      europeennes: homeService,
    }).passthrough(),
    profil: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      cta: z.string().min(1),
      imageAlt: z.string().min(1),
    }),
  }).passthrough()).extend({
    media: z.object({
      hero: z.string().min(1),
      team: z.string().min(1),
    }),
    portraitLinks: z.enum(['none', 'profiles']),
    serviceOrder: z.array(z.enum(['employeurs', 'travailleurs', 'europeennes']))
      .length(3)
      .refine(items => new Set(items).size === 3, 'Each service must appear exactly once'),
  }),
});

// Page content whose shape is free-form but whose locales are not: every one of
// these is read as `data[lang] || data.fr`, so an untranslated locale would
// publish French body copy under a `lang`/`hreflang` that claims otherwise.
const dataCollection = defineCollection({
  type: 'data',
  schema: perLocale(localeContent)
});

// Belgian services share one editorial model; EU retains its existing two audiences.
const requiredEditorialText = (label) => z.string().regex(/\S/, `${label} : texte obligatoire`);
const belgianServicesCollection = defineCollection({
  type: 'data',
  schema: perLocale(z.object({
    title: requiredEditorialText('Titre'),
    description: z.string().optional(),
    servicesTitle: requiredEditorialText('Titre des services'),
    situationsDisplay: z.enum(['expanded', 'accordion']).default('expanded'),
    sections: z.array(z.object({
      title: requiredEditorialText('Titre'),
      description: z.string().optional(),
      situations: z.array(z.object({
        question: requiredEditorialText('Question'),
        answer: requiredEditorialText('Réponse'),
      })).optional(),
    })).default([]),
    ctaText: requiredEditorialText('Libellé du lien tarifs'),
    ctaDestination: z.enum(['honoraires', 'contact']),
    seo: z.object({
      title: requiredEditorialText('Titre'),
      description: requiredEditorialText('Description SEO').refine(value => value.length <= 320, 'Maximum 320 caractères'),
      image: z.string().regex(/^(\/[^/]|https:\/\/)/, 'Image de la médiathèque ou URL HTTPS').optional().or(z.literal('')),
      imageAlt: z.string().optional(),
      keywords: z.array(requiredEditorialText('Mot-clé')).optional(),
    }),
  })),
});

export const collections = {
  'blog': blog,
  'config': configCollection,
  'navigation': navigationCollection,
  'ui-translations': uiTranslationsCollection,
  // Add all other data collections here
  'home': homeCollection,
  'profile': profileCollection,
  'contact': dataCollection,
  'honoraires': dataCollection,
  'employeurs': belgianServicesCollection,
  'travailleurs': belgianServicesCollection,
  'europeennes': dataCollection,
  'legal': dataCollection,
};
