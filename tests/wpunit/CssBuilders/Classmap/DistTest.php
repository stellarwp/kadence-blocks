<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Classmap;

use Tests\wpunit\KadenceBlocksTestCase;

/**
 * The files the CSS builders need at runtime go into the release.
 *
 * The release is built from the repository minus the paths in `.distignore`. The class map is a generated file, so nothing
 * else would notice if a pattern ever started to cover it.
 */
final class DistTest extends KadenceBlocksTestCase {

	/**
	 * What the builders load while the plugin runs, relative to the plugin folder.
	 *
	 * @var string[]
	 */
	private const RUNTIME_FILES = [
		'includes/css-builders/classmap.php',
		'includes/css-builders/class-kadence-blocks-css-builders.php',
		'includes/css-builders/class-kadence-blocks-css-block-builder.php',
		'includes/css-builders/class-kadence-blocks-css-section-runner.php',
	];

	/**
	 * No line of `.distignore` covers a runtime file or one of its folders.
	 *
	 * @return void
	 */
	public function testRuntimeFilesAreNotIgnoredByTheRelease(): void {
		$ignored = array_filter( array_map( 'trim', file( KADENCE_BLOCKS_PATH . '.distignore' ) ?: [] ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file -- Local file.

		foreach ( self::RUNTIME_FILES as $file ) {
			$this->assertFileExists( KADENCE_BLOCKS_PATH . $file );

			foreach ( $ignored as $pattern ) {
				$prefix = ltrim( rtrim( $pattern, '/' ), '/' );

				$this->assertFalse( $file === $prefix || 0 === strpos( $file, $prefix . '/' ), $file . ' is covered by the .distignore line ' . $pattern . ' and would not ship.' );
				$this->assertFalse( false !== strpos( $pattern, '*' ) && fnmatch( $pattern, $file ), $file . ' is covered by the .distignore pattern ' . $pattern . ' and would not ship.' );
			}
		}
	}
}
