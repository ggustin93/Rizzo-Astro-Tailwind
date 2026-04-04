#!/bin/bash

# ==============================================================================
# run-dns-tests.sh — DNS & Migration Health Check
#
# Comprehensive health check for the Netlify DNS migration of
# rizzo-michiels.be (primary) and crizzo-avocate.be (alias).
#
# Checks: DNS propagation, DNSSEC, SSL, redirect chains, GSC readiness,
#         Google site verification, site availability, SEO signals.
#
# Usage:
#   ./scripts/run-dns-tests.sh          # Full health check
#   ./scripts/run-dns-tests.sh --quick  # DNS-only (no HTTP checks)
#
# Dependencies: dig, curl, openssl
# ==============================================================================

set -euo pipefail

# --- Configuration ---
PRIMARY_DOMAIN="rizzo-michiels.be"
ALIAS_DOMAIN="crizzo-avocate.be"
NETLIFY_NS_PATTERN="nsone.net"
GOOGLE_VERIFICATION="google-site-verification=cqhUlOYSwGAy0UV3MKcObCD6UDw7I8mcrnEAblGM3xQ"
EXPECTED_NETLIFY_NS=(
  "dns1.p04.nsone.net."
  "dns2.p04.nsone.net."
  "dns3.p04.nsone.net."
  "dns4.p04.nsone.net."
)

