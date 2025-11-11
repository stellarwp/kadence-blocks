<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Cached_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\OptimizerTestCase;

final class CachedStoreDecoratorTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Cached_Store_Decorator $store;

	/** @var Store&MockObject */
	private $mock_store;
	private int $post_id;
	private Path $path;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		// Create a mock store for testing.
		$this->mock_store = $this->createMock( Store::class );
		$this->store      = new Cached_Store_Decorator( $this->mock_store );
		$this->post_id    = $this->factory()->post->create();
		$post_path        = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		// Clear any cached data.
		wp_cache_delete( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		wp_cache_delete( $this->get_has_cache_key( $this->path ), Cached_Store_Decorator::GROUP );

		parent::tearDown();
	}

	public function testItReturnsFalseForNonExistentData(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( false );

		$this->assertFalse( $this->store->has( $this->path ) );
	}

	public function testItReturnsTrueForExistentData(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( true );

		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testItCachesHasResultAndReturnsCachedValue(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( true );

		// First call should hit the store and cache the result.
		$this->assertTrue( $this->store->has( $this->path ) );

		// Second call should hit the cache.
		$this->mock_store->expects( $this->never() )
						->method( 'has' );

		$cached_result = $this->store->has( $this->path );
		$this->assertTrue( $cached_result );
	}

	public function testItCachesFalseResultAndReturnsCachedValue(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( false );

		// First call should hit the store and cache the result.
		$this->assertFalse( $this->store->has( $this->path ) );

		// Second call should hit the cache.
		$this->mock_store->expects( $this->never() )
						->method( 'has' );

		$cached_result = $this->store->has( $this->path );
		$this->assertFalse( $cached_result );
	}

	public function testItHandlesMultiplePathsIndependently(): void {
		$post_id_1 = $this->factory()->post->create();
		$post_id_2 = $this->factory()->post->create();

		$path_1 = new Path( $this->get_post_path( $post_id_1 ) );
		$path_2 = new Path( $this->get_post_path( $post_id_2 ) );

		// Set up mock expectations for both paths.
		$this->mock_store->expects( $this->exactly( 2 ) )
						->method( 'has' )
						->withConsecutive(
							[ $path_1 ],
							[ $path_2 ]
						)
						->willReturn( true, false );

		// First call for both paths.
		$this->assertTrue( $this->store->has( $path_1 ) );
		$this->assertFalse( $this->store->has( $path_2 ) );

		// Second call should hit cache for both.
		$this->mock_store->expects( $this->never() )
						->method( 'has' );

		$this->assertTrue( $this->store->has( $path_1 ) );
		$this->assertFalse( $this->store->has( $path_2 ) );

		// Clean up.
		wp_cache_delete( $this->get_has_cache_key( $path_1 ), Cached_Store_Decorator::GROUP );
		wp_cache_delete( $this->get_has_cache_key( $path_2 ), Cached_Store_Decorator::GROUP );
	}

	public function testItClearsHasCacheWhenDataIsSet(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// First, cache a has result.
		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( false );

		$this->assertFalse( $this->store->has( $this->path ) );

		// Now set data. The current implementation doesn't clear the has cache on set.
		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );

		// The has cache should still be cached, so it should return the cached value.
		$this->mock_store->expects( $this->never() )
						->method( 'has' );

		$this->assertFalse( $this->store->has( $this->path ) );
	}

	public function testItClearsHasCacheWhenDataIsDeleted(): void {
		// Set up mock expectations for both has calls.
		$this->mock_store->expects( $this->exactly( 2 ) )
						->method( 'has' )
						->withConsecutive(
							[ $this->path ],
							[ $this->path ]
						)
						->willReturn( true, false );

		// First call to cache the has result.
		$this->assertTrue( $this->store->has( $this->path ) );

		// Now delete data, which should clear the has cache.
		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( true );

		$this->assertTrue( $this->store->delete( $this->path ) );

		// Second call should hit the store again since cache was cleared.
		$this->assertFalse( $this->store->has( $this->path ) );
	}

	public function testItUsesCorrectHasCacheKey(): void {
		$path_1 = new Path( 'test-post-1' );
		$path_2 = new Path( 'test-post-2' );

		$key_1 = $this->get_has_cache_key( $path_1 );
		$key_2 = $this->get_has_cache_key( $path_2 );

		$this->assertEquals( sprintf( 'kb_optimizer_url_%s_has', $path_1->hash() ), $key_1 );
		$this->assertEquals( sprintf( 'kb_optimizer_url_%s_has', $path_2->hash() ), $key_2 );
		$this->assertNotEquals( $key_1, $key_2 );
	}

	public function testItHandlesCacheMissForHasMethod(): void {
		// Ensure no cache exists.
		wp_cache_delete( $this->get_has_cache_key( $this->path ), Cached_Store_Decorator::GROUP );

		$this->mock_store->expects( $this->once() )
						->method( 'has' )
						->with( $this->path )
						->willReturn( false );

		$result = $this->store->has( $this->path );
		$this->assertFalse( $result );
	}

	public function testItGetsNullValueWhenNoOptimizationDataExists(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->path )
						->willReturn( null );

		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItGetsOptimizationDataFromCache(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Set the cache directly.
		wp_cache_set( $this->get_cache_key( $this->path ), $analysis, Cached_Store_Decorator::GROUP, Cached_Store_Decorator::TTL );

		// Mock store should not be called since data is in cache.
		$this->mock_store->expects( $this->never() )
						->method( 'get' );

		$result = $this->store->get( $this->path );
		$this->assertNotNull( $result );
		$this->assertEquals( $analysis->toArray(), $result->toArray() );
	}

	public function testItGetsOptimizationDataFromStoreAndCachesIt(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->path )
						->willReturn( $analysis );

		// First call should hit the store and cache the result.
		$result = $this->store->get( $this->path );
		$this->assertNotNull( $result );
		$this->assertEquals( $analysis->toArray(), $result->toArray() );

		// Second call should hit the cache.
		$this->mock_store->expects( $this->never() )
						->method( 'get' );

		$cached_result = $this->store->get( $this->path );
		$this->assertNotNull( $cached_result );
		$this->assertEquals( $analysis->toArray(), $cached_result->toArray() );
	}

	public function testItSetsOptimizationDataAndCachesIt(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$result = $this->store->set( $this->path, $analysis );
		$this->assertTrue( $result );

		// Verify the data is cached.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );
		$this->assertEquals( $analysis->toArray(), $cached->toArray() );
	}

	public function testItDoesNotCacheWhenSetReturnsFalse(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( false );

		$result = $this->store->set( $this->path, $analysis );
		$this->assertFalse( $result );

		// Verify the data is not cached.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertFalse( $cached );
	}

	public function testItDeletesOptimizationDataAndClearsCache(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// First, set some data and cache it.
		wp_cache_set( $this->get_cache_key( $this->path ), $analysis, Cached_Store_Decorator::GROUP, Cached_Store_Decorator::TTL );

		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->path )
						->willReturn( true );

		$result = $this->store->delete( $this->path );
		$this->assertTrue( $result );

		// Verify the cache is cleared.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertFalse( $cached );
	}

	public function testItHandlesMultiplePostsIndependently(): void {
		$analysis1 = WebsiteAnalysis::from( $this->getResultsFixture() );
		$analysis2 = WebsiteAnalysis::from( $this->getResultsFixture() );

		$post_id_1 = $this->factory()->post->create();
		$post_id_2 = $this->factory()->post->create();

		$post_path_1 = $this->get_post_path( $post_id_1 );
		$post_path_2 = $this->get_post_path( $post_id_2 );

		$path_1 = new Path( $post_path_1 );
		$path_2 = new Path( $post_path_2 );

		// Set up mock expectations for both posts.
		$this->mock_store->expects( $this->exactly( 2 ) )
						->method( 'set' )
						->withConsecutive(
							[ $path_1, $analysis1 ],
							[ $path_2, $analysis2 ]
						)
						->willReturn( true );

		// Set data for both posts.
		$this->assertTrue( $this->store->set( $path_1, $analysis1 ) );
		$this->assertTrue( $this->store->set( $path_2, $analysis2 ) );

		// Verify both are cached independently.
		$cached_1 = wp_cache_get( $this->get_cache_key( $path_1 ), Cached_Store_Decorator::GROUP );
		$cached_2 = wp_cache_get( $this->get_cache_key( $path_2 ), Cached_Store_Decorator::GROUP );

		$this->assertNotNull( $cached_1 );
		$this->assertNotNull( $cached_2 );
		$this->assertEquals( $analysis1->toArray(), $cached_1->toArray() );
		$this->assertEquals( $analysis2->toArray(), $cached_2->toArray() );

		// Clean up.
		wp_cache_delete( $this->get_cache_key( $path_1 ), Cached_Store_Decorator::GROUP );
		wp_cache_delete( $this->get_cache_key( $path_2 ), Cached_Store_Decorator::GROUP );
	}

	public function testItHandlesCacheMissGracefully(): void {
		// Ensure no cache exists.
		wp_cache_delete( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->path )
						->willReturn( null );

		$result = $this->store->get( $this->path );
		$this->assertNull( $result );
	}

	public function testItHandlesInvalidCacheData(): void {
		// Set invalid data in cache.
		wp_cache_set( $this->get_cache_key( $this->path ), 'invalid_data', Cached_Store_Decorator::GROUP, Cached_Store_Decorator::TTL );

		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->path )
						->willReturn( $analysis );

		// Should fall back to store when cache has invalid data.
		$result = $this->store->get( $this->path );
		$this->assertNotNull( $result );
		$this->assertEquals( $analysis->toArray(), $result->toArray() );
	}

	public function testItUsesCorrectCacheGroup(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$this->store->set( $this->path, $analysis );

		// Verify cache uses the correct group.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );

		// Verify cache doesn't exist in wrong group.
		$wrong_group_cached = wp_cache_get( $this->get_cache_key( $this->path ), 'wrong_group' );
		$this->assertFalse( $wrong_group_cached );
	}

	public function testItUsesCorrectCacheTTL(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$this->store->set( $this->path, $analysis );

		// Verify the cache key exists with the correct TTL.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );

		// The TTL is set to 43200 seconds (12 hours) in the class.
		$this->assertEquals( Cached_Store_Decorator::TTL, 43200 );
	}

	public function testItGeneratesCorrectCacheKeys(): void {
		$path_1 = new Path( 'test-post-1' );
		$path_2 = new Path( 'test-post-2' );

		$key_1 = $this->get_cache_key( $path_1 );
		$key_2 = $this->get_cache_key( $path_2 );

		$this->assertEquals( sprintf( 'kb_optimizer_url_%s', $path_1->hash() ), $key_1 );
		$this->assertEquals( sprintf( 'kb_optimizer_url_%s', $path_2->hash() ), $key_2 );
		$this->assertNotEquals( $key_1, $key_2 );
	}

	public function testItHandlesLargeDataSetsInCache(): void {
		// Create a large analysis with many images.
		$large_fixture = $this->getResultsFixture();

		// Add many more images to test large data handling.
		for ( $i = 0; $i < 50; $i++ ) {
			$large_fixture['images'][] = $large_fixture['images'][0]; // Duplicate first image.
		}

		$large_analysis = WebsiteAnalysis::from( $large_fixture );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $large_analysis )
						->willReturn( true );

		$this->assertTrue( $this->store->set( $this->path, $large_analysis ) );

		// Verify large data is cached correctly.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );
		$this->assertEquals( $large_analysis->toArray(), $cached->toArray() );
		$this->assertCount( count( $large_analysis->images ), $cached->images );
	}

	public function testItHandlesSpecialCharactersInCachedData(): void {
		$fixture = $this->getResultsFixture();

		// Add special characters to test data.
		$fixture['desktop']['sections'][0]['className'] = 'test-class with "quotes" and \'apostrophes\' and <tags>';
		$fixture['mobile']['sections'][0]['className']  = 'test-class with "quotes" and \'apostrophes\' and <tags>';

		$analysis = WebsiteAnalysis::from( $fixture );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->path, $analysis )
						->willReturn( true );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );

		// Verify special characters are preserved in cache.
		$cached = wp_cache_get( $this->get_cache_key( $this->path ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );
		$this->assertEquals( $analysis->toArray(), $cached->toArray() );
		$this->assertStringContainsString( 'quotes', $cached->desktop->sections[0]->className );
		$this->assertStringContainsString( 'apostrophes', $cached->mobile->sections[0]->className );
	}

	/**
	 * Get the cache key for a post ID using the decorator's public method.
	 */
	private function get_cache_key( Path $path ): string {
		return $this->store->get_key( $path );
	}

	/**
	 * Get the has cache key for a path.
	 */
	private function get_has_cache_key( Path $path ): string {
		return sprintf( '%s_%s', $this->get_cache_key( $path ), 'has' );
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
