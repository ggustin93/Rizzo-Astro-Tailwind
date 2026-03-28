#!/bin/bash

URL="https://rizzo-michiels.be/fr/"
DOMAIN="rizzo-michiels.be"
DEFAULT_SITEMAP_URL="https://rizzo-michiels.be/sitemap.xml" # Common default location

echo "🔍 Diagnostic d'indexation Bing pour $URL"
echo "-----------------------------------------------------"

# 1. Résolution DNS
echo -e "\n🔧 1. Vérification DNS pour $DOMAIN..."
if dig +short $DOMAIN &>/dev/null; then
    echo "✅ Enregistrements DNS trouvés pour $DOMAIN:"
    dig +short $DOMAIN
else
    echo "❌ Problème : Aucun enregistrement DNS trouvé pour $DOMAIN"
fi

# 2. Ping (vérifie si le domaine répond)
echo -e "\n📡 2. Test de ping pour $DOMAIN..."
if ping -c 3 $DOMAIN &>/dev/null; then
    echo "✅ Ping vers $DOMAIN réussi."
else
    echo "❌ Ping vers $DOMAIN échoué. Le serveur pourrait être inaccessible ou ne pas répondre aux pings."
fi

# 3. Connexion HTTP(s) à l'URL
echo -e "\n🌐 3. Vérification de la réponse HTTP(S) pour $URL..."
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 $URL)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Connexion HTTP(S) à $URL réussie (Code: $HTTP_STATUS)."
    echo "   En-têtes de réponse :"
    curl -I --max-time 10 $URL 2>/dev/null | grep -E 'HTTP/|Server:|Content-Type:|X-Robots-Tag:'
elif [ "$HTTP_STATUS" -ne 0 ]; then
    echo "❌ Échec de connexion HTTP(S) à $URL (Code: $HTTP_STATUS)."
    echo "   Essayez d'accéder à l'URL dans un navigateur pour plus de détails."
else
    echo "❌ Échec de connexion à $URL (Curl n'a pas pu se connecter ou a expiré)."
fi

# 4. Vérification robots.txt
ROBOTS_URL="https://$DOMAIN/robots.txt"
echo -e "\n🤖 4. Vérification de $ROBOTS_URL..."
ROBOTS_CONTENT=$(curl -s --max-time 10 $ROBOTS_URL)
ROBOTS_HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 $ROBOTS_URL)

if [ "$ROBOTS_HTTP_STATUS" -eq 200 ]; then
    echo "✅ Fichier robots.txt trouvé ($ROBOTS_URL)."
    if [[ -n "$ROBOTS_CONTENT" ]]; then
        echo "   Contenu de robots.txt :"
        echo "$ROBOTS_CONTENT"
        # Check for specific Bingbot disallow all
        if echo "$ROBOTS_CONTENT" | grep -Eiq "User-agent:\s*Bingbot" && echo "$ROBOTS_CONTENT" | grep -Eiq "Disallow:\s*/\s*$"; then
            echo "⚠️ Attention : Bingbot est spécifiquement bloqué (Disallow: /) dans robots.txt."
        # Check for general disallow all if Bingbot isn't specifically mentioned as allowed
        elif ! echo "$ROBOTS_CONTENT" | grep -Eiq "User-agent:\s*Bingbot" && echo "$ROBOTS_CONTENT" | grep -Eiq "User-agent:\s*\*" && echo "$ROBOTS_CONTENT" | grep -Eiq "Disallow:\s*/\s*$"; then
             echo "⚠️ Attention : Tous les bots (User-agent: *) pourraient être bloqués (Disallow: /), et Bingbot n'a pas de règle Allow spécifique."
        fi
    else
        echo "⚠️ Fichier robots.txt est vide."
    fi
else
    echo "❌ Fichier robots.txt non trouvé ou inaccessible à $ROBOTS_URL (Code: $ROBOTS_HTTP_STATUS)."
    echo "   Il est recommandé d'avoir un fichier robots.txt."
fi

