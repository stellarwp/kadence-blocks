<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Path;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use Tests\Support\Classes\TestCase;

final class PathFactoryTest extends TestCase {

	private Path_Factory $path_factory;
	private ?string $request_uri_cache;

	protected function setUp(): void {
		parent::setUp();

		$this->request_uri_cache = $_SERVER['REQUEST_URI'] ?? null;

		$this->path_factory = $this->container->get( Path_Factory::class );
	}

	protected function tearDown(): void {
		// Restore the original REQUEST_URI.
		if ( isset( $this->request_uri_cache ) ) {
			$_SERVER['REQUEST_URI'] = $this->request_uri_cache;
		}

		parent::tearDown();
	}

	public function testItHandlesRootPath(): void {
		$_SERVER['REQUEST_URI'] = '/';

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
	}

	public function testItStripsQueryString(): void {
		$_SERVER['REQUEST_URI'] = '/wp-login.php?redirect_to=/dashboard';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php', $path->path() );
	}

	public function testItNormalizesDuplicateSlashes(): void {
		$_SERVER['REQUEST_URI'] = '/wp//includes///file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp/includes/file.php', $path->path() );
	}

	public function testItNormalizesTripleSlashes(): void {
		$_SERVER['REQUEST_URI'] = '///wp-login.php';

		$path = $this->path_factory->make();

		$this->assertInstanceOf( Path::class, $path );
		$this->assertSame( '/wp-login.php', $path->path() );
	}

	public function testItFallsBackToRootWhenRequestUriMissing(): void {
		unset( $_SERVER['REQUEST_URI'] );

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
	}

	public function testItFallsBackToRootWhenRequestUriEmpty(): void {
		$_SERVER['REQUEST_URI'] = '';

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
	}

	public function testItHandlesLeadingSlashesAndQuery(): void {
		$_SERVER['REQUEST_URI'] = '///wp/wp-login.php?foo=bar';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp/wp-login.php', $path->path() );
	}

	public function testItHandlesTrailingSlash(): void {
		$_SERVER['REQUEST_URI'] = '/wp-login.php/';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php/', $path->path() );
	}
}
