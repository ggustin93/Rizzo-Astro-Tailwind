import { defineConfig } from "astro/config";

// Set this to 'static' or 'hybrid' based on your needs
const outputMode = 'static';

export default defineConfig({
  output: outputMode,
  redirects: {
    '/': '/fr'
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [{ protocol: "https" }],
    domains: ['pexels.com', 'unsplash.com', 'images.pexels.com'],
    format: ['avif', 'webp'],
    fallbackFormat: 'png',
    quality: 80,
    densities: [1, 2],
    cacheDir: './.cache/image',
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
  // i18n is handled in [...lang]/index.astro
});