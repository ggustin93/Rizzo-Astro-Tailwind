// middleware.js - Redirection de la racine vers la version française par défaut
// Format compatible avec Astro et Vercel

// Fonction principale du middleware Astro
export function onRequest({ request }, next) {
  const url = new URL(request.url);
  
  // Si on est à la racine exacte, rediriger vers /fr/
  if (url.pathname === '/' || url.pathname === '') {
    // On vérifie que ce n'est pas déjà une URL avec langue (fr/en/it)
    // Cela évite d'interférer avec le changement de langue
    return new Response('', {
      status: 302,
      headers: {
        'Location': '/fr/',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
  
  // Ne pas interférer avec les URL qui ont déjà un code de langue
  if (url.pathname.match(/^\/(fr|en|it)(?:\/|$)/)) {
    return next(); // On laisse passer ces URL sans modification
  }
  
  // Sinon, continuer normalement
  return next();
}

// Compatibilité Vercel Edge Middleware si nécessaire
export default function middleware(request) {
  const url = new URL(request.url);
  
  // Si on est à la racine exacte, rediriger vers /fr/
  if (url.pathname === '/' || url.pathname === '') {
    return Response.redirect(new URL('/fr/', request.url), 302);
  }
  
  // Ne pas interférer avec les URL qui ont déjà un code de langue
  if (url.pathname.match(/^\/(fr|en|it)(?:\/|$)/)) {
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
    '/((?!fr|en|it).*)'
  ]
}; 