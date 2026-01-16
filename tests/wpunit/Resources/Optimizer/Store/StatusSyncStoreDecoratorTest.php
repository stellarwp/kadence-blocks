<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Status_Sync_Store_Decorator;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\OptimizerTestCase;

final class StatusSyncStoreDecoratorTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Status_Sync_Store_Decorator $store;

	/** @var Store&MockObject */
	private $mock_store;
	private Status $status;
	private int $post_id;
	private Path $path;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		// Create a mock store for testing.
		$this->mock_store = $this->createMock( Store::class );
		$this->status     = $this->container->get( Status::class );
		$this->store      = new Status_Sync_Store_Decorator( $this->mock_store, $this->status );

		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_name'   => 'test-post',
			]
		);

		$post_path = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path, $this->post_id );

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		// Clean up status.
		if ( $this->post_id > 0 ) {
			$this->status->delete( $this->post_id );
		}

		parent::tearDown();
	}

	public function testHasDelegatesToStore(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( true );

		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testGetDelegatesToStore(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->path )
						->willReturn( $analysis );

		$result = $this->store->get( $this->path );

		$this->assertSame( $analysis, $result );
	}

	public function testSetSyncsStatusFromFreshAnalysis(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Verify initial status is NOT_OPTIMIZED.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$result = $this->store->set( $this->path, $analysis );

		$this->assertTrue( $result );
		// Status should be synced to OPTIMIZED.
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSetSyncsStatusFromStaleAnalysis(): void {
		$stale_analysis = WebsiteAnalysis::from( $this->getResultsFixture( true ) );

		// Verify initial status is NOT_OPTIMIZED.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $stale_analysis )
						->willReturn( true );

		$result = $this->store->set( $this->path, $stale_analysis );

		$this->assertTrue( $result );
		// Status should be synced to STALE.
		$this->assertSame( Status::STALE, $this->status->get( $this->post_id ) );
	}

	public function testSetDoesNotSyncWhenStoreReturnsFalse(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Verify initial status.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( false );

		$result = $this->store->set( $this->path, $analysis );

		$this->assertFalse( $result );
		// Status should not be synced when store returns false.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSetDoesNotSyncWhenPathHasNoPostId(): void {
		$path_without_post_id = new Path( '/test-path/' );
		$analysis             = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $path_without_post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $path_without_post_id, $analysis );

		$this->assertTrue( $result );
		// Status should not be synced when there's no post_id.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testDeleteSyncsStatusDeletion(): void {
		// First set status to OPTIMIZED.
		$this->status->set_optimized( $this->post_id );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( true );

		$result = $this->store->delete( $this->path );

		$this->assertTrue( $result );
		// Status should be deleted (returns to NOT_OPTIMIZED).
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testDeletePreservesExcludedStatus(): void {
		// Set post as excluded.
		$this->status->set_excluded( $this->post_id );
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( true );

		$result = $this->store->delete( $this->path );

		$this->assertTrue( $result );
		// Status::delete() preserves EXCLUDED status.
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );
	}

	public function testDeleteDoesNotSyncWhenPathHasNoPostId(): void {
		$path_without_post_id = new Path( '/test-path/' );

		// Set status first.
		$this->status->set_optimized( $this->post_id );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $path_without_post_id )
						->willReturn( true );

		$result = $this->store->delete( $path_without_post_id );

		$this->assertTrue( $result );
		// Status should not be synced when there's no post_id.
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testDeleteReturnsFalseWhenStoreReturnsFalse(): void {
		// Set status first.
		$this->status->set_optimized( $this->post_id );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( false );

		$result = $this->store->delete( $this->path );

		$this->assertFalse( $result );
		// Status should still be synced even if store returns false.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testResolvesPostIdFromPath(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Use path with explicit post_id.
		$path_with_post_id = new Path( $this->path->path(), $this->post_id );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $path_with_post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $path_with_post_id, $analysis );

		$this->assertTrue( $result );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testResolvesPostIdFromQueriedObject(): void {
		// Set up global $post object for get_post().
		global $post;
		$original_post = $post ?? null;
		$post          = get_post( $this->post_id );

		$path_without_post_id = new Path( $this->path->path() );
		$analysis             = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $path_without_post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $path_without_post_id, $analysis );

		$this->assertTrue( $result );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		// Clean up.
		$post = $original_post;
	}

	public function testDoesNotSyncForTermQueriedObject(): void {
		// Create a category.
		$term_id = $this->factory()->term->create(
			[
				'taxonomy' => 'category',
				'name'     => 'Test Category',
			]
		);

		// Set global $post to null (term pages don't have a post).
		global $post;
		$original_post = $post ?? null;
		$post          = null;

		$path_without_post_id = new Path( '/category/test-category/' );
		$analysis             = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $path_without_post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $path_without_post_id, $analysis );

		$this->assertTrue( $result );
		// Status should not be synced when there's no post (term page).
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );

		// Clean up.
		$post = $original_post;
		wp_delete_term( $term_id, 'category' );
	}

	public function testDoesNotSyncForUserQueriedObject(): void {
		// Create a user.
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'user_email' => 'testauthor@example.com',
			]
		);

		// Set global $post to null (user pages don't have a post).
		global $post;
		$original_post = $post ?? null;
		$post          = null;

		$path_without_post_id = new Path( '/author/testauthor/' );
		$analysis             = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $path_without_post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $path_without_post_id, $analysis );

		$this->assertTrue( $result );
		// Status should not be synced when there's no post (user page).
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );

		// Clean up.
		$post = $original_post;
		wp_delete_user( $user_id );
	}

	public function testWorksWithMultiplePosts(): void {
		$post_id_2 = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post 2',
				'post_status' => 'publish',
				'post_name'   => 'test-post-2',
			]
		);

		$post_id_3 = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post 3',
				'post_status' => 'publish',
				'post_name'   => 'test-post-3',
			]
		);

		$path_2 = new Path( $this->get_post_path( $post_id_2 ), $post_id_2 );
		$path_3 = new Path( $this->get_post_path( $post_id_3 ), $post_id_3 );

		$fresh_analysis = WebsiteAnalysis::from( $this->getResultsFixture() );
		$stale_analysis = WebsiteAnalysis::from( $this->getResultsFixture( true ) );

		try {
			// Set fresh analysis for post 1.
			$this->mock_store->expects( $this->exactly( 3 ) )
							->method( 'set' )
							->withConsecutive(
								[ $this->path, $fresh_analysis ],
								[ $path_2, $stale_analysis ],
								[ $path_3, $fresh_analysis ]
							)
							->willReturn( true );

			$this->assertTrue( $this->store->set( $this->path, $fresh_analysis ) );
			$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

			// Set stale analysis for post 2.
			$this->assertTrue( $this->store->set( $path_2, $stale_analysis ) );
			$this->assertSame( Status::STALE, $this->status->get( $post_id_2 ) );

			// Set fresh analysis for post 3.
			$this->assertTrue( $this->store->set( $path_3, $fresh_analysis ) );
			$this->assertSame( Status::OPTIMIZED, $this->status->get( $post_id_3 ) );

			// Delete post 2.
			$this->mock_store->expects( $this->once() )
							->method( 'delete' )
							->with( $path_2 )
							->willReturn( true );

			$this->assertTrue( $this->store->delete( $path_2 ) );
			$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $post_id_2 ) );

			// Verify other posts still have their status.
			$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
			$this->assertSame( Status::OPTIMIZED, $this->status->get( $post_id_3 ) );
		} finally {
			// Clean up.
			$this->status->delete( $post_id_2 );
			$this->status->delete( $post_id_3 );
		}
	}

	/**
	 * Get the results fixture with the lastModified appended to it.
	 */
	private function getResultsFixture( bool $is_stale = false ): array {
		$data    = $this->fixture( 'resources/optimizer/result.json' );
		$decoded = json_decode( $data, true );

		$decoded['isStale'] = $is_stale;

		return $decoded;
	}
}
