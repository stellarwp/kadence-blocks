#!/bin/bash
#
# Checks out and builds the Kadence theme the `integration-kadence` suite boots, then
# links it into the WordPress themes directory slic serves.
#
# The theme is a test dependency, not a package: it is cloned into
# tests/_themes/kadence (gitignored, .git kept so re-runs only fetch) at the
# ref named by KADENCE_THEME_GIT_REF, and built with `pup build`.
#
# WPLoader activates a theme by slug from wp-content/themes, so the checkout is
# linked there. The link is relative and only resolves inside the slic
# containers, where the plugins directory sits next to the themes directory.
#
# Environment
# KADENCE_THEME_GIT_REF - branch or tag to check out (default: release/fse)
# KADENCE_THEME_GIT_URL - repository to clone (default: stellarwp/kadence on GitHub)
# SLIC_THEMES_DIR       - host path of slic's themes directory (default: read from `slic info`)
# SLIC_BIN              - slic executable (default: slic)
#
# cSpell:ignore puprc

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THEME_DIR="${PLUGIN_DIR}/tests/_themes/kadence"
THEME_REF="${KADENCE_THEME_GIT_REF:-release/fse}"
THEME_URL="${KADENCE_THEME_GIT_URL:-https://github.com/stellarwp/kadence.git}"
SLIC_BIN="${SLIC_BIN:-slic}"

if [ -d "${THEME_DIR}/.git" ]; then
	git -C "${THEME_DIR}" fetch --depth 1 origin "${THEME_REF}"
	git -C "${THEME_DIR}" checkout --force --detach FETCH_HEAD
else
	mkdir -p "$(dirname "${THEME_DIR}")"
	git clone --depth 1 --branch "${THEME_REF}" "${THEME_URL}" "${THEME_DIR}"
fi

echo "Kadence theme at ${THEME_REF} ($(git -C "${THEME_DIR}" rev-parse --short HEAD))"

(
	cd "${THEME_DIR}"
	# The theme's `pup` script appends its arguments to the download step too, so fetch pup first.
	composer pup > /dev/null
	composer -- pup build
)

if [ -z "${SLIC_THEMES_DIR:-}" ]; then
	# `slic info` colors its output; strip the escape codes before reading the value.
	SLIC_THEMES_DIR="$("${SLIC_BIN}" info | sed 's/\x1b\[[0-9;]*m//g' | awk -F': ' '/^ *- SLIC_THEMES_DIR:/ { print $2 }')"
fi

if [ -z "${SLIC_THEMES_DIR}" ] || [ ! -d "${SLIC_THEMES_DIR}" ]; then
	echo "Could not find slic's themes directory; set SLIC_THEMES_DIR." >&2
	exit 1
fi

ln -sfn "../plugins/$(basename "${PLUGIN_DIR}")/tests/_themes/kadence" "${SLIC_THEMES_DIR}/kadence"

echo "Linked ${SLIC_THEMES_DIR}/kadence"
