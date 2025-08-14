# Contexte Actif

## Objectif Actuel
L'objectif principal était de **résoudre les échecs des tests SEO** et de **corriger le sélecteur de langue défectueux**. Cet objectif est maintenant **atteint**.

Récemment, l'objectif s'est porté sur la **vérification et l'amélioration des redirections** ainsi que la **résolution des erreurs 503** rencontrées sur le site.

**Nouvelle urgence résolue** : Centralisation des coordonnées de contact suite au problème de téléphone professionnel de Christine. Solution implémentée avec interface CMS pour modifications futures autonomes.

**Mise à jour du 28/06/2025** : Le numéro de téléphone a été changé de "+32 488 40 45 49" à "+32 479 80 50 02" partout sur le site suite à un problème avec l'opérateur téléphonique. Tous les numéros sont maintenant centralisés dans `site-config.yml` et accessibles via l'interface admin Decap CMS.

**Mise à jour du 14/08/2025** : Refactoring de la source de vérité pour les données de contact. L'email a été mis à jour et une mention sur la page contact a été supprimée.

## Tâches Actuelles
1. **Maintenance SEO** : S'assurer que le site reste bien indexé par les moteurs de recherche.
2. **Suivi des performances** : Surveiller les performances du site et résoudre les problèmes éventuels.
3. **Mise à jour du contenu** : Assister Christine pour les mises à jour de contenu via le CMS.

## Décisions Récentes
- **Désactivation du prerendering** : Le prerendering de Netlify a été désactivé car il causait des erreurs 503 et n'est pas nécessaire pour ce site statique.
- **Centralisation des coordonnées** : Toutes les coordonnées de contact sont maintenant centralisées dans `site-config.yml` et configurables via l'interface admin.
- **Source de vérité unique** : Le refactoring du 14/08/2025 a consolidé `site-config.yml` comme la source de vérité unique pour les informations de contact, éliminant les données dupliquées dans `navigation.yml` et `contact.yml`.
- **Validation par Tests E2E** : Une suite de tests automatisés avec Playwright a été mise en place pour vérifier la cohérence des données de contact sur l'ensemble du site, garantissant la non-régression.

## Points d'Attention
- **Performances mobiles** : Le site doit rester performant sur mobile, c'est une priorité.
- **Compatibilité navigateurs** : Le site doit fonctionner sur tous les navigateurs modernes.
- **Sécurité** : Le site doit rester sécurisé et à jour.

## Changements Récents
La session de travail a abouti à plusieurs changements majeurs :
1.  **Fiabilisation du script de test SEO** : Le script `scripts/run-seo-tests.sh` a été entièrement révisé pour devenir fiable, en utilisant `sed` et `awk` pour surmonter les problèmes de parsing HTML.
2.  **Suppression de `astro-seo`** : La dépendance a été retirée au profit d'une gestion manuelle des balises SEO directement dans `src/layouts/BaseLayout.astro`.
3.  **Correction du sélecteur de langue** : Le script du composant `LanguagePicker.astro` a été modifié pour utiliser l'événement `astro:page-load`, assurant sa compatibilité avec les View Transitions.
4.  **Stabilisation du build** : Des erreurs de build ont été résolues en ajoutant un schéma de contenu (`src/content/config.ts`) et en configurant correctement Tailwind CSS.
5.  **Amélioration du script de test bot** : Le script `scripts/run-bot-tests.sh` a été amélioré pour suivre les redirections et afficher les URLs finales.
6.  **Clarification des redirections** : Vérification que les redirections 301 fonctionnent correctement et ajout de redirections explicites dans `netlify.toml` pour les URLs sans slash.
7.  **Résolution des erreurs 503** : Désactivation du service de prerendering beta de Netlify qui était la cause des erreurs.

## Prochaines Étapes
- **Déployer les changements** : La priorité est de "commit" et "push" la branche actuelle pour mettre en production toutes les corrections validées en local.
- **Poursuivre le développement** : Une fois le déploiement effectué, le développement de nouvelles fonctionnalités ou de contenu peut reprendre sur une base stable.

## Décisions Actives
- **Standard de test** : Le script `run-seo-tests.sh` est maintenant le standard de vérité pour la validation du SEO technique avant tout déploiement.
- **Architecture SEO** : L'approche manuelle de la gestion des balises SEO est confirmée comme étant la solution la plus robuste et la plus transparente pour ce projet.
- **Redirections multilingues** : Conserver le code de statut 301 pour les redirections est considéré comme la solution la plus professionnelle pour un site multilingue.
- **Prerendering** : Le prerendering a été désactivé car non nécessaire pour ce site statique généré par Astro.

*Dernière mise à jour : 14/08/2025 - Refactoring de la source de vérité des données de contact et ajout de tests E2E.*