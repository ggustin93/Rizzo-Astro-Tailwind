import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15_000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
  // Tests assert against production output: the dev server injects Astro's dev-toolbar
  // DOM (extra <h1>s) which breaks strict-mode locators. BASE_URL overrides this to
  // point at a deploy preview or any already-running host instead.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview',
        url: 'http://localhost:4321/fr/',
        reuseExistingServer: true,
        timeout: 300_000,
      },
});
