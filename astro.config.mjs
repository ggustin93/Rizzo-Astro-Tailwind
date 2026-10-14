import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
// import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import { LOCALE_PATTERN } from './src/config/locales';

// Function to filter pages from sitemap
function sitemapFilter(page) {
  const path = new URL(page).pathname;

  // Exclude individual blog posts (e.g., /fr/blog/post-slug)
  // This will keep main blog listing pages like /fr/blog, /en/blog etc.
  if (path.match(new RegExp(`^/(${LOCALE_PATTERN})/blog/.+`))) {
    return false; // Exclude
  }

  const pathWithoutLang = path.replace(new RegExp(`^/(${LOCALE_PATTERN})`), '');

  // Exclude all pages under the /legal/ path
  if (pathWithoutLang.startsWith('/legal')) {
    return false; // Exclude
  }

  // Define slugs for other specific pages to be excluded (e.g., credits)
  // These are matched after removing the language prefix
  const specificSlugsToExclude = [
    '/credits'
    // Add English/Italian equivalents for '/credits' if your site uses specific translated slugs
    // e.g., if English credits page is /en/site-credits, add '/site-credits' here.
  ];

  if (specificSlugsToExclude.includes(pathWithoutLang)) {
    return false; // Exclude
  }

  return true; // Include all other pages
}

// Set this to 'static' or 'hybrid' based on your needs
const outputMode = 'static';

// Uncomment this when deploying to production
const siteUrl = 'https://rizzo-michiels.be';

export default defineConfig({
  // The adapter is only needed for SSR (server) mode
  // adapter: netlify(),
  site: siteUrl,
  publicDir: './public',
  output: outputMode,
  /* assets: {
    mount: {
      './src/assets': '/assets'
    }
  },*/
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
    /* robotsTxt({
      host: siteUrl,
      sitemap: true,
    }), */
    sitemap({
      filter: sitemapFilter,
      // Optional: If you use i18n domains or different base paths per language,
      // you might need to configure the i18n settings for the sitemap.
      // Example:
      // i18n: {
      //   defaultLocale: 'fr', // Your default language
      //   locales: {
      //     fr: 'fr-BE', // Or just 'fr'
      //     en: 'en-US', // Or just 'en'
      //     it: 'it-IT', // Or just 'it'
      //   },
      // },
    }),
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