PAGES_TO_CHECK=(
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

# --- Colors & Symbols ---
RST='\033[0m'
BLD='\033[1m'
GRN='\033[0;32m'
RED='\033[0;31m'
YLW='\033[0;33m'
BLU='\033[0;34m'

PASS=0; FAIL=0; WARN=0; SKIP=0

ok()   { echo -e "  ${GRN}PASS${RST}  $1"; PASS=$((PASS + 1)); }
fail() { echo -e "  ${RED}FAIL${RST}  $1"; FAIL=$((FAIL + 1)); }
warn() { echo -e "  ${YLW}WARN${RST}  $1"; WARN=$((WARN + 1)); }
skip() { echo -e "  ${BLU}SKIP${RST}  $1"; SKIP=$((SKIP + 1)); }
hdr()  { echo -e "\n${BLD}${YLW}--- $1 ---${RST}"; }

# --- Dependency check ---
for cmd in dig curl openssl; do
  if ! command -v "$cmd" &>/dev/null; then
    echo -e "${RED}Missing dependency: $cmd${RST}" && exit 1
  fi
done

QUICK_MODE=false
[[ "${1:-}" == "--quick" ]] && QUICK_MODE=true

echo -e "\n${BLD}DNS & Migration Health Check${RST}"
echo -e "  Primary : ${PRIMARY_DOMAIN}"
echo -e "  Alias   : ${ALIAS_DOMAIN}"
echo -e "  Date    : $(date '+%Y-%m-%d %H:%M:%S')"
[[ "$QUICK_MODE" == true ]] && echo -e "  Mode    : ${YLW}Quick (DNS only)${RST}"

# ==============================================================================
# 1. DNSSEC
# ==============================================================================
hdr "1. DNSSEC Status"

DS_RECORD=$(dig "$PRIMARY_DOMAIN" DS +short 2>/dev/null)
DNSKEY=$(dig "$PRIMARY_DOMAIN" DNSKEY +short 2>/dev/null)

if [[ -z "$DS_RECORD" ]]; then
  ok "No DS record at .be registry (DNSSEC disabled) — safe for Netlify DNS"
else
  fail "DS record still present at .be registry — DNSSEC active"
  echo -e "       ${RED}Netlify DNS does not support DNSSEC.${RST}"
  echo -e "       ${RED}DNSSEC-validating resolvers (Google, Cloudflare) may fail to resolve.${RST}"
  echo -e "       ${RED}Disable DNSSEC in Infomaniak before changing nameservers.${RST}"
  echo -e "       DS: ${DS_RECORD}"
fi

if [[ -n "$DNSKEY" ]]; then
  warn "DNSKEY records still present (will disappear after NS migration)"
else
  ok "No DNSKEY records"
fi

# ==============================================================================
# 2. Nameservers
# ==============================================================================
hdr "2. Nameservers"

NS_RECORDS=$(dig "$PRIMARY_DOMAIN" NS +short 2>/dev/null | sort)
IS_NETLIFY_DNS=false

if echo "$NS_RECORDS" | grep -q "$NETLIFY_NS_PATTERN"; then
  IS_NETLIFY_DNS=true
  ok "NS on Netlify DNS"
  while IFS= read -r ns; do
    echo "       $ns"
  done <<< "$NS_RECORDS"
else
  warn "NS still on Infomaniak (propagation pending or NS not changed yet)"
  while IFS= read -r ns; do
    echo "       $ns"
  done <<< "$NS_RECORDS"
  echo ""
  echo -e "       ${BLU}Expected Netlify NS:${RST}"
  for ns in "${EXPECTED_NETLIFY_NS[@]}"; do
    echo "         $ns"
  done
fi

# Check if Netlify DNS zone responds directly
NETLIFY_A=$(dig @dns1.p04.nsone.net "$PRIMARY_DOMAIN" A +short 2>/dev/null)
if [[ -n "$NETLIFY_A" ]]; then
  ok "Netlify DNS zone configured and responding (A: $NETLIFY_A)"
else
  fail "Netlify DNS zone not responding — run 'Set up Netlify DNS' in dashboard"
fi

# Alias domain NS
ALIAS_NS=$(dig "$ALIAS_DOMAIN" NS +short 2>/dev/null | head -1)
if echo "$ALIAS_NS" | grep -q "$NETLIFY_NS_PATTERN"; then
  ok "${ALIAS_DOMAIN} on Netlify DNS"
else
  warn "${ALIAS_DOMAIN} NS: $ALIAS_NS"
fi

# ==============================================================================
# 3. DNS Records
# ==============================================================================
hdr "3. DNS Records (${PRIMARY_DOMAIN})"

A_RECORD=$(dig "$PRIMARY_DOMAIN" A +short 2>/dev/null | head -1)
if [[ -n "$A_RECORD" ]]; then
  ok "A record: $A_RECORD"
else
  fail "No A record"
fi

WWW_RECORD=$(dig "www.${PRIMARY_DOMAIN}" +short 2>/dev/null | head -1)
if [[ -n "$WWW_RECORD" ]]; then
  ok "www: $WWW_RECORD"
else
  warn "No www record"
fi

# Google site verification TXT
TXT_RECORDS=$(dig "$PRIMARY_DOMAIN" TXT +short 2>/dev/null)
if echo "$TXT_RECORDS" | grep -q "google-site-verification"; then
  ok "Google site verification TXT present"
else
  fail "Google site verification TXT missing — add to Netlify DNS"
  echo -e "       ${RED}Value: ${GOOGLE_VERIFICATION}${RST}"
fi

# Email records (informational — should NOT be present after migration)
MX_RECORD=$(dig "$PRIMARY_DOMAIN" MX +short 2>/dev/null)
if [[ -n "$MX_RECORD" ]]; then
  warn "MX record still present: $MX_RECORD (remove if no email needed)"
else
  ok "No MX record (expected — no email on this domain)"
fi

SPF_RECORD=$(echo "$TXT_RECORDS" | grep "spf" || true)
if [[ -n "$SPF_RECORD" ]]; then
  warn "SPF record still present: $SPF_RECORD (remove if no email needed)"
else
  ok "No SPF record (expected — no email on this domain)"
fi

DMARC_RECORD=$(dig "_dmarc.${PRIMARY_DOMAIN}" TXT +short 2>/dev/null)
if [[ -n "$DMARC_RECORD" ]]; then
  warn "DMARC record still present: $DMARC_RECORD (remove if no email needed)"
else
  ok "No DMARC record (expected — no email on this domain)"
fi

# ==============================================================================
# Quick mode stops here
# ==============================================================================
if [[ "$QUICK_MODE" == true ]]; then
  echo ""
  hdr "SUMMARY (Quick Mode)"
  echo -e "  ${GRN}PASS: ${PASS}${RST}  ${RED}FAIL: ${FAIL}${RST}  ${YLW}WARN: ${WARN}${RST}  ${BLU}SKIP: ${SKIP}${RST}"
  [[ $FAIL -gt 0 ]] && exit 1 || exit 0
fi

# ==============================================================================
# 4. SSL Certificates
# ==============================================================================
hdr "4. SSL Certificates"

for domain in "$PRIMARY_DOMAIN" "$ALIAS_DOMAIN"; do
  CERT_INFO=$(echo | openssl s_client -connect "${domain}:443" -servername "$domain" 2>/dev/null \
    | openssl x509 -noout -dates -subject 2>/dev/null)

  if [[ -n "$CERT_INFO" ]]; then
    EXPIRY=$(echo "$CERT_INFO" | grep "notAfter" | cut -d= -f2)
    EXPIRY_EPOCH=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$EXPIRY" "+%s" 2>/dev/null || date -d "$EXPIRY" "+%s" 2>/dev/null || echo "0")
    NOW_EPOCH=$(date "+%s")
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

    if [[ $DAYS_LEFT -gt 14 ]]; then
      ok "$domain — SSL valid, expires in ${DAYS_LEFT} days ($EXPIRY)"
    elif [[ $DAYS_LEFT -gt 0 ]]; then
      warn "$domain — SSL expires in ${DAYS_LEFT} days ($EXPIRY)"
    else
      fail "$domain — SSL expired or invalid"
    fi
  else
    fail "$domain — SSL connection failed"
  fi
done

# ==============================================================================
# 5. Redirect Chains (critical for GSC)
# ==============================================================================
hdr "5. Redirect Chains (${ALIAS_DOMAIN} → ${PRIMARY_DOMAIN})"

# HTTP redirect — informational only (Netlify always does HTTP→HTTPS at platform level before netlify.toml rules)
HTTP_RESPONSE=$(curl -sI --max-time 10 "http://${ALIAS_DOMAIN}/" 2>/dev/null)
HTTP_CODE=$(echo "$HTTP_RESPONSE" | grep -i "^HTTP/" | head -1 | awk '{print $2}')
HTTP_LOCATION=$(echo "$HTTP_RESPONSE" | grep -i "^location:" | head -1 | sed 's/location: *//i' | tr -d '\r')

if [[ "$HTTP_CODE" == "301" ]]; then
  if echo "$HTTP_LOCATION" | grep -qi "https://${PRIMARY_DOMAIN}"; then
    ok "http://${ALIAS_DOMAIN}/ → 301 → ${HTTP_LOCATION} (single hop)"
  elif echo "$HTTP_LOCATION" | grep -qi "https://${ALIAS_DOMAIN}"; then
    warn "http://${ALIAS_DOMAIN}/ → 301 → ${HTTP_LOCATION} (2 hops: HTTP→HTTPS then cross-domain)"
    echo -e "       ${YLW}Expected behavior on Netlify — platform upgrades HTTP→HTTPS before netlify.toml rules.${RST}"
    echo -e "       ${YLW}GSC 'Change of Address' validates HTTPS directly (1 hop) — this is not a blocker.${RST}"
  else
    fail "http://${ALIAS_DOMAIN}/ → 301 → ${HTTP_LOCATION} (unexpected target)"
  fi
else
  fail "http://${ALIAS_DOMAIN}/ → HTTP ${HTTP_CODE} (expected 301)"
fi

# HTTPS redirect
HTTPS_RESPONSE=$(curl -sI --max-time 10 "https://${ALIAS_DOMAIN}/" 2>/dev/null)
HTTPS_CODE=$(echo "$HTTPS_RESPONSE" | grep -i "^HTTP/" | head -1 | awk '{print $2}')
HTTPS_LOCATION=$(echo "$HTTPS_RESPONSE" | grep -i "^location:" | head -1 | sed 's/location: *//i' | tr -d '\r')

if [[ "$HTTPS_CODE" == "301" ]] && echo "$HTTPS_LOCATION" | grep -qi "$PRIMARY_DOMAIN"; then
  ok "https://${ALIAS_DOMAIN}/ → 301 → ${HTTPS_LOCATION}"
else
  fail "https://${ALIAS_DOMAIN}/ → HTTP ${HTTPS_CODE} → ${HTTPS_LOCATION}"
fi

# Count total hops for HTTP chain
FULL_CHAIN=$(curl -sIL --max-time 15 "http://${ALIAS_DOMAIN}/" 2>/dev/null | grep -ci "^HTTP/")
HOPS=$((FULL_CHAIN - 1))

if [[ $HOPS -le 2 ]]; then
  ok "Full chain from http://${ALIAS_DOMAIN}/: ${HOPS} redirect(s) → 200"
else
  warn "Full chain from http://${ALIAS_DOMAIN}/: ${HOPS} redirects (ideally <=2)"
fi

# Path-level redirects
echo ""
echo -e "  ${BLU}Path-level 301 checks:${RST}"
for path in "${REDIRECT_PATHS[@]}"; do
  RESP=$(curl -sI --max-time 10 "https://${ALIAS_DOMAIN}${path}" 2>/dev/null)
  CODE=$(echo "$RESP" | grep -i "^HTTP/" | head -1 | awk '{print $2}')
  LOC=$(echo "$RESP" | grep -i "^location:" | head -1 | sed 's/location: *//i' | tr -d '\r')

  if [[ "$CODE" == "301" ]] && echo "$LOC" | grep -qi "$PRIMARY_DOMAIN"; then
    ok "${path} → 301 → ${LOC}"
  elif [[ "$CODE" == "301" ]]; then
    warn "${path} → 301 → ${LOC} (not pointing to ${PRIMARY_DOMAIN})"
  else
    fail "${path} → HTTP ${CODE} (expected 301)"
  fi
done

# ==============================================================================
# 6. Site Availability
# ==============================================================================
hdr "6. Site Availability (${PRIMARY_DOMAIN})"

for path in "${PAGES_TO_CHECK[@]}"; do
  CODE=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "https://${PRIMARY_DOMAIN}${path}" 2>/dev/null)
  if [[ "$CODE" == "200" ]]; then
    ok "${path} → 200"
  else
    fail "${path} → HTTP ${CODE}"
  fi
