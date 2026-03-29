# Checklist — Demande Christine Rizzo (14 mars 2026)

**Branche** : `main` (feature branch mergée le 28/03/2026)
**Deadline** : 8 avril 2026
**Dernière mise à jour** : 28 mars 2026

---

## R4 — Supprimer bloc Honoraires de la homepage

- [x] Bloc intro honoraires supprimé de `index.astro`
- [x] Import `CheckCircle` nettoyé (plus utilisé)
- [x] YAML `honoraires` conservé dans `home.yml` (CMS le référence)
- [x] Page `/honoraires` toujours accessible via nav header
- [x] Build passe sans erreur

## R2 — Nouvelle section Institutions européennes

### Collection de contenu
- [x] `src/content/europeennes/europeennes.yml` créé (FR/EN/IT)
- [x] Contenu cloné depuis travailleurs comme base
- [x] SEO metadata renseigné (title, description, keywords) pour 3 langues
- [x] Collection `europeennes` enregistrée dans `src/content/config.ts`

### Page service
- [x] `src/pages/[...lang]/services/europeennes.astro` créé
- [x] Couleur `bg-europeenne` appliquée
- [x] `iconMap` aligné avec les noms d'icônes YAML (`BriefCase`, `Shield`, `Handshake`)
- [x] Null guard sur `IconComponent` (`{IconComponent && ...}`)
- [x] Page fonctionne en FR, EN, IT

### Couleurs Tailwind
- [x] `europeenne: '#2B6CB0'` ajouté dans `tailwind.config.js`
- [x] `light-europeenne: '#90CDF4'` ajouté

### Homepage
- [x] Bloc `europeennes` ajouté dans `home.yml` pour FR/EN/IT
- [x] Layout passé de `flex md:w-1/2` à `grid grid-cols-1 md:grid-cols-3`
- [x] Ordre : Employeurs (1er) > Travailleurs (2ème) > Européennes (3ème)
- [x] Chaque bloc a sa couleur distincte

### Navigation
- [x] FR : `INSTITUTIONS EUROPÉENNES` → `/fr/services/europeennes`
- [x] EN : `EUROPEAN INSTITUTIONS` → `/en/services/europeennes`
- [x] IT : `ISTITUZIONI EUROPEE` → `/it/services/europeennes`
- [x] Ordre dropdown : Employeurs > Travailleurs > Européennes

### Decap CMS
- [x] Collection `europeennes` ajoutée dans `public/admin/config.yml`
- [x] Champs identiques au pattern `employeurs`

### Nettoyage
- [x] Imports inutilisés supprimés
- [x] Variables non référencées supprimées
- [x] Commentaires obsolètes nettoyés

## R5 — Nouveau logo

- [x] Nouveau logo SVG vectorisé (`logo-rizzo-michiels.svg`)
- [x] Contenu de `logo_crizzo_calli3.svg` remplacé par le nouveau logo (même nom de fichier → 0 imports à modifier)
- [x] Favicons régénérés depuis le nouveau logo (favicon.ico multi-size, 16x16, 32x32, apple-touch-icon 180px, android-chrome 192/512)
- [x] `site.webmanifest` mis à jour : nom "Rizzo & Michiels - Avocates", theme_color `#faf5f0`
- [x] Image de partage social mise à jour : `default-social-image.jpg` et `default-social-image.png` régénérés avec le nouveau logo "rm." (1200×630, fond blanc)

## R3 — Mise à jour pages légales

- [x] Config CMS vérifiée — les 3 pages légales sont éditables via `/admin/` (sections title + markdown FR/EN/IT)
- [x] Placeholders `%%ADDRESS%%`, `%%EMAIL%%`, `%%PHONE%%` auto-remplacés depuis `site-config.yml`
- [x] ✅ Christine a fourni les nouvelles infos légales (mail 28/03/2026)

