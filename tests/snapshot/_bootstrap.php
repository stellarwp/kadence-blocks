<?php declare( strict_types=1 );
// cspell:ignore spatie .

/*
 * Codeception regenerates snapshots on `--debug`, while the spatie/phpunit-snapshot-assertions
 * library does the same on `--update-snapshots`. Codeception strictly validates its CLI
 * arguments, so appending `--update-snapshots` to the `codecept run` command directly would
 * throw an error. We translate the intent here: when running with `--debug`, also tell spatie
 * to update snapshots.
 */
if ( in_array( '--debug', $_SERVER['argv'], true ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
	$_SERVER['argv'][] = '--update-snapshots';
}
