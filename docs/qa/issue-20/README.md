# Services belges — recette et reprise du ticket #20

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

Branche locale : `codex/20-services-belges`. Base et référence fixe de revue :
`14d3a4c5f2019b8f8ee81eb6870ec0bbdbf27ce7` (`feat/oct-2026-romain-nl-seo`),
présente avant toute modification. Worktree exclusivement consacré à #20.
Commit d’implémentation relu et testé : `ba1b5809da0e9ae66f410533ea549650b31e312d`.
Tickets #20, #18 et #23 lus intégralement via `gh`, commentaires vides le 14 septembre.

## Contenu livré

Deux pages sur un composant commun : cinq rubriques chacune, dix situations Travailleurs
(répartition 4/2/2/2), quatre situations Employeurs et tous les paragraphes FR reçus.
Sources intégrales : `2026-09-14-nos-services.pdf` (3 pages contrôlées visuellement) et
son extraction dans le dossier partagé `meeting-2026-09-15/sources/`, lus sans modification.
La version initiale affichait toutes les situations dépliées. Les accordéons ont ensuite été autorisés par Guillaume et livrés avec un choix d’affichage dans Decap. Aucune FAQ séparée ni balisage FAQ ajouté. Prétraductions EN/IT/NL préparées.
URLs et médias historiques préservés. Le schéma et les deux publics UE restent inchangés.

Une seule définition des champs Decap couvre les huit éditions. Le schéma Astro est partagé
par les deux collections et contrôle les textes requis ainsi que les destinations.
`BaseLayout` reçoit uniquement une alternative d'image facultative ; les pages qui ne la
fournissent pas conservent leur comportement. Profils, accueil et contact non modifiés.

## Éditer dans Decap

Dans **Page Travailleurs** ou **Page Employeurs**, ouvrir la langue souhaitée :

- Titre de page, introduction facultative et titre des services.
- **Rubriques** : titre requis, description multilignes facultative, situations facultatives.
  Ajouter avec « Add rubriques », glisser la poignée pour réordonner, croix pour retirer.
- **Situations** : question et réponse requises ensemble. Une liste vide est autorisée.
  Même principe d'ajout, de glisser-déposer et de retrait ; résumé par question.
- **Libellé du lien tarifs / Destination du lien** : Honoraires ou Contact, automatiquement
  dans la langue courante. Les routes techniques ne sont pas saisies librement.
- **Référencement et aperçu de partage** : titre, description, image via médiathèque,
  alternative textuelle, mots-clés. Image vide : image globale du site ; alternative vide :
  titre SEO localisé. Les textes sont propres au public et à la langue ; les coordonnées
  restent dans la configuration commune existante.

Enregistrer déclenche le cycle Git/build dans l'environnement connecté. Le site statique ne
change qu'après reconstruction et publication de cet environnement ; aucun délai fixe promis.
Les champs de l'ancienne double liste ne sont plus présentés. Pas de saisie YAML/JSON/HTML.

## Preuves locales, 14 septembre 2026

Seams confirmés par Guillaume : build Astro, Playwright sur production HTTP, quatre langues,
desktop/mobile/clavier, édition CMS suivie de reconstruction.

- TDD : échec initial sur les cinq rubriques Travailleurs, puis succès ; même cycle Employeurs ;
  échec NL sans rubriques, puis succès après migration des prétraductions.
- Test du build : une question sans réponse était initialement acceptée ; maintenant refusée.
  Réponse absente, question blanche, titre vide et destination non autorisée sont testés.
