import { defineConfig } from "astro/config";

export default defineConfig({
  redirects: {
    '/': '/fr'
  },
  typescript: {
    enabled: false
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/global.css";`,
        },
      },
    },
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'it'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    },
  },
});