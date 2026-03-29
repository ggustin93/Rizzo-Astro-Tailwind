# troubleshoot.md

**Dernière mise à jour :** 2026-03-29

Référence des incidents connus, causes racines et correctifs appliqués sur le site rizzo-michiels.be (Astro 5.9.0 / Netlify / Decap CMS, trilingue FR/EN/IT).

---

## Incidents résolus et en cours

### Incident 1 — Redirections 301 cross-domain Netlify silencieuses ✅ Résolu

**Symptôme**
Après configuration de `rizzo-michiels.be` comme domaine principal et `crizzo-avocate.be` comme alias dans Netlify Dashboard, les redirections 301 vers le nouveau domaine ne se déclenchaient pas. `crizzo-avocate.be` continuait de servir le contenu (HTTP 200).

**Cause racine**
Le redirect automatique alias → primary de Netlify est un comportement CDN-edge qui ne se déclenche que si les deux domaines sont sur Netlify DNS. `rizzo-michiels.be` utilise un A record Infomaniak externe (`75.2.60.5`) sans badge "Netlify DNS" — le CDN ne reconnaît pas les deux domaines comme appartenant au même projet et ignore le redirect automatique.

**Correctif appliqué**
Ajout de règles explicites dans `netlify.toml`, placées avant toutes les autres règles `[[redirects]]` :

```toml
[[redirects]]
  from   = "https://crizzo-avocate.be/*"
  to     = "https://rizzo-michiels.be/:splat"
  status = 301
  force  = true

[[redirects]]
  from   = "http://crizzo-avocate.be/*"
  to     = "https://rizzo-michiels.be/:splat"
  status = 301
  force  = true
```

**Note sur la chaîne HTTP**
La règle `http://` est partiellement interceptée par le redirect HTTP → HTTPS automatique de Netlify (appliqué avant l'évaluation de `netlify.toml`). La chaîne réelle est : `http://crizzo-avocate.be/` → `https://crizzo-avocate.be/` → `https://rizzo-michiels.be/`. Les navigateurs et robots suivent cette chaîne normalement.

**Vérification**
`./scripts/run-migration-tests.sh` → 30/30 PASS (29/03/2026)

---

### Incident 2 — Google Search Console "Changement d'adresse" : validation échoue ⚠️ Surveillance

**Symptôme**
GSC affiche "Impossible de récupérer la page" pour `http://crizzo-avocate.be/` et pour les URLs `https://crizzo-avocate.be/fr/`, `/en/equipe/stephanie-michiels/`, `/fr/`, `/en/`, `/it/`.

**Cause racine identifiée**
Double chaîne de redirects pour les requêtes HTTP entrantes :

1. `http://crizzo-avocate.be/` → `https://crizzo-avocate.be/` (redirect HTTP → HTTPS Netlify, couche basse, avant `netlify.toml`)
2. `https://crizzo-avocate.be/` → `https://rizzo-michiels.be/` (règle `netlify.toml`)
3. `https://rizzo-michiels.be/` → `/fr/` (redirect racine Astro)

L'outil GSC "Changement d'adresse" attend que `http://crizzo-avocate.be/` retourne directement un 301 vers le nouveau domaine. La chaîne intermédiaire peut perturber la validation automatique.

**Hypothèse alternative**
GSC peut tester des URLs mises en cache avant le déploiement des nouvelles règles (29/03/2026). Relancer la validation 24 h après le déploiement avant de conclure à un problème structurel.

**Cause SSL exclue**
Le certificat SSL de `crizzo-avocate.be` est valide et couvre les SANs : `crizzo-avocate.be`, `*.crizzo-avocate.be`, `rizzo-michiels.be`, `www.rizzo-michiels.be`.

**Solution recommandée à long terme : migration vers Netlify DNS**
Avantages : certificat SSL entièrement géré par Netlify, redirects automatiques sans règles `netlify.toml`, performances CDN optimales (routing intelligent vs A record statique), résolution définitive du problème GSC.

Étapes de migration :
1. Netlify Dashboard → Domain settings → `rizzo-michiels.be` → "Set up Netlify DNS" → noter les 4 nameservers
2. Infomaniak → Zone DNS `rizzo-michiels.be` → remplacer les nameservers
3. Attendre la propagation DNS (24 à 48 h)
4. Netlify reprovisionne le certificat SSL automatiquement
5. Relancer `./scripts/run-migration-tests.sh` et la validation GSC "Changement d'adresse"

**Action immédiate**
Relancer la validation GSC 24 h après le déploiement du 29/03/2026. Si toujours en échec, passer à la migration Netlify DNS.

---

### Incident 3 — Fallback og:image pointant vers une preview Netlify expirée ✅ Résolu

**Symptôme**
Trois pages (`contact.astro`, `equipe.astro`, `contact/success.astro`) avaient un fallback `og:image` hardcodé vers une URL de déploiement preview Netlify expirée (`v5--crizzo.netlify.app/_astro/logo_crizzo_calli3...`).

**Correctif appliqué**
Remplacement par `/default-social-image.jpg` (commit `29decdef`).

**Règle à retenir**
Ne jamais hardcoder d'URLs de preview Netlify (`xxxx--project.netlify.app`) dans le code source. Toujours utiliser des chemins relatifs (`/default-social-image.jpg`) ou la variable `siteUrl` issue de `site-config.yml`.

---

### Incident 4 — Décalage DNS : rizzo-michiels.be sur A record externe ⚠️ Surveillance

**Situation actuelle**
- `rizzo-michiels.be` → A record Infomaniak `75.2.60.5` (load balancer Netlify, sans badge Netlify DNS)
- `crizzo-avocate.be` → Netlify DNS actif (alias dans Netlify)

**Risques identifiés**
- Renouvellement SSL potentiellement moins fiable sans Netlify DNS
- Redirects automatiques alias → primary non fonctionnels (contournés par `netlify.toml`)
- Performances CDN légèrement sous-optimales (A record statique vs routing intelligent Netlify DNS)

**Action recommandée**
Migrer `rizzo-michiels.be` vers Netlify DNS (voir les étapes dans l'Incident 2).

---

## Pièges récurrents

### Decap CMS — configuration de branche

Le fichier `public/admin/config.yml` (ligne 3) définit la branche Git lue par Decap CMS. Toujours revenir à `branch: main` avant de merger en production. En développement sur une feature branch, pointer temporairement vers cette branche pour permettre l'édition de contenu.

### Icônes Feather — correspondance avec l'iconMap

Les clés d'icônes dans les collections YAML (`employeurs.yml`, `europeennes.yml`) doivent correspondre exactement aux clés définies dans l'`iconMap` du fichier `.astro` correspondant. Un écart provoque un rendu silencieux sans icône et sans erreur de build. Ajouter un null guard : `{IconComponent && <IconComponent />}`.

### Informations de contact — source unique

Toutes les informations de contact (email, téléphone, lien Cal.com) doivent être lues exclusivement depuis `src/content/config/site-config.yml` via `getContactInfo()`. Ne jamais dupliquer ces données dans des composants individuels — toute divergence entre composants est un signe de non-respect de cette règle.

### Ordre des règles de redirection dans netlify.toml

Les règles `[[redirects]]` cross-domain (ancien domaine → nouveau domaine) doivent être placées en tête du fichier `netlify.toml`, avant les règles de routing interne. Netlify évalue les règles dans l'ordre et s'arrête à la première correspondance.
