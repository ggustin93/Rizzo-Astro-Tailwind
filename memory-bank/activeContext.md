# Contexte Actif

## Objectif Actuel
L'objectif principal était de **résoudre les échecs des tests SEO** et de **corriger le sélecteur de langue défectueux**. Cet objectif est maintenant **atteint**.

## Changements Récents
La session de travail a abouti à plusieurs changements majeurs :
1.  **Fiabilisation du script de test SEO** : Le script `scripts/run-seo-tests.sh` a été entièrement révisé pour devenir fiable, en utilisant `sed` et `awk` pour surmonter les problèmes de parsing HTML.
2.  **Suppression de `astro-seo`** : La dépendance a été retirée au profit d'une gestion manuelle des balises SEO directement dans `src/layouts/BaseLayout.astro`.
3.  **Correction du sélecteur de langue** : Le script du composant `LanguagePicker.astro` a été modifié pour utiliser l'événement `astro:page-load`, assurant sa compatibilité avec les View Transitions.
4.  **Stabilisation du build** : Des erreurs de build ont été résolues en ajoutant un schéma de contenu (`src/content/config.ts`) et en configurant correctement Tailwind CSS.

## Prochaines Étapes
- **Déployer les changements** : La priorité est de "commit" et "push" la branche actuelle pour mettre en production toutes les corrections validées en local.
- **Poursuivre le développement** : Une fois le déploiement effectué, le développement de nouvelles fonctionnalités ou de contenu peut reprendre sur une base stable.

## Décisions Actives
- **Standard de test** : Le script `run-seo-tests.sh` est maintenant le standard de vérité pour la validation du SEO technique avant tout déploiement.
- **Architecture SEO** : L'approche manuelle de la gestion des balises SEO est confirmée comme étant la solution la plus robuste et la plus transparente pour ce projet.

*Dernière mise à jour : 06/06/2025 - Fin de la session de débogage SEO et du sélecteur de langue.*