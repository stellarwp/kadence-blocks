<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks;

use Tests\wpunit\KadenceBlocksTestCase;

/**
 * The README of the builders documents the public API; it has to match the code.
 */
final class ReadmeTest extends KadenceBlocksTestCase {

	/**
	 * The README text.
	 *
	 * @return string
	 */
	private function readme(): string {
		return (string) file_get_contents( KADENCE_BLOCKS_PATH . 'includes/css-builders/README.md' ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local file.
	}

	/**
	 * Every reusable section in the README exists, with the constructor arguments the README shows.
	 *
	 * @return void
	 */
	public function testReusableSectionsMatchTheCode(): void {
		preg_match_all( '/^\| `(Kadence_Blocks_Css_\w+_Section)\( ([^)]*) \)` \|/m', $this->readme(), $found, PREG_SET_ORDER );

		$this->assertGreaterThan( 10, count( $found ), 'The README table of reusable sections went missing.' );

		foreach ( $found as [ , $class_name, $arguments ] ) {
			$this->assertTrue( class_exists( $class_name ), $class_name . ' is in the README but does not exist.' );

			$documented = array_map(
				static function ( string $argument ): string {
					return ltrim( trim( explode( '=', $argument )[0] ), '$' );
				},
				explode( ',', $arguments )
			);
			$actual     = array_map(
				static function ( \ReflectionParameter $parameter ): string {
					return $parameter->getName();
				},
				( new \ReflectionClass( $class_name ) )->getConstructor()->getParameters()
			);

			$this->assertSame( $actual, $documented, $class_name . ' has other constructor arguments than the README says.' );
		}
	}

	/**
	 * Every hook the README lists is fired by the code, under that name.
	 *
	 * @return void
	 */
	public function testDocumentedHooksExistInTheCode(): void {
		preg_match_all( '/^\| `(kadence_blocks_[a-z_]+)`/m', $this->readme(), $found );

		$source = (string) file_get_contents( KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-css.php' ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local source file.

		foreach ( [ 'css-builders', 'blocks' ] as $folder ) {
			$files = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( KADENCE_BLOCKS_PATH . 'includes/' . $folder, \FilesystemIterator::SKIP_DOTS ) );

			foreach ( $files as $file ) {
				$source .= 'php' === $file->getExtension() ? (string) file_get_contents( $file->getPathname() ) : ''; // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local source files.
			}
		}

		$this->assertGreaterThan( 3, count( $found[1] ) );

		foreach ( $found[1] as $hook ) {
			$this->assertMatchesRegularExpression( "/(apply_filters|do_action)\(\s*'" . preg_quote( $hook, '/' ) . "'/", $source, $hook . ' is in the README but nothing fires it.' );
		}
	}
}
