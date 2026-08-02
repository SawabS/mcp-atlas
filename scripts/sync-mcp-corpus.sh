#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
ROOT="${1:-$PROJECT_DIR}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  fi
}

download_atomic() {
  local url="$1"
  local destination="$2"
  local temporary="${destination}.part"

  curl --fail --silent --show-error --location \
    --retry 4 --retry-all-errors --connect-timeout 20 --max-time 300 \
    "$url" --output "$temporary"
  mv -- "$temporary" "$destination"
}

for command_name in curl git jq python3 sha256sum; do
  require_command "$command_name"
done

mkdir -p \
  "$ROOT/website" \
  "$ROOT/official-repos" \
  "$ROOT/registry/pages" \
  "$ROOT/manifests"

printf 'Downloading canonical website corpus...\n'
download_atomic \
  'https://modelcontextprotocol.io/llms.txt' \
  "$ROOT/website/llms.txt"
download_atomic \
  'https://modelcontextprotocol.io/llms-full.txt' \
  "$ROOT/website/llms-full.txt"
download_atomic \
  'https://registry.modelcontextprotocol.io/openapi.yaml' \
  "$ROOT/registry/openapi.yaml"

printf 'Listing official GitHub repositories...\n'
python3 "$SCRIPT_DIR/sync_github_manifest.py" \
  "$ROOT/manifests/official-repositories.json"

printf 'Cloning or updating official repositories...\n'
jq -r '.[].nameWithOwner' "$ROOT/manifests/official-repositories.json" |
while IFS= read -r repository_name; do
  name="${repository_name#*/}"
  destination="$ROOT/official-repos/$name"

  if [[ -d "$destination/.git" ]]; then
    printf 'Updating %s\n' "$repository_name"
    git -C "$destination" pull --ff-only ||
      printf 'Warning: could not update %s\n' "$repository_name" >&2
  elif [[ -e "$destination" ]]; then
    printf 'Warning: %s exists but is not a Git repository; skipping\n' "$destination" >&2
  else
    printf 'Cloning %s\n' "$repository_name"
    git clone --depth=1 --quiet \
      "https://github.com/${repository_name}.git" "$destination" ||
      printf 'Warning: could not clone %s\n' "$repository_name" >&2
  fi
done

printf 'Downloading MCP Registry metadata...\n'
python3 "$SCRIPT_DIR/sync_registry.py" "$ROOT/registry"

printf 'Building repository revision and ingestion manifests...\n'
: > "$ROOT/manifests/official-repository-commits.tsv"
jq -r '.[].name' "$ROOT/manifests/official-repositories.json" |
while IFS= read -r repository_name; do
  repository_path="$ROOT/official-repos/$repository_name"
  if [[ -d "$repository_path/.git" ]]; then
    printf '%s\t%s\n' \
      "$repository_name" \
      "$(git -C "$repository_path" rev-parse HEAD)"
  fi
done > "$ROOT/manifests/official-repository-commits.tsv"

python3 "$SCRIPT_DIR/build_source_manifest.py" "$ROOT"

printf 'MCP knowledge base synchronized at: %s\n' "$ROOT"
