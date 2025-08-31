# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional multilingual website for Christine Rizzo, a labor law attorney in Brussels, built with Astro framework and Decap CMS for content management. The site operates in French (default), English, and Italian with SSG output.

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
- **Astro 5.9.0**: Static site generator with View Transitions
- **Tailwind CSS**: Utility-first CSS with Typography plugin
- **Decap CMS**: Git-based headless CMS (admin at `/admin/`)
- **Content Collections**: Type-safe content management via Astro

### Content Structure
- **Collections**: Blog articles, config, navigation, UI translations
- **Languages**: Multilingual YAML files under `src/content/`
- **Schema Validation**: Zod schemas in `src/content/config.ts`
- **Centralized Config**: Contact info in `src/content/config/site-config.yml`

### Routing Architecture
- **Dynamic Language Routes**: `[...lang]/` pattern for all pages
- **Supported Languages**: `fr`, `en`, `it` (French is default)
- **Root Redirect**: `/` → `/fr/` via netlify.toml
- **Language Detection**: Validates and redirects invalid language params

### Content Management System
- **Admin Access**: `/admin/` with Git Gateway backend
- **YAML Storage**: All content stored as YAML in `src/content/`
- **Media**: Images in `public/assets/images/`
- **Blog Structure**: `src/content/blog/{lang}/{slug}.md`

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