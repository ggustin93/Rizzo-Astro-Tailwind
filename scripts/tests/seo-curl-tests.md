# Guide de Test SEO Technique

Ce document explique comment vérifier les aspects techniques clés du SEO pour ce projet.

## Méthode Recommandée : Utiliser le Script de Test Automatisé

La méthode la plus fiable pour tester le SEO de ce site est d'utiliser le script de test automatisé. Il est conçu pour être robuste et pour éviter les faux négatifs.

**Usage :**
```bash
./scripts/run-seo-tests.sh
```

Ce script vérifie automatiquement les points suivants pour toutes les pages configurées :
*   Le statut HTTP (doit être 200).
*   La présence d'une balise `<meta name="robots" content="index, follow">` unique et correcte.
*   La correspondance de l'URL canonique.
*   La présence des balises `hreflang`.
*   La validité du fichier `robots.txt`.
*   L'accessibilité du `sitemap-index.xml`.

## Méthode Manuelle (Pour Débogage Uniquement)

Les commandes `curl` manuelles peuvent être utiles pour un débogage rapide, mais elles sont **fortement déconseillées** pour des tests de routine. Elles ont historiquement produit des **faux négatifs** en raison de leur incapacité à analyser correctement le code HTML minifié renvoyé par le serveur.

### Le Piège des Commandes `grep` Simples

Les commandes comme `curl ... | grep '<meta name="robots"'` ont échoué car :
1.  Le serveur renvoie le `<head>` sur une seule ligne.
2.  `grep` trouve la première occurrence d'un mot-clé sur cette ligne, même si ce n'est pas dans la bonne balise. Par exemple, il peut confondre la balise `og:image` avec la balise `robots`.

Le script `run-seo-tests.sh` résout ce problème en formatant le HTML avant de l'analyser, ce qui garantit la fiabilité des résultats.

### Exemples de Commandes Manuelles (avec prudence)

Si vous devez absolument effectuer un test manuel, voici quelques exemples.

**1. Vérifier les En-têtes HTTP :**
```bash
curl -I https://rizzo-michiels.be/fr/
```
*À rechercher :* `HTTP/2 200`, `Cache-Control`, absence de `X-Robots-Tag: noindex`.

**2. Vérifier `robots.txt` :**
```bash
curl https://rizzo-michiels.be/robots.txt
```
*À rechercher :* `User-agent: *`, `Allow: /`, et le lien vers le `Sitemap`.

**3. Visualiser le HTML brut (pour inspection manuelle) :**
```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://rizzo-michiels.be/fr/
```

---

*Ce document a été mis à jour pour refléter l'état actuel du projet et les leçons apprises lors de la résolution des problèmes de test SEO.* 