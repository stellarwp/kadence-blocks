#!/usr/bin/env bash
#
# Run the pinned @stellarwp/changelogger via npx, fetched on demand from the
# public npm registry (and cached by npm after the first run).
#
# Deliberately NOT a package.json dependency: the zip CI resolves @stellarwp/*
# from GitHub Packages, where changelogger isn't published, so listing it
# there breaks `npm install` during builds. It's release tooling, not a build
# dependency — same on-demand pattern as the pup.phar download.
#
# Usage:
#   dev_scripts/changelogger.sh <changelogger args...>
#   composer run changelog:add
#
set -euo pipefail

cd "$(dirname "$0")/.."

CHANGELOGGER_VERSION="0.10.0"

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx (Node.js) is required to run @stellarwp/changelogger." >&2
  exit 1
fi

exec npx -y "@stellarwp/changelogger@${CHANGELOGGER_VERSION}" "$@"
