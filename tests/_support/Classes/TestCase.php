<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use RuntimeException;
use Brain\Monkey;

class TestCase extends WPTestCase {

	protected Container $container;
	protected ?string $request_uri_cache;

	protected function setUp(): void {
		// Cache the original REQUEST_URI.
		$this->request_uri_cache = $_SERVER['REQUEST_URI'] ?? null;

		parent::setUp();

		// Already initialized via kadence_blocks_init().
		$this->container = App::instance()->container();
	}

	protected function tearDown(): void {
		// Restore the original REQUEST_URI.
		if ( isset( $this->request_uri_cache ) ) {
			$_SERVER['REQUEST_URI'] = $this->request_uri_cache;
		}

		Monkey\tearDown();

		parent::tearDown();
	}

	/**
	 * Load the content of a fixture.
	 *
	 * @param string $file The filename, relative to the codeception _data/fixtures path.
	 *
	 * @throws \RuntimeException
	 */
	protected function fixture( string $file ): string {
		$path = codecept_data_dir( sprintf( 'fixtures/%s', $file ) );

		if ( ! file_exists( $path ) ) {
			throw new RuntimeException( sprintf( 'Fixture file "%s" does not exist', $path ) );
		}

		return (string) file_get_contents( $path );
	}
}
