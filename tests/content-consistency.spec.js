import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { content, languages } from './helpers';

// RM-25: each language is edited on its own screen in the CMS, so a point added or removed in one
// language silently went missing in the others. Lists must keep the same length in every language.
const pages = ['europeennes', 'travailleurs', 'employeurs'];

/** Length of every list under `node`, keyed by its path. SEO keywords are per language by design. */
const listLengths = (node, path = '', out = {}) => {
  if (Array.isArray(node)) out[path] = node.length;
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key !== 'seo') listLengths(value, path ? `${path}.${key}` : key, out);
    }
  }
  return out;
};

for (const page of pages) {
  test(`${page}: every list has the same number of points in each language`, () => {
    const data = content(`${page}/${page}.yml`);
    const byLang = Object.fromEntries(languages.map((lang) => [lang, listLengths(data[lang])]));
    const paths = new Set(languages.flatMap((lang) => Object.keys(byLang[lang])));
    const mismatches = [...paths]
      .map((path) => ({ path, ...Object.fromEntries(languages.map((lang) => [lang, byLang[lang][path] ?? 0])) }))
      .filter((row) => new Set(languages.map((lang) => row[lang])).size > 1);
    expect(mismatches).toEqual([]);
  });
}

// The CMS says so under each of these lists.
const config = load(readFileSync(new URL('../public/admin/config.yml', import.meta.url), 'utf8'));
for (const page of pages) {
  test(`CMS ${page}: each list reminds to keep the 4 languages aligned`, () => {
    const lists = [];
    (function walk(node, path) {
      if (Array.isArray(node)) return node.forEach((n) => walk(n, path));
      if (!node || typeof node !== 'object' || node.name === 'seo') return;
      const here = node.label ? [...path, node.label] : path;
      if (node.widget === 'list') lists.push({ path: here.join(' → '), hint: node.hint });
      for (const value of Object.values(node)) walk(value, here);
    })(config.collections.find((c) => c.name === page), []);
    expect(lists.length).toBeGreaterThan(0);
    for (const { path, hint } of lists) expect(hint, path).toMatch(/4 langues/);
  });
}
