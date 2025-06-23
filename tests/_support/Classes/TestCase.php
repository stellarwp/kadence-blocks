<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\ContainerAdapter;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use RuntimeException;

class TestCase extends WPTestCase {

	protected Container $container;

	protected function setUp(): void {
		parent::setUp();

		$this->container = App::instance( new ContainerAdapter( new \KadenceWP\KadenceBlocks\lucatume\DI52\Container() ) )->container();
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
