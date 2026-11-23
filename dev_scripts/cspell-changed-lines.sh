#!/bin/bash
#
# Spell-checks only the lines the current branch adds compared with a base ref,
# so touching a file doesn't surface its existing spelling issues. Lines the
# diff didn't add are blanked, which keeps reported line numbers matching the
# files; new files are checked in full.
#
# Usage: dev_scripts/cspell-changed-lines.sh <base-ref>
#
# cSpell:ignore ACMRTUXB

set -uo pipefail

BASE_REF="${1:?Usage: $0 <base-ref>}"
status=0

while IFS= read -r file; do
	[ -f "${file}" ] || continue

	added_lines="$(git diff -U0 --no-color "${BASE_REF}" -- "${file}" | awk '
		/^@@/ {
			split($3, range, ",")
			start = substr(range[1], 2)
			count = (range[2] == "" ? 1 : range[2])
			for (i = 0; i < count; i++) print start + i
		}
	')"
	[ -n "${added_lines}" ] || continue

	awk 'NR == FNR { added[$1] = 1; next } { print (FNR in added) ? $0 : "" }' <(echo "${added_lines}") "${file}" |
		bunx cspell lint -c .cspell.json --no-progress --no-summary --no-must-find-files "stdin://${file}" || status=1
done < <(git diff --name-only --diff-filter=ACMRTUXB "${BASE_REF}")

exit "${status}"
