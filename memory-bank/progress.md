## Progress

### What Works

*   Initial Memory Bank structure created and core files initialized.
*   Sitemap generation in `astro.config.mjs` customized to exclude specific pages/paths.
*   IndexNow API key file and manual submission script are in place.
*   Root redirection from `/` to `/fr/` is handled efficiently by `netlify.toml`.
*   **SEO Meta Tags**: All duplicate meta tags (`robots`, Open Graph, etc.) have been eliminated. The site now generates a single, correct set of SEO tags, managed directly within `src/layouts/BaseLayout.astro`. This resolves previous SEO test failures.
*   **Content Schema**: A robust content schema is defined in `src/content/config.ts`, ensuring type safety and preventing build errors related to content structure (e.g., the `allowIndexing` field in `site-config.yml`).
*   **Language Picker**: The language picker (`LanguagePicker.astro`) now functions correctly across all pages, even with Astro's View Transitions enabled. Its script was updated to use the `astro:page-load` event, ensuring it re-initializes after every page change.

### What's Left to Build

*   The entire website content and functionality as per `docs/prd.md`.
*   Implementation of content for all site sections.
*   Potential automation of IndexNow protocol submissions.
*   Ongoing refinement of Memory Bank files as the project evolves.

### Current Status

*   **Stable Build**: The project build is stable. All critical SEO and client-side script issues are resolved.
*   The project is now in a solid state, ready for further content development or feature implementation.

### Known Issues

*   `xmllint` is a dependency for the sitemap parsing feature of `scripts/submit_indexnow.sh`. This is not an issue with the site itself, but a prerequisite for using that specific script feature. 