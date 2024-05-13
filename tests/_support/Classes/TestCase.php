<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\ContainerAdapter;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;

class TestCase extends WPTestCase {

	protected Container $container;

	protected function setUp(): void {
		parent::setUp();

		$this->container = App::instance( new ContainerAdapter( new \KadenceWP\KadenceBlocks\lucatume\DI52\Container() ) )->container();
	}

}
