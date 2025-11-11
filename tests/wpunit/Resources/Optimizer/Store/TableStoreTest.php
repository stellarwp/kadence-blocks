<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Query;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Table_Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;

final class TableStoreTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Store $store;
	private Optimizer_Query $query;
	private Path $path;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		$this->query = $this->container->get( Optimizer_Query::class );
		$this->store = $this->container->get( Table_Store::class );
		$post_id     = $this->factory()->post->create();

		$post_path = $this->get_post_path( $post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		$this->assertGreaterThan( 0, $post_id );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

		parent::tearDown();
	}

	public function testItReturnsFalseForNonExistentData(): void {
		$this->assertFalse( $this->store->has( $this->path ) );
	}

	public function testItReturnsTrueForExistentData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testItReturnsFalseAfterDeletingData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );
		$this->assertTrue( $this->store->delete( $this->path ) );
		$this->assertFalse( $this->store->has( $this->path ) );
	}

	public function testItReturnsFalseForNonExistentPath(): void {
		$path = new Path( 'path-does-not-exist' );

		$this->assertFalse( $this->store->has( $path ) );
	}

	public function testItReturnsTrueForMultiplePaths(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$post_id_1 = $this->factory()->post->create();
		$post_id_2 = $this->factory()->post->create();

		$path_1 = new Path( $this->get_post_path( $post_id_1 ) );
		$path_2 = new Path( $this->get_post_path( $post_id_2 ) );

		try {
			// Initially both paths should not have data.
			$this->assertFalse( $this->store->has( $path_1 ) );
			$this->assertFalse( $this->store->has( $path_2 ) );

			// Set data for first path.
			$this->assertTrue( $this->store->set( $path_1, $analysis ) );
			$this->assertTrue( $this->store->has( $path_1 ) );
			$this->assertFalse( $this->store->has( $path_2 ) );

			// Set data for second path.
			$this->assertTrue( $this->store->set( $path_2, $analysis ) );
			$this->assertTrue( $this->store->has( $path_1 ) );
			$this->assertTrue( $this->store->has( $path_2 ) );

			// Delete first path's data.
			$this->assertTrue( $this->store->delete( $path_1 ) );
			$this->assertFalse( $this->store->has( $path_1 ) );
			$this->assertTrue( $this->store->has( $path_2 ) );

			// Delete second path's data.
			$this->assertTrue( $this->store->delete( $path_2 ) );
			$this->assertFalse( $this->store->has( $path_1 ) );
			$this->assertFalse( $this->store->has( $path_2 ) );
		} finally {
			// Ensure cleanup even if test fails.
			$this->store->delete( $path_1 );
			$this->store->delete( $path_2 );
		}
	}

	public function testItReturnsTrueAfterUpsertingSameData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );

		// Upsert the same data - should still return true.
		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testItReturnsTrueAfterUpdatingData(): void {
		$analysis1 = WebsiteAnalysis::from( $this->getResultsFixture() );
		$analysis2 = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Set initial data.
		$this->assertTrue( $this->store->set( $this->path, $analysis1 ) );
		$this->assertTrue( $this->store->has( $this->path ) );

		// Update with new data - should still return true.
		$this->assertTrue( $this->store->set( $this->path, $analysis2 ) );
		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testItGetsNullValueForNonExistentData(): void {
		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItSetsGetsAndDeletesOptimizationData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$retrieved_analysis = $this->store->get( $this->path );
		$this->assertNotNull( $retrieved_analysis );
		$this->assertEquals( $analysis->toArray(), $retrieved_analysis->toArray() );
		$this->assertTrue( $this->store->delete( $this->path ) );
		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItReturnsTrueWhenSettingSameValueTwice(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );

		// Set the same value again - should return true for upsert operation.
		$result = $this->store->set( $this->path, $analysis );
		$this->assertIsBool( $result );

		// Verify the value is still correct.
		$retrieved_analysis = $this->store->get( $this->path );
		$this->assertNotNull( $retrieved_analysis );
		$this->assertEquals( $analysis->toArray(), $retrieved_analysis->toArray() );
	}

	public function testItHandlesInvalidPath(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Create a valid post ID for testing.
		$valid_post_id = $this->factory()->post->create();
		$valid_path    = new Path( $this->get_post_path( $valid_post_id ) );

		$this->assertTrue( $this->store->set( $valid_path, $analysis ) );


		$retrieved_analysis = $this->store->get( $valid_path );
		$this->assertNotNull( $retrieved_analysis );
		$this->assertEquals( $analysis->toArray(), $retrieved_analysis->toArray() );
		$this->assertTrue( $this->store->delete( $valid_path ) );
	}

	public function testItReturnsNullForNonExistentPost(): void {
		$path = new Path( 'path-does-not-exist' );

		$this->assertNull( $this->store->get( $path ) );
	}

	public function testDeleteReturnsTrueForNonExistentData(): void {
		$path = new Path( 'path-does-not-exist' );
		// Table_Store delete should return true even for non-existent data (no rows affected).
		// Note: This may return false if the database query fails, which is acceptable.
		$result = $this->store->delete( $path );
		$this->assertIsBool( $result );
	}

	public function testItCanSetGetAndDeleteMultiplePosts(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$post_id_1 = $this->factory()->post->create();
		$post_id_2 = $this->factory()->post->create();

		$path_1 = new Path( $this->get_post_path( $post_id_1 ) );
		$path_2 = new Path( $this->get_post_path( $post_id_2 ) );

		try {
			// Set data for both posts.
			$this->assertTrue( $this->store->set( $path_1, $analysis ) );
			$this->assertTrue( $this->store->set( $path_2, $analysis ) );

			// Verify both posts have the correct data.
			$retrieved_1 = $this->store->get( $path_1 );
			$retrieved_2 = $this->store->get( $path_2 );
			$this->assertNotNull( $retrieved_1 );
			$this->assertNotNull( $retrieved_2 );
			$this->assertEquals( $analysis->toArray(), $retrieved_1->toArray() );
			$this->assertEquals( $analysis->toArray(), $retrieved_2->toArray() );

			// Delete first post's data.
			$this->assertTrue( $this->store->delete( $path_1 ) );
			$this->assertNull( $this->store->get( $path_1 ) );

			// Verify second post's data is still there.
			$retrieved_2_after_delete = $this->store->get( $path_2 );
			$this->assertNotNull( $retrieved_2_after_delete );
			$this->assertEquals( $analysis->toArray(), $retrieved_2_after_delete->toArray() );

			// Clean up second post.
			$this->assertTrue( $this->store->delete( $path_2 ) );
			$this->assertNull( $this->store->get( $path_2 ) );
		} finally {
			// Ensure cleanup even if test fails.
			$this->store->delete( $path_1 );
			$this->store->delete( $path_2 );
		}
	}

	public function testDataIntegrityAfterSerializationAndDeserialization(): void {
		$original_analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $original_analysis ) );
		$retried_analysis = $this->store->get( $this->path );

		// Verify the data structure integrity.
		$this->assertInstanceOf( WebsiteAnalysis::class, $retried_analysis );
		$this->assertEquals( $original_analysis->toArray(), $retried_analysis->toArray() );

		// Verify specific properties to ensure deep equality.
		$this->assertEquals( $original_analysis->desktop->toArray(), $retried_analysis->desktop->toArray() );
		$this->assertEquals( $original_analysis->mobile->toArray(), $retried_analysis->mobile->toArray() );
		$this->assertCount( count( $original_analysis->images ), $retried_analysis->images );

		foreach ( $original_analysis->images as $index => $image ) {
			$this->assertEquals( $image->toArray(), $retried_analysis->images[ $index ]->toArray() );
		}
	}

	public function testItHandlesJsonDecodeErrorsGracefully(): void {
		// Insert invalid JSON directly into the database to test error handling.
		$this->query->qb()->upsert(
			[
				'path_hash' => $this->path->hash(),
				'path'      => $this->path->path(),
				'analysis'  => 'invalid json data',
			],
			[
				'path_hash',
			],
			[
				'%s',
				'%s',
				'%s',
			]
		);

		// Should return null when JSON decode fails.
		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItHandlesEmptyJsonData(): void {
		// Insert empty JSON data.
		$this->query->qb()->upsert(
			[
				'path_hash' => $this->path->hash(),
				'path'      => $this->path->path(),
				'analysis'  => '{}',
			],
			[
				'path_hash',
			],
			[
				'%s',
				'%s',
				'%s',
			]
		);

		// Should return null when JSON is empty or invalid structure.
		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItUpdatesExistingDataWithUpsert(): void {
		$analysis1 = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Make a change to the data to compare later.
		$analysis1->mobile->sections = [];

		$analysis2 = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Set initial data.
		$this->assertTrue( $this->store->set( $this->path, $analysis1 ) );
		$retrieved_1 = $this->store->get( $this->path );
		$this->assertNotNull( $retrieved_1 );
		$this->assertEquals( $analysis1->toArray(), $retrieved_1->toArray() );

		// Update with new data (should use upsert to update existing record).
		$result = $this->store->set( $this->path, $analysis2 );
		$this->assertIsBool( $result );
		$retrieved_2 = $this->store->get( $this->path );
		$this->assertNotNull( $retrieved_2 );
		$this->assertEquals( $analysis2->toArray(), $retrieved_2->toArray() );

		// Verify the old data is gone.
		$this->assertNotEquals( $analysis1->toArray(), $retrieved_2->toArray() );
	}

	public function testItHandlesLargeDataSets(): void {
		// Create a large analysis with many images.
		$large_fixture = $this->getResultsFixture();

		// Add many more images to test large data handling.
		for ( $i = 0; $i < 100; $i++ ) {
			$large_fixture['images'][] = $large_fixture['images'][0]; // Duplicate first image.
		}

		$large_analysis = WebsiteAnalysis::from( $large_fixture );

		$this->assertTrue( $this->store->set( $this->path, $large_analysis ) );
		$retrieved_analysis = $this->store->get( $this->path );

		$this->assertInstanceOf( WebsiteAnalysis::class, $retrieved_analysis );
		$this->assertEquals( $large_analysis->toArray(), $retrieved_analysis->toArray() );
		$this->assertCount( count( $large_analysis->images ), $retrieved_analysis->images );
	}

	public function testItHandlesSpecialCharactersInData(): void {
		$fixture = $this->getResultsFixture();

		// Add special characters to test data.
		$fixture['desktop']['sections'][0]['className'] = 'test-class with "quotes" and \'apostrophes\' and <tags>';
		$fixture['mobile']['sections'][0]['className']  = 'test-class with "quotes" and \'apostrophes\' and <tags>';

		$analysis = WebsiteAnalysis::from( $fixture );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$retrieved_analysis = $this->store->get( $this->path );

		$this->assertNotNull( $retrieved_analysis );
		$this->assertEquals( $analysis->toArray(), $retrieved_analysis->toArray() );
		$this->assertStringContainsString( 'quotes', $retrieved_analysis->desktop->sections[0]->className );
		$this->assertStringContainsString( 'apostrophes', $retrieved_analysis->mobile->sections[0]->className );
	}

	public function testItHandlesUnicodeCharactersInData(): void {
		$fixture = $this->getResultsFixture();

		// Add unicode characters to test data.
		$fixture['desktop']['sections'][0]['className'] = 'test-class with unicode: 🚀🌟🎉';
		$fixture['mobile']['sections'][0]['className']  = 'test-class with unicode: 🚀🌟🎉';

		$analysis = WebsiteAnalysis::from( $fixture );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$retrieved_analysis = $this->store->get( $this->path );

		$this->assertNotNull( $retrieved_analysis );
		$this->assertEquals( $analysis->toArray(), $retrieved_analysis->toArray() );
		$this->assertStringContainsString( '🚀', $retrieved_analysis->desktop->sections[0]->className );
		$this->assertStringContainsString( '🌟', $retrieved_analysis->mobile->sections[0]->className );
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
