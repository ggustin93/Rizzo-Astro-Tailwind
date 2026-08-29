// middleware.js - Redirection de la racine vers la version française par défaut
// Format compatible avec Astro et Vercel

import { LOCALE_PATTERN, DEFAULT_LOCALE } from './config/locales';

// Les locales viennent de src/config/locales.ts : le middleware est la porte de
// routage, donc une langue oubliée ici est rejetée avant d'atteindre les pages.
const LOCALE_PREFIX = new RegExp(`^/(${LOCALE_PATTERN})(?:/|$)`);
const DEFAULT_HOME = `/${DEFAULT_LOCALE}/`;

// Fonction principale du middleware Astro
export function onRequest({ request }, next) {
  const url = new URL(request.url);

  // Si on est à la racine exacte, rediriger vers la langue par défaut
  if (url.pathname === '/' || url.pathname === '') {
    return new Response('', {
      status: 302,
      headers: {
        'Location': DEFAULT_HOME,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // Ne pas interférer avec les URL qui ont déjà un code de langue
  if (LOCALE_PREFIX.test(url.pathname)) {
    return next(); // On laisse passer ces URL sans modification
  }

  // Sinon, continuer normalement
  return next();
}

// Compatibilité Vercel Edge Middleware si nécessaire
export default function middleware(request) {
  const url = new URL(request.url);

  // Si on est à la racine exacte, rediriger vers la langue par défaut
  if (url.pathname === '/' || url.pathname === '') {
    return Response.redirect(new URL(DEFAULT_HOME, request.url), 302);
  }

  // Ne pas interférer avec les URL qui ont déjà un code de langue
  if (LOCALE_PREFIX.test(url.pathname)) {
    return; // On laisse passer ces URL sans modification
  }

  // Sinon, continuer normalement
  return;
}

// Configuration Vercel - définir sur quels chemins le middleware s'applique
export const config = {
  matcher: [
    // Uniquement sur la racine exacte ou sur les chemins qui ne commencent pas déjà par un code de langue
    '/',
    `/((?!${LOCALE_PATTERN}).*)`
  ]
};
