#!/bin/bash

# ==============================================================================
# Commandes curl pour tester les problèmes de 502 sur crizzo-avocate.be
# ==============================================================================

# URL à tester
URL="https://crizzo-avocate.be/fr/"

# --- Commandes pour tester avec différents user-agents ---

# 1. Test avec Googlebot
echo "=== Test avec Googlebot ==="
curl -v -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "$URL"
echo -e "\n\n"

# 2. Test avec Bingbot
echo "=== Test avec Bingbot ==="
curl -v -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "$URL"
echo -e "\n\n"

# 3. Test avec Googlebot-Image
echo "=== Test avec Googlebot-Image ==="
curl -v -A "Googlebot-Image/1.0" "$URL"
echo -e "\n\n"

# 4. Test avec DuckDuckBot
echo "=== Test avec DuckDuckBot ==="
curl -v -A "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)" "$URL"
echo -e "\n\n"

# 5. Test avec le navigateur standard
echo "=== Test avec navigateur standard ==="
curl -v -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$URL"
echo -e "\n\n"

# --- Commande pour tester plusieurs fois et extraire seulement le code HTTP ---
echo "=== Test répété avec Bingbot (10 requêtes, codes HTTP uniquement) ==="
for i in {1..10}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "$URL")
  echo "Requête $i: $HTTP_CODE"
  sleep 1
done

# --- Commande pour capturer les en-têtes HTTP de réponse (utile pour analyser les erreurs) ---
echo -e "\n=== En-têtes de réponse détaillés avec Bingbot ==="
curl -s -D - -o /dev/null -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "$URL"

# --- Commande pour capturer l'ID de requête Netlify (utile pour le support) ---
echo -e "\n=== Capture de l'ID de requête Netlify ==="
curl -s -D - -o /dev/null -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "$URL" | grep -i "x-nf-request-id"

# --- Commande avancée : tester avec différents user-agents en boucle ---
echo -e "\n=== Test de tous les user-agents en boucle (3 fois chacun) ==="
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

for run in {1..3}; do
  echo "--- Run #$run ---"
  for i in "${!USER_AGENTS[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -A "${USER_AGENTS[$i]}" "$URL")
    printf "%-20s | %s\n" "${BOT_NAMES[$i]}" "$HTTP_CODE"
    
    # Si une erreur 502 est détectée, capturer l'ID de requête Netlify
    if [ "$HTTP_CODE" -eq 502 ]; then
      echo "ERREUR 502 DÉTECTÉE! Capture des détails:"
      HEADERS=$(curl -s -D - -o /dev/null -A "${USER_AGENTS[$i]}" "$URL")
      echo "$HEADERS" | grep -i "x-nf-request-id"
      echo "$HEADERS" | grep -i "cache-status"
      echo "$HEADERS" | grep -i "server"
    fi
    
    sleep 1
  done
  echo ""
  sleep 2
done 