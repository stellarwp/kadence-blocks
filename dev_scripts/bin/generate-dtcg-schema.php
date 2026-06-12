<?php
/**
 * Regenerates (or verifies) the published DTCG JSON Schema from its PHP source of truth.
 *
 * The committed includes/resources/Design_Tokens/Schema/dtcg.schema.json is a generated artifact, not a
 * hand-edited file: it is emitted by Dtcg_Schema_Generator from Token_Type + Alias so the published
 * contract cannot drift from the runtime validator. Run this whenever those classes change.
 *
 * Usage (via Composer, so it works on every platform without a shell wrapper):
 *   composer generate-dtcg-schema             # write the schema file
 *   composer generate-dtcg-schema -- --check  # exit non-zero if the file is stale (CI guard), write nothing
 *
 * This is a local developer CLI tool, never loaded in a WordPress/VIP request, so the VIP filesystem and
 * wp_json_encode rules below do not apply: it must write the repo file directly and emit byte-exact JSON.
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

// phpcs:disable WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_fwrite, WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_file_put_contents, WordPress.WP.AlternativeFunctions.json_encode_json_encode -- CLI build tool, not WP runtime; see file docblock.

use KadenceWP\KadenceBlocks\Dev\Design_Tokens\Schema\Dtcg_Schema_Generator;

// This script lives in dev_scripts/bin/, so the repo root is two levels up.
$root = dirname( __DIR__, 2 );

$autoload = $root . '/vendor/autoload.php';
if ( ! is_file( $autoload ) ) {
	fwrite( STDERR, "error: vendor/autoload.php not found. Run `composer install` first.\n" );
	exit( 1 );
}
require $autoload;

$target = $root . '/includes/resources/Design_Tokens/Schema/dtcg.schema.json';
$check  = in_array( '--check', array_slice( $argv, 1 ), true );

// Must match exactly how the conformance test re-encodes the schema for its byte comparison.
$expected = json_encode( ( new Dtcg_Schema_Generator() )->generate(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . "\n";

if ( $check ) {
	$current = is_file( $target ) ? (string) file_get_contents( $target ) : '';

	if ( $current === $expected ) {
		fwrite( STDOUT, "ok: dtcg.schema.json is up to date.\n" );
		exit( 0 );
	}

	fwrite( STDERR, "error: dtcg.schema.json is stale. Run `composer generate-dtcg-schema` to regenerate.\n" );
	exit( 1 );
}

if ( file_put_contents( $target, $expected ) === false ) {
	fwrite( STDERR, sprintf( "error: could not write %s\n", $target ) );
	exit( 1 );
}

fwrite( STDOUT, sprintf( "wrote %s (%d bytes)\n", $target, strlen( $expected ) ) );
exit( 0 );
