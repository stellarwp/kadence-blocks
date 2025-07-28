<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Expired_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Table_Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\TestCase;

final class ExpiredStoreDecoratorTest extends TestCase {

	use Permalink_Trait;

	private Expired_Store_Decorator $store;
	private int $post_id;
	private Path $path;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		// Manually create the decorator chain to ensure proper setup
		$table_store = $this->container->get( Table_Store::class );
		$this->store = new Expired_Store_Decorator( $table_store );

		$this->post_id = $this->factory()->post->create();
		$post_path     = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		$this->assertGreaterThan( 0, $this->post_id );
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

	public function testItReturnsTrueForStaleData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture( true ) );

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

	public function testItWorksWithBasicOperations(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Test basic set/get/has/delete cycle
		$this->assertFalse( $this->store->has( $this->path ) );
		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );
		$this->assertEquals( $analysis, $this->store->get( $this->path ) );
		$this->assertTrue( $this->store->delete( $this->path ) );
		$this->assertFalse( $this->store->has( $this->path ) );
		$this->assertNull( $this->store->get( $this->path ) );
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
			$set_result = $this->store->set( $path_2, $analysis );
			$this->assertTrue( $set_result, 'Setting data for path_2 should return true' );

			$has_result = $this->store->has( $path_2 );
			$this->assertTrue( $has_result, 'has() should return true for path_2 after setting data' );

			// Verify both paths have data.
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

	public function testItReturnsTrueForStaleDataAfterUpdate(): void {
		$fresh_analysis = WebsiteAnalysis::from( $this->getResultsFixture() );
		$stale_analysis = WebsiteAnalysis::from( $this->getResultsFixture( true ) );

		// Set fresh data.
		$this->assertTrue( $this->store->set( $this->path, $fresh_analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );

		// Update with stale data - should still return true.
		$this->assertTrue( $this->store->set( $this->path, $stale_analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testItReturnsTrueForFreshDataAfterStaleData(): void {
		$stale_analysis = WebsiteAnalysis::from( $this->getResultsFixture( true ) );
		$fresh_analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		// Set stale data.
		$this->assertTrue( $this->store->set( $this->path, $stale_analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );

		// Update with fresh data - should still return true.
		$this->assertTrue( $this->store->set( $this->path, $fresh_analysis ) );
		$this->assertTrue( $this->store->has( $this->path ) );
	}

	public function testItGetsNullValueWhenNoOptimizationDataExists(): void {
		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItSetsGetsAndDeletesOptimizationData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );
		$this->assertEquals( $analysis, $this->store->get( $this->path ) );
		$this->assertTrue( $this->store->delete( $this->path ) );
		$this->assertNull( $this->store->get( $this->path ) );
	}

	public function testItReturnsNullWhenPostModifiedAfterAnalysis(): void {
		// Force last modified to -1 minute ago so we aren't dealing with time shifting.
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture( true ) );

		$this->assertTrue( $this->store->set( $this->path, $analysis ) );

		// Update the post to make it newer than the analysis.
		wp_update_post(
			[
				'ID'           => $this->post_id,
				'post_title'   => 'Updated Post',
				'post_content' => 'Updated content',
			]
		);

		$this->assertNull( $this->store->get( $this->path ) );
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