# 5. Vérification sitemap
echo -e "\n🗺️  5. Vérification du sitemap..."
SITEMAP_TO_CHECK=""
# First, try to get sitemap URL from robots.txt
if [ "$ROBOTS_HTTP_STATUS" -eq 200 ]; then
    SITEMAP_FROM_ROBOTS=$(echo "$ROBOTS_CONTENT" | grep -ioE "Sitemap:\s*[^[:space:]]+" | awk '{print $2}' | head -n 1)
    if [[ -n "$SITEMAP_FROM_ROBOTS" ]]; then
        echo "   ℹ️ Sitemap déclaré dans robots.txt: $SITEMAP_FROM_ROBOTS"
        SITEMAP_TO_CHECK="$SITEMAP_FROM_ROBOTS"
    else
        echo "   ℹ️ Aucun sitemap déclaré dans robots.txt. Tentative avec l'URL par défaut: $DEFAULT_SITEMAP_URL"
        SITEMAP_TO_CHECK="$DEFAULT_SITEMAP_URL"
    fi
else
    echo "   ⚠️ robots.txt non accessible, tentative avec l'URL de sitemap par défaut: $DEFAULT_SITEMAP_URL"
    SITEMAP_TO_CHECK="$DEFAULT_SITEMAP_URL"
fi

if [[ -n "$SITEMAP_TO_CHECK" ]]; then
    SITEMAP_HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 "$SITEMAP_TO_CHECK")
    if [ "$SITEMAP_HTTP_STATUS" -eq 200 ]; then
        echo "✅ Fichier sitemap trouvé et accessible à $SITEMAP_TO_CHECK (Code: $SITEMAP_HTTP_STATUS)."
        echo "   Assurez-vous qu'il est soumis à Bing Webmaster Tools et qu'il reflète les pages que vous souhaitez indexer."
        # Check if it's a sitemap index
        SITEMAP_CONTENT_TYPE=$(curl -s -I -L --max-time 10 "$SITEMAP_TO_CHECK" | grep -ioE "Content-Type:\s*application/xml|Content-Type:\s*text/xml|Content-Type:\s*application/atom\+xml|Content-Type:\s*application/rss\+xml")
        if curl -s -L --max-time 10 "$SITEMAP_TO_CHECK" | grep -iq "<sitemapindex"; then
             echo "   ℹ️  Ce sitemap ($SITEMAP_TO_CHECK) est un INDEX DE SITEMAPS. Bing devrait pouvoir le traiter."
             echo "       Contenu de l'index de sitemaps (premières lignes) :"
             curl -s -L --max-time 10 "$SITEMAP_TO_CHECK" | head -n 5
        fi
    else
        echo "❌ Fichier sitemap non trouvé ou inaccessible à $SITEMAP_TO_CHECK (Code: $SITEMAP_HTTP_STATUS)."
        echo "   Il est fortement recommandé d'avoir un sitemap.xml valide et accessible."
    fi
else
    echo "❌ Aucune URL de sitemap à vérifier n'a pu être déterminée."
fi


# 6. Test User-Agent Bingbot
echo -e "\n🔎 6. Test d'accès en tant que Bingbot pour $URL..."
BINGBOT_STATUS=$(curl -o /dev/null -s -w "%{http_code}" -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" --max-time 10 $URL)
if [ "$BINGBOT_STATUS" -eq 200 ]; then
    echo "✅ Accès en tant que Bingbot à $URL réussi (Code: $BINGBOT_STATUS)."
    echo "   En-têtes de réponse pour Bingbot :"
    curl -I -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" --max-time 10 $URL 2>/dev/null | grep -E 'HTTP/|Server:|Content-Type:|X-Robots-Tag:'
else
    echo "❌ Accès en tant que Bingbot à $URL semble bloqué ou problématique (Code: $BINGBOT_STATUS)."
    echo "   Vérifiez les configurations serveur, firewall, ou les règles spécifiques dans .htaccess ou la configuration de l'hébergeur."
fi

echo -e "\n-----------------------------------------------------"
echo "💡 Recommandations supplémentaires :"
echo "   - Soumettez votre site et sitemap à Bing Webmaster Tools : https://www.bing.com/webmasters/"
echo "   - Vérifiez les erreurs d'exploration dans Bing Webmaster Tools."
echo "   - Assurez-vous que le contenu important est facilement accessible et non bloqué."
echo "   - Vérifiez la présence de balises meta robots sur les pages individuelles (ex: <meta name=\"robots\" content=\"noindex\">)."
echo -e "\n✅ Diagnostic terminé." 