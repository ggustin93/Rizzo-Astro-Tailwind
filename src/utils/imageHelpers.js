// utils/imageHelpers.js
import { join } from 'node:path';
import sharp from 'sharp';

export function isExternalImage(src){
    return src.startsWith('http://') || src.startsWith('https://');
  }

// Netlify sets NETLIFY=true on every build it runs (production, branch deploys, previews).
const onNetlify = process.env.NETLIFY === 'true';

const cdnUrl = (src, width, height) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}` + (height ? `&h=${height}&fit=cover` : '');

// Width of a file in public/, or 0 when it can't be read (missing, unsupported).
// Builds run from the project root; this module is bundled elsewhere, so no import.meta.url.
async function sourceWidth(src) {
  try {
    return (await sharp(join(process.cwd(), 'public', src)).metadata()).width ?? 0;
  } catch {
    console.warn(`[cdnImage] cannot read public${src}: served without 2x variant`);
    return 0;
  }
}

/**
 * Serve a CMS image through the Netlify Image CDN (#42): resized to its display size,
 * cropped when a height is given, and converted to AVIF/WebP for the browser.
 * A 2x variant is offered only when the source is wide enough, never upscaled.
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
  if ((await sourceWidth(src)) >= width * 2) image.srcset = `${image.src} 1x, ${cdnUrl(src, width * 2, cropHeight && cropHeight * 2)} 2x`;
  return image;
}
