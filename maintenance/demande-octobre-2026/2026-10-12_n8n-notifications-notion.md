# Notification email à chaque demande Notion : n8n auto-hébergé ?

12/10/2026. Investigation, rien n'a été installé ni modifié sur un serveur.

**Besoin** : recevoir un email quand Christine dépose une demande via le formulaire Notion « Retours et demandes du site » (espace Pwablo, plan Free, data source `f3115be8-07d4-4e75-aa9d-b0795cf01562`). Les automatisations Notion qui envoient un email sont payantes.

## TL;DR

- Un VPS Infomaniak existe bien (`83.228.211.126`, Ubuntu 24.04), mais **aucune clé SSH de ce Mac n'y donne accès**. Ressources, Docker, services : inconnus.
- n8n tient sur un petit VPS (300 Mo à 1 Go de RAM au repos avec SQLite). C'est faisable si le VPS a **au moins 2 Go de RAM** (1 Go avec swap, c'est limite).
- **Pour ce seul besoin, n8n est surdimensionné** : un script cron de 30 lignes (sur le VPS) ou un workflow GitHub Actions planifié (zéro serveur) fait le même travail sans application web à exposer, sécuriser et mettre à jour.
- **Recommandation** : si d'autres automatisations sont réellement prévues à court terme, n8n + Caddy en Docker sur le VPS (plan ci-dessous). Sinon, le script, quitte à passer à n8n plus tard. La partie Notion (intégration + partage de la base) est la même dans les deux cas.

## 1. État du VPS : constaté vs inconnu

### Constaté (depuis le Mac, sans connexion)

| Élément | Valeur | Source |
|---|---|---|
| IP | `83.228.211.126` | `~/.ssh/known_hosts` (clés hôte ed25519, rsa, ecdsa enregistrées, fichier daté du 03/06/2026) |
| Reverse DNS | `ov-39aa85.infomaniak.ch` | `host 83.228.211.126` : c'est bien une machine Infomaniak |
| OS | Ubuntu 24.04 LTS (noble) | bannière SSH `OpenSSH_9.6p1 Ubuntu-3ubuntu13.19` |
| SSH | port 22 ouvert, **clé publique uniquement** (mot de passe refusé) | `Permission denied (publickey)` |
| HTTP/HTTPS | ports 80 et 443 **filtrés** (timeout, pas de refus) | `curl` : firewall Infomaniak ou security group qui bloque, ou rien qui écoute derrière un filtre |
| Alias SSH | aucun dans `~/.ssh/config` (seul `gitlab.com` y figure) | |
| Historique shell | aucune commande `ssh`/`vps`/`infomaniak` | `~/.zsh_history` |
| Docs | aucun repo de `~/Documents/GitHub` ne mentionne ce VPS, un `docker-compose` n8n ou l'IP | grep |

