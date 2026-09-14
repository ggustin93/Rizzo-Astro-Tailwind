# Accueil, équipe et profils — #12

## État actuel au 14 septembre 2026

Les lots #12 et #20 sont intégrés et publiés sur `feat/oct-2026-romain-nl-seo`. Dernière révision fonctionnelle : `25ae308e`, déploiement Netlify `6aa83cd0a738ed0008da3e53`, confirmé `ready` en contexte branche. Les worktrees de réalisation ont été supprimés après intégration.

[Ouvrir la preview](https://feat-oct-2026-romain-nl-seo--crizzo-pwablo-dev.netlify.app/fr/).

- Accueil : boutons mobiles compacts, libellé « Découvrir l’équipe » sans lien, conformément au PDF de Christine, et portraits cliquables vers les profils (portée du « sans lien » à confirmer avec le cabinet). Les photos de la page Équipe sont également cliquables.
- Services : en-têtes centrés sur fond thématique, texte blanc, sommaire, accordéons natifs et séparateur unique entre rubriques. Turquoise Travailleurs, violet Employeurs, bleu Institutions européennes conservés ; nuance foncée du turquoise pour le contraste.
- Decap : textes et médias restent éditables. `portraitLinks: profiles` active les liens des mini-portraits. « Affichage des situations » propose `accordion` ou `expanded`, indépendamment pour chaque page/langue.
- Preuves : 215 tests réussis et 5 ignorés sur la refonte générale ; 62 tests distants réussis sur `8b75992b`. Dernières corrections : build réussi et 90 tests locaux réussis ; bouton, portrait lié et en-tête coloré vérifiés par HTTP sur la preview de `25ae308e`. Ne pas confondre ces séries de vérifications.
- Restent ouverts : recette CMS distante sur backend de test et relecture juridique/linguistique du cabinet. #19 (contact/RDV), #22 (UE) et #24 (messagerie) ne sont pas livrés par ces lots. Production inchangée.

Le dossier de réunion, ses mails et ses PDF restent locaux sous `maintenance/`, ignorés par Git. Ne pas les ajouter aux commits.

## Historique de réalisation initiale

Base fixe de revue : `14d3a4c5f2019b8f8ee81eb6870ec0bbdbf27ce7`.
Branche initiale : `codex/12-accueil-equipe` (worktree supprimé après intégration). Les restrictions ci-dessous décrivent la réalisation initiale ; l’état actuel figure en tête.

Sources : GitHub #12, #18 et #23 (corps complets et commentaires lus le 14 septembre 2026 ; aucun commentaire), copie locale `meeting-2026-09-15/tickets/01-equipe-accueil.md`, PDF Équipe de 8 pages et PDF Accueil de 3 pages. Textes extraits et toutes les pages inspectées visuellement. Les annotations sont dessinées dans les pages, pas des objets PDF `/Annots`. Les trois paragraphes de Christine et les cinq de Stephanie sont intégralement barrés sur les profils ; les présentations Équipe doivent être conservées en entier.

## Plan et seams autorisés

1. Présentation Christine distincte du profil, identité stable, données et CMS.
2. Quatre membres, contenus intégraux et prétraductions, navigation et métadonnées.
3. Accueil fourni, médias éditables et mini-portraits.
4. Recette de reconstruction, Playwright ciblé puis suite complète, revue Standards/Spec et commit.

Seams confirmés par Guillaume : build Astro/typecheck, Playwright sur production HTTP port 4322, quatre langues, desktop/mobile/clavier, CMS/preview. Boucle rouge/vert par tranche. Les réservations et le bloc contact restent aux lots #13/#19.

## Réserves externes

- Liens : Christine demande « Découvrir l’équipe (mais sans lien) ». Le libellé reste non cliquable. Les portraits sont cliquables selon la demande de Guillaume ; confirmer avec le cabinet si son annotation devait aussi les concerner.
- Traductions : prétraductions à relire par le cabinet ; aucune validation juridique acquise.
- Accès effectif Decap, enregistrement et réouverture dans le CMS : preuve externe distincte des modifications YAML et builds locaux.
- Preview distante publiée ; production non déployée. Ticket ouvert pour les recettes et relectures restantes.

## Modèle livré et reprise des autres lots

- `site-config.yml → team` est l’annuaire ordonné partagé : identifiant, slug, nom, portrait carré, portrait individuel facultatif et LinkedIn. Les anciens slugs des associées restent identiques ; `romain-archalaus` est stable. Le portrait individuel vide reprend le carré.
- `site-config.yml → lawyers` reste la sélection de contacts existants, désormais reliés par `id`. Le schéma résout leur nom et LinkedIn depuis l’annuaire pour conserver le contrat des composants existants. L’ajout d’Arnaud et Romain à `team` n’ajoute aucun destinataire au formulaire ni carte de contact. #19 devra rattacher ses coordonnées aux mêmes identifiants, sans recopier l’identité.
- `profile.yml → fr/en/it/nl → lawyers` référence chaque membre par `id`. L’ordre localisé ne pilote pas l’affichage. Présentation Équipe, biographie individuelle et présentation collective de l’accueil sont indépendantes. Le PDF ne fournit aucune nouvelle biographie introductive individuelle : les profils commencent par les parcours.
- La navigation, les routes, les quatre nœuds Person, le sitemap et `llms.txt` utilisent l’annuaire. Les données de contact inconnues ne sont pas inventées. Les commandes de réservation supplémentaires relèvent des lots #13/#19.
- `home.yml → portraitLinks` vaut `profiles` en preview. Le libellé « Découvrir l’équipe » reste sans lien conformément au PDF ; il reste éditable dans Page Accueil → langue → Équipe. Le choix `none` désactive uniquement les liens des mini-portraits.

## Aide Decap ciblée

| Réglage | Emplacement |
| --- | --- |
| Renommer, réordonner, remplacer un portrait ou LinkedIn | Configuration → Paramètres généraux → Membres de l’équipe |
| Présentations, rôle, titre, parcours, langues et publications | Page Équipe → langue → Membres de l’équipe |
| Biographie individuelle facultative | Même membre → Biographie ; une liste vide ne publie aucun paragraphe |
| Conférences et publications | Même membre ; listes vides masquées, introduction des publications indépendante (contribution de Romain) |
| SEO de la liste / du profil | Référencement de la page Équipe / SEO du membre |
| Promesse, trois parcours, texte collectif, libellés et destinations | Page Accueil → langue |
| Images de l’accueil, ordre des parcours et liens des mini-portraits | Page Accueil → réglages partagés |

Les textes et alternatives sont traduits ; l’identité, les portraits et l’ordre sont communs. Les relations utilisent la syntaxe officielle [relation sur liste d’une collection de fichiers](https://decapcms.org/docs/widgets/relation/). Ne pas modifier les identifiants ou slugs existants pour renommer une personne. Les changements apparaissent après enregistrement puis reconstruction du site. Aucun délai de déploiement n’est promis ici.

Le backend CMS reste `main`, conformément à la configuration de production. **Avant toute recette authentifiée**, une personne autorisée doit préparer le backend et la preview sur la branche de test ; ne pas enregistrer ces données de démonstration sur `main`. Aucun changement de branche distante n’a été effectué dans ce lot.

## Validation locale et revue initiales

Les logs complets et captures locales sont dans `maintenance/issue-12/` (non versionné). Le rapport local `rapport.md` contient le hash du commit final et les résultats exacts. Le commit contenant ce document est la livraison locale du lot.

- TDD : échec attendu sur présentation Christine, puis correction ; échec sur quatre profils, puis intégration ; échec accueil, puis intégration ; échec sur les références d’Arnaud, puis correction de la condition Publications.
- `node scripts/verify-team-editing.mjs` : 8 tests après renommage/réorganisation/remplacement de portrait et suppression de listes, puis 8 après réintroduction ; quatre langues, Chromium et mobile-safari. Les trois fichiers source sont restaurés octet pour octet par `finally`, puis le build est reconstruit. Il s’agit d’une recette **YAML → build → navigateur**, pas d’un enregistrement Decap.
- `npm run build` : typecheck et génération statique, 72 pages, aucune erreur (39 hints non bloquants).
- `BASE_URL=http://127.0.0.1:4322 npx playwright test tests/team-editorial.spec.js tests/team-profiles.spec.ts tests/seo-structured-data.spec.ts --retries=0` : 84 tests réussis après correction de revue.
- Suite complète unique : `BASE_URL=http://127.0.0.1:4322 npm test -- --retries=0` → 171 réussis, 5 ignorés (scénarios desktop-only sur mobile), 8 échecs dus aux anciennes assertions de l’accueil. Mise à jour du seul bloc Homepage Expertise Grid selon le PDF puis `BASE_URL=http://127.0.0.1:4322 npx playwright test tests/european-institutions.spec.ts --retries=0` → 28 réussis, aucun échec. La suite complète n’a pas été relancée une seconde fois.
- Recette visuelle : accueil, équipe et profils des collaborateurs en desktop et mobile ; médias chargés, pas de débordement horizontal dans les quatre langues ; navigation Équipe → profil au clavier.
- Decap local : application chargée, écran « Login with Netlify Identity » observé. **Authentification, édition FR/NL, enregistrement, réouverture et reconstruction depuis Decap non effectués.**
- `simplify` appliqué au diff récent : schéma SEO partagé, navigation rendue plus lisible, données Person directement issues du titre validé ; aucun changement de périmètre.
- Revues parallèles Standards et Spec depuis la base fixe, diff WIP complet (`git diff 14d3a4c5 --`) avant le commit. Un même défaut identifié sur les deux axes : priorité `||`/`&&` masquant les publications avec introduction. Corrigé avec test rouge/vert ; seconde lecture sur chaque axe : **aucun finding restant**.

## Commandes de reprise

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
# Dans un autre terminal, sans réutiliser un autre serveur :
BASE_URL=http://127.0.0.1:4322 npm test -- --retries=0
# Recette temporaire des contenus, serveur 4322 du même worktree requis :
node scripts/verify-team-editing.mjs
```

Vérifier le port annoncé par Astro avant les tests. La configuration Playwright standard garde son port historique ; `BASE_URL` est obligatoire pour ce worktree. `js-yaml` est déclaré comme dépendance de développement pour la recette, à la version déjà verrouillée par le projet.

Prochaine étape : recette CMS sur backend de test et relecture des textes/traductions du cabinet. La preview est publiée ; aucun changement DNS, envoi de mail ni réservation réelle ne fait partie de cette livraison.

## Historique : passe simplify complémentaire

Passe réellement appliquée après `61cf6336`, sur trois fichiers du lot : schémas Accueil/Profils mis en forme champ par champ ; gardes de `getTeam()` explicites, ensemble `profileIds` nommé et spreads séparés ; chemin `teamPath` calculé hors de la boucle de navigation. Aucun champ, contenu ou réglage CMS modifié. Comparaison structurelle de l’AST des schémas : identique. `npm run build` réussi puis commande ciblée équipe/profils/SEO ci-dessus : **84 réussis (30,2 s)**. Relecture Standards et Spec de ce seul delta : aucun finding. Aucun merge, push ou déploiement ; intégration coordonnée en attente des deux retours.
