<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Classmap;

use Tests\wpunit\KadenceBlocksTestCase;

/**
 * The generated class map lists every CSS builder class, and nothing else in the builder folders needs a `require`.
 */
final class ClassmapTest extends KadenceBlocksTestCase {

	/**
	 * Run `php bin/generate-css-classmap.php includes includes/css-builders/classmap.php css-builders css-writers` when this fails.
	 *
	 * @return void
	 */
	public function testClassmapIsCurrent(): void {
		$expected = [];

		foreach ( [ 'css-builders', 'css-writers' ] as $folder ) {
			$files = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( KADENCE_BLOCKS_PATH . 'includes/' . $folder, \FilesystemIterator::SKIP_DOTS ) );

			foreach ( $files as $file ) {
				$expected = array_merge( $expected, $this->declared( $file ) );
			}
		}

		ksort( $expected );

		$this->assertSame( $expected, require KADENCE_BLOCKS_PATH . 'includes/css-builders/classmap.php' );
	}

	/**
	 * No builder or writer file requires another file, except the loader itself; the class map loads them.
	 *
	 * @return void
	 */
	public function testBuilderFilesRequireNothing(): void {
		$offenders = [];

		foreach ( [ 'css-builders', 'css-writers' ] as $folder ) {
			$files = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( KADENCE_BLOCKS_PATH . 'includes/' . $folder, \FilesystemIterator::SKIP_DOTS ) );

			foreach ( $files as $file ) {
				$offenders = array_merge( $offenders, $this->requiring( $file ) );
			}
		}

		$this->assertSame( [], $offenders );
	}

	/**
	 * The classes a PHP file declares, with its path relative to the includes folder.
	 *
	 * @param \SplFileInfo $file The file.
	 *
	 * @return array<string, string>
	 */
	private function declared( \SplFileInfo $file ): array {
		if ( 'php' !== $file->getExtension() || 'classmap.php' === $file->getFilename() ) {
			return [];
		}

		preg_match_all( '/^(?:final |abstract )?(?:class|interface|trait) ([A-Za-z0-9_]+)/m', (string) file_get_contents( $file->getPathname() ), $found ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local source files.

		return array_fill_keys( $found[1], substr( $file->getPathname(), strlen( KADENCE_BLOCKS_PATH . 'includes/' ) ) );
	}

	/**
	 * The path of a PHP file when it starts a line with `require` or `include`.
	 *
	 * @param \SplFileInfo $file The file.
	 *
	 * @return string[]
	 */
	private function requiring( \SplFileInfo $file ): array {
		if ( 'php' !== $file->getExtension() || in_array( $file->getFilename(), [ 'classmap.php', 'class-kadence-blocks-css-builders.php' ], true ) ) {
			return [];
		}

		return preg_match( '/^\s*(require|include)(_once)?\b/m', (string) file_get_contents( $file->getPathname() ) ) ? [ $file->getPathname() ] : []; // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local source files.
	}
}
