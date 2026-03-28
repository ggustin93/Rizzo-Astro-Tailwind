## Technical Context: Site Web Professionnel — Cabinet Rizzo & Michiels

### 1. Technologies Utilisées

*   **Framework:** Astro 5.9.0 (with View Transitions enabled)
*   **Styling:** Tailwind CSS (integrated via `@astrojs/tailwind`, with Typography plugin and custom colors)
*   **Content Management:** Decap CMS (Git Gateway backend) + flat-file YAML in `src/content/`
*   **Content Schema:** Astro Content Collections (`src/content/config.ts`) with Zod schemas — source of truth for content structure
*   **Hébergement & Déploiement:** Netlify (déploiement continu depuis Git)
*   **Tests E2E:** Playwright (`/tests` directory)
*   **Icons:** astro-feather-icons, FontAwesome, custom SVG components
*   **Booking:** Cal.com integration (embedded appointment scheduling)
*   **Build:** Static site generation (`astro build`), output in `dist/`

### 2. Content Collections

| Collection | Path | Description |
|---|---|---|
| home | `src/content/home/home.yml` | Homepage content (hero, expertise cards, team, SEO) |
| travailleurs | `src/content/travailleurs/travailleurs.yml` | Workers services page |
| employeurs | `src/content/employeurs/employeurs.yml` | Employers services page |
| **europeennes** | `src/content/europeennes/europeennes.yml` | **European Institutions services page (new)** |
| profile | `src/content/profile/profile.yml` | Team/lawyer profiles |
| honoraires | `src/content/honoraires/honoraires.yml` | Fees page |
| blog | `src/content/blog/{lang}/*.md` | Blog articles per language |
| config | `src/content/config/site-config.yml` | Global site config, lawyers array, SEO |
| navigation | `src/content/navigation/navigation.yml` | Header/footer nav links |
| ui-translations | `src/content/ui-translations/ui-translations.yml` | Interface text translations |

### 3. Lawyers Array Pattern

`site-config.yml` contains a `lawyers` array. Each entry has: `name`, `email`, `phone`, `whatsapp`, `linkedin`, `calendarLink` (optional), `address`. Components iterate over this array to dynamically render per-lawyer contact info. Adding/removing a lawyer only requires editing this file.

### 4. CMS Branch Configuration

Decap CMS reads content from the branch specified in `public/admin/config.yml` (line 3: `branch: <branch-name>`). During feature development, this can be temporarily pointed to the feature branch so content editors can preview/edit new content before it's merged to main. **Must be reverted to `main` before or immediately after merge.**

### 5. Infrastructure et Déploiement

* **Redirections:** Configurées dans `netlify.toml` — racine vers `/fr/` (301), chemins sans slash vers versions avec slash.
* **Netlify Prerendering:** Désactivé (causait des erreurs 503, non nécessaire pour SSG).
* **Bot Testing:** Script `scripts/run-bot-tests.sh` pour tester les réponses HTTP avec différents user-agents.
* **SEO Testing:** Script `scripts/run-seo-tests.sh` pour valider les balises meta, canoniques et hreflang.
* **IndexNow:** Script `scripts/submit_indexnow.sh` pour soumission manuelle d'URLs.
