# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **European Institutions service section** (`/services/europeennes/`): new content collection (`src/content/europeennes/`), dedicated service page with trilingual content (FR/EN/IT), homepage expertise block, navigation dropdown links, and full Decap CMS configuration for client-side editing
- Tailwind color tokens for the new European Institutions section (`bleu-europeennes` palette)
- New "rm." monogram logo SVG (`logo-rizzo-michiels.svg`) replacing the previous calligraphy logo
- Regenerated all favicon assets from the new logo: `favicon.ico` (multi-size ICO), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180px), `android-chrome-192x192.png`, `android-chrome-512x512.png`
- Social sharing images (`default-social-image.jpg`, `default-social-image.png`) regenerated with the new "rm." logo at 1200×630px on white background
- E2E test suite for European Institutions feature (`tests/european-institutions.spec.ts`)
- This CHANGELOG

### Changed
- Homepage expertise layout: 2-column flex (Employeurs / Travailleurs) → 3-column CSS grid (Employeurs / Travailleurs / Européennes)
- Navigation dropdown updated with three service areas and reordered links
- Homepage content schema (`config.ts`) extended to support the new European Institutions block
- `site.webmanifest`: added firm name "Rizzo & Michiels - Avocates", short name, and beige theme color (`#faf5f0`)
- Bouton principal "NOUS CONTACTER" (hero) : le survol passe désormais à la couleur de marque `travailleur` (teal #068D9D) plutôt qu'un gris foncé générique, pour une cohérence chromatique jaune accent → teal
- Bouton secondaire "EN SAVOIR PLUS" (hero) : le survol affiche un fond beige (`#faf5f0`) avec texte sombre, discret et non-concurrent avec le CTA principal
- Boutons des cartes d'expertise (Employeurs / Travailleurs / Européennes) : la couleur du texte au repos passe de la couleur de section à `gray-900` pour une meilleure lisibilité sur fond blanc ; le survol bascule vers un fond transparent (laissant apparaître la couleur de carte) avec texte blanc
- Variante secondaire du composant Button : suppression de `hover:text-gray-900` sur le variant par défaut pour éviter les conflits avec les surcharges de couleur de texte au survol définies à l'usage

### Removed
- Honoraires intro block from the homepage (the dedicated Honoraires page remains accessible via navigation)
- Dead code across service pages: unused imports, stale translation objects, unreferenced variables, and outdated comments

### Fixed
- Icons on Employeurs service page: `Search` → `CheckSquare` (audit/due diligence) and `UserPlus` → `Users` (individual employment relationship management) — updated in `employeurs.astro` and `employeurs.yml` across all three languages (FR/EN/IT)
- Icons on Européennes service page: `Search` → `CheckSquare` for all audit/analysis services in both the Agences and Fonctionnaires sections — updated in `europeennes.astro` and `europeennes.yml` across all three languages (FR/EN/IT)
- Null guard on `IconComponent` rendering in `employeurs.astro`
- Aligned `employeurs.astro` icon map keys with YAML icon names
- SEO `og:image` and `twitter:image` URLs now point to the production domain instead of GitHub raw URLs
- Configuration CMS (Decap) pour la page Institutions européennes : les champs `services` des sections Agences et Fonctionnaires étaient définis comme listes de chaînes simples alors que le gabarit attend des objets `{icon, text}` — corrigé en liste d'objets avec champs `icon` (sélecteur) et `text` (chaîne), éliminant les erreurs d'édition dans l'interface d'administration

### Pending (not in this release)
- **R1 — Domain migration**: `crizzo-avocate.be` → `rizzo-michiels.be` (separate branch, merged last)
- **R3 — Legal pages**: Christine to update legal text via Decap CMS (`/admin/`)

## [Earlier]

- Updated Honoraires page content and layout
- Refactored `.gitignore` for improved organization and clarity
- Added `.nvmrc` and pinned Node.js version in `package.json`
- Updated professional profile information
