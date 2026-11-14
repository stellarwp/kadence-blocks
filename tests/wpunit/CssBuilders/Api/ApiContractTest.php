<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Api;

use Tests\wpunit\KadenceBlocksTestCase;

/**
 * The public API of the CSS builder classes only ever grows.
 *
 * Kadence Blocks Pro can run against an older or newer Kadence Blocks, so a method may be added but never removed or
 * given more required parameters. When this fails on purpose, regenerate the snapshot with
 * `KB_UPDATE_API_SNAPSHOT=1` and bump KADENCE_BLOCKS_CSS_BUILDERS_VERSION.
 */
final class ApiContractTest extends KadenceBlocksTestCase {

	private const SNAPSHOT = __DIR__ . '/css-builders-api.json';

	/**
	 * Nothing in the snapshot was removed or made stricter.
	 *
	 * @return void
	 */
	public function testPublicApiIsAdditiveOnly(): void {
		$current = $this->current();

		if ( getenv( 'KB_UPDATE_API_SNAPSHOT' ) ) {
			file_put_contents( self::SNAPSHOT, wp_json_encode( $current, JSON_PRETTY_PRINT ) . "\n" ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_file_put_contents -- Developer tool.
		}

		$snapshot = json_decode( (string) file_get_contents( self::SNAPSHOT ), true );
		$broken   = [];

		foreach ( $snapshot as $class_name => $methods ) {
			foreach ( $methods as $method => $required ) {
				$now = $current[ $class_name ][ $method ] ?? null;

				if ( null === $now || $now > $required ) {
					$broken[] = $class_name . '::' . $method;
				}
			}
		}

		$this->assertSame( [], $broken, 'The CSS builder API lost or tightened methods.' );
	}

	/**
	 * The snapshot has the classes Pro depends on.
	 *
	 * @return void
	 */
	public function testSnapshotIsNotEmpty(): void {
		$snapshot = json_decode( (string) file_get_contents( self::SNAPSHOT ), true );

		$this->assertArrayHasKey( 'Kadence_Blocks_Css_Build_Input', $snapshot );
		$this->assertArrayHasKey( 'Kadence_Blocks_Css_Builders', $snapshot );
		$this->assertNotEmpty( $snapshot['Kadence_Blocks_Css_Build_Input'] );
	}

	/**
	 * The count of required parameters of every public method of every shared builder class.
	 *
	 * @return array<string, array<string, int>>
	 */
	private function current(): array {
		$map = $this->class_map();

		$autoload = static function ( string $name ) use ( $map ): void {
			if ( isset( $map[ $name ] ) ) {
				require_once $map[ $name ];
			}
		};

		spl_autoload_register( $autoload );

		$api = [];

		foreach ( array_keys( $map ) as $name ) {
			$api[ $name ] = $this->describe( $name );
		}

		spl_autoload_unregister( $autoload );
		ksort( $api );

		return $api;
	}

	/**
	 * Every class and interface the shared builder directories declare, with its file.
	 *
	 * @return array<string, string>
	 */
	private function class_map(): array {
		$map = [];

		foreach ( [ 'css-writers', 'css-builders' ] as $folder ) {
			$files = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( KADENCE_BLOCKS_PATH . 'includes/' . $folder, \FilesystemIterator::SKIP_DOTS ) );

			foreach ( $files as $file ) {
				preg_match( '/^(?:final |abstract )?(?:class|interface) (Kadence_Blocks_\w+)/m', (string) file_get_contents( $file->getPathname() ), $match ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local source files.

				if ( 'php' === $file->getExtension() && ! empty( $match[1] ) ) {
					$map[ $match[1] ] = $file->getPathname();
				}
			}
		}

		return $map;
	}

	/**
	 * The required parameter count of each public method of a class or interface.
	 *
	 * @param string $name The class name.
	 *
	 * @return array<string, int>
	 */
	private function describe( string $name ): array {
		$methods = [];

		foreach ( ( new \ReflectionClass( $name ) )->getMethods( \ReflectionMethod::IS_PUBLIC ) as $method ) {
			$methods[ $method->getName() ] = $method->getNumberOfRequiredParameters();
		}

		ksort( $methods );

		return $methods;
	}
}
