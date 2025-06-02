
## **Product Requirements Document: Site Web Professionnel Christine Rizzo, Avocate**

**Date:** 2 juin 2025
**Version:** 1.0
**Auteur:** AI (basé sur l'analyse Repomix)

---

### 1. Introduction

Ce document décrit les fonctionnalités et les exigences du site web professionnel de Maître Christine Rizzo, avocate spécialisée en droit du travail à Bruxelles. Le site sert de plateforme d'information, de vitrine d'expertise et de point de contact principal pour les clients potentiels et existants. Il est conçu pour être multilingue, performant, optimisé pour le SEO et facilement administrable via un CMS headless.

### 2. Objectifs du Produit

*   **Présenter l'expertise professionnelle** de Christine Rizzo en droit du travail.
*   **Attirer et informer** les clients potentiels (travailleurs et employeurs).
*   **Faciliter la prise de contact** et la planification de rendez-vous.
*   **Partager des informations juridiques** pertinentes via une section blog.
*   **Construire et renforcer** l'image de marque professionnelle de Christine Rizzo.
*   **Assurer une visibilité optimale** sur les moteurs de recherche (SEO).

### 3. Public Cible

*   **Travailleurs** cherchant des conseils ou une représentation en droit du travail.
*   **Employeurs/Entreprises** (équipes RH, dirigeants) nécessitant une expertise en droit social.
*   Individus recherchant des informations générales sur le droit du travail belge.
*   Audience multilingue : francophone, anglophone et italophone.

### 4. Fonctionnalités Clés

#### 4.1. Présentation du Contenu

1.  **Pages Principales:**
    *   **Accueil:** Présentation générale, accroche, accès rapide aux sections clés.
    *   **Services (dynamiques):**
        *   Page dédiée "Pour les Travailleurs" (contenu spécifique).
        *   Page dédiée "Pour les Employeurs" (contenu spécifique).
    *   **Profil:** Biographie, parcours, publications, conférences de Christine Rizzo.
    *   **Honoraires:** Détail des structures tarifaires, exemples de forfaits, informations sur l'aide juridique et l'assurance protection juridique. Pages dédiées par type de client (travailleur, employeur).
    *   **Contact:** Multiples moyens de contact (formulaire Cal.com, email, téléphone, WhatsApp, LinkedIn, adresse).
    *   **Blog:** Liste d'articles avec filtres par catégories.
    *   **Articles de Blog Individuels:** Affichage détaillé des articles avec métadonnées (auteur, date, temps de lecture, catégories, points clés).
    *   **Pages Légales:** Mentions Légales, Politique de Confidentialité, Informations Légales & CGV.
    *   **Page 404 Personnalisée:** Guide l'utilisateur en cas d'erreur.
    *   **Page Crédits.**
    *   **Signature Email (page dédiée).**
2.  **Composants Réutilisables:**
    *   **Header:** Navigation principale, logo, sélecteur de langue, bouton de contact.
    *   **Footer:** Plan du site, coordonnées, liens légaux, crédits éco-conception.
    *   **Cartes d'Article:** Affichage standardisé des articles en aperçu.
    *   **Boutons d'Action (CTA):** Cohérence visuelle pour les appels à l'action.
    *   **Composant SEO:** Gestion centralisée des méta-données pour chaque page.
    *   **Sélecteur de Langue:** Permet à l'utilisateur de changer la langue du site.
    *   **Icônes:** Utilisation d'icônes vectorielles pour la clarté visuelle.

#### 4.2. Gestion de Contenu (CMS)

1.  **Interface d'Administration (Decap CMS):** Accessible via `/admin/`.
2.  **Collections Modifiables:**
    *   Page d'accueil.
    *   Page Travailleurs.
    *   Page Employeurs.
    *   Page Profil.
    *   Page Honoraires (général, tarifs employeur, tarifs travailleur).
    *   Pages Légales (Mentions, Confidentialité, Infos Légales).
    *   Articles de Blog (FR, EN, IT) avec champs structurés (titre, date, auteur, miniature, temps de lecture, catégories, description SEO, mots-clés, contenu Markdown).
    *   Configuration du site (visibilité sections, lien Cal.com, SEO global).
    *   Navigation (menus header/footer par langue).
    *   Traductions de l'interface utilisateur (UI) par langue.

#### 4.3. Multilinguisme

1.  **Langues Supportées:** Français (fr), Anglais (en), Italien (it).
2.  **Structure d'URL:** Basée sur des préfixes de langue (ex: `/fr/contact`, `/en/contact`).
3.  **Contenu Traduit:** Toutes les pages principales, articles de blog et éléments d'interface utilisateur sont traduisibles via le CMS.
4.  **Redirections Automatiques:** Basées sur la langue du navigateur (via `netlify.toml`).
5.  **Sélecteur de Langue:** Permet un changement manuel par l'utilisateur.

#### 4.4. Interaction Utilisateur

1.  **Prise de Rendez-vous:** Intégration avec Cal.com (lien configurable via CMS).
2.  **Multiples Points de Contact:** Liens directs pour email, téléphone, WhatsApp, LinkedIn, Google Maps.
3.  **Navigation Claire:** Menus header et footer, liens internes logiques.
4.  **Filtre Catégories Blog:** Permet de trier les articles de blog.

#### 4.5. SEO & Performance

1.  **Optimisation SEO:**
    *   Utilisation du composant `astro-seo` pour les méta-balises (title, description, canonical, OpenGraph, Twitter Cards).
    *   Mots-clés configurables par page/article.
    *   Sitemap XML généré automatiquement (`@astrojs/sitemap`).
    *   Fichier `robots.txt` et en-têtes `X-Robots-Tag` pour directives d'indexation.
    *   Structure d'URL sémantique et multilingue.
2.  **Performance:**
    *   Site statique généré par Astro.
    *   Optimisation des images (Astro Assets avec Sharp, compression Netlify, formats AVIF/WebP).
    *   CSS optimisé via Tailwind CSS.
    *   Préchargement des polices.
    *   Minimisation du JavaScript.
3.  **Accessibilité:**
    *   Focus sur la sémantique HTML.
    *   Attributs ARIA si nécessaire.

#### 4.6. Technique & Administratif

1.  **Framework:** Astro.
2.  **Styling:** Tailwind CSS.
3.  **CMS:** Decap CMS (auto-hébergé).
4.  **Hébergement & Déploiement:** Netlify (déploiement continu depuis Git).
5.  **Build:** Processus de build statique (`astro build`).
6.  **Dépendances:** Gérées via `package.json`.

### 5. Conception et UX

*   Design professionnel, sobre et moderne, reflétant le sérieux du domaine juridique.
*   Interface utilisateur intuitive et facile à naviguer.
*   Responsive design, assurant une expérience optimale sur ordinateurs, tablettes et mobiles.
*   Mise en avant claire des appels à l'action (prise de contact, rendez-vous).
*   Palette de couleurs cohérente (beige, bleu travailleur, bleu employeur, accent jaune).

### 6. Indicateurs de Succès (Exemples)

*   Augmentation du nombre de prises de contact via le site.
*   Nombre de rendez-vous planifiés via l'intégration Cal.com.
*   Classement amélioré sur les moteurs de recherche pour les mots-clés ciblés.
*   Temps passé sur le site et nombre de pages vues.
*   Taux de rebond faible.

### 7. Considérations Futures (Optionnel)

*   Intégration de témoignages clients (si pertinent et gérable via CMS).
*   Section FAQ plus élaborée.
*   Optimisations SEO continues basées sur l'analyse des performances.

