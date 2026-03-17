# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **European Institutions service section** (`/services/europeennes/`): new content collection (`src/content/europeennes/`), dedicated service page with trilingual content (FR/EN/IT), homepage expertise block, navigation dropdown links, and full Decap CMS configuration for client-side editing
- Tailwind color tokens for the new European Institutions section (`bleu-europeennes` palette)
- New "rm." monogram logo SVG (`logo-rizzo-michiels.svg`) replacing the previous calligraphy logo
- Regenerated all favicon assets from the new logo: `favicon.ico` (multi-size ICO), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180px), `android-chrome-192x192.png`, `android-chrome-512x512.png`
- E2E test suite for European Institutions feature (`tests/european-institutions.spec.ts`)
- This CHANGELOG

### Changed
- Homepage expertise layout: 2-column flex (Employeurs / Travailleurs) → 3-column CSS grid (Employeurs / Travailleurs / Européennes)
- Navigation dropdown updated with three service areas and reordered links
- Homepage content schema (`config.ts`) extended to support the new European Institutions block
- `site.webmanifest`: added firm name "Rizzo & Michiels - Avocates", short name, and beige theme color (`#faf5f0`)

### Removed
- Honoraires intro block from the homepage (the dedicated Honoraires page remains accessible via navigation)
- Dead code across service pages: unused imports, stale translation objects, unreferenced variables, and outdated comments

### Fixed
- Null guard on `IconComponent` rendering in `employeurs.astro`
- Aligned `employeurs.astro` icon map keys with YAML icon names
- SEO `og:image` and `twitter:image` URLs now point to the production domain instead of GitHub raw URLs

### Pending (not in this release)
- **R1 — Domain migration**: `crizzo-avocate.be` → `rizzo-michiels.be` (separate branch, merged last)
- **R3 — Legal pages**: Christine to update legal text via Decap CMS (`/admin/`)

## [Earlier]

- Updated Honoraires page content and layout
- Refactored `.gitignore` for improved organization and clarity
- Added `.nvmrc` and pinned Node.js version in `package.json`
- Updated professional profile information
