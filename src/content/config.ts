import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.any(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()),
    highlights: z.array(z.string()).optional(),
    // Pas besoin de champ `lang` ici, car la langue est déterminée par le dossier
  }),
});

export const collections = {
  'blog': blog,
};