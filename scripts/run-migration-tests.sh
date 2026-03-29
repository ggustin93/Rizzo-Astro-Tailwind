#!/bin/bash

# ==============================================================================
# Domain Migration Verification Script
#
# Description:
#   Vérifie que la migration de crizzo-avocate.be vers rizzo-michiels.be
#   fonctionne correctement : redirections 301, pages opérationnelles,
#   canonical tags, sitemap, robots.txt, DNS.
#
# Usage:
#   ./scripts/run-migration-tests.sh
#
# ==============================================================================

# --- Configuration ---
OLD_DOMAIN="crizzo-avocate.be"
NEW_DOMAIN="rizzo-michiels.be"
NEW_BASE="https://${NEW_DOMAIN}"
OLD_BASE="https://${OLD_DOMAIN}"

# Pages à tester pour les redirections 301
REDIRECT_PATHS=(
  "/"
  "/fr/"
  "/en/"
  "/it/"
  "/fr/services/europeennes/"
  "/fr/services/travailleurs/"
  "/fr/services/employeurs/"
  "/fr/contact/"
  "/en/equipe/stephanie-michiels/"
)

# Pages clés qui doivent renvoyer 200 sur le nouveau domaine
PAGES_200=(
  "/fr/"
  "/en/"
  "/it/"
  "/fr/services/europeennes/"
  "/fr/services/travailleurs/"
  "/fr/services/employeurs/"
  "/fr/contact/"
  "/fr/honoraires/"
  "/fr/equipe/"
  "/fr/blog/"
)

# --- Couleurs ---
COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[0;33m'
COLOR_BLUE='\033[0;34m'
COLOR_BOLD='\033[1m'
TICK="✅"
CROSS="❗"
WARN="⚠️"

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# --- Fonctions utilitaires ---
print_pass() {
  echo -e "  ${COLOR_GREEN}${TICK} PASS:${COLOR_RESET} $1"
  ((PASS_COUNT++))
}

print_fail() {
  echo -e "  ${COLOR_RED}${CROSS} FAIL:${COLOR_RESET} $1"
  ((FAIL_COUNT++))
}

print_warn() {
  echo -e "  ${COLOR_YELLOW}${WARN} WARN:${COLOR_RESET} $1"
  ((WARN_COUNT++))
}

print_info() {
  echo -e "  ${COLOR_BLUE}ℹ️  INFO:${COLOR_RESET} $1"
}

print_header() {
  echo -e "\n${COLOR_BOLD}${COLOR_YELLOW}━━━ $1 ━━━${COLOR_RESET}"
}

# ==============================================================================
echo -e "\n${COLOR_BOLD}🔄 Migration Verification: ${OLD_DOMAIN} → ${NEW_DOMAIN}${COLOR_RESET}"
echo -e "   $(date '+%Y-%m-%d %H:%M:%S')\n"

# ==============================================================================
# 1. DNS Resolution
# ==============================================================================
print_header "1. DNS Resolution"

for domain in "$OLD_DOMAIN" "$NEW_DOMAIN"; do
  ip=$(dig +short "$domain" A 2>/dev/null | head -1)
  if [ -n "$ip" ]; then
    print_pass "${domain} → ${ip}"
  else
    print_fail "${domain} — pas de résolution DNS"
  fi
done

# ==============================================================================
# 2. Redirections 301 (ancien domaine → nouveau)
# ==============================================================================
print_header "2. Redirections 301 (${OLD_DOMAIN} → ${NEW_DOMAIN})"

for path in "${REDIRECT_PATHS[@]}"; do
  url="${OLD_BASE}${path}"

  # Récupérer status code et header Location
  response=$(curl -sI --max-time 10 "$url" 2>/dev/null)
  http_code=$(echo "$response" | grep -i "^HTTP/" | tail -1 | awk '{print $2}')
  location=$(echo "$response" | grep -i "^location:" | tail -1 | sed 's/location: *//i' | tr -d '\r')

  if [ "$http_code" = "301" ]; then
    # Vérifier que la redirection pointe vers le nouveau domaine
    if echo "$location" | grep -qi "$NEW_DOMAIN"; then
      print_pass "${path} → 301 → ${location}"
    elif echo "$location" | grep -q "^/"; then
      # Redirect relative (reste sur l'ancien domaine)
      print_fail "${path} → 301 → ${location} (redirect relative, reste sur ${OLD_DOMAIN})"
    else
      print_fail "${path} → 301 → ${location} (ne pointe pas vers ${NEW_DOMAIN})"
    fi
  elif [ "$http_code" = "200" ]; then
    print_fail "${path} → 200 (sert la page au lieu de rediriger)"
  elif [ -z "$http_code" ]; then
    print_fail "${path} → pas de réponse (timeout ou DNS)"
  else
    print_fail "${path} → HTTP ${http_code} (attendu: 301)"
  fi
done

# Test HTTP (non-HTTPS) aussi
print_info "Test HTTP → HTTPS sur ancien domaine :"
http_response=$(curl -sI --max-time 10 "http://${OLD_DOMAIN}/" 2>/dev/null)
http_code=$(echo "$http_response" | grep -i "^HTTP/" | head -1 | awk '{print $2}')
http_location=$(echo "$http_response" | grep -i "^location:" | head -1 | sed 's/location: *//i' | tr -d '\r')

if [ "$http_code" = "301" ]; then
  print_pass "http://${OLD_DOMAIN}/ → 301 → ${http_location}"
else
  print_warn "http://${OLD_DOMAIN}/ → HTTP ${http_code} (attendu: 301 vers HTTPS)"
fi

# ==============================================================================
# 3. Pages opérationnelles (nouveau domaine → 200)
# ==============================================================================
print_header "3. Pages opérationnelles (${NEW_DOMAIN} → 200)"

for path in "${PAGES_200[@]}"; do
  url="${NEW_BASE}${path}"
  http_code=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "$url" 2>/dev/null)

  if [ "$http_code" = "200" ]; then
    print_pass "${path} → 200"
  else
    print_fail "${path} → HTTP ${http_code} (attendu: 200)"
  fi
