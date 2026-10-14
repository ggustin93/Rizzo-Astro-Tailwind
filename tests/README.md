# E2E Tests

Playwright tests for the website. Specs read the copy the cabinet can edit from `src/content/*.yml` through `tests/helpers.ts`, never hard-coded.

## Setup

```bash
npm install
npx playwright install   # Chromium and WebKit (mobile-safari project)
```

## Running the tests

```bash
npm test                                  # builds, previews on :4321, runs every spec
npx playwright test tests/<file>          # one spec
BASE_URL=https://staging.rizzo-michiels.be npx playwright test   # against a deployed site
```

Playwright starts `npm run build && npm run preview` itself (reusing a server already on :4321).

## Checks outside `npm test`

Two scripts run specs that are skipped in `npm test`, because they need their own build or servers:

- `node scripts/verify-image-cdn.mjs`: builds the site as Netlify does (`NETLIFY=true`) and checks that CMS photos are served resized by the Netlify Image CDN (`image-cdn-build.spec.js`).
- `node scripts/verify-cms-photo.mjs`: replays the cabinet's photo change in a real Decap CMS (decap-server local backend, loopback only) on a scratch copy of the repo: a photo over 5 MB is refused, a 4.7 MB photo becomes a member's portrait and changes only that field, then the team page serves it through the Image CDN (`cms-photo-upload.spec.js`). About 15 s; needs network the first time to fetch decap-server.

## Guards worth knowing

- `content-consistency.spec.js`: lists on the EU institutions, workers and employers pages must have the same number of points in FR/EN/IT/NL (SEO keywords excluded). The CMS edits each language separately, which is how RM-25 happened.
- `cms-images.spec.js`: every CMS image field has format advice and the 5 MB upload limit.
