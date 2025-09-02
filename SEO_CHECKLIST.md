# SEO Checklist Post-Deployment

## ✅ Éléments à vérifier

### Meta Tags
- [ ] Titre unique sur chaque page (< 60 caractères)
- [ ] Meta description unique (< 160 caractères)
- [ ] Keywords pertinents
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags

### Structure
- [ ] Une seule balise H1 par page
- [ ] Hiérarchie des titres respectée (H1 → H2 → H3)
- [ ] URLs propres avec trailing slashes
- [ ] Canonical URLs correctes

### Multilingue
- [ ] Hreflang tags présents sur toutes les pages
- [ ] Alternates pour FR, EN, IT
- [ ] x-default défini

### Technique
- [ ] Sitemap XML généré et accessible
- [ ] Robots.txt correct
- [ ] Certificat SSL actif (HTTPS)
- [ ] Temps de chargement < 3s
- [ ] Mobile responsive

### Contenu
- [ ] Texte alternatif sur toutes les images
- [ ] Pas de contenu dupliqué
- [ ] Liens internes cohérents
- [ ] "NOUS CONTACTER" au lieu de "ME CONTACTER"

### Performance
- [ ] Score Lighthouse > 90
- [ ] Images optimisées (WebP/AVIF)
- [ ] CSS/JS minifiés
- [ ] Cache headers configurés

## 🔧 Commandes de vérification

```bash
# Tests automatiques
./scripts/run-seo-tests.sh
./scripts/run-bot-tests.sh

# Build de production
npm run build

# Test local
npm run preview

# Soumission IndexNow
./scripts/submit_indexnow.sh
```

## 📊 Monitoring post-déploiement

1. **Google Search Console**
   - Vérifier l'indexation
   - Surveiller les erreurs
   - Analyser les performances

2. **Google Analytics**
   - Trafic organique
   - Taux de rebond
   - Conversions

3. **Outils tiers**
   - Ahrefs/SEMrush pour le suivi des rankings
   - GTmetrix pour la performance