import { chromium } from '/Users/pwablo/orca/workspaces/Rizzo-Astro-Tailwind/staging/node_modules/playwright/index.mjs';
const dir = process.argv[2];
const b = await chromium.launch({ executablePath: '/Users/pwablo/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' }); const p = await b.newPage({ deviceScaleFactor: 4 });
for (const v of ['origine', 'site']) {
  await p.goto(`file://${dir}/christine-${v}.html`); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: `${dir}/christine-${v}.pdf`, width: '91mm', height: '61mm', printBackground: true });
  await p.setViewportSize({ width: 344, height: 231 * 2 });
  await p.screenshot({ path: `${dir}/christine-${v}.png`, fullPage: true });
}
await b.close();