Tentatives de connexion (non interactives, `BatchMode`) refusées pour `ubuntu`, `debian`, `root`, `almalinux`, `rocky`, `pwablo`, `guillaume`, avec les clés `id_ed25519` (hello@pwablo.be), `id_ed25519.save` et `gitlab-gate-ssh` (Gate-16, dans l'agent SSH).

### Inconnu (à lire dans le Manager Infomaniak ou après connexion)

RAM, vCPU, disque, offre exacte (VPS Lite, VPS Cloud ou Public Cloud), utilisateur de connexion, clé SSH attendue, Docker installé ou non, reverse proxy (nginx/Caddy/Traefik), certificats TLS, services qui tournent, domaines pointant vers l'IP.

### Comment se connecter

1. Manager Infomaniak → VPS (ou Public Cloud) → la machine : lire la formule (RAM !), la clé SSH associée et l'utilisateur par défaut (`ubuntu` sur les images Ubuntu Infomaniak).
2. Si la clé d'origine est perdue : la plupart des offres permettent d'ajouter une clé ou de réinstaller depuis le Manager (la réinstallation efface tout). Ajouter `~/.ssh/id_ed25519.pub`.
3. Ajouter un alias dans `~/.ssh/config` :

```
Host vps-pwablo
    HostName 83.228.211.126
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
```

4. Inventaire en lecture seule :

```bash
ssh vps-pwablo 'uname -a; cat /etc/os-release | head -3; nproc; free -h; df -h /; \
  docker --version 2>/dev/null; docker ps 2>/dev/null; \
  systemctl list-units --type=service --state=running --no-pager | head -40; \
  sudo ss -tlnp; ls /opt /srv /home; crontab -l 2>/dev/null'
```

5. Domaines pointant vers le VPS : chercher l'IP dans les zones DNS (Netlify DNS, Infomaniak).

## 2. n8n auto-hébergé : ce que disent les docs (octobre 2026)

Sources : docs.n8n.io (via Context7 `/n8n-io/n8n-docs`), page « Docker Compose » du guide d'installation.

- **Ressources** : n8n n'est pas gourmand en CPU, c'est la mémoire qui compte. Fourchette indicative de la doc : **320 Mo à 2 Go de RAM**, 512 Mo à 4 Go de disque. Un 1 vCPU / 2 Go suffit pour quelques workflows ; 1 Go est jouable avec 1 à 2 Go de swap.
- **Base de données** : SQLite par défaut (fichier dans le volume `/home/node/.n8n`). Postgres seulement pour de gros volumes ou le mode queue. Ici, SQLite.
- **Compose officiel** : Traefik + n8n, Let's Encrypt automatique. Variables : `N8N_HOST`, `N8N_PROTOCOL=https`, `N8N_WEBHOOK_URL` (à partir de n8n 2.30 ; `WEBHOOK_URL` avant), `GENERIC_TIMEZONE`/`TZ`, `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true`, `N8N_RESTRICT_FILE_ACCESS_TO=/files`. Port n8n publié uniquement sur `127.0.0.1`. Caddy fait la même chose en 3 lignes de config : retenu ci-dessous.
- **Authentification** : depuis n8n 1.0 il n'y a plus de basic auth ; on crée un **compte propriétaire** au premier lancement. Activer la 2FA dans les paramètres utilisateur.
- **`N8N_ENCRYPTION_KEY`** : chiffre les identifiants (token Notion, mot de passe SMTP). Générée et stockée dans le volume si absente ; la fixer explicitement dans `.env` et la sauvegarder hors du serveur, sinon une restauration rend les credentials illisibles.
- **Licence (Sustainable Use License)** : usage libre « pour vos besoins internes ». La FAQ cite explicitement comme autorisé le cas d'un consultant freelance qui fait tourner sa propre instance et construit des workflows pour ses clients, tant que les clients n'accèdent pas à l'éditeur. Recevoir soi-même un email quand une cliente dépose une demande est clairement un usage interne. Interdit : revendre n8n ou donner aux clients un accès pour construire leurs propres workflows.
- **Notion Trigger** : événements « Page added to database » et « Page updated in database ». C'est un **trigger par polling** (« Poll Times », par exemple toutes les minutes ou toutes les X minutes), actif seulement quand le workflow est publié. Il ne remonte pas les pages créées avant la publication. Credential : **Internal Integration Secret** (notion.com/my-integrations, capacité « Read content » suffit pour lire), puis **partager la base** avec l'intégration (… → Connexions → Connecter à). L'API Notion est disponible sur le plan Free.
- **Envoi d'email** : nœud **Send Email** (SMTP). 465 avec SSL/TLS activé, ou 587 avec SSL/TLS désactivé (STARTTLS). Options utiles : Reply-To, désactiver « Append n8n Attribution ». Alternative : nœud Gmail (OAuth, plus lourd à configurer).

## 3. Taille du VPS Infomaniak

La page tarifaire Infomaniak est rendue en JavaScript et n'a pas pu être lue automatiquement : **prix et formules à vérifier dans le Manager**. De mémoire (non vérifié), la plus petite formule VPS Lite tourne autour de 1 vCPU / 2 Go / quelques dizaines de Go pour quelques euros par mois ; le Public Cloud facture à l'heure des instances dès 1 vCPU / 1 à 2 Go.

| RAM du VPS | n8n ? |
|---|---|
| 512 Mo | Non. Script cron uniquement. |
| 1 Go | Possible avec swap de 2 Go, pas de place pour autre chose. |
| 2 Go et plus | Oui, confortable pour n8n + Caddy + quelques services. |

## 4. Alternatives, honnêtement

| Option | Coût | Effort initial | Entretien | Délai de notif | Limites |
|---|---|---|---|---|---|
| **n8n sur le VPS** | 0 € de plus (VPS déjà payé) | 1 à 2 h (DNS, Docker, Caddy, workflow) | mises à jour n8n mensuelles, OS, sauvegardes, surface web exposée | 1 min | Une app web de plus à garder à jour. Réutilisable pour d'autres automatisations. |
| **Script cron sur le VPS** (Python, stdlib) | 0 € | 30 min | quasi nul (`unattended-upgrades` pour l'OS) | 5 min | Pas d'interface ; chaque nouvelle automatisation = du code. Aucun port à ouvrir. |
| **GitHub Actions planifié** (script identique, secrets GitHub) | 0 € | 30 min | nul | 5 à 15 min (le cron GitHub prend du retard aux heures chargées) | Repo public : le planning est désactivé après 60 jours sans activité sur le repo. Pas de serveur du tout. |
| **Zapier Free** | 0 € | 15 min | nul | 15 min | 100 tâches/mois, zaps à 2 étapes (Notion → Email suffit). Données chez un tiers US. |
| Automatisation Notion native | plan Plus | 5 min | nul | immédiat | Payant. |

Le script cron ressemble à ceci (à adapter, non testé) :

```python
#!/usr/bin/env python3
# Notifie par email les nouvelles demandes Notion. Cron : */5 * * * *
import json, os, smtplib, urllib.request
from email.message import EmailMessage
from pathlib import Path

DS = "f3115be8-07d4-4e75-aa9d-b0795cf01562"
SEEN = Path(os.environ.get("SEEN_FILE", "/var/lib/notion-notify/seen.json"))

def notion(path, body):
    req = urllib.request.Request(f"https://api.notion.com/v1/{path}", json.dumps(body).encode(), {
        "Authorization": f"Bearer {os.environ['NOTION_TOKEN']}",
        "Notion-Version": "2025-09-03", "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=30))

seen = set(json.loads(SEEN.read_text())) if SEEN.exists() else None
pages = notion(f"data_sources/{DS}/query", {"sorts": [{"timestamp": "created_time", "direction": "descending"}], "page_size": 20})["results"]
if seen is None:  # premier lancement : on mémorise sans notifier
    seen = {p["id"] for p in pages}
for p in reversed(pages):
    if p["id"] in seen:
        continue
    pr = p["properties"]
    num = pr["Numéro"]["unique_id"]
    msg = EmailMessage()
    msg["Subject"] = f"[Rizzo] Nouvelle demande RM-{num['number']} : " + "".join(t["plain_text"] for t in pr["Objet de la demande "]["title"])
    msg["From"], msg["To"] = os.environ["SMTP_USER"], os.environ["MAIL_TO"]
    msg.set_content("".join(t["plain_text"] for t in pr["Description et résultat souhaité"]["rich_text"]) + f"\n\n{p['url']}")
    with smtplib.SMTP_SSL(os.environ.get("SMTP_HOST", "mail.infomaniak.com"), 465) as s:
        s.login(os.environ["SMTP_USER"], os.environ["SMTP_PASS"])
        s.send_message(msg)
    seen.add(p["id"])
SEEN.parent.mkdir(parents=True, exist_ok=True)
SEEN.write_text(json.dumps(sorted(seen)))
```

## 5. Architecture recommandée si n8n

```
Notion (base « Retours et demandes du site »)
   ▲ polling API toutes les 1 à 5 min (token d'intégration interne)
   │
VPS Infomaniak 83.228.211.126 ── Docker
   ├─ caddy  :80/:443  → TLS Let's Encrypt pour n8n.pwablo.be
   └─ n8n    127.0.0.1:5678, SQLite dans le volume n8n_data
   │
   ▼ SMTP 465 (boîte d'envoi dédiée, ex. notifications@pwablo.be chez Infomaniak)
hello@pwablo.be
```

Le polling est sortant : pour ce workflow précis, n8n n'a **même pas besoin d'être exposé sur Internet**. Variante plus sûre : ne pas ouvrir 80/443, écouter sur `127.0.0.1` et accéder à l'éditeur via un tunnel SSH (`ssh -L 5678:localhost:5678 vps-pwablo`). Caddy et le domaine ne deviennent nécessaires que le jour où un workflow reçoit des webhooks.

## 6. Plan de mise en place (commandes à lancer par Guillaume)

### 6.1 Prérequis

1. Accès SSH au VPS (section 1) et vérification de la RAM (`free -h`). Si moins de 1 Go : s'arrêter là, prendre le script cron.
2. Swap si 1 à 2 Go de RAM :

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

3. Mises à jour de sécurité automatiques : `sudo apt install unattended-upgrades`.
4. Docker (dépôt officiel) :

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # puis se reconnecter
docker --version && docker compose version
```

5. **Uniquement si exposition publique** : enregistrement A `n8n.pwablo.be → 83.228.211.126` (zone DNS de pwablo.be), puis ouvrir 80 et 443 dans le firewall du Manager Infomaniak (ils sont filtrés aujourd'hui).

### 6.2 Fichiers (`~/n8n/`)

`.env` (droits `600`, à sauvegarder hors du serveur) :

```dotenv
N8N_DOMAIN=n8n.pwablo.be
GENERIC_TIMEZONE=Europe/Brussels
# openssl rand -hex 32
N8N_ENCRYPTION_KEY=remplacer-par-une-cle-aleatoire
```

`docker-compose.yml` :

```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:2.30.0   # épingler une version, monter volontairement
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      - N8N_HOST=${N8N_DOMAIN}
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - N8N_WEBHOOK_URL=https://${N8N_DOMAIN}/
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - TZ=${GENERIC_TIMEZONE}
      - NODE_ENV=production
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336        # 14 jours d'historique
    volumes:
      - n8n_data:/home/node/.n8n

  caddy:                                   # à omettre si accès par tunnel SSH seulement
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - N8N_DOMAIN=${N8N_DOMAIN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data

volumes:
  n8n_data:
  caddy_data:
```

`Caddyfile` :

```
{$N8N_DOMAIN} {
    reverse_proxy n8n:5678
}
```

Vérifier le numéro de version stable courant sur hub.docker.com/r/n8nio/n8n avant de lancer.

### 6.3 Lancement

```bash
cd ~/n8n && chmod 600 .env
docker compose up -d
docker compose logs -f n8n      # attendre "Editor is now accessible"
```

Ouvrir `https://n8n.pwablo.be` (ou `http://localhost:5678` via `ssh -L 5678:localhost:5678 vps-pwablo`), créer le compte propriétaire, activer la 2FA.

### 6.4 Côté Notion

1. notion.com/my-integrations → New integration, espace **Pwablo**, type interne, nom « n8n notifications », capacité **Read content** uniquement.
2. Copier l'Internal Integration Secret.
3. Page de la base « Retours et demandes du site » → … → Connexions → Connecter à → « n8n notifications ».

### 6.5 Côté email

Boîte d'envoi dédiée (évite de stocker le mot de passe de la boîte principale) : par exemple `notifications@pwablo.be` chez Infomaniak, SMTP `mail.infomaniak.com`, port 465, SSL/TLS activé (paramètres à confirmer dans le Manager Mail). Pour Gmail : `smtp.gmail.com`, 465, mot de passe d'application (2FA obligatoire).

### 6.6 Le workflow

1. **Notion Trigger** : credential Notion (secret ci-dessus), événement **Page added to database**, base « Retours et demandes du site », Poll Times « Every X » = 2 minutes, option Simplify désactivée pour garder les noms de propriétés bruts.
2. **Send Email** : credential SMTP.
   - From : `notifications@pwablo.be` ; To : `hello@pwablo.be` ; Reply-To : facultatif.
   - Subject : `[Rizzo] RM-{{ $json.properties["Numéro"].unique_id.number }} : {{ $json.properties["Objet de la demande "].title.map(t => t.plain_text).join("") }}`
   - Email Format : Text ; corps :

```
Nouvelle demande de {{ $json.properties["Votre nom"].select?.name ?? "?" }}

Numéro : RM-{{ $json.properties["Numéro"].unique_id.number }}
Objet : {{ $json.properties["Objet de la demande "].title.map(t => t.plain_text).join("") }}
Priorité : {{ $json.properties["Priorité souhaitée"].select?.name ?? "-" }}
Page concernée : {{ $json.properties["Page concernée"].url ?? "-" }}

Description :
{{ $json.properties["Description et résultat souhaité"].rich_text.map(t => t.plain_text).join("") }}

Fiche Notion : {{ $json.url }}
```

   - Options : Append n8n Attribution = off.
3. Noms de propriétés relevés le 12/10/2026 via l'API (`ntn api v1/data_sources/…`). **Attention à l'espace final dans `"Objet de la demande "`** : si quelqu'un renomme une colonne, le workflow casse. `Numéro` est un `unique_id` (préfixe RM côté Notion, seul le nombre est renvoyé dans `number`). Les captures (`Captures d’écran`) ne sont pas jointes : le lien vers la fiche suffit.
4. Tester : « Fetch test event » sur le trigger, exécuter, vérifier la réception. Puis **Publish** le workflow et soumettre une demande test via le formulaire public.
5. Workflow d'erreur (Settings → Error workflow) : un petit workflow « Error Trigger → Send Email » pour être prévenu si le polling échoue (token révoqué, Notion en panne).

### 6.7 Sauvegardes et mises à jour

```bash
# Sauvegarde hebdo (cron), à copier hors du VPS (Swiss Backup, kDrive, Mac)
docker run --rm -v n8n_n8n_data:/data -v ~/backups:/backup alpine \
  tar czf /backup/n8n-$(date +%F).tgz -C /data .

# Export lisible des workflows et credentials (chiffrés)
docker compose exec n8n n8n export:workflow --all --output=/home/node/.n8n/backup-workflows.json

# Mise à jour : changer le tag dans docker-compose.yml après lecture des release notes
docker compose pull && docker compose up -d
```

Le nom réel du volume est donné par `docker volume ls`. Conserver `N8N_ENCRYPTION_KEY` dans le gestionnaire de mots de passe.

## 7. Coûts

| Poste | Coût |
|---|---|
| n8n Community Edition | 0 € |
| VPS | déjà payé (montant à lire dans le Manager) ; s'il faut monter à 2 Go, quelques €/mois de plus |
| Boîte `notifications@` | incluse si le service Mail Infomaniak de pwablo.be a des adresses libres, sinon utiliser Gmail |
| Temps | 1 à 2 h la première fois, puis environ 15 min/mois (mises à jour, vérification des sauvegardes) |

## 8. Risques

- **Sécurité** : un éditeur n8n exposé détient des tokens (Notion, SMTP, et demain d'autres). n8n a eu plusieurs CVE critiques en 2025-2026 : mises à jour régulières obligatoires. Le tunnel SSH sans ports ouverts supprime l'essentiel du risque.
- **Panne silencieuse** : si le VPS ou n8n tombe, plus aucune notification, sans alerte. Le workflow d'erreur ne couvre pas un VPS éteint ; un check Upptime/healthchecks.io gratuit le peut.
- **Schéma Notion** : renommer une colonne (ou corriger l'espace final de « Objet de la demande ») casse les expressions.
- **Mémoire** : sur 1 Go, une montée de version ou un gros workflow peut déclencher l'OOM killer.
- **Délivrabilité** : envoyer depuis le domaine pwablo.be via le SMTP Infomaniak authentifié (SPF/DKIM déjà alignés) ; ne pas envoyer en SMTP direct depuis le VPS.
- **Licence** : sans risque pour cet usage. À revoir seulement si un client devait un jour se connecter à l'instance pour construire ses workflows.

## 9. Questions ouvertes pour Guillaume

1. Quelle offre exacte et combien de RAM sur le VPS `83.228.211.126` (`ov-39aa85`) ? Avec quel utilisateur et quelle clé tu t'y connectais ? Sert-il déjà à quelque chose ?
2. Quelles autres automatisations n8n sont prévues concrètement (Twenty → Accountable, relances, etc.) ? S'il n'y en a pas dans les 3 prochains mois, le script cron suffit.
3. Exposer n8n publiquement (`n8n.pwablo.be`, utile pour les webhooks) ou rester derrière un tunnel SSH ?
4. Adresse d'envoi (`notifications@pwablo.be` chez Infomaniak ou Gmail) et destinataires (toi seul, ou aussi un accusé de réception à Christine) ?
5. Notifier aussi les modifications (« Page updated in database », par exemple les réponses de Christine) ou seulement les nouvelles demandes ?
