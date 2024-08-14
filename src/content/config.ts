// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogFr = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()),
    highlights: z.array(z.string()).optional(),
    // Pas de champ `body` ici, car le contenu principal est déjà géré par Astro
  }),
});

const blogIt = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()),
    highlights: z.array(z.string()).optional(),
  }),
});

const blogEn = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()),
    highlights: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog_fr': blogFr,
  'blog_it': blogIt,
  'blog_en': blogEn,
};