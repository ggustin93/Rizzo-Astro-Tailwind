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
BASE_URL="https://crizzo-avocate.be"
# Add page paths to this array to include them in the tests.
PAGES_TO_TEST=(
  "/fr/"
  "/en/"
  "/it/"
  "/fr/contact/"
  "/en/contact/"
  "/it/contact/"
)

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
  
  if [ "$href" == "$url" ]; then
    print_pass "Canonical URL matches page URL: $href"
  else
    print_fail "Canonical URL mismatch. Found: $href, Expected: $url"
  fi
}

test_hreflang_tags() {
  local url=$1
  local html_content=$(curl -s "$url")
  
  # Assuming 3 languages: fr, en, it
  local fr_ok=$(echo "$html_content" | grep -i 'hreflang="fr"' | wc -l)
  local en_ok=$(echo "$html_content" | grep -i 'hreflang="en"' | wc -l)
  local it_ok=$(echo "$html_content" | grep -i 'hreflang="it"' | wc -l)

  if [ "$fr_ok" -gt 0 ] && [ "$en_ok" -gt 0 ] && [ "$it_ok" -gt 0 ]; then
    print_pass "Found hreflang tags for fr, en, it"
  else
    print_fail "Missing one or more hreflang tags (fr:$fr_ok, en:$en_ok, it:$it_ok)"
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

  if ! echo "$content" | grep -q "Sitemap: ${BASE_URL}/sitemap-index.xml"; then
    print_fail "Missing or incorrect Sitemap URL"
  else
    print_pass "Found correct Sitemap URL"
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
  done
  
  echo -e "\n${COLOR_BOLD}All tests completed.${COLOR_RESET}"
}

main 