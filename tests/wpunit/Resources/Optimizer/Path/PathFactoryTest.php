<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Path;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use Tests\Support\Classes\TestCase;

final class PathFactoryTest extends TestCase {

	private Path_Factory $path_factory;

	protected function setUp(): void {
		parent::setUp();

		$this->path_factory = $this->container->get( Path_Factory::class );
	}

	protected function tearDown(): void {
		unset( $_SERVER['REQUEST_URI'] );

		parent::tearDown();
	}

	public function testItHandlesTripleSlashes(): void {
		$_SERVER['REQUEST_URI'] = '///wp-login.php';

		$this->assertInstanceOf( Path::class, $this->path_factory->make() );
	}
}
