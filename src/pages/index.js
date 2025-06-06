// src/pages/index.js
// Redirection de la racine vers /fr/ via une page statique
// Cette page ne s'applique que lorsqu'aucun des autres mécanismes n'a fonctionné

export async function get({ request }) {
  const url = new URL(request.url);
  
  // Rediriger uniquement si on est sur la racine exacte
  if (url.pathname === '/' || url.pathname === '') {
    return {
      body: '',
      status: 302,
      headers: {
        'Location': '/fr/',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    };
  }
  
  // Si on a déjà un code de langue, ne pas rediriger
  if (url.pathname.match(/^\/(fr|en|it)(?:\/|$)/)) {
    return {
      status: 200,
      body: 'Language route detected, proceeding normally'
    };
  }
  
  // Comportement par défaut
  return {
    status: 200,
    body: 'Index page'
  };
}

// src/pages/index.js - Redirection simple pour la version statique
// Ceci agit comme sauvegarde si le middleware échoue ou n'est pas exécuté

// La fonction Astro doit renvoyer un objet avec une propriété body 
// et les en-têtes appropriés pour la redirection
export async function GET() {
  return new Response('', {
    status: 302,
    headers: {
      'Location': '/fr/',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
} 