<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Cached_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\TestCase;

final class CachedStoreDecoratorTest extends TestCase {

	private Cached_Store_Decorator $store;

	/** @var Store&MockObject */
	private $mock_store;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		// Create a mock store for testing.
		$this->mock_store = $this->createMock( Store::class );
		$this->store      = new Cached_Store_Decorator( $this->mock_store );
		$this->post_id    = $this->factory()->post->create();

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		// Clear any cached data.
		wp_cache_delete( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );

		parent::tearDown();
	}

	public function testItGetsNullValueWhenNoOptimizationDataExists(): void {
		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->post_id )
						->willReturn( null );

		$this->assertNull( $this->store->get( $this->post_id ) );
	}

	public function testItGetsOptimizationDataFromCache(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Set the cache directly.
		wp_cache_set( $this->get_cache_key( $this->post_id ), $analysis, Cached_Store_Decorator::GROUP, Cached_Store_Decorator::TTL );

		// Mock store should not be called since data is in cache.
		$this->mock_store->expects( $this->never() )
						->method( 'get' );

		$result = $this->store->get( $this->post_id );
		$this->assertNotNull( $result );
		$this->assertEquals( $analysis->toArray(), $result->toArray() );
	}

	public function testItGetsOptimizationDataFromStoreAndCachesIt(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->post_id )
						->willReturn( $analysis );

		// First call should hit the store and cache the result.
		$result = $this->store->get( $this->post_id );
		$this->assertNotNull( $result );
		$this->assertEquals( $analysis->toArray(), $result->toArray() );

		// Second call should hit the cache.
		$this->mock_store->expects( $this->never() )
						->method( 'get' );

		$cached_result = $this->store->get( $this->post_id );
		$this->assertNotNull( $cached_result );
		$this->assertEquals( $analysis->toArray(), $cached_result->toArray() );
	}

	public function testItSetsOptimizationDataAndCachesIt(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->post_id, $analysis )
						->willReturn( true );

		$result = $this->store->set( $this->post_id, $analysis );
		$this->assertTrue( $result );

		// Verify the data is cached.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );
		$this->assertEquals( $analysis->toArray(), $cached->toArray() );
	}

	public function testItDoesNotCacheWhenSetReturnsFalse(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->post_id, $analysis )
						->willReturn( false );

		$result = $this->store->set( $this->post_id, $analysis );
		$this->assertFalse( $result );

		// Verify the data is not cached.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
		$this->assertFalse( $cached );
	}

	public function testItDeletesOptimizationDataAndClearsCache(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// First, set some data and cache it.
		wp_cache_set( $this->get_cache_key( $this->post_id ), $analysis, Cached_Store_Decorator::GROUP, Cached_Store_Decorator::TTL );

		$this->mock_store->expects( $this->once() )
						->method( 'delete' )
						->with( $this->post_id )
						->willReturn( true );

		$result = $this->store->delete( $this->post_id );
		$this->assertTrue( $result );

		// Verify the cache is cleared.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
		$this->assertFalse( $cached );
	}

	public function testItHandlesMultiplePostsIndependently(): void {
		$analysis1 = WebsiteAnalysis::from( $this->getResultsFixture() );
		$analysis2 = WebsiteAnalysis::from( $this->getResultsFixture() );

		$post_id_1 = $this->factory()->post->create();
		$post_id_2 = $this->factory()->post->create();

		// Set up mock expectations for both posts.
		$this->mock_store->expects( $this->exactly( 2 ) )
						->method( 'set' )
						->withConsecutive(
							[ $post_id_1, $analysis1 ],
							[ $post_id_2, $analysis2 ]
						)
						->willReturn( true );

		// Set data for both posts.
		$this->assertTrue( $this->store->set( $post_id_1, $analysis1 ) );
		$this->assertTrue( $this->store->set( $post_id_2, $analysis2 ) );

		// Verify both are cached independently.
		$cached_1 = wp_cache_get( $this->get_cache_key( $post_id_1 ), Cached_Store_Decorator::GROUP );
		$cached_2 = wp_cache_get( $this->get_cache_key( $post_id_2 ), Cached_Store_Decorator::GROUP );

		$this->assertNotNull( $cached_1 );
		$this->assertNotNull( $cached_2 );
		$this->assertEquals( $analysis1->toArray(), $cached_1->toArray() );
		$this->assertEquals( $analysis2->toArray(), $cached_2->toArray() );

		// Clean up.
		wp_cache_delete( $this->get_cache_key( $post_id_1 ), Cached_Store_Decorator::GROUP );
		wp_cache_delete( $this->get_cache_key( $post_id_2 ), Cached_Store_Decorator::GROUP );
	}

	public function testItHandlesCacheMissGracefully(): void {
		// Ensure no cache exists.
		wp_cache_delete( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->post_id )
						->willReturn( null );

		$result = $this->store->get( $this->post_id );
		$this->assertNull( $result );
	}

	public function testItHandlesInvalidCacheData(): void {
		// Set invalid data in cache.
		wp_cache_set( $this->get_cache_key( $this->post_id ), 'invalid_data', Cached_Store_Decorator::GROUP, Cached_Store_Decorator::TTL );

		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'get' )
						->with( $this->post_id )
						->willReturn( $analysis );

		// Should fall back to store when cache has invalid data.
		$result = $this->store->get( $this->post_id );
		$this->assertNotNull( $result );
		$this->assertEquals( $analysis->toArray(), $result->toArray() );
	}

	public function testItUsesCorrectCacheGroup(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->post_id, $analysis )
						->willReturn( true );

		$this->store->set( $this->post_id, $analysis );

		// Verify cache uses the correct group.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );

		// Verify cache doesn't exist in wrong group.
		$wrong_group_cached = wp_cache_get( $this->get_cache_key( $this->post_id ), 'wrong_group' );
		$this->assertFalse( $wrong_group_cached );
	}

	public function testItUsesCorrectCacheTTL(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->mock_store->expects( $this->once() )
						->method( 'set' )
						->with( $this->post_id, $analysis )
						->willReturn( true );

		$this->store->set( $this->post_id, $analysis );

		// Verify the cache key exists with the correct TTL.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );

		// The TTL is set to 43200 seconds (12 hours) in the class.
		$this->assertEquals( Cached_Store_Decorator::TTL, 43200 );
	}

	public function testItGeneratesCorrectCacheKeys(): void {
		$post_id_1 = 123;
		$post_id_2 = 456;

		$key_1 = $this->get_cache_key( $post_id_1 );
		$key_2 = $this->get_cache_key( $post_id_2 );

		$this->assertEquals( 'kb_optimizer_post_123', $key_1 );
		$this->assertEquals( 'kb_optimizer_post_456', $key_2 );
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
						->with( $this->post_id, $large_analysis )
						->willReturn( true );

		$this->assertTrue( $this->store->set( $this->post_id, $large_analysis ) );

		// Verify large data is cached correctly.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
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
						->with( $this->post_id, $analysis )
						->willReturn( true );

		$this->assertTrue( $this->store->set( $this->post_id, $analysis ) );

		// Verify special characters are preserved in cache.
		$cached = wp_cache_get( $this->get_cache_key( $this->post_id ), Cached_Store_Decorator::GROUP );
		$this->assertNotNull( $cached );
		$this->assertEquals( $analysis->toArray(), $cached->toArray() );
		$this->assertStringContainsString( 'quotes', $cached->desktop->sections[0]->className );
		$this->assertStringContainsString( 'apostrophes', $cached->mobile->sections[0]->className );
	}

	/**
	 * Get the cache key for a post ID using the decorator's public method.
	 */
	private function get_cache_key( int $post_id ): string {
		return $this->store->get_key( $post_id );
	}

	/**
	 * Get the results fixture with the lastModified appended to it.
	 */
	private function getResultsFixture(): array {
		$data    = $this->fixture( 'resources/optimizer/result.json' );
		$decoded = json_decode( $data, true );

		$decoded['lastModified'] = new DateTimeImmutable( 'now', new DateTimeZone( 'UTC' ) );

		return $decoded;
	}
}