done

# ==============================================================================
# 7. SEO Signals
# ==============================================================================
hdr "7. SEO Signals"

# Canonical tags
for path in "/fr/" "/en/" "/it/"; do
  HTML=$(curl -s --max-time 10 "https://${PRIMARY_DOMAIN}${path}" 2>/dev/null)
  CANONICAL=$(echo "$HTML" | tr '>' '\n' | grep -i 'rel="canonical"' | sed -n 's/.*href="\([^"]*\)".*/\1/p' | head -1)

  if [[ -z "$CANONICAL" ]]; then
    fail "${path} — no canonical tag"
  elif echo "$CANONICAL" | grep -q "$PRIMARY_DOMAIN"; then
    ok "${path} canonical → ${CANONICAL}"
  elif echo "$CANONICAL" | grep -q "$ALIAS_DOMAIN"; then
    fail "${path} canonical still points to old domain: ${CANONICAL}"
  else
    warn "${path} canonical: ${CANONICAL}"
  fi
done

# Sitemap
SITEMAP_CODE=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "https://${PRIMARY_DOMAIN}/sitemap-index.xml" 2>/dev/null)
if [[ "$SITEMAP_CODE" == "200" ]]; then
  ok "sitemap-index.xml → 200"
  SITEMAP_CONTENT=$(curl -s --max-time 10 "https://${PRIMARY_DOMAIN}/sitemap-index.xml" 2>/dev/null)
  if echo "$SITEMAP_CONTENT" | grep -qi "$ALIAS_DOMAIN"; then
    fail "Sitemap contains old domain URLs"
  else
    ok "Sitemap clean — no old domain references"
  fi