### Mentions légales (`notice.yml`) — infos reçues de Christine
- [x] Section **Éditeur** (FR/EN/IT) : `Rizzo & MICHIELS SRL`, deux téléphones (`+32 488 40 45 49 - +32 498 50 29 01`), n° entreprise `1034.645.352`
- [x] Section **Contact** (FR/EN/IT) : email → `rizzomichiels@gmail.com`
- [x] `%%PHONE%%` et `%%EMAIL%%` remplacés par valeurs en dur (infos SRL ≠ infos avocat individuel)
- [x] `%%ADDRESS%%` conservé (adresse identique)
- [x] `notice.yml` : 12 occurrences `crizzo-avocate.be` → corrigé dans R1

### Autres pages légales
- [x] `src/content/legal/privacy.yml` : références domaine → corrigé dans R1
- [x] `src/content/legal-info/legal-info.yml` : entité mise à jour vers SRL (FR: "Dénomination : Rizzo & MICHIELS SRL", EN: "Name:", IT: "Denominazione:") + n° entreprise `1034.645.352` remplace `0829.577.949` (FR/EN/IT)

## R1 — Migration de domaine

**Christine a validé** — feu vert pour la migration (28/03/2026)

### Prérequis
- [x] Domaine `rizzo-michiels.be` acheté via Infomaniak
- [x] DNS configuré chez Infomaniak : A record `75.2.60.5` + CNAME `www` → `crizzo-pwablo-dev.netlify.app`
- [ ] ⏳ DNS propagation en cours — vérifier sur dnschecker.org
- [ ] ⏳ Netlify : domaine `rizzo-michiels.be` en "Pending DNS verification"

### Fichiers à modifier (~19 fichiers, ~51 occurrences)

#### Config & Layout
- [x] `astro.config.mjs` : siteUrl → `https://rizzo-michiels.be`
- [x] `site-config.yml` : siteUrl → `https://rizzo-michiels.be`
- [x] `BaseLayout.astro` : URL fallback → `https://rizzo-michiels.be`
- [x] `public/robots.txt` : Sitemap URL
- [x] `public/admin/config.yml` : 2 occurrences + **branch revertie → `main`**

#### Contenu
- [x] `notice.yml` : 12 occurrences `crizzo-avocate.be` → `rizzo-michiels.be`
- [x] `privacy.yml` : 9 occurrences (FR/EN/IT)
- [x] `navigation.yml` : 3x ecoDesignUrl
- [x] `europeennes.yml` : 3x SEO images
- [x] `home.yml` : 3x SEO images

#### Composants
- [x] `signature.astro` : URL + texte lien
- [x] `Footer.astro` : ecoDesignUrl fallback

#### Scripts SEO
- [x] `scripts/submit_indexnow.sh` : HOST, KEY_LOCATION_URL, SITEMAP_URL
- [x] `scripts/run-seo-tests.sh` : BASE_URL
- [x] `scripts/run-bot-tests.sh` : commentaires exemples
- [x] `scripts/run-dns-tests.sh` : commentaire exemple
- [x] `scripts/tests/bing_index_check.sh` : URL + DOMAIN
- [x] `scripts/tests/seo-curl-tests.md` : exemples curl

#### Autre
- [ ] Fichier de vérification IndexNow (garder ou régénérer pour nouveau domaine)

### Vérification post-remplacement
- [x] `npm run build` passe (50 pages, 3.26s)
- [x] `grep -r "crizzo-avocate" src/ public/ scripts/ astro.config.mjs` → 0 résultats
- [x] `dist/` généré sans aucune occurrence de l'ancien domaine
- [x] `dist/sitemap-index.xml` contient `rizzo-michiels.be`

### SEO — Étapes critiques post-déploiement

