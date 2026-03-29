# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **Document PDF politique dossiers clients** (`public/assets/documents/politique-traitement-dossiers-clients.pdf`) : ajout du fichier et lien dans les Mentions légales (section "Données personnelles") dans les trois langues (FR/EN/IT), avec lien cliquable "accessible ici / accessible here / accessibile qui"
- Lien cliquable vers la Politique de confidentialité dans les Mentions légales (section "Données personnelles") — FR pointe vers `/fr/legal/privacy`, EN vers `/en/legal/privacy`, IT vers `/it/legal/privacy`

### Changed
- **Politique de confidentialité** (`privacy.yml`) — section "Données personnelles traitées" réécrite dans les trois langues : suppression de l'inexactitude "aucune donnée collectée" et ajout de la liste exhaustive des collectes réelles (formulaire de contact via Netlify Forms, Cal.com, données techniques Netlify hébergeur) avec mention des finalités et durées de conservation, pour conformité RGPD (CNPD belge)
- **README.md** : mis à jour pour refléter les deux avocates (Christine Rizzo & Stephanie Michiels), l'usage de Netlify Forms, la structure `public/assets/documents/`, les pages légales, et le tableau `lawyers` dans `site-config.yml`

- **European Institutions service section** (`/services/europeennes/`): new content collection (`src/content/europeennes/`), dedicated service page with trilingual content (FR/EN/IT), homepage expertise block, navigation dropdown links, and full Decap CMS configuration for client-side editing
- Tailwind color tokens for the new European Institutions section (`bleu-europeennes` palette)
- New "rm." monogram logo SVG (`logo-rizzo-michiels.svg`) replacing the previous calligraphy logo
- Regenerated all favicon assets from the new logo: `favicon.ico` (multi-size ICO, 16/32/48px), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180px), `android-chrome-192x192.png`, `android-chrome-512x512.png` — generated via sharp/rsvg from the SVG, cropped to the central calligraphic mark (viewBox 530–1120) on beige background (`#faf5f0`)
- Social sharing images (`default-social-image.jpg`, `default-social-image.png`) regenerated with the new "rm." logo at 1200×630px on white background
- E2E test suite for European Institutions feature (`tests/european-institutions.spec.ts`)
- Domain migration verification script (`scripts/run-migration-tests.sh`): automated checks for 301 cross-domain redirects, page availability, canonical tags, sitemap integrity, robots.txt, and DNS resolution
- This CHANGELOG

### Changed
- SEO titles harmonized across all pages to reflect "Rizzo & Michiels" branding (replaced "Christine Rizzo Avocate" references, fixed IT gender "Avvocato" → "Avvocate", unified EN "Lawyer" → "Attorneys")
- Homepage Européennes card: added subtitle "Agences · Fonctionnaires & Agents" (FR/EN/IT) to clarify dual-audience scope
- Homepage expertise layout: 2-column flex (Employeurs / Travailleurs) → 3-column CSS grid (Employeurs / Travailleurs / Européennes)
- Navigation dropdown updated with three service areas and reordered links
- Homepage content schema (`config.ts`) extended to support the new European Institutions block
- `site.webmanifest`: added firm name "Rizzo & Michiels - Avocates", short name, beige theme color (`#faf5f0`), and aligned `background_color` to `#faf5f0` (was `#ffffff`)
- Bouton principal "NOUS CONTACTER" (hero) : le survol passe désormais à la couleur de marque `travailleur` (teal #068D9D) plutôt qu'un gris foncé générique, pour une cohérence chromatique jaune accent → teal
- Bouton secondaire "EN SAVOIR PLUS" (hero) : le survol affiche un fond beige (`#faf5f0`) avec texte sombre, discret et non-concurrent avec le CTA principal
- Boutons des cartes d'expertise (Employeurs / Travailleurs / Européennes) : la couleur du texte au repos passe de la couleur de section à `gray-900` pour une meilleure lisibilité sur fond blanc ; le survol bascule vers un fond transparent (laissant apparaître la couleur de carte) avec texte blanc
- Variante secondaire du composant Button : suppression de `hover:text-gray-900` sur le variant par défaut pour éviter les conflits avec les surcharges de couleur de texte au survol définies à l'usage
- Legal notice publisher updated from individual lawyer (Christine Rizzo) to company entity (Rizzo & MICHIELS SRL) with new company number (1034.645.352), dual phone numbers, and shared contact email across FR/EN/IT
- Legal information page (`legal-info.yml`) updated from individual lawyer to SRL entity: name, company number (0829.577.949 → 1034.645.352) across FR/EN/IT
- Domain migrated from `crizzo-avocate.be` to `rizzo-michiels.be` across 17 files: site config, Astro config, layouts, robots.txt, legal content, navigation, SEO images, email signature, footer, CMS config, and all SEO scripts
- Decap CMS branch config reverted from `feature/european-institutions` to `main` for production

### Removed
- Honoraires intro block from the homepage (the dedicated Honoraires page remains accessible via navigation)
- Dead code across service pages: unused imports, stale translation objects, unreferenced variables, and outdated comments

### Fixed
- Icons on Employeurs service page: `Search` → `CheckSquare` (audit/due diligence) and `UserPlus` → `Users` (individual employment relationship management) — updated in `employeurs.astro` and `employeurs.yml` across all three languages (FR/EN/IT)
- Icons on Européennes service page: `Search` → `CheckSquare` for all audit/analysis services in both the Agences and Fonctionnaires sections — updated in `europeennes.astro` and `europeennes.yml` across all three languages (FR/EN/IT)
- Null guard on `IconComponent` rendering in `employeurs.astro`
- Aligned `employeurs.astro` icon map keys with YAML icon names
- SEO `og:image` URLs: replaced 12 broken `v5--crizzo.netlify.app` references with `/default-social-image.png` in contact, travailleurs, and profile collections
- SEO descriptions in contact collection updated to mention both lawyers (was "Christine Rizzo" only)
- SEO `og:image` and `twitter:image` URLs now point to the production domain instead of GitHub raw URLs
- Configuration CMS (Decap) pour la page Institutions européennes : les champs `services` des sections Agences et Fonctionnaires étaient définis comme listes de chaînes simples alors que le gabarit attend des objets `{icon, text}` — corrigé en liste d'objets avec champs `icon` (sélecteur) et `text` (chaîne), éliminant les erreurs d'édition dans l'interface d'administration
- `og:image` fallback on contact, contact/success, and equipe pages: replaced stale Netlify preview URL (`v5--crizzo.netlify.app`) with local `/default-social-image.jpg`
- Italian localization typo in legal notice: "Responsabilité" → "Responsabilità"
- Trailing newline added to `robots.txt` for POSIX compliance

## [Earlier]

- Updated Honoraires page content and layout
- Refactored `.gitignore` for improved organization and clarity
- Added `.nvmrc` and pinned Node.js version in `package.json`
- Updated professional profile information
