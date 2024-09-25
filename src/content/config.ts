import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.any(),
    author: z.string(),
    thumbnail: z.string(),
    readTime: z.string(),
    categories: z.array(z.string()).nonempty(),
    highlights: z.array(z.string()).optional(),
    description: z.string().max(160),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blog,
};