#### Immédiat (jour J)
- [x] Netlify : `rizzo-michiels.be` en domaine principal, `crizzo-avocate.be` en alias — fait le 28/03/2026
- [x] `netlify.toml` : redirections cross-domain explicites ajoutées (`https://crizzo-avocate.be/*` → `https://rizzo-michiels.be/:splat`) — commit `efec6a95` (29/03/2026)
  - ⚠️ Les redirections automatiques Netlify ne fonctionnaient PAS : `rizzo-michiels.be` utilise un A record Infomaniak externe (pas Netlify DNS), donc le CDN-edge redirect silencieux ne se déclenche pas. Solution : règles `netlify.toml` avec syntaxe domaine complet.
- [x] Vérifier 301 : `./scripts/run-migration-tests.sh` → **30/30 PASS** (29/03/2026)
- [x] `./scripts/submit_indexnow.sh -s` — **202 Accepted**, 36 URLs soumises à Bing/Yandex (29/03/2026)
- [ ] Google Search Console : ajouter et vérifier propriété `rizzo-michiels.be`
- [ ] Google Search Console : **outil "Changement d'adresse"** sur `crizzo-avocate.be` → `rizzo-michiels.be` (301s maintenant actifs → validation possible)
- [ ] GSC : soumettre sitemap `https://rizzo-michiels.be/sitemap-index.xml`
- [ ] GSC : "Inspection d'URL" sur les 5-6 pages clés pour demander indexation

#### Bing Webmaster Tools — étapes
1. [ ] Aller sur https://www.bing.com/webmasters
2. [ ] Se connecter (compte Microsoft)
3. [ ] **Ajouter le site** → `https://rizzo-michiels.be`
4. [ ] **Méthode de vérification** : choisir "XML file" ou "CNAME" (le plus simple : ajouter le CNAME dans le DNS Infomaniak)
5. [ ] Une fois vérifié → **Sitemaps** → Soumettre `https://rizzo-michiels.be/sitemap-index.xml`
6. [ ] **Import depuis GSC** (optionnel) : Bing propose d'importer les données depuis Google Search Console — accepter si proposé
7. [x] ~~`./scripts/submit_indexnow.sh -s`~~ — **déjà fait** (29/03/2026, 36 URLs, HTTP 202)
8. [ ] Vérifier dans **URL Inspection** que les pages clés sont indexées

#### Semaine 1
- [ ] Profils externes mis à jour : Google Business Profile, LinkedIn (Christine + Stephanie), annuaires barreau
- [ ] Profil Website Carbon créé pour `rizzo-michiels.be`
- [ ] Vérifier dans GSC que les pages commencent à être indexées sous le nouveau domaine
- [ ] Re-exécuter `./scripts/run-migration-tests.sh` pour confirmer que les 301 tiennent

#### Monitoring (2-4 semaines)
- [ ] `./scripts/run-migration-tests.sh` → 30/30 pass confirmé
- [ ] Surveiller GSC pour erreurs 404 ou baisses de trafic
- [ ] Vérifier que les 301 de l'ancien domaine restent fonctionnels
- [ ] ⚠️ **Ne PAS supprimer `crizzo-avocate.be`** pendant 6-12 mois minimum (les 301 transfèrent le « link juice » SEO)

---

## SEO Audit (28 mars 2026)

**État global : Bon** — Fondamentaux SEO solides.

### Corrigé
- [x] Fallback `og:image` sur 3 pages (`contact`, `equipe`, `contact/success`) pointait vers ancien domaine Netlify preview (`v5--crizzo.netlify.app`) → remplacé par `/default-social-image.jpg`

