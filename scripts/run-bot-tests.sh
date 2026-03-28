#!/bin/bash

# ==============================================================================
#
# run-bot-tests.sh
#
# Description:
#   A script to test a URL's response by simulating requests from various
#   major search engine crawlers (bots). It can run multiple passes to check
#   for intermittent issues.
#
# Usage:
#   ./run-bot-tests.sh <full_url> [number_of_runs] [show_headers]
#
# Example (single run):
#   ./run-bot-tests.sh https://rizzo-michiels.be/fr/
#
# Example (5 runs):
#   ./run-bot-tests.sh https://rizzo-michiels.be/fr/ 5
#
# Example (with headers):
#   ./run-bot-tests.sh https://rizzo-michiels.be/fr/ 1 headers
#
# Dependencies:
#   - curl
#
# ==============================================================================

# --- Configuration ---
# Colors for output
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[0;33m'
C_CYAN='\033[0;36m'
C_MAGENTA='\033[0;35m'

# --- Argument Parsing ---
if [ -z "$1" ]; then
    printf "${C_RED}Usage: $0 <full_url> [number_of_runs] [show_headers]${C_RESET}\n"
    printf "Example: $0 https://example.com/page 5\n"
    exit 1
fi

URL=$1
# Default to 1 run if the second argument is not provided or not a number
NUM_RUNS=${2:-1}
if ! [[ "$NUM_RUNS" =~ ^[0-9]+$ ]]; then
    NUM_RUNS=1
fi

SHOW_HEADERS=false
if [ "$3" = "headers" ]; then
    SHOW_HEADERS=true
fi

TIMEOUT=10 # Max time in seconds for each request

# Associative array of Bot Name => User-Agent String
# Using a more robust way to declare arrays for bash v3+ compatibility
declare -a BOT_NAMES
declare -a BOT_AGENTS

# NOTE: Associative arrays are not supported in Bash 3 (default on macOS).
# We use two separate indexed arrays instead.
BOT_NAMES=(
    "Googlebot"
    "Bingbot"
    "Googlebot-Image"
    "YandexBot"
    "DuckDuckBot"
    "Baiduspider"
    "AhrefsBot"
    "SemrushBot"
    "Standard Browser"
)

BOT_AGENTS=(
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
    "Googlebot-Image/1.0"
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)"
    "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)"
    "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)"
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)"
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)"
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
)


# --- Main Script ---
printf "Testing URL: ${C_YELLOW}%s${C_RESET}\n" "$URL"
printf "Number of runs: ${C_YELLOW}%s${C_RESET}\n" "$NUM_RUNS"
printf "Timeout for each request: %s seconds\n" "$TIMEOUT"
printf "Follow redirects: ${C_GREEN}Yes${C_RESET}\n"
if [ "$SHOW_HEADERS" = true ]; then
    printf "Show headers: ${C_GREEN}Yes${C_RESET}\n"
else
    printf "Show headers: ${C_RED}No${C_RESET}\n"
fi

for run in $(seq 1 "$NUM_RUNS"); do
    printf "\n${C_MAGENTA}--- Run #%s ---${C_RESET}\n" "$run"
    if [ "$SHOW_HEADERS" = true ]; then
        printf "%-20s | %-12s | %s\n" "Bot Name" "HTTP Status" "Final URL"
        printf -- "------------------------------------------------------------\n"
    else
        printf "%-20s | %-12s | %s\n" "Bot Name" "HTTP Status" "Final URL"
        printf -- "------------------------------------------------------------\n"
    fi

    # Loop through the bots
    for i in "${!BOT_NAMES[@]}"; do
        BOT_NAME="${BOT_NAMES[$i]}"
        USER_AGENT="${BOT_AGENTS[$i]}"
        
        # Create a temporary file for headers
        HEADER_FILE=$(mktemp)
        
        # Perform the curl request with -L to follow redirects
        # -D to dump headers, -s for silent operation
        if [ "$SHOW_HEADERS" = true ]; then
            # Full output with headers for debugging
            printf "\n${C_CYAN}Headers for ${BOT_NAME}:${C_RESET}\n"
            curl -s -A "$USER_AGENT" -L --max-time "$TIMEOUT" -D - "$URL" | head -20
            printf "\n"
            
            # Get status code and effective URL
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -A "$USER_AGENT" -L --max-time "$TIMEOUT" "$URL")
            EFFECTIVE_URL=$(curl -s -o /dev/null -w "%{url_effective}" -A "$USER_AGENT" -L --max-time "$TIMEOUT" "$URL")
        else
            # Just get status code and effective URL for summary
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -A "$USER_AGENT" -L --max-time "$TIMEOUT" "$URL")
            EFFECTIVE_URL=$(curl -s -o /dev/null -w "%{url_effective}" -A "$USER_AGENT" -L --max-time "$TIMEOUT" "$URL")
        fi
        
        # Clean up
        rm -f "$HEADER_FILE"
        
        # Print formatted result
        if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
            STATUS_COLOR=$C_GREEN
        elif [ "$HTTP_STATUS" -ge 400 ]; then
            STATUS_COLOR=$C_RED
        else
            STATUS_COLOR=$C_YELLOW
        fi
        
        printf "%-20s | ${STATUS_COLOR}%-12s${C_RESET} | %s\n" "$BOT_NAME" "$HTTP_STATUS" "$EFFECTIVE_URL"
    done
done

printf -- "\n----------------------------------------\n"
printf "All tests complete.\n" 