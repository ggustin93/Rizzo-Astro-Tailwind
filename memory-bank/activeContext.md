# Contexte Actif

## Objectif Actuel
Finaliser la branche `feature/european-institutions` pour merge vers main. Les changements majeurs sont implémentés : deux avocates, section Institutions Européennes, nouveau CTA dynamique, nouveau branding.

## Tâches en Cours
1. **CMS branch fix** : `public/admin/config.yml` pointe temporairement vers `feature/european-institutions` pour permettre l'édition du contenu `europeennes.yml` via Decap CMS avant le merge. À revertir vers `branch: main` au moment du merge.
2. **Nettoyage des descriptions** : Le champ `description` dans `europeennes.yml` a été nettoyé (suppression du balisage HTML résiduel).
3. **Tests E2E** : Les tests existants doivent être mis à jour pour le tableau `lawyers` et la nouvelle section de services.
4. **Validation mobile/desktop** : Vérifier le rendu du composant CTA 2 colonnes sur différentes tailles d'écran.

## Décisions Récentes
- **Tableau `lawyers` dynamique** : Le `site-config.yml` contient un tableau `lawyers` itéré par les composants (CTA, Footer, etc.). Ajouter/supprimer un avocat ne nécessite que la modification de ce fichier.
- **CMS branch temporaire** : Decap CMS pointe vers la branche de feature pendant le développement pour permettre l'édition du contenu qui n'existe pas encore sur main.
- **Source de vérité unique** : `site-config.yml` reste la source de vérité pour toutes les coordonnées de contact.

## Points d'Attention
- **Revertir `branch: main`** dans `public/admin/config.yml` avant ou immédiatement après le merge vers main.
- **Performances mobiles** : Le site doit rester performant sur mobile.
- **Cohérence CMS ↔ Schema ↔ Template** : Les champs dans le CMS config (`public/admin/config.yml`), le schema Zod (`src/content/config.ts`), le contenu YAML, et les templates Astro doivent rester alignés.

*Dernière mise à jour : 17/03/2026*
