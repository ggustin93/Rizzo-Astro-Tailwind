#!/bin/bash

# ==============================================================================
# Version simplifiée pour tester les erreurs 502 sur crizzo-avocate.be
# ==============================================================================

URL="https://crizzo-avocate.be/fr/"

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

# Test rapide pour Bingbot uniquement (10 requêtes)
echo "=== Test de Bingbot (10 requêtes) ==="
echo "Requête | Code HTTP | ID Requête Netlify"
echo "-----------------------------------------"
for i in {1..10}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -A "${USER_AGENTS[1]}" "$URL")
  
  if [ "$HTTP_CODE" -eq 502 ]; then
    # Si erreur 502, capturer l'ID de requête
    HEADERS=$(curl -s -D - -o /dev/null -A "${USER_AGENTS[1]}" "$URL")
    REQUEST_ID=$(echo "$HEADERS" | grep -i "x-nf-request-id" | awk '{print $2}' | tr -d '\r')
    printf "%-7s | \033[0;31m%-9s\033[0m | %s\n" "$i" "$HTTP_CODE" "$REQUEST_ID"
  else
    printf "%-7s | \033[0;32m%-9s\033[0m |\n" "$i" "$HTTP_CODE"
  fi
  
  sleep 1
done

echo -e "\n=== Test de tous les user-agents (3 cycles) ==="
for run in {1..3}; do
  echo -e "\n--- Cycle #$run ---"
  echo "Bot                 | Code HTTP | ID Requête Netlify"
  echo "----------------------------------------------------"
  
  for i in "${!USER_AGENTS[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -A "${USER_AGENTS[$i]}" "$URL")
    
    if [ "$HTTP_CODE" -eq 502 ]; then
      # Si erreur 502, capturer les détails importants
      HEADERS=$(curl -s -D - -o /dev/null -A "${USER_AGENTS[$i]}" "$URL")
      REQUEST_ID=$(echo "$HEADERS" | grep -i "x-nf-request-id" | awk '{print $2}' | tr -d '\r')
      CACHE_STATUS=$(echo "$HEADERS" | grep -i "cache-status" | awk '{print $2}' | tr -d '\r')
      
      printf "%-20s | \033[0;31m%-9s\033[0m | %s\n" "${BOT_NAMES[$i]}" "$HTTP_CODE" "$REQUEST_ID"
      
      # Enregistrer les détails de l'erreur dans un fichier pour référence
      echo "=== ERREUR 502 DÉTECTÉE ! ===" >> error_details.log
      echo "Date: $(date)" >> error_details.log
      echo "Bot: ${BOT_NAMES[$i]}" >> error_details.log
      echo "User-Agent: ${USER_AGENTS[$i]}" >> error_details.log
      echo "$HEADERS" >> error_details.log
      echo "=========================================" >> error_details.log
    else
      printf "%-20s | \033[0;32m%-9s\033[0m |\n" "${BOT_NAMES[$i]}" "$HTTP_CODE"
    fi
    
    sleep 1
  done
done

echo -e "\nTest terminé. Si des erreurs 502 ont été détectées, les détails ont été enregistrés dans error_details.log" 