else
  fail "sitemap-index.xml → HTTP ${SITEMAP_CODE}"
fi

# robots.txt
ROBOTS=$(curl -s --max-time 10 "https://${PRIMARY_DOMAIN}/robots.txt" 2>/dev/null)
ROBOTS_CODE=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "https://${PRIMARY_DOMAIN}/robots.txt" 2>/dev/null)

if [[ "$ROBOTS_CODE" == "200" ]]; then
  ok "robots.txt → 200"
  if echo "$ROBOTS" | grep -qi "sitemap.*${PRIMARY_DOMAIN}"; then
    ok "robots.txt sitemap points to ${PRIMARY_DOMAIN}"
  else
    warn "robots.txt sitemap reference may be incorrect"
  fi
else
  fail "robots.txt → HTTP ${ROBOTS_CODE}"
fi

# ==============================================================================
# 8. GSC Readiness Assessment
# ==============================================================================
hdr "8. GSC 'Change of Address' Readiness"

GSC_READY=true

# Check 1: HTTPS single-hop redirect (what GSC actually validates)
if [[ "$HTTPS_CODE" == "301" ]] && echo "$HTTPS_LOCATION" | grep -qi "https://${PRIMARY_DOMAIN}"; then
  ok "HTTPS redirect is single-hop → ${PRIMARY_DOMAIN} (GSC validates HTTPS)"
