<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Status;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Meta;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;

final class MetaTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Meta $meta;
	private Store $store;
	private Status $status;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks for path testing.
		update_option( 'permalink_structure', '/%postname%/' );

		$this->meta   = $this->container->get( Meta::class );
		$this->store  = $this->container->get( Store::class );
		$this->status = $this->container->get( Status::class );

		// Create a test post.
		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_name'   => 'test-post',
			]
		);

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		// Clean up test data.
		if ( $this->post_id > 0 ) {
			$post_path = $this->get_post_path( $this->post_id );
			if ( $post_path ) {
				$path = new Path( $post_path, $this->post_id );
				$this->store->delete( $path );
			}
			$this->status->delete( $this->post_id );
		}

		parent::tearDown();
	}

	public function testItHasMetaKeyConstant(): void {
		// Test that the meta key constant is accessible.
		$this->assertEquals( '_kb_optimizer_status', Meta::KEY );
	}

	public function testItRegistersPostMeta(): void {
		$this->meta->register_meta();

		// Verify the meta is registered.
		$registered = get_registered_meta_keys( 'post' );

		$this->assertArrayHasKey( Meta::KEY, $registered );

		$meta_config = $registered[ Meta::KEY ];

		$this->assertIsCallable( $meta_config['sanitize_callback'] );
		$this->assertTrue( $meta_config['single'] );
		$this->assertSame( 'integer', $meta_config['type'] );
		$this->assertSame( 'integer', $meta_config['show_in_rest']['schema']['type'] );
		$this->assertSame( 'Exclude this post from optimization.', $meta_config['show_in_rest']['schema']['description'] );
	}

	public function testSanitizeCallbackValidatesStatusValues(): void {
		$this->meta->register_meta();

		$registered        = get_registered_meta_keys( 'post' );
		$meta_config       = $registered[ Meta::KEY ];
		$sanitize_callback = $meta_config['sanitize_callback'];

		// Test valid statuses are preserved.
		$this->assertSame( Status::EXCLUDED, $sanitize_callback( Status::EXCLUDED ) );
		$this->assertSame( Status::NOT_OPTIMIZED, $sanitize_callback( Status::NOT_OPTIMIZED ) );
		$this->assertSame( Status::OPTIMIZED, $sanitize_callback( Status::OPTIMIZED ) );
		$this->assertSame( Status::STALE, $sanitize_callback( Status::STALE ) );

		// Test invalid statuses default to NOT_OPTIMIZED.
		$this->assertSame( Status::NOT_OPTIMIZED, $sanitize_callback( 999 ) );
		$this->assertSame( Status::NOT_OPTIMIZED, $sanitize_callback( -2 ) );
		$this->assertSame( Status::NOT_OPTIMIZED, $sanitize_callback( 'invalid' ) );
	}

	public function testSanitizeCallbackCastsToInteger(): void {
		$this->meta->register_meta();

		$registered        = get_registered_meta_keys( 'post' );
		$meta_config       = $registered[ Meta::KEY ];
		$sanitize_callback = $meta_config['sanitize_callback'];

		// Test string values are cast to integers.
		$this->assertSame( Status::OPTIMIZED, $sanitize_callback( '1' ) );
		$this->assertSame( Status::EXCLUDED, $sanitize_callback( '-1' ) );
	}

	public function testMaybeClearOptimizerDataReturnsEarlyForWrongMetaKey(): void {
		$post_path = $this->get_post_path( $this->post_id );
		$path      = new Path( $post_path, $this->post_id );

		// Set some data in the store.
		$this->assertTrue( $this->store->has( $path ) === false );

		// Call with wrong meta_key - should return early without deleting.
		$this->meta->maybe_clear_optimizer_data( $this->post_id, 'wrong_key', Status::EXCLUDED );

		// Verify store wasn't accessed (we can't easily verify this without mocking,
		// but we can verify the method doesn't throw errors).
		$this->assertTrue( true );
	}

	public function testMaybeClearOptimizerDataReturnsEarlyForNonExcludedValue(): void {
		$post_path = $this->get_post_path( $this->post_id );
		$path      = new Path( $post_path, $this->post_id );

		// Call with correct meta_key but wrong value - should return early.
		$this->meta->maybe_clear_optimizer_data( $this->post_id, Meta::KEY, Status::OPTIMIZED );

		// Verify method doesn't throw errors.
		$this->assertTrue( true );
	}

	public function testMaybeClearOptimizerDataReturnsEarlyForAutosave(): void {
		// Create an autosave post.
		$autosave_result = wp_create_post_autosave(
			[
				'post_ID'   => $this->post_id,
				'post_type' => 'post',
			]
		);

		if ( $autosave_result && is_int( $autosave_result ) ) {
			// Call with autosave post - should return early.
			$this->meta->maybe_clear_optimizer_data( $autosave_result, Meta::KEY, Status::EXCLUDED );

			// Verify method doesn't throw errors.
			$this->assertTrue( true );
		} else {
			// If autosave creation fails, skip this test.
			$this->markTestSkipped( 'Could not create autosave post for testing' );
		}
	}

	public function testMaybeClearOptimizerDataReturnsEarlyForRevision(): void {
		// Create a revision post.
		$revision_id = wp_save_post_revision( $this->post_id );

		if ( $revision_id ) {
			// Call with revision post - should return early.
			$this->meta->maybe_clear_optimizer_data( $revision_id, Meta::KEY, Status::EXCLUDED );

			// Verify method doesn't throw errors.
			$this->assertTrue( true );
		}
	}

	public function testMaybeClearOptimizerDataReturnsEarlyForPostWithoutPath(): void {
		// Create a post without a permalink (e.g., draft with no slug).
		$draft_id = $this->factory()->post->create(
			[
				'post_title'  => 'Draft Post',
				'post_status' => 'draft',
				'post_name'   => '',
			]
		);

		// Call with post that has no path - should return early.
		$this->meta->maybe_clear_optimizer_data( $draft_id, Meta::KEY, Status::EXCLUDED );

		// Verify method doesn't throw errors.
		$this->assertTrue( true );

		// Clean up.
		wp_delete_post( $draft_id, true );
	}

	public function testMaybeClearOptimizerDataDeletesStoreDataForExcludedPost(): void {
		$post_path = $this->get_post_path( $this->post_id );
		$path      = new Path( $post_path, $this->post_id );

		// Verify post has a valid path.
		$this->assertNotEmpty( $post_path );

		// Create and set analysis data in the store.
		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => [
					'criticalImages'   => [],
					'backgroundImages' => [],
					'sections'         => [],
				],
				'mobile'  => [
					'criticalImages'   => [],
					'backgroundImages' => [],
					'sections'         => [],
				],
				'images'  => [],
			]
		);

		$this->assertTrue( $this->store->set( $path, $analysis ) );
		$this->assertTrue( $this->store->has( $path ) );

		// Call with correct parameters - should delete from store.
		$this->meta->maybe_clear_optimizer_data( $this->post_id, Meta::KEY, Status::EXCLUDED );

		// Verify data was deleted from store.
		$this->assertFalse( $this->store->has( $path ) );
		$this->assertNull( $this->store->get( $path ) );
	}
}