done

# ==============================================================================
# 4. Canonical tags (nouveau domaine)
# ==============================================================================
print_header "4. Canonical tags"

for path in "/fr/" "/en/" "/it/"; do
  url="${NEW_BASE}${path}"
  html=$(curl -s --max-time 10 "$url" 2>/dev/null)
  canonical=$(echo "$html" | tr '>' '\n' | grep -i 'rel="canonical"' | sed -n 's/.*href="\([^"]*\)".*/\1/p' | head -1)

  if [ -z "$canonical" ]; then
    print_fail "${path} — pas de canonical tag"
  elif echo "$canonical" | grep -q "$NEW_DOMAIN"; then
    print_pass "${path} → canonical: ${canonical}"
  elif echo "$canonical" | grep -q "$OLD_DOMAIN"; then
    print_fail "${path} → canonical pointe vers ancien domaine: ${canonical}"
  else
    print_warn "${path} → canonical inattendu: ${canonical}"
  fi
done

# ==============================================================================
# 5. Sitemap
# ==============================================================================
print_header "5. Sitemap"

sitemap_url="${NEW_BASE}/sitemap-index.xml"
sitemap_code=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "$sitemap_url" 2>/dev/null)

if [ "$sitemap_code" = "200" ]; then
  print_pass "sitemap-index.xml accessible (200)"

  # Vérifier qu'aucune URL de l'ancien domaine n'est dans le sitemap
  sitemap_content=$(curl -s --max-time 10 "$sitemap_url" 2>/dev/null)
  if echo "$sitemap_content" | grep -qi "$OLD_DOMAIN"; then
    print_fail "Le sitemap contient des URLs ${OLD_DOMAIN}"
  else
    print_pass "Aucune URL ${OLD_DOMAIN} dans le sitemap"
  fi
else
  print_fail "sitemap-index.xml → HTTP ${sitemap_code}"
fi

# ==============================================================================
# 6. robots.txt
# ==============================================================================
print_header "6. robots.txt"

robots_url="${NEW_BASE}/robots.txt"
robots_content=$(curl -s --max-time 10 "$robots_url" 2>/dev/null)
robots_code=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "$robots_url" 2>/dev/null)

if [ "$robots_code" = "200" ]; then
  print_pass "robots.txt accessible (200)"

  if echo "$robots_content" | grep -qi "sitemap.*${NEW_DOMAIN}"; then
    print_pass "Sitemap référence ${NEW_DOMAIN}"
  elif echo "$robots_content" | grep -qi "sitemap.*${OLD_DOMAIN}"; then
    print_fail "Sitemap référence encore ${OLD_DOMAIN}"
  else
    print_warn "Pas de référence Sitemap trouvée dans robots.txt"
  fi

  if echo "$robots_content" | grep -qi "disallow.*admin"; then
    print_pass "/admin/ bloqué pour les bots"
  else
    print_warn "/admin/ non bloqué dans robots.txt"
  fi
else
  print_fail "robots.txt → HTTP ${robots_code}"
fi

# ==============================================================================
# Résumé
# ==============================================================================
echo -e "\n${COLOR_BOLD}━━━ RÉSUMÉ ━━━${COLOR_RESET}"
echo -e "  ${COLOR_GREEN}${TICK} Pass: ${PASS_COUNT}${COLOR_RESET}"
echo -e "  ${COLOR_RED}${CROSS} Fail: ${FAIL_COUNT}${COLOR_RESET}"
echo -e "  ${COLOR_YELLOW}${WARN} Warn: ${WARN_COUNT}${COLOR_RESET}"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo -e "\n  ${COLOR_RED}${COLOR_BOLD}⚠️  ${FAIL_COUNT} test(s) en échec — migration incomplète${COLOR_RESET}"
  echo -e "  ${COLOR_BLUE}Conseil: Vérifier que ${OLD_DOMAIN} est bien configuré comme"
  echo -e "  alias (et non domaine principal) dans Netlify Dashboard.${COLOR_RESET}"
  exit 1
else
  echo -e "\n  ${COLOR_GREEN}${COLOR_BOLD}✅ Migration vérifiée avec succès !${COLOR_RESET}"
  exit 0
fi
