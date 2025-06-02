# Vérifications SEO avec cURL

Ce fichier répertorie les commandes `curl` utiles pour vérifier rapidement certains paramètres SEO techniques d'une page web. Remplacez `https://crizzo-avocate.be/fr/` par l'URL que vous souhaitez tester.

## 1. Vérifier les En-têtes HTTP (Cache, X-Robots-Tag)

Cette commande affiche les en-têtes HTTP renvoyés par le serveur.

```bash
curl -I https://crizzo-avocate.be/fr/
```

**À rechercher :**

*   `Cache-Control:` : Indique comment la page doit être mise en cache (ex: `no-store`, `max-age=0, must-revalidate`).
*   `Age:` : Durée (en secondes) depuis laquelle la réponse est en cache sur le CDN. Un âge élevé peut indiquer un problème de cache.
*   `X-Robots-Tag:` : Directive d'indexation via en-tête (ex: `noindex`, `nofollow`). Si présent, il prime sur la balise meta robots.

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK
*   `Cache-Control: public, max-age=0, must-revalidate` (La directive `no-store` du fichier `_headers` n'est pas appliquée, mais c'est acceptable).
*   `Age: 0`
*   `X-Robots-Tag:` Absent.

## 2. Vérifier la Balise Meta Robots dans le HTML

### 2a. Vérification Standard

Cette commande télécharge le HTML et recherche la balise `<meta name="robots">` avec un User-Agent standard.

```bash
curl -s https://crizzo-avocate.be/fr/ | grep -i '<meta name="robots"'
```

**À rechercher :**

*   La présence de la balise.
*   Le contenu de l'attribut `content` (ex: `index, follow`, `noindex, follow`, etc.).

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (`content="index, follow"`).

### 2b. Vérification avec Simulation Googlebot (Débogage)

Utilisez cette commande si Google Search Console (test en direct) signale une balise `noindex` alors que la vérification standard (2a) semble correcte. Cela permet de voir si le serveur renvoie un contenu différent à Googlebot.

```bash
curl -s -A 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' https://crizzo-avocate.be/fr/ | grep -i '<meta name="robots"'
```

**À rechercher :**

*   Si la balise `<meta name="robots">` renvoyée est différente de celle du test standard.
*   La présence de plusieurs balises `<meta name="robots">` (problème de duplication).

**Résultat Historique (22/04/2025 pour crizzo-avocate.be/fr/) :** ❗ ERREUR TROUVÉE
*   Le test initial révélait **trois** balises `<meta name="robots">`, dont deux avec `content="noindex, nofollow"`, causant le blocage GSC.
*   ✅ **CORRECTION APPLIQUÉE (fix(seo)) :** La génération de la balise a été centralisée dans `SEO.astro`.
*   **Résultat ATTENDU (après déploiement du fix) :** Une seule balise `<meta name="robots" content="index, follow">` doit être retournée par cette commande.

## 3. Vérifier la Balise Canonique dans le HTML

Cette commande télécharge le HTML et recherche la balise `<link rel="canonical">`.

```bash
curl -s https://crizzo-avocate.be/fr/ | grep -i '<link rel="canonical"'
```

**À rechercher :**

*   La présence de la balise.
*   L'URL spécifiée dans l'attribut `href`. Elle doit correspondre à l'URL préférée pour cette page.

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (`href="https://crizzo-avocate.be/fr/"`).

## 4. Vérifier les Balises Hreflang dans le HTML

Cette commande télécharge le HTML et recherche les balises `<link rel="alternate" hreflang="...">`. Utile pour les sites multilingues.

```bash
curl -s https://crizzo-avocate.be/fr/ | grep -i '<link rel="alternate" hreflang'
```

**À rechercher :**

*   La présence des balises pour chaque version linguistique.
*   La correction des codes de langue (`hreflang`) et des URL (`href`).

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (Balises présentes et correctes pour `fr`, `en`, `it`).

## 5. Vérifier la Balise Titre (`<title>`) dans le HTML

Cette commande télécharge le HTML et recherche la balise `<title>`.

```bash
curl -s https://crizzo-avocate.be/fr/ | grep -i '<title>'
```

**À rechercher :**

*   La présence de la balise.
*   Le contenu du titre, qui est crucial pour le SEO.

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (Titre pertinent : "Christine Rizzo | Avocate en droit du travail à Bruxelles").

## 6. Vérifier la Balise Meta Description dans le HTML

Cette commande télécharge le HTML et recherche la balise `<meta name="description">`.

```bash
curl -s https://crizzo-avocate.be/fr/ | grep -i '<meta name="description"'
```

**À rechercher :**

*   La présence de la balise.
*   Le contenu de la description, important pour l'incitation au clic dans les résultats de recherche.

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (Description pertinente présente).

## 7. Vérifier le fichier `robots.txt`

Cette commande télécharge et affiche le contenu du fichier `robots.txt` à la racine du site.

```bash
curl https://crizzo-avocate.be/robots.txt | cat
```

**À rechercher :**

*   `User-agent: *` : S'applique à tous les robots.
*   `Allow: /` (ou des `Allow` spécifiques) : Autorise l'exploration des chemins indiqués.
*   Absence de `Disallow: /` qui bloquerait tout le site.
*   `Sitemap: <URL_du_sitemap>` : Indique l'emplacement du sitemap.

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (`User-agent: *`, `Allow: /`, `Sitemap: .../sitemap-index.xml`).

## 8. Vérifier le fichier `sitemap.xml`

Cette commande télécharge et affiche le contenu du fichier sitemap (souvent `sitemap.xml` ou `sitemap-index.xml` pour Astro).

