// middleware.js - Redirection de la racine vers la version française par défaut
// Format compatible avec Astro et Vercel

import { LOCALE_PATTERN, DEFAULT_LOCALE } from './config/locales';

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

  // Toute autre URL (y compris celles déjà préfixées d'une langue) passe telle quelle.
  return next();
}

// Compatibilité Vercel Edge Middleware si nécessaire
export default function middleware(request) {
  const url = new URL(request.url);

  // Si on est à la racine exacte, rediriger vers la langue par défaut
  if (url.pathname === '/' || url.pathname === '') {
    return Response.redirect(new URL(DEFAULT_HOME, request.url), 302);
  }

  // Toute autre URL (y compris celles déjà préfixées d'une langue) passe telle quelle.
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
