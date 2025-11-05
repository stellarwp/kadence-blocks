<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Path;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use Tests\Support\Classes\TestCase;

final class PathFactoryTest extends TestCase {

	private Path_Factory $path_factory;

	protected function setUp(): void {
		parent::setUp();

		$this->path_factory = $this->container->get( Path_Factory::class );
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

	public function testItNormalizesMultipleSlashes(): void {
		$_SERVER['REQUEST_URI'] = '/wp//includes///file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp/includes/file.php', $path->path() );
	}

	public function testItNormalizesTripleSlashesAtStart(): void {
		$_SERVER['REQUEST_URI'] = '///wp-login.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php', $path->path() );
	}

	public function testItHasEmptyPathWhenRequestUriMissing(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		unset( $_SERVER['REQUEST_URI'] );

		$this->path_factory->make();
	}

	public function testItHasEmptyPathWhenRequestUriEmpty(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		$_SERVER['REQUEST_URI'] = '';

		$this->path_factory->make();
	}

	public function testItNormalizesLeadingSlashesAndStripsQuery(): void {
		$_SERVER['REQUEST_URI'] = '///wp/wp-login.php?foo=bar';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp/wp-login.php', $path->path() );
	}

	public function testItHandlesTrailingSlash(): void {
		$_SERVER['REQUEST_URI'] = '/wp-login.php/';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php/', $path->path() );
	}

	public function testItAddsLeadingSlashWhenMissing(): void {
		$_SERVER['REQUEST_URI'] = 'page/subpage';

		$path = $this->path_factory->make();

		$this->assertSame( '/page/subpage', $path->path() );
	}

	public function testItHandlesPathOfZero(): void {
		$_SERVER['REQUEST_URI'] = '/0';

		$path = $this->path_factory->make();

		$this->assertSame( '/0', $path->path() );
	}

	public function testItStripsFragments(): void {
		$_SERVER['REQUEST_URI'] = '/page#section';

		$path = $this->path_factory->make();

		$this->assertSame( '/page', $path->path() );
	}

	public function testItHandlesQueryOnlyUri(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		$_SERVER['REQUEST_URI'] = '?query=value';

		$this->path_factory->make();
	}

	public function testItHandlesComplexQueryString(): void {
		$_SERVER['REQUEST_URI'] = '/page?foo=bar&baz=qux#anchor';

		$path = $this->path_factory->make();

		$this->assertSame( '/page', $path->path() );
	}

	public function testItHandlesUrlEncodedPath(): void {
		$_SERVER['REQUEST_URI'] = '/page%20with%20spaces/file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/page%20with%20spaces/file.php', $path->path() );
	}

	public function testItNormalizesMixedMultipleSlashes(): void {
		$_SERVER['REQUEST_URI'] = '//path///to////file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/path/to/file.php', $path->path() );
	}

	public function testItHandlesPathWithOnlySlashes(): void {
		$_SERVER['REQUEST_URI'] = '/////';

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
	}
}
