<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Status;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use Tests\Support\Classes\OptimizerTestCase;

final class StatusTest extends OptimizerTestCase {

	private Status $status;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->status = $this->container->get( Status::class );

		// Create a test post.
		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		// Clean up test data.
		if ( $this->post_id > 0 ) {
			$this->status->delete( $this->post_id );
		}

		parent::tearDown();
	}

	public function testGetReturnsNotOptimizedForUnindexedPost(): void {
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSetIndexesPostSuccessfully(): void {
		$result = $this->status->set( $this->post_id );

		$this->assertTrue( $result );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testGetReturnsOptimizedForIndexedPost(): void {
		// First index the post.
		$this->status->set( $this->post_id );

		// Then verify it's indexed.
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testDeleteRemovesIndexSuccessfully(): void {
		// First index the post.
		$this->status->set( $this->post_id );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		// Then delete the index.
		$result = $this->status->delete( $this->post_id );

		$this->assertTrue( $result );
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testDeleteReturnsZeroForNonExistentIndex(): void {
		// Try to delete an index that doesn't exist.
		$result = $this->status->delete( $this->post_id );

		$this->assertFalse( $result );
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testWorksWithMultiplePosts(): void {
		// Create additional test posts.
		$post_id_2 = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post 2',
				'post_status' => 'publish',
			]
		);

		$post_id_3 = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post 3',
				'post_status' => 'publish',
			]
		);

		// Index only the first and third posts.
		$this->status->set( $this->post_id );
		$this->status->set( $post_id_3 );

		// Verify indexing status.
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $post_id_2 ) );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $post_id_3 ) );

		// Clean up additional posts.
		$this->status->delete( $post_id_2 );
		$this->status->delete( $post_id_3 );
	}

	public function testHandlesZeroPostId(): void {
		// Test get with zero post ID.
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( 0 ) );

		// Test set with zero post ID.
		$result = $this->status->set( 0 );
		$this->assertFalse( $result );

		// Test delete with zero post ID.
		$result = $this->status->delete( 0 );
		$this->assertFalse( $result );
	}

	public function testIsValidReturnsTrueForValidStatuses(): void {
		$this->assertTrue( $this->status->is_valid( Status::EXCLUDED ) );
		$this->assertTrue( $this->status->is_valid( Status::NOT_OPTIMIZED ) );
		$this->assertTrue( $this->status->is_valid( Status::OPTIMIZED ) );
		$this->assertTrue( $this->status->is_valid( Status::STALE ) );
	}

	public function testIsValidReturnsFalseForInvalidStatuses(): void {
		$this->assertFalse( $this->status->is_valid( -2 ) );
		$this->assertFalse( $this->status->is_valid( 3 ) );
		$this->assertFalse( $this->status->is_valid( 100 ) );
	}

	public function testSetWithExcludedStatus(): void {
		$result = $this->status->set( $this->post_id, Status::EXCLUDED );

		$this->assertTrue( $result );
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );
	}

	public function testSetWithNotOptimizedStatus(): void {
		// First set to optimized.
		$this->status->set( $this->post_id, Status::OPTIMIZED );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		// Then set to not optimized.
		$result = $this->status->set( $this->post_id, Status::NOT_OPTIMIZED );

		$this->assertTrue( $result );
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSetWithStaleStatus(): void {
		$result = $this->status->set( $this->post_id, Status::STALE );

		$this->assertTrue( $result );
		$this->assertSame( Status::STALE, $this->status->get( $this->post_id ) );
	}

	public function testSetThrowsExceptionForInvalidStatus(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Invalid status: 999' );

		$this->status->set( $this->post_id, 999 );
	}

	public function testSetOptimizedSetsPostToOptimized(): void {
		$result = $this->status->set_optimized( $this->post_id );

		$this->assertTrue( $result );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSetExcludedSetsPostToExcluded(): void {
		$result = $this->status->set_excluded( $this->post_id );

		$this->assertTrue( $result );
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );
	}

	public function testIsExcludedReturnsTrueForExcludedPost(): void {
		$this->status->set_excluded( $this->post_id );

		$this->assertTrue( $this->status->is_excluded( $this->post_id ) );
	}

	public function testIsExcludedReturnsFalseForNonExcludedPost(): void {
		// Test with not optimized.
		$this->assertFalse( $this->status->is_excluded( $this->post_id ) );

		// Test with optimized.
		$this->status->set_optimized( $this->post_id );
		$this->assertFalse( $this->status->is_excluded( $this->post_id ) );

		// Test with stale.
		$this->status->set( $this->post_id, Status::STALE );
		$this->assertFalse( $this->status->is_excluded( $this->post_id ) );
	}

	public function testDeletePreservesExcludedStatus(): void {
		// Set post to excluded.
		$this->status->set_excluded( $this->post_id );
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );

		// Try to delete - should fail and preserve excluded status.
		$result = $this->status->delete( $this->post_id );

		$this->assertFalse( $result );
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );
	}

	public function testDeleteRemovesStaleStatus(): void {
		$this->status->set( $this->post_id, Status::STALE );
		$this->assertSame( Status::STALE, $this->status->get( $this->post_id ) );

		$result = $this->status->delete( $this->post_id );

		$this->assertTrue( $result );
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testFromAnalysisReturnsNotOptimizedForNull(): void {
		$status = $this->status->from_analysis( null );

		$this->assertSame( Status::NOT_OPTIMIZED, $status );
	}

	public function testFromAnalysisReturnsOptimizedForFreshAnalysis(): void {
		$analysis = $this->create_fresh_analysis();

		$status = $this->status->from_analysis( $analysis );

		$this->assertSame( Status::OPTIMIZED, $status );
	}

	public function testFromAnalysisReturnsStaleForStaleAnalysis(): void {
		$analysis = $this->create_stale_analysis();

		$status = $this->status->from_analysis( $analysis );

		$this->assertSame( Status::STALE, $status );
	}

	public function testSyncFromAnalysisWithNullSetsNotOptimized(): void {
		// First set to optimized.
		$this->status->set_optimized( $this->post_id );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );

		// Sync with null analysis.
		$result = $this->status->sync_from_analysis( $this->post_id, null );

		$this->assertTrue( $result );
		$this->assertSame( Status::NOT_OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSyncFromAnalysisWithFreshAnalysisSetsOptimized(): void {
		$analysis = $this->create_fresh_analysis();

		$result = $this->status->sync_from_analysis( $this->post_id, $analysis );

		$this->assertTrue( $result );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	public function testSyncFromAnalysisWithStaleAnalysisSetsStale(): void {
		$analysis = $this->create_stale_analysis();

		$result = $this->status->sync_from_analysis( $this->post_id, $analysis );

		$this->assertTrue( $result );
		$this->assertSame( Status::STALE, $this->status->get( $this->post_id ) );
	}

	public function testSyncFromAnalysisOverwritesExistingStatus(): void {
		// Set to excluded first.
		$this->status->set_excluded( $this->post_id );
		$this->assertSame( Status::EXCLUDED, $this->status->get( $this->post_id ) );

		// Sync with fresh analysis - should overwrite excluded status.
		$analysis = $this->create_fresh_analysis();
		$result   = $this->status->sync_from_analysis( $this->post_id, $analysis );

		$this->assertTrue( $result );
		$this->assertSame( Status::OPTIMIZED, $this->status->get( $this->post_id ) );
	}

	/**
	 * Create a fresh (non-stale) WebsiteAnalysis object for testing.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_fresh_analysis(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'isStale' => false,
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
	}

	/**
	 * Create a stale WebsiteAnalysis object for testing.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_stale_analysis(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'isStale' => true,
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
	}
}