else
  fail "HTTPS redirect is NOT pointing to ${PRIMARY_DOMAIN} — GSC validation will fail"
  GSC_READY=false
fi

# Check 2: SSL on both domains
for domain in "$PRIMARY_DOMAIN" "$ALIAS_DOMAIN"; do
  SSL_OK=$(echo | openssl s_client -connect "${domain}:443" -servername "$domain" 2>/dev/null | grep -c "Verify return code: 0" || true)
  if [[ "$SSL_OK" -ge 1 ]]; then
    ok "$domain SSL verification OK"
  else
    warn "$domain SSL verification uncertain"
  fi
done

# Check 3: Google site verification
if echo "$TXT_RECORDS" | grep -q "google-site-verification"; then
  ok "Google site verification active"
else
  fail "Google site verification missing — GSC won't verify ownership"
  GSC_READY=false
fi

if [[ "$GSC_READY" == true ]]; then
  echo ""
  echo -e "  ${GRN}${BLD}GSC 'Change of Address' should succeed.${RST}"
  echo -e "  ${BLU}Next steps:${RST}"
  echo -e "    1. GSC → ${ALIAS_DOMAIN} → Settings → Change of Address"
  echo -e "    2. Select ${PRIMARY_DOMAIN} as new site"
  echo -e "    3. Submit sitemap: https://${PRIMARY_DOMAIN}/sitemap-index.xml"
  echo -e "    4. URL Inspection on key pages"
else
  echo ""
  echo -e "  ${RED}${BLD}GSC 'Change of Address' NOT ready yet.${RST}"
  if [[ "$IS_NETLIFY_DNS" == false ]]; then
    echo -e "  ${YLW}Waiting for NS propagation to Netlify DNS will fix the redirect chain.${RST}"
  fi
fi

# ==============================================================================
# Summary
# ==============================================================================
echo ""
hdr "SUMMARY"
echo -e "  ${GRN}PASS: ${PASS}${RST}  ${RED}FAIL: ${FAIL}${RST}  ${YLW}WARN: ${WARN}${RST}  ${BLU}SKIP: ${SKIP}${RST}"
echo ""

if [[ $FAIL -gt 0 ]]; then
  echo -e "  ${RED}${BLD}${FAIL} check(s) failed — action required${RST}"
  exit 1
elif [[ $WARN -gt 0 ]]; then
  echo -e "  ${YLW}${BLD}All critical checks passed, ${WARN} warning(s) to review${RST}"
  exit 0
else
  echo -e "  ${GRN}${BLD}All checks passed — migration healthy${RST}"
  exit 0
fi
