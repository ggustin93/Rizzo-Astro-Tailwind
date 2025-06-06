## Active Context

### Current Focus

*   The project is currently stable. The main focus has been on resolving critical build and functionality issues related to SEO and client-side scripting.

### Recent Changes

*   **Removed `astro-seo`**: The `astro-seo` package was uninstalled to resolve persistent issues with duplicate meta tags.
*   **Manual SEO Implementation**: All SEO meta tags (robots, Open Graph, Twitter Cards, canonical URL) are now generated directly within `src/layouts/BaseLayout.astro` for full control.
*   **Content Schema Definition**: Created `src/content/config.ts` to define a strict schema for all content collections, particularly `site-config`. This fixed critical build errors by ensuring type safety between the YAML content file and the Astro components.
*   **Corrected `site-config.yml`**: Added the required `allowIndexing` field to `src/content/config/site-config.yml` to match the new schema.
*   **Fixed `LanguagePicker.astro`**: Modified the component's script to use the `astro:page-load` event. This ensures the language switcher works reliably with Astro's View Transitions enabled, which was a major bug.
*   **Cleaned up `astro.config.mjs`**: Removed an incorrect `vite` configuration block and added the `@astrojs/tailwind` integration to resolve CSS pathing issues.

### Next Steps

*   Continue with content population and development of new features as needed.
*   Monitor site performance and search engine indexing.

### Active Decisions & Considerations

*   **SEO Management**: The decision was made to manage SEO tags manually in the base layout rather than relying on a third-party library, providing greater control and avoiding hard-to-debug issues.
*   **Content Type Safety**: Using Astro's content collection schemas is now the standard pattern for this project to ensure data integrity and prevent build failures.
*   **Client-side Scripts & View Transitions**: All new client-side scripts must be written to be compatible with Astro's View Transitions, typically by using the `astro:page-load` event for initialization. 