#!/bin/bash
set -e

# Sync selected files from upstream Uniwind repository
# Usage: ./scripts/sync-uniwind.sh [branch|tag]

UPSTREAM_REPO="https://github.com/uni-stack/uniwind.git"
UPSTREAM_REF="${1:-main}"
DEST_DIR="packages/uniwind-plugin-next/src/uniwind"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TEMP_DIR=$(mktemp -d)

# Files to sync (relative to packages/uniwind/src in upstream)
FILES_TO_SYNC=(
  "src/css/index.ts"
  "src/css/insets.ts"
  "src/css/processFunctions.ts"
  "src/css/themes.ts"
  "src/css/variants.ts"
  "src/metro/logger.ts"
  "src/utils/buildDtsFile.ts"
  "src/utils/stringifyThemes.ts"
)

# Also sync these from packages/uniwind root
ROOT_FILES=(
  "LICENSE"
)

cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo "Syncing from uniwind@$UPSTREAM_REF..."

# Shallow clone with sparse checkout for efficiency
cd "$TEMP_DIR"
git clone --depth 1 --filter=blob:none --sparse "$UPSTREAM_REPO" uniwind
cd uniwind
git sparse-checkout set packages/uniwind
git checkout "$UPSTREAM_REF" 2>/dev/null || git checkout "origin/$UPSTREAM_REF"

UPSTREAM_SRC="$TEMP_DIR/uniwind/packages/uniwind"

# Sync source files
for file in "${FILES_TO_SYNC[@]}"; do
  src="$UPSTREAM_SRC/$file"
  dest="$ROOT_DIR/$DEST_DIR/$file"

  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "  ✓ $file"
  else
    echo "  ✗ $file (not found upstream)"
  fi
done

# Sync root files
for file in "${ROOT_FILES[@]}"; do
  src="$UPSTREAM_SRC/$file"
  dest="$ROOT_DIR/$DEST_DIR/$file"

  if [[ -f "$src" ]]; then
    cp "$src" "$dest"
    echo "  ✓ $file"
  else
    echo "  ✗ $file (not found upstream)"
  fi
done

# Get the commit hash for reference
cd "$TEMP_DIR/uniwind"
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_DATE=$(git log -1 --format=%ci)

echo ""
echo "Synced from: $UPSTREAM_REF ($COMMIT_HASH)"
echo "Commit date: $COMMIT_DATE"
echo ""
echo "Done! Review changes with: git diff $DEST_DIR"