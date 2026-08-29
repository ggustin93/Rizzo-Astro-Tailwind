import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

// Issue #10: crawlers and generative engines need structured firm/lawyer facts,
// an llms.txt summary, and explicit AI-crawler rules — without waiting for NL (#11)
// or a third lawyer (#12).
const languages = ['fr', 'en', 'it'];

async function jsonLdGraph(page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((raw) => {
    const parsed = JSON.parse(raw);
    return parsed['@graph'] ?? [parsed];
  });
}

test.describe('JSON-LD structured data', () => {
  for (const lang of languages) {
    test(`/${lang}/ describes the firm as a LegalService`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/`);
      const graph = await jsonLdGraph(page);

      const firm = graph.find((node) => node['@type'] === 'LegalService');
      expect(firm, 'a LegalService node is present').toBeTruthy();
      expect(firm.name).toBeTruthy();
      expect(firm.address?.addressLocality).toBe('Bruxelles');
      expect(firm.address?.streetAddress).toContain('Chaussée de Waterloo 1151');
      expect(firm.url).toContain(`/${lang}/`);
      expect(firm.inLanguage).toContain(lang);
    });

    test(`/${lang}/ describes each lawyer as a Person`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/`);
      const graph = await jsonLdGraph(page);

      const people = graph.filter((node) => node['@type'] === 'Person');
      expect(people.map((p) => p.name)).toEqual(
        expect.arrayContaining(['Christine Rizzo', 'Stephanie Michiels'])
      );
      for (const person of people) {
        expect(person.email, `${person.name} has an email`).toBeTruthy();
        expect(person.telephone, `${person.name} has a phone`).toBeTruthy();
        expect(person.worksFor, `${person.name} is linked to the firm`).toBeTruthy();
      }
    });
  }

  test('emits valid, parseable JSON on a deep page', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/equipe/christine-rizzo/`);
    const graph = await jsonLdGraph(page);
    expect(graph.length).toBeGreaterThan(0);
  });
});

test.describe('llms.txt', () => {
  test('is served at the site root and summarises the firm', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/llms.txt`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');

    const body = await response.text();
    expect(body).toContain('Rizzo');
    expect(body).toContain('Michiels');
    expect(body).toContain('droit du travail');
    // Points crawlers at the real pages rather than restating the whole site.
    expect(body).toContain('https://rizzo-michiels.be/fr/');
  });
});

test.describe('robots.txt', () => {
  test('states explicit rules for the major AI crawlers', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    expect(response.status()).toBe(200);
    const body = await response.text();

    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot']) {
      expect(body, `${bot} has an explicit rule`).toContain(`User-agent: ${bot}`);
    }
    expect(body).toContain('Sitemap: https://rizzo-michiels.be/sitemap-index.xml');
    expect(body).toContain('/llms.txt');
  });
});