### Confirmé OK
- [x] Title tags uniques par page/langue, < 60 chars
- [x] Meta descriptions 150-160 chars, pertinentes
- [x] H1 unique par page, contient keyword principal
- [x] Canonical tags auto-générés
- [x] Hreflang fr/en/it + x-default (français)
- [x] OG + Twitter Card tags complets
- [x] robots.txt : Disallow /admin/, sitemap référencé
- [x] Sitemap : filtrage intelligent (exclut legal, credits, blog posts individuels — intentionnel)
- [x] Redirections 301 profil→equipe
- [x] Cache headers assets /_astro/* 1 an immutable
- [x] Migration domaine dans src/ : 0 occurrence `crizzo-avocate`
- [x] SEO metadata europeennes renseigné (title, description, keywords) pour 3 langues
- [x] Keywords pertinents et variés par page service
- [x] Images avec alt text, width/height, lazy loading

### Hors scope (tâches futures)
- [ ] 🟡 **JSON-LD structured data** — Aucun markup schema.org (Organization, LocalBusiness, BreadcrumbList, LegalService). Impact : pas de rich snippets SERP, visibilité locale réduite.
- [ ] 🟢 Image `illustrationServices` sur homepage : attribut `height` manquant (risque CLS mineur)

---

## Validation technique

- [x] `npm run build` réussit (50 pages, ~3s)
- [x] Tests E2E Playwright créés (`tests/european-institutions.spec.ts`)
- [x] CHANGELOG ajouté et à jour (commit `691019a4`)
- [x] Preview déployée via Netlify CLI (draft deploy)
- [x] **URL preview** : https://69b95f3213124811d3ffa1c8--crizzo-pwablo-dev.netlify.app
- [x] Christine valide la preview (homepage 3 colonnes, page europeennes, logo, favicons) — validé 28/03/2026
- [x] Branche `feature/european-institutions` mergée dans `main` et pushée (28/03/2026)
- [x] Code review sénior passé — aucun bloqueur (H2 : `legal-info.yml` entité SRL à discuter avec Christine)
- [x] Redirections 301 cross-domain — 30/30 PASS (29/03/2026)
- [x] IndexNow soumis — 36 URLs, HTTP 202 (29/03/2026)
- [x] `run-seo-tests.sh` — tous les tests passent (canonical, hreflang, robots, 200)
- [ ] Responsive mobile vérifié (3 blocs empilés)

## Ordre d'exécution

```
1. ✅ R3 — Mettre à jour notice.yml (mentions légales SRL)
2. ✅ R1 — Remplacer crizzo-avocate.be → rizzo-michiels.be (17 fichiers, 51 occurrences)
3. ✅ Revertir public/admin/config.yml branch → main
4. ✅ npm run build + grep vérification → 0 occurrences ancien domaine
5. ✅ feature/european-institutions → main (merge + push 28/03/2026)
6. ✅ netlify.toml : cross-domain 301 explicites (commit efec6a95, 29/03/2026)
7. ✅ Migration vérifiée 30/30 + IndexNow soumis (29/03/2026)
8. ⏳ (Manuel) GSC : Changement d'adresse + sitemap + URL Inspection
9. ⏳ (Manuel) Bing Webmaster Tools : vérification propriété + sitemap
```

## Git — Commits sur `main`

```
691019a4 Update CHANGELOG with domain migration, legal notice, and SEO fixes
6e22dfe1 Merge feature/european-institutions: EU section, logo, domain migration, legal update
29decdef Fix broken og:image fallback on contact and equipe pages
fc0e5d31 Migrate domain from crizzo-avocate.be to rizzo-michiels.be
ed0d72dc Update legal notice with SRL entity info (Rizzo & MICHIELS SRL)
0df8c1b1 Harmonize SEO titles and descriptions across all pages
```

## Points d'attention

1. **Descriptions `europeennes` vides** dans `home.yml` — Christine doit les remplir via le CMS
2. **Couleur `#2B6CB0`** (bleu européen) — à confirmer avec Christine
3. ~~**CMS branch temporaire**~~ ✅ `public/admin/config.yml` revertie vers `branch: main`
4. ~~**`default-social-image.png`**~~ ✅ Fait
5. ~~**Redirections 301**~~ ✅ **30/30 PASS** (29/03/2026) — `netlify.toml` avec règles cross-domain explicites. Les redirections automatiques Netlify ne suffisaient pas car `rizzo-michiels.be` utilise un A record externe (Infomaniak), pas Netlify DNS.
6. ~~**`legal-info.yml`**~~ ✅ Mis à jour avec entité SRL + n° entreprise `1034.645.352`
