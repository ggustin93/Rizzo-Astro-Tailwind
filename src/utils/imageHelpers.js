// utils/imageHelpers.js
import { join } from 'node:path';
import sharp from 'sharp';

export function isExternalImage(src){
    return src.startsWith('http://') || src.startsWith('https://');
  }

// Netlify sets NETLIFY=true on every build it runs (production, branch deploys, previews).
const onNetlify = process.env.NETLIFY === 'true';

// Quality 85 instead of the CDN default 75, which visibly smoothed faces on portraits.
const cdnUrl = (src, width, height) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}` + (height ? `&h=${height}&fit=cover` : '') + '&q=85';

// Size of a file in public/, or 0 × 0 when it can't be read (missing, unsupported).
// Builds run from the project root; this module is bundled elsewhere, so no import.meta.url.
async function sourceSize(src) {
  try {
    const { width = 0, height = 0 } = await sharp(join(process.cwd(), 'public', src)).metadata();
    return { width, height };
  } catch {
    console.warn(`[cdnImage] cannot read public${src}: served without high-density variant`);
    return { width: 0, height: 0 };
  }
}

/**
 * Serve a CMS image through the Netlify Image CDN (#42): resized to its display size,
 * cropped when a height is given, and converted to AVIF/WebP for the browser.
 * A high-density variant (up to 2x) uses whatever the source has beyond the display size, never upscaled.
 * SVG, remote URLs and builds outside Netlify (dev, preview, tests) keep the original file.
 * Returns <img> attributes, display width and height included.
 * @param {string} src
 * @param {{ width: number, height?: number, crop?: boolean, enabled?: boolean }} options
 *   height is the display height; it also crops the image unless crop is false (illustrations).
 */
export async function cdnImage(src, { width, height, crop = true, enabled = onNetlify }) {
  if (!enabled || !src || isExternalImage(src) || /\.svg$/i.test(src)) return { src, width, height };
  const cropHeight = crop ? height : undefined;
  const image = { src: cdnUrl(src, width, cropHeight), width, height };
  const source = await sourceSize(src);
  const room = Math.min(source.width / width, cropHeight ? source.height / cropHeight : Infinity);
  const density = Math.min(2, Math.floor(room * 100) / 100);
  if (density > 1) {
    const dense = cdnUrl(src, Math.round(width * density), cropHeight && Math.round(cropHeight * density));
    image.srcset = `${image.src} 1x, ${dense} ${density}x`;
  }
  return image;
}
