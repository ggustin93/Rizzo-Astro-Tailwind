import { test, expect } from '@playwright/test';
import { BASE_URL, address, languages, lawyers } from './helpers';

// Issue #10: crawlers and generative engines need structured firm/lawyer facts,
// an llms.txt summary, and explicit AI-crawler rules — without waiting for NL (#11)
// or a third lawyer (#12).

// The firm node is site-wide, so its identity does not vary by page.
const firmOrigin = 'https://rizzo-michiels.be';

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
      expect(firm.url).toBe(`${firmOrigin}/`);
      expect(firm.inLanguage).toContain(lang);
      // @id is constant across the site, so url must be too.
      expect(firm['@id']).toBe(`${firmOrigin}/#firm`);
    });

    test(`/${lang}/ describes each lawyer as a Person`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}/`);
      const graph = await jsonLdGraph(page);

      const people = graph.filter((node) => node['@type'] === 'Person');
      expect(people.map((p) => p.name)).toEqual(
        expect.arrayContaining(lawyers.map((lawyer) => lawyer.name))
      );
      for (const person of people) {
        expect(person.email, `${person.name} has an email`).toBeTruthy();
        expect(person.telephone, `${person.name} has a phone`).toBeTruthy();
        expect(person.worksFor, `${person.name} is linked to the firm`).toBeTruthy();
        expect(person.jobTitle, `${person.name} has a job title`).toBeTruthy();
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
    expect(body).toContain('droit du travail');
    expect(body).toContain(address);
    // Points crawlers at the real pages rather than restating the whole site.
    expect(body).toContain(`${firmOrigin}/fr/`);
  });

  // #16: the file is generated from the content collections, so the roster and
  // the locale list cannot drift from site-config/profile/locales.ts.
  test('names every lawyer on the published roster', async ({ request }) => {
    const body = await (await request.get(`${BASE_URL}/llms.txt`)).text();

    for (const lawyer of lawyers) {
      expect(body, `${lawyer.name} is summarised`).toContain(lawyer.name);
      expect(body, `${lawyer.name} has a linked profile`).toContain(
        `${firmOrigin}/fr/equipe/${lawyer.slug}`
      );
    }
  });

  test('links the home page of every locale the site ships', async ({ request }) => {
    const body = await (await request.get(`${BASE_URL}/llms.txt`)).text();

    for (const lang of languages) {
      expect(body, `${lang} home page is linked`).toContain(`${firmOrigin}/${lang}/`);
    }
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

test.describe('JSON-LD localisation', () => {
  test('job titles follow the page language', async ({ page }) => {
    const titleOn = async (lang: string) => {
      await page.goto(`${BASE_URL}/${lang}/`);
      const graph = await jsonLdGraph(page);
      return graph.find((node) => node.name === 'Christine Rizzo')?.jobTitle;
    };

    const fr = await titleOn('fr');
    const en = await titleOn('en');

    expect(fr).toBeTruthy();
    expect(en).toBeTruthy();
    expect(en, 'the English page must not advertise the French title').not.toBe(fr);
  });

  test('the firm node is identical across locales', async ({ page }) => {
    const firmOn = async (lang: string) => {
      await page.goto(`${BASE_URL}/${lang}/`);
      const graph = await jsonLdGraph(page);
      const firm = graph.find((node) => node['@type'] === 'LegalService');
      return { id: firm['@id'], url: firm.url };
    };

    const reference = await firmOn('fr');
    expect(await firmOn('en')).toEqual(reference);
    expect(await firmOn('it')).toEqual(reference);
  });
});
