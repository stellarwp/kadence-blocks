#!/usr/bin/env bash
#
# Release prep: run the version-bump pipeline in order.
#
#   1. Bump every version declared in .puprc -> paths.versions   (pup replace-version)
#   2. Replace @since TBD / @deprecated TBD / 'tbd' placeholders  (pup replace-tbd)
#
# Both steps are thin wrappers around stellarwp/pup's native commands; the
# pup phar is downloaded on demand (same guard as the `pup` composer script).
#
# Usage:
#   dev_scripts/release-prep.sh <version> [--dry-run]
#   composer run release:prep 3.5.0
#
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="${1:-}"
shift || true

if [ -z "$VERSION" ]; then
  echo "Error: a version number is required." >&2
  echo "Usage: dev_scripts/release-prep.sh <version> [--dry-run]" >&2
  exit 1
fi

DRY_RUN=
case " $* " in
  *" --dry-run "*) DRY_RUN=1 ;;
esac

# Download the pinned pup phar on first use (kept in sync with the `pup` script
# in composer.json). The phar is gitignored, so this is a no-op once cached.
PUP_VERSION="2.0.0"
if [ ! -f ./bin/pup.phar ]; then
  curl -o bin/pup.phar -L -C - "https://github.com/stellarwp/pup/releases/download/${PUP_VERSION}/pup.phar"
fi

echo "=== 1/2: Updating version strings ==="
if [ -n "$DRY_RUN" ]; then
  echo "  [dry run] version bump skipped (pup replace-version has no dry-run mode)."
else
  php ./bin/pup.phar replace-version "$VERSION"
fi

echo ""
echo "=== 2/2: Replacing TBD placeholder tags ==="
php ./bin/pup.phar replace-tbd "$VERSION" ${DRY_RUN:+--dry-run}

echo ""
echo "✓ Release prep complete for $VERSION"
