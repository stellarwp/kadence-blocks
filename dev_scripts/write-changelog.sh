#!/usr/bin/env bash
#
# Compile pending changelog entries into readme.txt using
# @stellarwp/changelogger (and the custom Kadence-format strategy). The
# changelogger itself is fetched on demand via dev_scripts/changelogger.sh.
#
# Authors add entries during development with:
#   composer run changelog:add
# which drops a YAML file into ./changelog. This command rolls them up.
#
# A version is required. changelogger's own auto-versioning is NOT used: it
# only reads bracketed "= [x.y.z]" headers, which the Kadence format
# (= x.y.z = / Release Date: ...) doesn't use, so it would fall back to
# 0.1.0. The release version is supplied explicitly (release:prep passes it
# through).
#
# Usage:
#   dev_scripts/write-changelog.sh <version> [--date <date>] [--dry-run]
#   composer run changelog:write -- 3.8.0
#
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="${1:-}"
shift || true

if [ -z "$VERSION" ]; then
  echo "Error: a version number is required." >&2
  echo "Usage: dev_scripts/write-changelog.sh <version> [--date <date>] [--dry-run]" >&2
  exit 1
fi

echo "Writing changelog for $VERSION..."
exec dev_scripts/changelogger.sh write --overwrite-version "$VERSION" "$@"
