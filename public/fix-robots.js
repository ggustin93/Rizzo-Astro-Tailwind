// Script d'urgence pour supprimer toutes les balises meta robots noindex
document.addEventListener('DOMContentLoaded', function() {
  // Chercher toutes les balises meta robots
  var metaRobots = document.querySelectorAll('meta[name="robots"]');
  
  // Supprimer toutes les balises meta robots sauf la première
  if (metaRobots.length > 1) {
    for (var i = 1; i < metaRobots.length; i++) {
      metaRobots[i].parentNode.removeChild(metaRobots[i]);
    }
  }
  
  // S'assurer que la première balise meta robots est réglée sur index, follow
  if (metaRobots.length > 0) {
    metaRobots[0].setAttribute('content', 'index, follow');
  } else {
    // Si aucune balise meta robots n'existe, en créer une
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    meta.setAttribute('content', 'index, follow');
    document.head.appendChild(meta);
  }
  
  // Ajouter un commentaire pour confirmer que le script a fonctionné
  console.log('✅ fix-robots.js: Balises meta robots corrigées');
}); 