# Rizzo & Michiels — Labor Law Attorneys

A website built for Christine Rizzo and Stephanie Michiels, labor law attorneys based in Brussels. The project was approached with care for detail: clean architecture, multilingual support, and content fully managed through flat files — no database, no unnecessary complexity.

**Stack:** Astro 5 SSG · Tailwind CSS · Decap CMS · Netlify
**Languages:** French (default) · English · Italian
**Live admin:** `/admin/` (Decap CMS, Git Gateway)

---

## Content Architecture

All content is managed through YAML files and Markdown — no database involved.

```mermaid
graph TD
    CMS["Decap CMS<br/>/admin/"] -->|writes| YAML["src/content/<br/>YAML + Markdown"]
    YAML -->|validated by| SCHEMA["config.ts<br/>Zod schemas"]
    SCHEMA -->|feeds| BUILD["Astro Build<br/>SSG"]
    BUILD -->|deploys| NETLIFY["Netlify<br/>Static hosting"]

    YAML --> CONFIG["site-config.yml<br/>Single source of truth<br/>(contact, lawyers array)"]
    YAML --> BLOG["blog/{lang}/*.md"]
    YAML --> PAGES["page collections<br/>home, travailleurs,<br/>employeurs, europeennes…"]
    YAML --> I18N["ui-translations/{lang}.yml<br/>Interface strings"]
```

**Single source of truth:** contact information (email, phone, Cal.com links) is defined once in `src/content/config/site-config.yml` and propagates site-wide through a dedicated utility. Component-level hardcoding should be avoided.

---

## Multilingual Routing

| URL pattern | Language | Notes |
| --- | --- | --- |
| `/fr/*` | French | Default language |
| `/en/*` | English | |
| `/it/*` | Italian | |
| `/` | — | Redirects to `/fr/` via `netlify.toml` |

Invalid language params fall back to `/fr/`. All routes are generated via `getStaticPaths()`, with trailing slashes consistently enforced.

---

## Quick Start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + production build
npm run preview   # preview dist/ locally
```

---

## Common Tasks

### Update contact information or lawyer details

Edit `src/content/config/site-config.yml`. The `lawyers` array drives the CTA component — add, remove, or update entries there. Each entry accepts `name`, `email`, `phone`, and an optional `calendarLink` (Cal.com URL). No component changes are needed.

### Add a blog article

Create a Markdown file at `src/content/blog/{lang}/{slug}.md` with the required frontmatter. It will appear in listings without further configuration.

### Add a new page

1. Create `src/pages/[...lang]/[pagename].astro`
2. Implement `getStaticPaths()` for the three language codes
3. Load translations with `getUiTranslations(currentLang)`
4. Add a content collection in `src/content/config.ts` if the page has managed content

### Modify navigation

Edit `src/content/navigation/site-navigation.yml`.

### Run SEO validation

```bash
./scripts/run-seo-tests.sh        # meta tags and structure
./scripts/run-bot-tests.sh        # crawler behavior
./scripts/run-migration-tests.sh  # 301 redirects, canonicals, sitemap
./scripts/submit_indexnow.sh      # submit URLs via IndexNow
```

---

## Project Constraints

| Constraint | Detail |
| --- | --- |
| No TypeScript | JavaScript only; `astro check` runs type inference via JSDoc |
| Static output only | SSG, no SSR or serverless functions |
| Content-first | All page content in YAML/Markdown, not in component files |
| No hardcoded contact data | Always use `getContactInfo()` from `src/utils/contact-info.js` |

---

## Deployment

Deployed on Netlify via automatic Git push to `main`. Build command: `astro check && astro build`. Output: `dist/`.

Redirects and cache headers are configured in `netlify.toml`. The CMS branch target is set on line 3 of `public/admin/config.yml` — it should point to `main` in production.

**A note on cross-domain 301 redirects:** Netlify's automatic alias redirect does not fire when the primary domain relies on external DNS (e.g. an Infomaniak A record) rather than Netlify DNS. In that case, explicit rules are required in `netlify.toml`, using full source URLs (`https://old-domain.com/*`) and placed before all other redirect entries.

---

## Troubleshooting

| Symptom | Where to look |
| --- | --- |
| Build fails with schema error | `src/content/config.ts` — Zod schema validation is strict |
| SEO tags incorrect | `src/layouts/BaseLayout.astro` — tags are managed manually |
| Language picker broken after navigation | Ensure the picker script initialises on `astro:page-load`, not `DOMContentLoaded` |
| Contact form not submitting | `<form>` must have `data-netlify="true"` and a `name` attribute for Netlify to detect it at build time |
| CMS edits not visible in preview | Check `public/admin/config.yml` line 3 — the branch must match the branch you are previewing |

For past incidents and root cause analyses, see `maintenance/troubleshoot.md`.

---

## Contact

**Guillaume Gustin** — independent design and development
[hello@pwablo.be](mailto:hello@pwablo.be) · [pwablo.be](https://pwablo.be)
