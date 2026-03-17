# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- European Institutions service section: content collection (`src/content/europeennes/`), service page, homepage expertise block, navigation dropdown links, and Decap CMS configuration
- Tailwind color tokens for the new European Institutions section (`bleu-europeennes` palette)
- New "rm." monogram logo SVG (`logo-rizzo-michiels.svg`) replacing the previous calligraphy logo
- Regenerated all favicon assets (favicon.ico, favicon-16x16, favicon-32x32, apple-touch-icon, android-chrome 192/512) from the new logo
- Follow-up email draft in `maintenance/`

### Changed
- Homepage expertise layout from 2-column flex (Employeurs / Travailleurs) to 3-column CSS grid (Employeurs / Travailleurs / Européennes)
- Navigation dropdown order updated to reflect the three service areas
- Homepage content schema updated to support the new European Institutions block
- `site.webmanifest` updated with firm name "Rizzo & Michiels" and beige theme color (#faf5f0)

### Removed
- Honoraires intro block from the homepage (the Honoraires page itself remains accessible)
- Dead code: unused imports, stale translation objects, unreferenced variables, and outdated comments across service pages

### Fixed
- Null guard on `IconComponent` rendering in `employeurs.astro`
- Aligned `employeurs.astro` icon map keys with YAML icon names
- SEO `og:image` and `twitter:image` URLs now point to the production domain

## [Earlier]

- Updated Honoraires page content and layout
- Refactored `.gitignore` for improved organization and clarity
- Added `.nvmrc` and pinned Node.js version in `package.json`
- Updated professional profile information
