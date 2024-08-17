export function onRequest({ request, redirect }) {
    const url = new URL(request.url);
    const [, lang] = url.pathname.split('/');
    
    if (!['fr', 'en', 'it'].includes(lang)) {
      // Detect preferred language (you can implement more sophisticated detection)
      const preferredLang = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 'fr';
      
      // Redirect to the appropriate language
      return redirect(`/${preferredLang}${url.pathname}`);
    }
  }