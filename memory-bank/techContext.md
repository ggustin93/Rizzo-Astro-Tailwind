## Technical Context: Site Web Professionnel Christine Rizzo, Avocate

### 1. Technologies Utilisées

*   **Framework:** Astro
*   **Styling:** Tailwind CSS
*   **CMS:** Decap CMS (auto-hébergé)
*   **Hébergement & Déploiement:** Netlify (déploiement continu depuis Git)
*   **Build:** Processus de build statique (`astro build`)
*   **Dépendances:** Gérées via `package.json`
*   **Sitemap:** Generation and filtering configured via `@astrojs/sitemap` in `astro.config.mjs`.
*   **IndexNow Submission Script:** A Bash script (`scripts/submit_indexnow.sh`) using `curl` is available for manual submission of URLs to the IndexNow API. It can accept URLs as arguments or parse them from the site's sitemap (requires `xmllint`). Script updated for Bash v3+ portability (replaced `readarray`). 