```bash
# D'abord, vérifier l'index (courant avec Astro)
curl https://crizzo-avocate.be/sitemap-index.xml | cat

# Ensuite, vérifier un sitemap spécifique listé dans l'index
curl https://crizzo-avocate.be/sitemap-0.xml | cat
```

**À rechercher :**

*   L'existence des fichiers (pas d'erreur 404).
*   Une structure XML valide (`<urlset>`, `<url>`, `<loc>`).
*   Que les URL listées correspondent bien aux pages du site à indexer.

**Résultat du test (22/04/2025 pour crizzo-avocate.be/fr/) :** ✅ OK (Fichiers `sitemap-index.xml` et `sitemap-0.xml` existent, structure XML valide).
*   *Remarque mineure :* Le sitemap liste des URL de blog (/blog/, /fr/blog/...) qui sont actuellement désactivées sur le site. À nettoyer éventuellement.

---

## Checklist des Tests Post-Déploiement (Après Correction `fix(seo)`) 

Utilisez ce tableau pour vérifier que la correction du problème `meta robots` est effective après déploiement.

| Test Area                 | Outil / Commande (Exemple)                                                     | Résultat Attendu                                                                 | Statut (Post-Déploiement) |
| :------------------------ | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :------------------------ |
| **1. Meta Robots (Fix)**  | `curl -s -A 'Googlebot...' ... \| grep 'meta name="robots"'`                 | **Une seule** ligne : `<meta name="robots" content="index, follow">`            | ❗ (3 balises toujours)  |
| **2. GSC - Test URL**     | Google Search Console > Inspection URL > "Tester l'URL en direct"              | "L'URL est disponible pour Google", Indexation autorisée : Oui                     | N/A (Test Manuel GSC Requis) |
| **3. GSC - Indexation**   | Google Search Console > Inspection URL > "Demander une indexation"             | (Action à effectuer si Test 2 est OK)                                            | N/A (Test Manuel GSC Requis) |
| 4. En-têtes HTTP          | `curl -I https://crizzo-avocate.be/fr/`                                        | `Cache-Control: ...`, Pas de `X-Robots-Tag: noindex`.                            | ✅                        |
| 5. Meta Robots (Standard) | `curl -s https://crizzo-avocate.be/fr/ \| grep 'meta name="robots"'`          | Une seule ligne : `<meta name="robots" content="index, follow">`                 | ✅                        |
| 6. Balise Canonique       | `curl -s ... \| grep 'link rel="canonical"'`                                   | `href="https://crizzo-avocate.be/fr/"`                                           | ✅                        |
| 7. `robots.txt`           | `curl https://crizzo-avocate.be/robots.txt`                                    | `Allow: /`, Sitemap référencé.                                                   | ✅                        |
| 8. Sitemap                | `curl .../sitemap-index.xml` & `curl .../sitemap-0.xml`                       | Fichiers accessibles (200 OK), structure XML valide.                             | ✅                        |

**Instructions :**

1.  Déployer la branche contenant le commit `fix(seo): Resolve duplicated meta robots tag...`.
2.  Attendre quelques minutes après le déploiement.
3.  Exécuter les tests 1, 4, 5, 6, 7, 8.
4.  Si le test 1 est OK, effectuer le test 2 dans Google Search Console.
5.  Si le test 2 est OK, effectuer l'action 3 dans Google Search Console.
6.  Remplir la colonne "Statut" avec ✅ ou ❗. 

---

## Solution définitive au problème d'indexation (22/04/2025)

Malgré les corrections initiales, un test avec l'user-agent de Googlebot (`curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"`) a révélé que le problème persistait avec **3 balises meta robots**:

```html
<!-- Contrôle de l'indexation basé sur la configuration du site -->
<meta name="robots" content="noindex, nofollow">
<meta name="robots" content="index, follow">
<meta name="robots" content="noindex, nofollow">
```

### Solution radicale implémentée

Pour résoudre définitivement ce problème, une approche radicale a été mise en place:

1. **Hardcoding de l'indexation dans le code source**: 
   ```astro
   <!-- Dans BaseLayout.astro -->
   <SEO
       title={title}
       description={description}
       canonical={finalCanonical}
       image={image}
       keywords={keywords}
       type={type}
       lang={currentLang}
       allowIndexing={true} <!-- Valeur forcée à true -->
   />
   ```

2. **Suppression de l'option dans la configuration**:
   - Retrait du paramètre `allowIndexing` du fichier `site-config.yml`
   - Suppression de l'option dans l'interface du CMS (`config.yml`)

3. **Ajout de headers HTTP pour forcer l'indexation**:
   ```toml
   # Dans netlify.toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Robots-Tag = "index, follow"
   ```

   ```
   # Dans public/_headers
   /*
     X-Robots-Tag: index, follow
   ```

4. **Création d'un fichier de test** `robots-check.txt` pour vérification manuelle d'indexation.

### Avantages de cette approche

- **Robustesse**: Même si la configuration est modifiée, le site reste indexable
- **Simplicité**: Plus d'option dans le CMS = moins de risque d'erreur
- **Redondance**: Protection à plusieurs niveaux (code + headers HTTP)

### Tests après déploiement

Après déploiement de ces modifications, il est recommandé d'effectuer les tests suivants:

1. Vérifier avec `curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://crizzo-avocate.be/fr/ | grep -i '<meta name="robots"'` qu'une seule balise meta robots est présente avec `content="index, follow"`

2. Utiliser Google Search Console pour "Tester l'URL en direct" et vérifier que l'indexation est autorisée

3. Demander une nouvelle indexation via GSC si le test précédent est positif

La mise en œuvre de cette solution a fait l'objet d'un commit dédié: `fix(seo): Résolution définitive du problème d'indexation Google`. 