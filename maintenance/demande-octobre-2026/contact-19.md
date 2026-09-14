# Contact et réservation — ticket #19

Implémentation locale sur `feat/oct-2026-romain-nl-seo`, à partir de `592f329`.

## Réglages pour le cabinet

Dans Decap, Configuration du site :

- **Coordonnées du cabinet** : adresse commune et email général. La zone « Nos bureaux », les pages légales et les données structurées utilisent ces réglages. L’email général sert à l’action « Email avec documents ».
- **Annuaire — coordonnées individuelles** : choisir le membre grâce à son identité stable. Téléphone obligatoire, email professionnel et WhatsApp facultatifs. Un email vide masque uniquement ce lien ; ne pas saisir une adresse factice. Les numéros confirmés sont conservés pour Christine et Stephanie et ajoutés pour Arnaud et Romain.
- **Calendrier Cal.com** : vider le champ retire les commandes dans le header, l’Équipe et la bannière ; renseigner une URL Cal.com valide les rétablit. Romain n’a pas de calendrier. Son lien Contact mène aux coordonnées de son profil.
- **Identité et portraits** : LinkedIn est saisi une seule fois par membre, partagé entre les langues.
- **Afficher le formulaire de contact** : masque aussi les accès Message des bannières et les liens Formulaire du menu. Les autres contacts restent disponibles.
- **Illustration de la bannière Contact** : média commun aux langues.

Dans Traductions de l’interface, pour chaque langue : **Bloc contact** permet de modifier titre, alternative de l’image, libellé Contact individuel, libellés des quatre actions et leur ordre. Chaque type doit apparaître exactement une fois. Les destinations sont calculées depuis les réglages centraux. Les anciens champs EMAIL/RDV/APPEL/Réserver et les menus footer téléphones/emails sont retirés. Le titre « Nos bureaux » reste dans Navigation → Pied de page. Les textes du formulaire et de sa page de succès restent dans leurs sections de traduction.

Après enregistrement, attendre la reconstruction Netlify puis recharger la page. Un enregistrement CMS seul ne prouve pas que le nouveau contenu est publié.

## Formulaire et réception

Le formulaire existant reste sur Contact, accessible depuis Message dans toutes les bannières partagées. Ce choix est provisoire et doit être validé par le cabinet. Aucun upload ajouté : les pièces passent par l’application email du visiteur.

Le formulaire Netlify conserve le nom `contact-form`. L’annuaire ne détermine aucun destinataire. Le calcul inutilisé des emails des membres a été retiré ; aucun champ CMS ne prétend configurer des notifications serveur. Dans le tableau de bord Netlify, contrôler les notifications email du formulaire `contact-form` avec les destinataires métier validés, sans ajouter automatiquement les collaborateurs. Cette configuration et la réception réelle n’ont pas été vérifiées ici.

Les tests locaux interceptent les POST et simulent les réponses erreur/succès. Ils ne prouvent pas la réception Netlify. Les emails des collaborateurs restent vides dans l’attente de confirmation ; leur omission provisoire est à valider avec le cabinet.

## Recette et publication

- TDD : test du téléphone de Romain en échec avant modification, puis réussi.
- Recette locale : build Astro, tests publics FR/EN/IT/NL, clavier, Chrome et Safari mobile ; résultats finaux consignés ci-dessous.
- Démarrer `npm run preview -- --host 127.0.0.1 --port 4322` avant `node scripts/verify-contact-editing.mjs`. Le port 4322 doit servir ce dépôt.
- `scripts/verify-contact-editing.mjs` : modification temporaire téléphone/calendrier/visibilité/image/textes FR et NL/ordre, reconstruction et contrôle HTTP, puis restauration exacte des sources et reconstruction. **Ce n’est pas une preuve d’enregistrement dans Decap.**
- Decap utilise actuellement le backend Git Gateway sur `main`. Aucune modification CMS sur cette branche de production n’a été effectuée. Recette réelle à mener sur une branche de test : enregistrer, rouvrir, reconstruire, contrôler les quatre langues et restaurer. Ajouter puis retirer un membre exige son identité et ses traductions ; les quatre types d’action restent fixes.
- Preview distante : non publiée dans cette intervention. Aucune URL de preview ni validation cliente acquise.
- Publication : conditionnée à #24 pour l’activation de `info@rizzo-michiels.be`, aux destinataires Netlify confirmés, à la recette CMS et à la validation des textes FR/EN/IT/NL. Aucun contrôle de production ni réservation réelle effectué. Le ticket reste ouvert.

