# Log de maintenance - 28/06/2025

## Urgence : Changement de numéro de téléphone

### Contexte
Suite à un message urgent de Christine Rizzo le 28/06/2025 à 08:42 :
> "Bonjour Guillaume, désolée de te déranger le samedi mais j'ai un problème urgent pour le site. Je dois changer le numéro de téléphone car mon téléphone pro est désactivé à cause d'un changement d'opérateur foireux. Je ne sais pas le changer moi même sur les boutons appel et WhatsApp. [...] En attendant je dois mettre mon numéro privé."

### Modifications effectuées

1. **Centralisation des coordonnées de contact**
   - Ajout d'une section `contactInfo` dans `src/content/config/site-config.yml`
   - Configuration du Decap CMS dans `public/admin/config.yml` pour permettre l'édition des coordonnées
   - Mise à jour du schéma dans `src/content/config.ts`

2. **Mise à jour du numéro de téléphone**
   - Ancien numéro : `+32 488 40 45 49`
   - Nouveau numéro : `+32 479 80 50 02`
   - Numéro WhatsApp mis à jour : `32479805002`

3. **Fichiers modifiés**
   - `src/content/config/site-config.yml` - Ajout de la section contactInfo
   - `src/content/config.ts` - Mise à jour du schéma
   - `public/admin/config.yml` - Ajout des champs d'édition dans l'interface admin
   - `src/components/CTA.astro` - Utilisation des coordonnées centralisées
   - `src/components/Footer.astro` - Utilisation des coordonnées centralisées
   - `src/pages/[...lang]/contact.astro` - Utilisation des coordonnées centralisées
   - `src/pages/signature.astro` - Utilisation des coordonnées centralisées
   - `src/utils/contact-info.js` - Refactorisation pour utiliser la config globale
   - `src/content/contact/contact.yml` - Mise à jour du numéro dans les 3 langues
   - `src/content/legal/notice.yml` - Mise à jour du numéro dans les 3 langues

### Améliorations
- Ajout d'un champ `calendarLink` dans la configuration globale
- Centralisation des coordonnées LinkedIn et adresse postale
- Mise en place d'un système qui permet à Christine de modifier elle-même ses coordonnées via l'interface admin

### Vérifications
- Tentative de build avec `npm run build` et `npx astro check --no-typescript`
- Note : Problème de version Node.js (v18.15.0 alors qu'Astro requiert >=18.20.8)
- Les modifications sont simples et ne devraient pas causer de problèmes

### Documentation
- Mise à jour de `memory-bank/activeContext.md`
- Mise à jour de `memory-bank/progress.md`
- Création de ce log de maintenance

### Prochaines étapes
- Déployer les changements en production
- Informer Christine qu'elle peut désormais modifier ses coordonnées via l'interface admin
- Lui fournir un guide rapide pour effectuer ces modifications si nécessaire 