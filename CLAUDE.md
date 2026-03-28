# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional multilingual website for Christine Rizzo and Stephanie Michiels, labor law attorneys specializing in labor law in Brussels. The site serves as an information platform, expertise showcase, and primary contact point for potential and existing clients. Built with Astro framework and Decap CMS for content management, operating in French (default), English, and Italian with SSG output.

### Business Objectives
- Present the professional expertise of Christine Rizzo and Stephanie Michiels in labor law
- Attract and inform potential clients (workers, employers, and European institution staff)
- Facilitate contact and appointment scheduling
- Share relevant legal information via blog
- Build and strengthen professional brand image
- Ensure optimal search engine visibility (SEO)

### Target Audience
- **Workers** seeking advice or representation in labor law
- **Employers/Companies** (HR teams, executives) needing social law expertise
- Individuals seeking general information about Belgian labor law
- Multilingual audience: French, English, and Italian speakers

## Development Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:4321
npm run build        # Type check and production build
npm run preview      # Preview production build locally

# Testing
npm test             # Run Playwright E2E tests
npx playwright test  # Run specific test files
npx playwright test --ui  # Run tests with UI mode
```

## Architecture

### Core Technology Stack
- **Astro 5.9.0**: Static site generator with View Transitions enabled
- **Tailwind CSS**: Utility-first CSS with Typography plugin and custom colors
- **Decap CMS**: Git-based headless CMS (admin at `/admin/`)
- **Content Collections**: Type-safe content management via Astro with Zod schemas
- **Cal.com Integration**: Appointment booking system embedded
- **Icons**: astro-feather-icons, FontAwesome, custom SVG components

### Content Structure
- **Collections**: Blog articles, config, navigation, UI translations, contact, home, travailleurs, employeurs, europeennes (European Institutions), profile, honoraires
- **Languages**: Multilingual YAML files under `src/content/`
- **Schema Validation**: Zod schemas in `src/content/config.ts` (source of truth)
- **Centralized Config**: All global contact info in `src/content/config/site-config.yml`
- **Lawyers Array**: `site-config.yml` contains a `lawyers` array with entries for each lawyer (name, email, phone, calendarLink). Components iterate over this array to display per-lawyer contact information dynamically.
- **Single Source of Truth**: Contact info must always be pulled from site-config.yml

### Routing Architecture
- **Dynamic Language Routes**: `[...lang]/` pattern for all pages
- **Supported Languages**: `fr`, `en`, `it` (French is default)
- **Root Redirect**: `/` → `/fr/` via netlify.toml (simple, non-conditional)
- **Language Detection**: Validates and redirects invalid language params to French
- **Trailing Slashes**: All paths redirected to versions with trailing slashes

### Content Management System
- **Admin Access**: `/admin/` with Git Gateway backend
- **YAML Storage**: All content stored as YAML in `src/content/`
- **Media**: Images in `public/assets/images/`
- **Blog Structure**: `src/content/blog/{lang}/{slug}.md`
- **Content Schema Enforcement**: Build fails if content doesn't match schemas
- **CMS Branch Config**: `public/admin/config.yml` line 3 sets which Git branch Decap CMS reads from. Must point to `main` in production. Can be temporarily pointed to a feature branch during development to allow content editing before merge.

### Design System
- **Color Palette**: 
  - Beige (base)
  - Blue "travailleur" (worker blue)
  - Blue "employeur" (employer blue)
  - Yellow accent
- **Typography**: Professional, clean, modern
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliance targeted

## Key Implementation Patterns

### Adding New Pages
1. Create page in `src/pages/[...lang]/[pagename].astro`
2. Implement `getStaticPaths()` for language support
3. Load translations via `getUiTranslations(currentLang)`
4. Add content collection if needed in `src/content/config.ts`

### Working with Content
- **Contact Info**: Always use `getContactInfo()` from `src/utils/contact-info.js`
- **UI Translations**: Use `getUiTranslations()` for interface text
- **Blog Articles**: Use `getArticles()` from `src/utils/articles.js`
- **Navigation**: Loaded from `src/content/navigation/site-navigation.yml`

### SEO Implementation
- **Manual Tags**: SEO managed in `src/layouts/BaseLayout.astro`
- **Sitemap**: Auto-generated with filtering in `astro.config.mjs`
- **IndexNow**: Submit via `scripts/submit_indexnow.sh`
- **Indexing Control**: `allowIndexing` flag in site-config.yml

## Important Conventions

### Language Handling
- Always validate language params against `['fr', 'en', 'it']`
- Redirect invalid languages to `/fr/`
- Use language-specific content fallback to French if missing

### Component Patterns
- **Astro Components**: Use `.astro` for static components
- **Icons**: Import from `astro-feather-icons` or `astro-feather-icons2`
- **Images**: Use Astro's `Picture` component for optimization
- **Buttons**: Use `Button.astro` component for consistency
- **CTA Component**: `CTA.astro` dynamically iterates over the `lawyers` array from site-config.yml. Each lawyer gets their own contact card with Email, Appointment (Cal.com, conditional on valid `calendarLink`), and Phone buttons. When adding or removing lawyers, only site-config.yml needs to change.

### Testing Requirements
- E2E tests with Playwright in `tests/` directory
- Test contact info consistency across pages
- Verify multilingual routing and content display

## Deployment

- **Platform**: Netlify with automatic Git deployments
- **Build Output**: Static files in `dist/`
- **Redirects**: Configured in `netlify.toml`
- **Headers**: Cache control for `/_astro/*` assets (1 year, immutable)

## Common Tasks

### Update Contact Information
Edit `src/content/config/site-config.yml` - changes propagate site-wide

### Add Blog Article
1. Create markdown file in `src/content/blog/{lang}/`
2. Include required frontmatter (title, date, author, thumbnail, etc.)
3. Content appears automatically in blog listings

### Modify Navigation
Edit `src/content/navigation/site-navigation.yml` for all languages

### Add or Modify a Lawyer
Edit the `lawyers` array in `src/content/config/site-config.yml`. Each entry requires `name`, `email`, `phone`, and optionally `calendarLink` (Cal.com URL). The CTA component and other lawyer-aware components will automatically pick up the changes.

### Run SEO Validation
```bash
./scripts/run-seo-tests.sh  # Check meta tags and structure
./scripts/run-bot-tests.sh  # Test bot crawling behavior
```

## Project Constraints
- **No TypeScript**: Project uses JavaScript with TypeScript disabled
- **Static Output**: SSG mode only, no SSR
- **Content-First**: All content managed through YAML/Markdown files
- **Performance**: Optimize for Core Web Vitals and minimal footprint