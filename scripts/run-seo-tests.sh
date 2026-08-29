#!/bin/bash

# ==============================================================================
# SEO Test Suite
#
# Description:
#   This script runs a series of cURL-based tests to verify key technical
#   SEO aspects of a website. It checks headers, meta tags, and important
#   SEO files for a given list of URLs.
#
# Usage:
#   ./scripts/run-seo-tests.sh
#
# ==============================================================================

# --- Configuration ---
# Override to point the suite at a deploy preview or a local build, e.g.
#   BASE_URL=https://deploy-preview-42--site.netlify.app ./scripts/run-seo-tests.sh
BASE_URL="${BASE_URL:-https://rizzo-michiels.be}"
# Canonical URLs and the robots.txt sitemap entry always point at production,
# even when the pages are served from a preview host — that is correct SEO, so
# they are checked against this fixed origin rather than against BASE_URL.
CANONICAL_BASE="https://rizzo-michiels.be"
# Locales come from the single source of truth (src/config/locales.ts) so that
# shipping a new language extends this suite without editing it (issue #11).
LOCALES=($(sed -n "s/.*LOCALES = \[\(.*\)\] as const.*/\1/p" \
  "$(dirname "$0")/../src/config/locales.ts" | tr -d "' " | tr ',' ' '))
if [ ${#LOCALES[@]} -eq 0 ]; then
  echo "Could not read LOCALES from src/config/locales.ts" >&2
  exit 1
fi
# Every locale's home page and contact page.
PAGES_TO_TEST=()
for locale in "${LOCALES[@]}"; do
  PAGES_TO_TEST+=("/${locale}/")
done
for locale in "${LOCALES[@]}"; do
  PAGES_TO_TEST+=("/${locale}/contact/")
done

# User-Agents
UA_GOOGLEBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
UA_BINGBOT="Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

# --- Colors and Formatting ---
COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[0;33m'
COLOR_BLUE='\033[0;34m'
COLOR_BOLD='\033[1m'
TICK="✅"
CROSS="❗"

# --- Helper Functions ---
print_pass() {
  echo -e "  ${COLOR_GREEN}${TICK} PASS:${COLOR_RESET} $1"
}

print_fail() {
  echo -e "  ${COLOR_RED}${CROSS} FAIL:${COLOR_RESET} $1"
}

print_info() {
  echo -e "  ${COLOR_BLUE}ℹ️  INFO:${COLOR_RESET} $1"
}

print_header() {
  echo -e "\n${COLOR_BOLD}${COLOR_YELLOW}--- $1 ---${COLOR_RESET}"
}

# --- Test Functions ---

test_http_status() {
  local url=$1
  local user_agent=$2
  local ua_flag=""
  if [ -n "$user_agent" ]; then
    ua_flag="-A \"$user_agent\""
  fi
  
  local http_code=$(eval "curl -o /dev/null -s -w '%{http_code}' $ua_flag $url")
  
  if [ "$http_code" -eq 200 ]; then
    print_pass "HTTP status is 200"
  else
    print_fail "HTTP status is $http_code (expected 200)"
  fi
}

test_meta_robots() {
  local url=$1
  local user_agent=$2
  local ua_name=$3
  
  # Pre-process HTML to put each tag on a new line, making parsing reliable
  local html_content=$(curl -s -A "$user_agent" "$url" | sed 's/>/>\n/g')
  
  # Use a more specific grep to isolate the correct meta tag
  local robots_tags=$(echo "$html_content" | grep -i '<meta[^>]*name="robots"[^>]*>')
  local tag_count=$(echo "$robots_tags" | wc -l | tr -d ' ')
  
  if [ "$tag_count" -ne 1 ]; then
    print_fail "[$ua_name] Found $tag_count <meta name=\"robots\"> tags (expected 1)"
    print_info "$robots_tags"
    return
  fi

  # Use awk for more robust parsing. This finds the line with name="robots"
  # and then extracts the value of the content attribute from it.
  local content=$(echo "$robots_tags" | awk -F'content=' '{print $2}' | awk -F'"' '{print $2}' | tr '[:upper:]' '[:lower:]')
  
  if [[ "$content" == "index, follow" || "$content" == "follow, index" ]]; then
    print_pass "[$ua_name] Meta robots tag is 'index, follow'"
  else
    print_fail "[$ua_name] Meta robots tag is '$content' (expected 'index, follow')"
  fi
}

test_canonical_tag() {
  local url=$1
  local expected="${url/#$BASE_URL/$CANONICAL_BASE}"
  # Pre-process HTML to put each tag on a new line
  local html_content=$(curl -s "$url" | sed 's/>/>\n/g')
  
  # Use a more specific grep to isolate the correct canonical link tag
  local canonical_tags=$(echo "$html_content" | grep -i '<link[^>]*rel="canonical"[^>]*>')
  local tag_count=$(echo "$canonical_tags" | wc -l | tr -d ' ')

  if [ "$tag_count" -ne 1 ]; then
    print_fail "Found $tag_count <link rel=\"canonical\"> tags (expected 1)"
    return
  fi
  
  # Use awk for more robust parsing of the href attribute.
  local href=$(echo "$canonical_tags" | awk -F'href=' '{print $2}' | awk -F'"' '{print $2}')
  
  if [ "$href" == "$expected" ]; then
    print_pass "Canonical URL matches page URL: $href"
  else
    print_fail "Canonical URL mismatch. Found: $href, Expected: $expected"
  fi
}

test_hreflang_tags() {
  local url=$1
  local html_content=$(curl -s "$url")
  
  local missing=""
  for locale in "${LOCALES[@]}"; do
    if ! echo "$html_content" | grep -qi "hreflang=\"${locale}\""; then
      missing="${missing} ${locale}"
    fi
  done

  if [ -z "$missing" ]; then
    print_pass "Found hreflang tags for ${LOCALES[*]}"
  else
    print_fail "Missing hreflang tags for:${missing}"
  fi
}

test_robots_txt() {
  local url="${BASE_URL}/robots.txt"
  local content=$(curl -s "$url")
  
  print_header "Testing File: $url"
  
  if ! echo "$content" | grep -q "User-agent: *"; then
    print_fail "Missing 'User-agent: *'"
  else
    print_pass "Found 'User-agent: *'"
  fi
  
  if ! echo "$content" | grep -q "Allow: /"; then
    print_fail "Missing 'Allow: /'"
  else
    print_pass "Found 'Allow: /'"
  fi

  if ! echo "$content" | grep -q "Sitemap: ${CANONICAL_BASE}/sitemap-index.xml"; then
    print_fail "Missing or incorrect Sitemap URL"
  else
    print_pass "Found correct Sitemap URL"
  fi
}

test_llms_txt() {
  local url="${BASE_URL}/llms.txt"
  print_header "Testing File: $url"

  local headers=$(curl -s -o /dev/null -D - -w '%{http_code}' "$url")
  if ! echo "$headers" | grep -qi "^content-type: text/plain"; then
    print_fail "llms.txt is not served as text/plain"
  else
    print_pass "llms.txt is served as text/plain"
  fi

  local content=$(curl -s "$url")
  if echo "$content" | grep -q "droit du travail"; then
    print_pass "llms.txt summarises the firm"
  else
    print_fail "llms.txt is missing the firm summary"
  fi
}

test_ai_crawler_rules() {
  local content=$(curl -s "${BASE_URL}/robots.txt")
  print_header "Testing AI crawler rules"

  for bot in GPTBot OAI-SearchBot ClaudeBot PerplexityBot; do
    if echo "$content" | grep -q "User-agent: ${bot}"; then
      print_pass "Explicit rule for ${bot}"
    else
      print_fail "No explicit rule for ${bot}"
    fi
  done
}

test_json_ld() {
  local url=$1
  local content=$(curl -s "$url")

  if ! echo "$content" | grep -q 'application/ld+json'; then
    print_fail "No JSON-LD block found"
    return
  fi

  # Extract the JSON-LD payload and check the two node types we publish.
  local payload=$(echo "$content" | tr -d '\n' | grep -o '<script type="application/ld+json">[^<]*' | head -1)

  if echo "$payload" | grep -q '"LegalService"'; then
    print_pass "JSON-LD declares the firm as a LegalService"
  else
    print_fail "JSON-LD is missing the LegalService node"
  fi

  if echo "$payload" | grep -q '"Person"'; then
    print_pass "JSON-LD declares at least one Person"
  else
    print_fail "JSON-LD is missing Person nodes"
  fi
}

test_sitemap() {
    local url="${BASE_URL}/sitemap-index.xml"
    print_header "Testing File: $url"
    test_http_status "$url"
}

# --- Main Execution ---

main() {
  print_header "Running SEO Test Suite for $BASE_URL"
  
  # --- Site-wide File Tests ---
  test_robots_txt
  test_ai_crawler_rules
  test_llms_txt
  test_sitemap
  
  # --- Page-specific Tests ---
  for page in "${PAGES_TO_TEST[@]}"; do
    local url="${BASE_URL}${page}"
    print_header "Testing Page: $url"
    test_http_status "$url"
    test_meta_robots "$url" "$UA_GOOGLEBOT" "Googlebot"
    test_meta_robots "$url" "$UA_BINGBOT" "Bingbot"
    test_canonical_tag "$url"
    test_hreflang_tags "$url"
    test_json_ld "$url"
  done
  
  echo -e "\n${COLOR_BOLD}All tests completed.${COLOR_RESET}"
}

main 