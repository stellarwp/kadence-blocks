#!/bin/bash
#
# Runs phpcs against only the lines that have changed, so CI fails on issues
# introduced by a branch without flagging pre-existing violations elsewhere.
#
# phpcs is run against the full set of changed PHP files, the results are
# emitted as JSON, and diffFilter (exussum12/coverage-checker) narrows that
# report down to the lines present in the diff. diffFilter exits non-zero when
# any changed line still has an issue, and prints every remaining issue to the
# log -- unlike ReviewDog, the output is not truncated when there are many.
#
# Parameters
# $1 - operation_mode (diff or selected) (default: diff)
# $2 - base branch (default: origin/master)
# $3 - file list (newline separated, required when operation_mode is selected)
#
# cSpell:ignore ACMR diffcs diffFilter exussum

# Fail loudly: without this a failed `git diff` (base ref not fetched, a typo,
# a shallow-fetch issue) would print an error, leave an empty file list, and the
# "No php files to check" guard below would exit 0 -- a misleading green check.
set -euo pipefail

OPERATION_MODE="${1:-diff}"
BASE_BRANCH="${2:-origin/master}"

# check if operation mode is valid
if [ "$OPERATION_MODE" != "diff" ] && [ "$OPERATION_MODE" != "selected" ]; then
	echo "Invalid operation mode: $OPERATION_MODE. Valid values are: diff, selected."
	exit 1
fi

# if operation mode is selected, check if file list is provided
if [ "$OPERATION_MODE" = "selected" ]; then
	if [ -z "${3:-}" ]; then
		echo "File list is required for operation mode: selected."
		exit 1
	fi
fi

# both modes diff against the base ref, so make sure it actually exists before
# we rely on the diff being empty to mean "nothing changed"
if ! git rev-parse --verify --quiet "$BASE_BRANCH" >/dev/null; then
	echo "Base ref '$BASE_BRANCH' not found. Did the workflow fetch it?"
	exit 1
fi

# constants
DIFF_FILE="diff.txt"
DIFF_PHPCS_FILE="diffcs.txt"
PHPCS_JSON_FILE="phpcs.json"

# generate the list of php files to check
if [ "$OPERATION_MODE" = "diff" ]; then
	git diff "$BASE_BRANCH" --name-only --diff-filter=ACMR -- '*.php' >"$DIFF_PHPCS_FILE"
elif [ "$OPERATION_MODE" = "selected" ]; then
	shopt -s globstar
	echo "$3" >"$DIFF_PHPCS_FILE"
fi

# if there are no php files to check, exit successfully
if [ ! -s "$DIFF_PHPCS_FILE" ]; then
	echo "No php files to check."
	exit 0
fi

# generate the diff used to determine which lines changed
git diff "$BASE_BRANCH" >"$DIFF_FILE"

# run phpcs against the changed files, emitting a json report
# -q keeps the json clean -- without it phpcs prints deprecation notices to
# stdout (the ruleset still references some deprecated sniffs) ahead of the json
phpcs -q --standard=phpcs.xml --report=json --file-list="$DIFF_PHPCS_FILE" >"$PHPCS_JSON_FILE" || true

# validate the phpcs result
if [ "$(head -c 1 "$PHPCS_JSON_FILE")" != "{" ]; then
	echo "Invalid json file generated:"
	cat "$PHPCS_JSON_FILE"
	exit 1
fi

# filter the report down to the changed lines (exits non-zero on any issue)
vendor/bin/diffFilter --phpcs "$DIFF_FILE" "$PHPCS_JSON_FILE"
