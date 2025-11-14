<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Path;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use Tests\Support\Classes\OptimizerTestCase;

final class PathTest extends OptimizerTestCase {

	public function testConstructorWithPathOnly(): void {
		$path = new Path( '/test-path/' );

		$this->assertSame( '/test-path/', $path->path() );
		$this->assertNull( $path->post_id() );
	}

	public function testConstructorWithPathAndPostId(): void {
		$path = new Path( '/test-path/', 123 );

		$this->assertSame( '/test-path/', $path->path() );
		$this->assertSame( 123, $path->post_id() );
	}

	public function testConstructorThrowsExceptionForEmptyPath(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		new Path( '' );
	}

	public function testPathReturnsCorrectPath(): void {
		$path = new Path( '/my-test-path/' );

		$this->assertSame( '/my-test-path/', $path->path() );
	}

	public function testHashReturnsConsistentHash(): void {
		$path1 = new Path( '/test-path/' );
		$path2 = new Path( '/test-path/' );

		$hash1 = $path1->hash();
		$hash2 = $path2->hash();

		$this->assertSame( $hash1, $hash2 );
		$this->assertSame( 64, strlen( $hash1 ) ); // SHA256 produces 64 character hex string.
	}

	public function testHashReturnsDifferentHashForDifferentPaths(): void {
		$path1 = new Path( '/test-path-1/' );
		$path2 = new Path( '/test-path-2/' );

		$hash1 = $path1->hash();
		$hash2 = $path2->hash();

		$this->assertNotEquals( $hash1, $hash2 );
	}

	public function testPostIdReturnsNullWhenNotSet(): void {
		$path = new Path( '/test-path/' );

		$this->assertNull( $path->post_id() );
	}

	public function testPostIdReturnsCorrectValueWhenSet(): void {
		$path = new Path( '/test-path/', 456 );

		$this->assertSame( 456, $path->post_id() );
	}

	public function testPostIdCanBeZero(): void {
		$path = new Path( '/test-path/', 0 );

		$this->assertSame( 0, $path->post_id() );
	}

	public function testWithPostIdCreatesNewInstance(): void {
		$original_path = new Path( '/test-path/' );
		$new_path      = $original_path->with_post_id( 789 );

		// Original should remain unchanged.
		$this->assertNull( $original_path->post_id() );
		$this->assertSame( '/test-path/', $original_path->path() );

		// New instance should have post_id.
		$this->assertSame( 789, $new_path->post_id() );
		$this->assertSame( '/test-path/', $new_path->path() );

		// Should be different instances.
		$this->assertNotSame( $original_path, $new_path );
	}

	public function testWithPostIdOverwritesExistingPostId(): void {
		$original_path = new Path( '/test-path/', 123 );
		$new_path      = $original_path->with_post_id( 456 );

		// Original should remain unchanged.
		$this->assertSame( 123, $original_path->post_id() );

		// New instance should have new post_id.
		$this->assertSame( 456, $new_path->post_id() );
	}

	public function testWithPostIdPreservesPath(): void {
		$original_path = new Path( '/complex/path/with/multiple/segments/' );
		$new_path      = $original_path->with_post_id( 999 );

		$this->assertSame( '/complex/path/with/multiple/segments/', $new_path->path() );
	}

	public function testHashIsIndependentOfPostId(): void {
		$path1 = new Path( '/test-path/' );
		$path2 = new Path( '/test-path/', 123 );
		$path3 = new Path( '/test-path/', 456 );

		$hash1 = $path1->hash();
		$hash2 = $path2->hash();
		$hash3 = $path3->hash();

		// Hash should be the same regardless of post_id.
		$this->assertSame( $hash1, $hash2 );
		$this->assertSame( $hash2, $hash3 );
	}

	public function testWorksWithVariousPathFormats(): void {
		$paths = [
			'/',
			'/simple',
			'/with-trailing-slash/',
			'/multiple/segments/in/path',
			'/path/with-numbers/123',
			'/path-with-special-chars-!@#$%',
		];

		foreach ( $paths as $path_string ) {
			$path = new Path( $path_string, 100 );

			$this->assertSame( $path_string, $path->path() );
			$this->assertSame( 100, $path->post_id() );
			$this->assertNotEmpty( $path->hash() );
		}
	}

	public function testPostIdCanBeLargeInteger(): void {
		$large_post_id = 2147483647; // Max 32-bit signed integer.
		$path          = new Path( '/test-path/', $large_post_id );

		$this->assertSame( $large_post_id, $path->post_id() );
	}

	public function testMultipleWithPostIdCalls(): void {
		$path1 = new Path( '/test-path/' );
		$path2 = $path1->with_post_id( 100 );
		$path3 = $path2->with_post_id( 200 );
		$path4 = $path3->with_post_id( 300 );

		$this->assertNull( $path1->post_id() );
		$this->assertSame( 100, $path2->post_id() );
		$this->assertSame( 200, $path3->post_id() );
		$this->assertSame( 300, $path4->post_id() );

		// All should have the same path.
		$this->assertSame( '/test-path/', $path1->path() );
		$this->assertSame( '/test-path/', $path2->path() );
		$this->assertSame( '/test-path/', $path3->path() );
		$this->assertSame( '/test-path/', $path4->path() );
	}
}
