## Technical Context: Site Web Professionnel Christine Rizzo, Avocate

### 1. Technologies Utilisées

*   **Framework:** Astro (with View Transitions enabled)
*   **Styling:** Tailwind CSS (integrated via `@astrojs/tailwind`)
*   **Content Management:** Flat-file based, using YAML files in `src/content/`.
*   **Content Schema:** Astro Content Collections (`src/content/config.ts`) are used to enforce type safety.
*   **Hébergement & Déploiement:** Netlify (déploiement continu depuis Git)
*   **Dépendances:** Gérées via `package.json`.
*   **Sitemap:** Generation and filtering configured via `@astrojs/sitemap` in `astro.config.mjs`.
*   **IndexNow Submission Script:** A Bash script (`scripts/submit_indexnow.sh`) using `curl` is available for manual URL submission.
*   **Build:** Processus de build statique (`astro build`)
*   **Dépendances:** Gérées via `package.json`
*   **Sitemap:** Generation and filtering configured via `@astrojs/sitemap` in `astro.config.mjs`.
*   **IndexNow Submission Script:** A Bash script (`scripts/submit_indexnow.sh`) using `curl` is available for manual submission of URLs to the IndexNow API. It can accept URLs as arguments or parse them from the site's sitemap (requires `xmllint`). Script updated for Bash v3+ portability (replaced `readarray`). 

### 2. Infrastructure et Déploiement

* **Redirections:** Configurées dans `netlify.toml` pour rediriger la racine vers `/fr/` (301) et les chemins sans slash vers leurs versions avec slash.
* **Netlify Prerendering:** Désactivé car non nécessaire pour ce site statique généré par Astro. Le service était en beta et a causé des erreurs 503 le 7 juin 2025.
* **Bot Testing:** Script personnalisé `scripts/run-bot-tests.sh` pour tester les réponses HTTP avec différents user-agents de bots de recherche. Le script a été amélioré pour suivre les redirections et afficher les URLs finales. 