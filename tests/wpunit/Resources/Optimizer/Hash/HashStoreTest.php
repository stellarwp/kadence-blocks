<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Store;
use Tests\Support\Classes\TestCase;

final class HashStoreTest extends TestCase {

	private Hash_Store $hash_store;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->hash_store = $this->container->get( Hash_Store::class );

		// Create a test post.
		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);
	}

	protected function tearDown(): void {
		// Clean up test data.
		if ( $this->post_id ) {
			$this->hash_store->delete( $this->post_id, Viewport::desktop() );
			$this->hash_store->delete( $this->post_id, Viewport::mobile() );
		}

		parent::tearDown();
	}

	public function testGetReturnsNullWhenHashDoesNotExist(): void {
		$result = $this->hash_store->get( $this->post_id, Viewport::desktop() );

		$this->assertNull( $result );
	}

	public function testGetReturnsHashWhenExists(): void {
		$hash = 'test_hash_value';
		$this->hash_store->set( $this->post_id, Viewport::desktop(), $hash );

		$result = $this->hash_store->get( $this->post_id, Viewport::desktop() );

		$this->assertSame( $hash, $result );
	}

	public function testGetReturnsCorrectHashForDifferentViewports(): void {
		$desktop_hash = 'desktop_hash_value';
		$mobile_hash  = 'mobile_hash_value';

		$this->hash_store->set( $this->post_id, Viewport::desktop(), $desktop_hash );
		$this->hash_store->set( $this->post_id, Viewport::mobile(), $mobile_hash );

		$this->assertSame( $desktop_hash, $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
		$this->assertSame( $mobile_hash, $this->hash_store->get( $this->post_id, Viewport::mobile() ) );
	}

	public function testSetReturnsTrueOnSuccessfulUpdate(): void {
		$hash = 'test_hash_value';

		$result = $this->hash_store->set( $this->post_id, Viewport::desktop(), $hash );

		$this->assertTrue( $result );
	}

	public function testSetOverwritesExistingHash(): void {
		$original_hash = 'original_hash_value';
		$new_hash      = 'new_hash_value';

		$this->hash_store->set( $this->post_id, Viewport::desktop(), $original_hash );
		$this->hash_store->set( $this->post_id, Viewport::desktop(), $new_hash );

		$result = $this->hash_store->get( $this->post_id, Viewport::desktop() );

		$this->assertSame( $new_hash, $result );
	}

	public function testSetWorksForAllViewports(): void {
		$desktop_hash = 'desktop_hash_value';
		$mobile_hash  = 'mobile_hash_value';

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $desktop_hash ) );
		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::mobile(), $mobile_hash ) );
	}

	public function testDeleteReturnsTrueWhenHashExists(): void {
		$hash = 'test_hash_value';
		$this->hash_store->set( $this->post_id, Viewport::desktop(), $hash );

		$result = $this->hash_store->delete( $this->post_id, Viewport::desktop() );

		$this->assertTrue( $result );
	}

	public function testDeleteReturnsFalseWhenHashDoesNotExist(): void {
		$result = $this->hash_store->delete( $this->post_id, Viewport::desktop() );

		$this->assertFalse( $result );
	}

	public function testDeleteRemovesHashFromStorage(): void {
		$hash = 'test_hash_value';
		$this->hash_store->set( $this->post_id, Viewport::desktop(), $hash );

		// Verify hash exists.
		$this->assertSame( $hash, $this->hash_store->get( $this->post_id, Viewport::desktop() ) );

		// Delete the hash.
		$this->hash_store->delete( $this->post_id, Viewport::desktop() );

		// Verify hash no longer exists.
		$this->assertNull( $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
	}

	public function testDeleteOnlyRemovesSpecificViewportHash(): void {
		$desktop_hash = 'desktop_hash_value';
		$mobile_hash  = 'mobile_hash_value';

		$this->hash_store->set( $this->post_id, Viewport::desktop(), $desktop_hash );
		$this->hash_store->set( $this->post_id, Viewport::mobile(), $mobile_hash );

		// Delete only desktop hash.
		$this->hash_store->delete( $this->post_id, Viewport::desktop() );

		// Verify desktop hash is gone but mobile hash remains.
		$this->assertNull( $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
		$this->assertSame( $mobile_hash, $this->hash_store->get( $this->post_id, Viewport::mobile() ) );
	}

	public function testHashIsolationBetweenDifferentPosts(): void {
		$post_id_1 = $this->factory()->post->create( [ 'post_title' => 'Post 1' ] );
		$post_id_2 = $this->factory()->post->create( [ 'post_title' => 'Post 2' ] );

		$hash_1 = 'hash_for_post_1';
		$hash_2 = 'hash_for_post_2';

		$this->hash_store->set( $post_id_1, Viewport::desktop(), $hash_1 );
		$this->hash_store->set( $post_id_2, Viewport::desktop(), $hash_2 );

		$this->assertSame( $hash_1, $this->hash_store->get( $post_id_1, Viewport::desktop() ) );
		$this->assertSame( $hash_2, $this->hash_store->get( $post_id_2, Viewport::desktop() ) );

		// Clean up.
		$this->hash_store->delete( $post_id_1, Viewport::desktop() );
		$this->hash_store->delete( $post_id_2, Viewport::desktop() );
	}

	public function testEmptyStringHashReturnsNull(): void {
		$empty_hash = '';

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $empty_hash ) );
		$this->assertNull( $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
	}

	public function testLongHashStringIsStoredAndRetrieved(): void {
		$long_hash = str_repeat( 'a', 1000 );

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $long_hash ) );
		$this->assertSame( $long_hash, $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
	}

	public function testSpecialCharactersInHashArePreserved(): void {
		$special_hash = 'hash_with_special_chars_!@#$%^&*()_+-=[]{}|;:,.<>?';

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $special_hash ) );
		$this->assertSame( $special_hash, $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
	}
}
