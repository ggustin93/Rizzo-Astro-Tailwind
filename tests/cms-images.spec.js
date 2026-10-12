import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

// #42: every image the cabinet can upload says what to upload, and oversized files are refused.
const config = load(readFileSync(new URL('../public/admin/config.yml', import.meta.url), 'utf8'));
const imageFields = [];
(function walk(node, path) {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, path));
  if (!node || typeof node !== 'object') return;
  const here = node.label ? [...path, node.label] : path;
  if (node.widget === 'image') imageFields.push({ path: here.join(' → '), field: node });
  for (const value of Object.values(node)) walk(value, here);
})(config.collections, []);

test('the CMS has image fields', () => {
  expect(imageFields.length).toBeGreaterThan(10);
});

for (const { path, field } of imageFields) {
  test(`${path}: format advice and 5 MB upload limit`, () => {
    expect(field.hint, 'hint').toMatch(/px|SVG/);
    expect(field.media_library?.config?.max_file_size).toBe(5_000_000);
  });
}
