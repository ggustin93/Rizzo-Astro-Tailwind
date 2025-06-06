## Active Context

### Current Focus

*   Refining SEO strategy: sitemap configuration, IndexNow protocol implementation (manual submission script enhanced and made more portable).

### Recent Changes

*   Created the core Memory Bank files (initial setup).
*   Updated `astro.config.mjs` to implement `sitemapFilter` (excluding blog posts, /legal/*, /credits).
*   Developed and used `bing_index_check.sh` (subsequently deleted).
*   Confirmed correct sitemap URL (`https://crizzo-avocate.be/sitemap-index.xml` which points to `sitemap-0.xml`).
*   Updated Memory Bank files with initial sitemap/SEO details.
*   Created IndexNow API key file (`public/d77e7bbb53844ce7b455448cecfa0ffd.txt`).
*   Created IndexNow manual submission script (`scripts/submit_indexnow.sh`).
*   Enhanced `scripts/submit_indexnow.sh` to parse URLs from the live sitemap (using `xmllint`).
*   Updated `scripts/submit_indexnow.sh` to replace `readarray` with a `while read` loop for Bash v3+ portability.
*   Updated Memory Bank files to reflect script changes.
*   **Resolved Root Redirection**: Simplified the root redirection by removing the Astro-based script (`src/pages/index.astro`) and relying solely on a redirect rule in `netlify.toml` (`/ -> /fr/`). This fixes the "Redirecting from..." message and ensures bot compatibility.

### Next Steps

*   User to ensure `xmllint` is available if using sitemap parsing feature of the script.
*   User to test IndexNow submission using `scripts/submit_indexnow.sh --sitemap` after deployment (if not already done and successful).
*   User to commit recent script changes.
*   Monitor search engine indexing (Bing Webmaster Tools, Google Search Console).
*   Investigate and potentially implement automated IndexNow submissions on deployment.

### Active Decisions & Considerations

*   Decision to exclude specific content from sitemap to improve indexing focus.
*   `bing_index_check.sh` was a temporary diagnostic tool.
*   IndexNow API key `d77e7bbb53844ce7b455448cecfa0ffd` adopted.
*   IndexNow submission script enhanced for sitemap parsing and portability.
*   **Redirection Strategy**: The root of the site will use a simple, non-conditional redirect in `netlify.toml` for maximum performance and bot compatibility, defaulting all traffic to the French (`/fr/`) version. 