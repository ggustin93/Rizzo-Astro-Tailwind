import { defineConfig } from "astro/config";
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';

// Set this to 'static' or 'hybrid' based on your needs
const outputMode = 'static';

// Uncomment this when deploying to production
const siteUrl = 'https://crizzo-avocate.be';

export default defineConfig({
  site: siteUrl,
  publicDir: './public',
  output: outputMode,
  /* assets: {
    mount: {
      './src/assets': '/assets'
    }
  },*/
  redirects: {
    '/': '/fr/',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [{ protocol: "https" }],
    domains: ['pexels.com', 'unsplash.com', 'images.pexels.com', 'src'],
    format: ['avif', 'webp'],
    fallbackFormat: 'png',
    quality: 80,
    densities: [1, 2],
    cacheDir: './.cache/image',
  },
  typescript: {
    enabled: false
  },
  integrations: [
    robotsTxt({
      host: siteUrl,
      sitemap: true,
    }),
    sitemap(),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/global.css";`,
        },
      },
    },
  },
  // i18n is handled in [...lang]/index.astro
});