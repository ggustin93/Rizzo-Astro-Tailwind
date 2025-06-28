#!/bin/bash

# ==============================================================================
# Test comparatif entre Netlify et Vercel pour les erreurs 502
# ==============================================================================

NETLIFY_URL="https://crizzo-avocate.be/fr/"
VERCEL_URL="https://rizzo-astro-tailwind-ggd8.vercel.app/fr/"

# Définition des user-agents
USER_AGENTS=(
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
  "Googlebot-Image/1.0"
  "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)"
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
)

BOT_NAMES=(
  "Googlebot"
  "Bingbot"
  "Googlebot-Image"
  "DuckDuckBot"
  "Standard Browser"
)

echo "=== COMPARAISON NETLIFY VS VERCEL - TESTS AVEC BINGBOT ==="
echo -e "\nTest exécuté le $(date)\n"

# Fonction pour tester une URL
test_url() {
  local url=$1
  local platform=$2
  local cycles=$3
  
  local success_count=0
  local fail_count=0
  
  echo "=== Test de $platform ($url) - $cycles requêtes avec Bingbot ==="
  echo "Requête | Code HTTP | ID Requête"
  echo "-----------------------------------------"
  
  for i in $(seq 1 $cycles); do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -A "${USER_AGENTS[1]}" "$url")
    
    if [ "$HTTP_CODE" -eq 502 ]; then
      # Si erreur 502, capturer plus de détails
      HEADERS=$(curl -s -D - -o /dev/null -A "${USER_AGENTS[1]}" "$url")
      REQUEST_ID=$(echo "$HEADERS" | grep -i "x-nf-request-id\|x-vercel-id" | head -1 | awk '{print $2}' | tr -d '\r')
      printf "%-7s | \033[0;31m%-9s\033[0m | %s\n" "$i" "$HTTP_CODE" "$REQUEST_ID"
      fail_count=$((fail_count + 1))
    else
      printf "%-7s | \033[0;32m%-9s\033[0m |\n" "$i" "$HTTP_CODE"
      success_count=$((success_count + 1))
    fi
    
    sleep 1
  done
  
  # Calcul du taux de succès
  success_rate=$((success_count * 100 / cycles))
  echo -e "\nRésultat $platform: $success_count succès, $fail_count échecs ($success_rate% de succès)"
}

# Exécuter les tests
test_url "$NETLIFY_URL" "NETLIFY" 15
echo -e "\n"
test_url "$VERCEL_URL" "VERCEL" 15

echo -e "\n==== ANALYSE DES RÉSULTATS ====="
echo "Ces résultats prouvent clairement si le problème est lié à l'infrastructure (Netlify vs Vercel)"
echo "ou s'il est lié à la configuration du site (même codebase sur les deux plateformes)." 