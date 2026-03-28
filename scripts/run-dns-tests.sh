#!/bin/bash

# ==============================================================================
#
# run-dns-tests.sh
#
# Description:
#   A script to perform common DNS checks on a given domain name.
#   It checks for A, AAAA, NS, and DNSKEY records to help diagnose
#   DNS and connectivity issues.
#
# Usage:
#   ./run-dns-tests.sh <domain_name>
#
# Example:
#   ./run-dns-tests.sh rizzo-michiels.be
#
# Dependencies:
#   - dig (usually available in the 'dnsutils' or 'bind-utils' package)
#
# ==============================================================================

# --- Configuration ---
# Colors for output
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[0;33m'
C_BLUE='\033[0;34m'
C_CYAN='\033[0;36m'

# --- Functions ---

# Function to print a formatted header
print_header() {
    printf "\n${C_BLUE}======================================================================${C_RESET}\n"
    printf "${C_CYAN}%s${C_RESET}\n" "$1"
    printf "${C_BLUE}======================================================================${C_RESET}\n"
}

# Function to check if 'dig' command exists
check_dependencies() {
    if ! command -v dig &> /dev/null; then
        printf "${C_RED}Error: 'dig' command not found.${C_RESET}\n"
        printf "Please install 'dnsutils' (Debian/Ubuntu) or 'bind-utils' (CentOS/RHEL) and try again.\n"
        exit 1
    fi
}

# --- Main Script ---

# Check if a domain name was provided
if [ -z "$1" ]; then
    printf "${C_RED}Usage: $0 <domain_name>${C_RESET}\n"
    printf "Example: $0 example.com\n"
    exit 1
fi

DOMAIN=$1

check_dependencies

printf "${C_GREEN}Running DNS diagnostics for domain: ${C_YELLOW}${DOMAIN}${C_RESET}\n"

# --- A Record (IPv4) ---
print_header "Checking A Records (IPv4 addresses)"
A_RECORDS=$(dig +short A "$DOMAIN")
if [ -n "$A_RECORDS" ]; then
    printf "${C_GREEN}Found A records:${C_RESET}\n"
    echo "$A_RECORDS"
else
    printf "${C_YELLOW}No A records found for ${DOMAIN}.${C_RESET}\n"
fi

# --- AAAA Record (IPv6) ---
print_header "Checking AAAA Records (IPv6 addresses)"
AAAA_RECORDS=$(dig +short AAAA "$DOMAIN")
if [ -n "$AAAA_RECORDS" ]; then
    printf "${C_GREEN}Found AAAA records:${C_RESET}\n"
    echo "$AAAA_RECORDS"
else
    printf "${C_YELLOW}No AAAA records found for ${DOMAIN}. (This is not necessarily an error)${C_RESET}\n"
fi

# --- NS Record (Name Servers) ---
print_header "Checking NS Records (Authoritative Name Servers)"
NS_RECORDS=$(dig +short NS "$DOMAIN")
if [ -n "$NS_RECORDS" ]; then
    printf "${C_GREEN}Found NS records:${C_RESET}\n"
    echo "$NS_RECORDS"
else
    printf "${C_RED}Error: No NS records found for ${DOMAIN}. This is a critical issue.${C_RESET}\n"
fi

# --- MX Record (Mail Exchangers) ---
print_header "Checking MX Records (Mail Exchangers)"
MX_RECORDS=$(dig +short MX "$DOMAIN")
if [ -n "$MX_RECORDS" ]; then
    printf "${C_GREEN}Found MX records:${C_RESET}\n"
    echo "$MX_RECORDS"
else
    printf "${C_YELLOW}No MX records found for ${DOMAIN}. (This is only an issue if you expect email services)${C_RESET}\n"
fi

# --- DNSSEC Check (DNSKEY Records) ---
print_header "Checking for DNSSEC (DNSKEY Records)"
DNSKEY_RECORDS=$(dig +short DNSKEY "$DOMAIN")
if [ -n "$DNSKEY_RECORDS" ]; then
    printf "${C_GREEN}DNSSEC appears to be enabled.${C_RESET}\n"
    printf "Found DNSKEY records:\n"
    echo "$DNSKEY_RECORDS"
    
    print_header "Validating DNSSEC with +dnssec flag"
    # The 'ad' flag in the response header indicates Authentic Data (successful validation)
    DNSSEC_VALIDATION=$(dig +dnssec "$DOMAIN" | grep "flags:" | grep "ad")
    if [ -n "$DNSSEC_VALIDATION" ]; then
        printf "${C_GREEN}DNSSEC validation successful! The 'ad' flag was found in the response.${C_RESET}\n"
    else
        printf "${C_RED}Warning: DNSSEC is enabled, but validation may have failed. The 'ad' flag was not found.${C_RESET}\n"
        printf "This could indicate a misconfiguration with your DNSSEC setup.\n"
    fi
else
    printf "${C_GREEN}DNSSEC is not enabled for ${DOMAIN}.${C_RESET}\n"
fi


print_header "All checks complete." 