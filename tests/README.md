# E2E Tests

This directory contains End-to-End (E2E) tests for the website, powered by Playwright. These tests simulate real user interactions to verify that critical functionality and content are working as expected after changes have been made.

## Setup

Before running the tests, you need to install Playwright and its browser dependencies.

1.  **Install Playwright:**
    ```bash
    npm install -D @playwright/test
    ```

2.  **Install Browsers:**
    ```bash
    npx playwright install
    ```

## Running the Tests

1.  **Start the development server:**
    The tests require the Astro development server to be running.
    ```bash
    npm run dev
    ```

2.  **Run the Playwright test suite:**
    Open a *new* terminal window and run the following command:
    ```bash
    npx playwright test
    ```
    Playwright will execute all files ending in `.spec.ts` inside the `tests/` directory.

## Current Test Suites

*   `contact-info.spec.ts`: Verifies that the contact information (email, phone, address) is displayed correctly and consistently across the Contact page, Footer, and all Legal pages, pulling from the single source of truth (`site-config.yml`).