- Recette Decap **réelle mais locale** : `decap-server` sur `127.0.0.1:8083`, enraciné dans ce
  worktree, interface sur `http://127.0.0.1:4323/admin/`. Configuration `local_backend` injectée
  seulement dans la réponse réseau du navigateur Playwright ; aucun changement de backend
  ou de branche CMS livré. Procédure conforme à la [documentation Decap Proxy](https://decapcms.org/docs/decap-proxy/).
- Travailleurs : modification des titres FR/NL et du lien FR, ajout d'une rubrique et de deux
  situations, refus d'enregistrement d'une réponse absente, réordonnancement à la souris,
  enregistrement et réouverture. Après build, FR/NL et l'ordre étaient visibles par HTTP.
  [Capture du build de recette, données temporaires](cms-rebuild-fr.png).
- Retrait des situations via Decap, nouvel enregistrement et build : description seule visible,
  zéro élément de liste. Retrait de la rubrique et restauration des titres/liens via Decap.
  Égalité des données avec la sauvegarde antérieure vérifiée ; mise en forme YAML restaurée
  seulement après cette comparaison. EN/IT et Employeurs préservés pendant cette opération.
- Employeurs : modification d’un titre FR dans Decap, sauvegarde et réouverture, puis
  résultat visible après reconstruction HTTP. Restauration dans Decap et égalité des données
  vérifiées avant restauration de la mise en forme YAML.
- `/simplify` : rendu et métadonnées communs regroupés, conditions de présentation nommées,
  structure Astro aérée ; mêmes champs CMS et mêmes comportements.

## Résultats finaux après simplification

| Commande exacte | Résultat |
| --- | --- |
| `node scripts/qa/services-invalid-content.mjs` | 4 contenus invalides refusés, fichiers restaurés |
| `npm run build` | Astro check : 0 erreur, 0 avertissement, 46 hints ; 64 pages construites |
| `BASE_URL=http://127.0.0.1:4323 npx playwright test tests/belgian-services.spec.js tests/european-institutions.spec.ts --retries=0` | 64 réussis, 12,2 s |
| `BASE_URL=http://127.0.0.1:4323 npm test` | Suite complète lancée une fois : 187 réussis, 5 ignorés, 33,2 s |
| `git diff --check` | Aucun défaut d’espacement |

Les 5 cas ignorés sont les tests desktop de `header-booking.spec.ts`, déjà exclus sur mobile.
Safari parcourt les liens avec Option+Tab ; Chromium avec Tab. Aucun contournement par focus
programmatique sur le lien tarifs. Les hints Astro concernent notamment les API dépréciées et
les types implicites ; ils ne constituent ni erreurs ni avertissements du résultat Astro check.

Captures finales inspectées, après restauration des données CMS :
[Travailleurs desktop](travailleurs-fr-desktop.png), [Travailleurs mobile](travailleurs-fr-mobile.png),
[Employeurs desktop](employeurs-nl-desktop.png), [Employeurs mobile](employeurs-nl-mobile.png).
Pas de débordement horizontal ni texte coupé constaté sur ces captures.

Preview **locale** : `http://127.0.0.1:4323/`, build du commit `ba1b5809`.
Le proxy CMS 8083 a été arrêté après recette ; le serveur de preview 4323 reste disponible.

## Standards

Revue indépendante du diff `14d3a4c5...ba1b5809` : **0 finding**. Conformité aux conventions
Astro/SSG, YAML, schéma centralisé, bouton partagé, langues et fallback. Mutualisation adaptée
sans abstraction superflue ; deux adaptateurs de route justifiés. `imageAlt` reste facultatif
pour les autres pages. Aucun ajout TypeScript. Revue statique, sans exécution de tests par le relecteur.

## Spec

Revue indépendante du même diff : **0 finding correctif**. Les textes FR ont été confrontés
à l’extraction intégrale ; cinq rubriques par public, répartition des situations, modèle/CMS
communs et maintien UE conformes. Les prétraductions couvrent les mêmes contenus.
Les critères externes restent partiels et signalés ; ils imposent de garder le ticket ouvert.
Revue statique ; rapport et captures finalisés ensuite dans un commit documentaire.

Total : Standards 0 ; Spec 0 correctif. Aucune correction demandée par les deux axes.

## Réserves et validation externe

Textes FR reçus : **complets**, pas de contenu manquant sur ces deux pages. Restent ouverts :
validation du format par le cabinet, relecture juridique FR, relecture linguistique et juridique
EN/IT/NL. Les traductions préparées ne sont pas des textes juridiquement approuvés.

L'accès authentifié du cabinet à Decap/Git Gateway n'a pas été testé. La recette locale ne
valide ni ses droits, ni l'enregistrement sur une branche distante, ni un deploy preview Netlify.
Aucune URL de preview distante ni validation cliente ou production. Backend livré inchangé
sur `main` ; pour une future recette distante, configurer explicitement une branche de test
avant toute édition. Pas de push, merge, déploiement, envoi de message, RDV ni changement DNS.
Le ticket doit rester ouvert tant que les preuves externes attendues restent ouvertes.
Ce lot ne bloque pas automatiquement le jalon Équipe et ne déclenche aucun chantier UE.

## Reprise

Depuis ce worktree, vérifier `git status` et la branche avant toute action. Utiliser exclusivement
le port 4323 ; s'il est occupé, identifier son propriétaire avant de démarrer un serveur.

```sh
npm ci
node scripts/qa/services-invalid-content.mjs
npm run build
npm run preview -- --host 127.0.0.1 --port 4323
BASE_URL=http://127.0.0.1:4323 npx playwright test tests/belgian-services.spec.js tests/european-institutions.spec.ts --retries=0
BASE_URL=http://127.0.0.1:4323 npm test
```

Le script de contenu invalide modifie temporairement le YAML **de ce worktree seulement** et
le restaure dans `finally`. L'exécuter seul, puis reconstruire avant les tests HTTP. Ne pas lancer
une édition CMS ou un second build en parallèle sur ces mêmes fichiers.

L'installation initiale a échoué faute d'espace disque. Les dépendances de cette session ont
été lues via des liens locaux vers le `node_modules` existant du checkout source, avec caches
Astro/Vite séparés dans le worktree. Aucun fichier du checkout source n'a été édité. Pour une
reprise autonome, disposer d'espace et exécuter `npm ci` pour installer les dépendances locales.

## Nouvelle passe simplify après `790224c3`

Skill `/Users/pwablo/.agents/skills/simplify/SKILL.md` relu et diff du ticket examiné.
Deux améliorations limitées :

- Les titres attendus des tests traduits sont indexés par public (`travailleurs` / `employeurs`),
  supprimant le couplage implicite entre deux tableaux parallèles. Même couverture et mêmes valeurs.
- `BelgianServices.astro` regroupe la lecture de ses propriétés et aère les attributs des titres
  et du bouton. Classes, conditions, textes et destinations identiques.

Aucune modification des YAML, schémas ou champs CMS. Relecture locale du nouveau diff : aucun
changement fonctionnel identifié. Les revues indépendantes ci-dessus portent sur `ba1b5809`.

Vérifications exécutées le 14 septembre après cette nouvelle passe :
`npm run build` réussi (0 erreur, 0 avertissement, 46 hints, 64 pages),
`BASE_URL=http://127.0.0.1:4323 npx playwright test tests/belgian-services.spec.js tests/european-institutions.spec.ts --retries=0`
réussi (64 tests, 11,2 s), `git diff --check` réussi. La suite complète et la recette CMS ne sont
pas répétées pour cette modification de lisibilité ; leurs preuves précédentes restent datées
ci-dessus. Preview locale reconstruite ; aucun merge, push ou déploiement réalisé.

## Ajustement UI du 14 septembre

À la demande de Guillaume, les situations peuvent maintenant être affichées en accordéons natifs. Dans Decap, ouvrir la page Travailleurs ou Employeurs, puis la langue et **Affichage des situations** : « Tout déplié » ou « Accordéons ». Le choix est indépendant par page et langue. Les descriptions restent toujours visibles et les réponses sont présentes dans le HTML statique. Aucun balisage FAQ ajouté.

Le sommaire utilise les titres des rubriques éditables. Les thèmes conservent leur couleur : turquoise Travailleurs, violet Employeurs, bleu Institutions européennes. La nuance foncée du turquoise sert uniquement la lisibilité des textes.
