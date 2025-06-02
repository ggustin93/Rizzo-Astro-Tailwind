#!/bin/bash

# Configuration
HOST="crizzo-avocate.be"
API_KEY="d77e7bbb53844ce7b455448cecfa0ffd"
KEY_LOCATION_URL="https://crizzo-avocate.be/d77e7bbb53844ce7b455448cecfa0ffd.txt"
INDEXNOW_API_ENDPOINT="https://api.indexnow.org/IndexNow"
SITEMAP_URL="https://crizzo-avocate.be/sitemap-0.xml" # Adjusted to the actual sitemap

# --- Helper function to submit a list of URLs ---
submit_urls_to_indexnow() {
  local urls_to_submit_array=("$@")
  local batch_url_list_json=""

  if [ "${#urls_to_submit_array[@]}" -eq 0 ]; then
    echo "No URLs to submit."
    return
  fi

  echo "URLs in current batch:"
  for url_item in "${urls_to_submit_array[@]}"; do
    echo "- $url_item"
    if [ -z "$batch_url_list_json" ]; then
      batch_url_list_json="\"$url_item\""
    else
      batch_url_list_json="$batch_url_list_json, \"$url_item\""
    fi
  done

  local current_json_payload
  current_json_payload=$(cat <<EOF
{
  "host": "$HOST",
  "key": "$API_KEY",
  "keyLocation": "$KEY_LOCATION_URL",
  "urlList": [$batch_url_list_json]
}
EOF
)

  echo "------------------------------------"
  echo "Constructed JSON Payload for batch:"
  echo "$current_json_payload"
  echo "------------------------------------"

  local current_response_code
  current_response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$INDEXNOW_API_ENDPOINT" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$current_json_payload")

  echo "📬 Response from IndexNow API for batch:"
  echo "HTTP Status Code: $current_response_code"

  case $current_response_code in
    200) echo "✅ OK: Batch submitted successfully." ;;
    202) echo "✅ Accepted: Batch submission request accepted." ;;
    400) echo "❌ Bad Request: Invalid format for batch." ;;
    403) echo "❌ Forbidden: Key not valid for batch." ;;
    422) echo "❌ Unprocessable Entity: URLs in batch don't belong to host or key issue." ;;
    429) echo "❌ Too Many Requests for batch." ;;
    *) echo "⚠️ Unknown Response Code for batch: $current_response_code." ;;
  esac
  echo "------------------------------------"
}
# --- End Helper Function ---


# Default mode: manual URL submission
SUBMIT_SITEMAP=false

# Parse command-line options
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -s|--sitemap) SUBMIT_SITEMAP=true; shift ;;
    *) # Assume it's a URL if not an option
       # This part will be handled later if not submitting sitemap
       break ;;
  esac
done

echo "🚀 Submitting URLs to IndexNow..."
echo "------------------------------------"
echo "Host: $HOST"
echo "Key: $API_KEY"
echo "Key Location: $KEY_LOCATION_URL"
echo "API Endpoint: $INDEXNOW_API_ENDPOINT"

URLS_TO_PROCESS=()

if $SUBMIT_SITEMAP; then
  echo "🗺️  Fetching URLs from sitemap: $SITEMAP_URL"
  if ! command -v xmllint &> /dev/null; then
    echo "❌ Error: xmllint is not installed. Please install it to parse the sitemap."
    echo "   On Debian/Ubuntu: sudo apt-get install libxml2-utils"
    echo "   On macOS (with Homebrew): brew install libxml2"
    exit 1
  fi

  SITEMAP_CONTENT=$(curl -s -L "$SITEMAP_URL")
  if [ -z "$SITEMAP_CONTENT" ]; then
    echo "❌ Error: Could not fetch sitemap content from $SITEMAP_URL or it's empty."
    exit 1
  fi

  # Extract URLs from <loc> tags. Handles default namespace if present.
  # Using a temporary file for xmllint to handle potential BOM or weird chars
  TMP_SITEMAP_FILE=$(mktemp)
  echo "$SITEMAP_CONTENT" > "$TMP_SITEMAP_FILE"

  # Attempt to parse with and without namespace, as sitemaps can vary
  EXTRACTED_URLS=$(xmllint --xpath "//*[local-name()='urlset']/*[local-name()='url']/*[local-name()='loc']/text()" "$TMP_SITEMAP_FILE" 2>/dev/null || \
                   xmllint --xpath "/urlset/url/loc/text()" "$TMP_SITEMAP_FILE" 2>/dev/null)
  
  rm "$TMP_SITEMAP_FILE"

  if [ -z "$EXTRACTED_URLS" ]; then
      echo "❌ Error: No URLs found in sitemap or failed to parse. Check sitemap format."
      # For debugging, you can print SITEMAP_CONTENT here
      # echo "Sitemap content was:"
      # echo "$SITEMAP_CONTENT"
      exit 1
  fi
  
  # Read into array using a while loop for better portability
  URLS_TO_PROCESS=() # Initialize an empty array
  if [[ -n "$EXTRACTED_URLS" ]]; then # Check if EXTRACTED_URLS is not empty
    while IFS= read -r line; do
      # Avoid adding empty lines if xmllint output has them
      if [[ -n "$line" ]]; then 
        URLS_TO_PROCESS+=("$line")
      fi
    done <<< "$EXTRACTED_URLS"
  fi
  
  if [ "${#URLS_TO_PROCESS[@]}" -eq 0 ]; then
      echo "⚠️ No URLs extracted from sitemap. Nothing to submit."
      exit 0
  fi
  echo "✅ Found ${#URLS_TO_PROCESS[@]} URLs in sitemap."

else # Manual URL submission
  if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <url1> [url2] ..."
    echo "   or: $0 -s (or --sitemap) to submit all URLs from $SITEMAP_URL"
    echo "Example (manual): $0 https://${HOST}/fr/page1 https://${HOST}/fr/page2"
    exit 1
  fi
  for url_arg in "$@"; do
    URLS_TO_PROCESS+=("$url_arg")
  done
  echo "📄 Submitting manually provided URLs:"
fi

# Submit the collected URLs (could be from sitemap or manual input)
# For simplicity, submitting all in one go. IndexNow supports up to 10,000.
# If you expect more, batching logic would be needed here.
submit_urls_to_indexnow "${URLS_TO_PROCESS[@]}"

echo "💡 Remember: This script submits URLs. Indexing itself is still up to the search engines."
echo "   Verify submission status in Bing Webmaster Tools." 