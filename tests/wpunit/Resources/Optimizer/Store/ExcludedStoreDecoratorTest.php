<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Excluded_Store_Decorator;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\OptimizerTestCase;

final class ExcludedStoreDecoratorTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Excluded_Store_Decorator $store;

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
		$this->store      = new Excluded_Store_Decorator(
			$this->mock_store,
			$this->status,
			$this->container->get( LoggerInterface::class )
		);

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

	public function testHasReturnsFalseForExcludedPostEvenIfDataExists(): void {
		// Set post as excluded.
		$this->status->set_excluded( $this->post_id );

		// Mock store says data exists.
		$this->mock_store->expects( $this->never() )
						->method( 'has' );

		// Decorator should return false for excluded posts.
		$this->assertFalse( $this->store->has( $this->path ) );
	}

	public function testHasDelegatesToStoreForNonExcludedPost(): void {
		// Post is not excluded.
		$this->assertFalse( $this->status->is_excluded( $this->post_id ) );

		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( true );

		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testHasDelegatesToStoreWhenPathHasNoPostId(): void {
		$path_without_post_id = new Path( '/test-path/' );

		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $path_without_post_id )
						->willReturn( false );

		$this->assertFalse( $this->store->has( $path_without_post_id ) );
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

	public function testGetReturnsNullWhenStoreReturnsNull(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->path )
						->willReturn( null );

		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testSetBlocksExcludedPost(): void {
		// Set post as excluded.
		$this->status->set_excluded( $this->post_id );

		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Mock store should not be called.
		$this->mock_store->expects( $this->never() )
						->method( 'set' );

		// Decorator should block and return false.
		$result = $this->store->set( $this->path, $analysis );

		$this->assertFalse( $result );
	}

	public function testSetAllowsNonExcludedPost(): void {
		// Post is not excluded.
		$this->assertFalse( $this->status->is_excluded( $this->post_id ) );

		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$result = $this->store->set( $this->path, $analysis );

		$this->assertTrue( $result );
	}

	public function testSetAllowsPostWithoutPostIdButLogsWarning(): void {
		$path_without_post_id = new Path( '/test-path/' );
		$analysis             = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Should allow but log warning.
		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $path_without_post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $path_without_post_id, $analysis );

		$this->assertTrue( $result );
	}

	public function testSetReturnsFalseWhenStoreReturnsFalse(): void {
		// Post is not excluded.
		$this->assertFalse( $this->status->is_excluded( $this->post_id ) );

		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( false );

		$result = $this->store->set( $this->path, $analysis );

		$this->assertFalse( $result );
	}

	public function testDeleteDelegatesToStore(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( true );

		$result = $this->store->delete( $this->path );

		$this->assertTrue( $result );
	}

	public function testDeleteAllowsDeletionForExcludedPost(): void {
		// Set post as excluded.
		$this->status->set_excluded( $this->post_id );

		// Delete should still be allowed.
		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( true );

		$result = $this->store->delete( $this->path );

		$this->assertTrue( $result );
	}

	public function testDeleteReturnsFalseWhenStoreReturnsFalse(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( false );

		$result = $this->store->delete( $this->path );

		$this->assertFalse( $result );
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

		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		try {
			// Exclude post 2.
			$this->status->set_excluded( $post_id_2 );

			// Set up expectations for all calls.
			$this->mock_store->expects( $this->exactly( 2 ) )
							->method( 'set' )
							->withConsecutive(
								[ $this->path, $analysis ],
								[ $path_3, $analysis ]
							)
							->willReturn( true );

			// Post 1 (not excluded) should work.
			$this->assertTrue( $this->store->set( $this->path, $analysis ) );

			// Post 2 (excluded) should be blocked - mock should not be called.
			$this->assertFalse( $this->store->set( $path_2, $analysis ) );

			// Post 3 (not excluded) should work.
			$this->assertTrue( $this->store->set( $path_3, $analysis ) );
		} finally {
			// Clean up.
			$this->status->delete( $post_id_2 );
			$this->status->delete( $post_id_3 );
		}
	}

	/**
	 * Get the results fixture with the lastModified appended to it.
	 */
	private function getResultsFixture(): array {
		$data    = $this->fixture( 'resources/optimizer/result.json' );
		$decoded = json_decode( $data, true );

		$decoded['isStale'] = false;

		return $decoded;
	}
}
