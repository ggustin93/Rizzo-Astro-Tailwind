import { getCollection } from 'astro:content';

export async function getArticles(lang, limit) {
  const allBlogEntries = await getCollection('blog');
  const langEntries = allBlogEntries
    .filter(entry => entry.slug.startsWith(`${lang}/`))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  
  return limit ? langEntries.slice(0, limit) : langEntries;
}