## Résultats locaux du 14 septembre 2026

- `npm run build` : 72 pages générées, 0 erreur, 0 avertissement, 43 suggestions Astro.
- Suite finale sur le build dédié : `BASE_URL=http://127.0.0.1:4322 npx playwright test --workers=3` — **227 réussis, 5 ignorés**, aucun échec ni test instable (41,5 s). Les cinq exclusions concernent les scénarios desktop exécutés dans le projet mobile.
- Recette de modification/reconstruction : **8 tests réussis**, puis sources restaurées et build reconstruit.
- Captures examinées : `/tmp/issue19-fr-desktop.png` et `/tmp/issue19-nl-mobile.png`. Vérification des libellés NL et du nom d’Arnaud, absence de débordement horizontal, formulaire et menu ouverts.
- Améliorations visuelles demandées pendant la recette : icônes décoratives, cartes équilibrées, menus avec séparateurs, contrastes au survol, respect des préférences de mouvement réduit ; ombre du formulaire diffuse, bordure légère et espacement accru.
- Les essais intermédiaires ont révélé une fixture calendrier mal encodée, un serveur déjà présent sur 4321 et une interaction de test mobile fragile. La suite finale utilise la preview dédiée 4322, une réponse calendrier simulée sans ambiguïté d’encodage, et ouvre directement le menu footer au toucher après chargement des polices.

## Standards

Revue séparée : utilisation de `Picture`, centralisation des substitutions légales sans mutation de collection, correction du contraste des liens au survol. Aucun constat bloquant restant après correction. Les chevrons du footer sont contenus dans leur propre résumé.

## Spec

Revue séparée : adresse anglaise centralisée, aucun écart fonctionnel local restant identifié. L’acceptation globale reste partielle : édition Decap réelle, preview distante, réception Netlify/email et arbitrages/validation cliente ne sont pas prouvés. Aucune clôture automatique du ticket.

### Ajustement visuel complémentaire

À la demande de Guillaume : titre au-dessus des actions, descriptions supprimées du rendu et de Decap dans les quatre langues, cartes compactes sans hauteur de 156 px. Illustration réservée au desktop pour raccourcir le parcours mobile. Build et huit tests de menus multilingues vérifiés.

### Contacts individuels et footer — ajustement demandé

Guillaume a demandé de réintroduire l’email général dans le footer : cette décision remplace ici la consigne initiale « adresse seule ». Adresse et `info@rizzo-michiels.be` restent centralisés ; les menus des téléphones individuels ne reviennent pas dans le footer. La condition d’activation de l’email avant publication reste applicable.

Sur les profils, téléphone/email/WhatsApp/LinkedIn sont regroupés dans `MemberContactCard`, une grille à deux colonnes sur desktop et une sur mobile, avec icônes décoratives et omissions dérivées des coordonnées disponibles. Les cartes de la bannière conservent leurs arrondis au survol ; deux tracés fins habillent l’illustration.

Build final réussi. Vérification ciblée : 89 tests réussis et un test formulaire Safari réussi au retry ; recontrôle indépendant sans retry des 12 parcours individuels/formulaire entièrement réussi. Captures desktop/mobile de la carte et du survol inspectées ; email mobile sans retour à la ligne artificiel.
