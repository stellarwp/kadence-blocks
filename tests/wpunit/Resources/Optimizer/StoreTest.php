<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Meta_Store;
use Tests\Support\Classes\TestCase;

final class StoreTest extends TestCase {

	private Store $store;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->store   = $this->container->get( Store::class );
		$this->post_id = $this->factory()->post->create();

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->post_id );

		parent::tearDown();
	}

	public function testItBindsToCorrectConcreteClass(): void {
		$this->assertInstanceOf(
			Meta_Store::class,
			$this->store,
		);
	}

	public function testItGetsNullValue(): void {
		$this->assertNull( $this->store->get( $this->post_id ) );
	}

	public function testItSetsGetsAndDeletesOptimizationData(): void {
		$data = $this->fixture( 'resources/optimizer/result.json' );

		$analysis = WebsiteAnalysis::from( json_decode( $data, true ) );

		$this->assertTrue( $this->store->set( $this->post_id, $analysis ) );
		$this->assertEquals( $analysis, $this->store->get( $this->post_id ) );
		$this->assertTrue( $this->store->delete( $this->post_id ) );
		$this->assertNull( $this->store->get( $this->post_id ) );
	}

	public function testItReturnsTrueWhenSettingSameValueTwice(): void {
		$data     = $this->fixture( 'resources/optimizer/result.json' );
		$analysis = WebsiteAnalysis::from( json_decode( $data, true ) );

		$this->assertTrue( $this->store->set( $this->post_id, $analysis ) );

		// Set the same value again - should return true even though update_post_meta returns false.
		$this->assertTrue( $this->store->set( $this->post_id, $analysis ) );

		// Verify the value is still correct.
		$this->assertEquals( $analysis, $this->store->get( $this->post_id ) );
	}

	public function testItHandlesInvalidPostId(): void {
		$data     = $this->fixture( 'resources/optimizer/result.json' );
		$analysis = WebsiteAnalysis::from( json_decode( $data, true ) );

		// Using a non-existent post ID should still work (WordPress will handle it).
		$invalid_post_id = 999999;
		$this->assertTrue( $this->store->set( $invalid_post_id, $analysis ) );
		$this->assertEquals( $analysis, $this->store->get( $invalid_post_id ) );
		$this->assertTrue( $this->store->delete( $invalid_post_id ) );
	}

	public function testItReturnsNullForNonExistentPost(): void {
		$non_existent_post_id = 999999;
		$this->assertNull( $this->store->get( $non_existent_post_id ) );
	}

	public function testDeleteReturnsFalseForNonExistentMeta(): void {
		$non_existent_post_id = 999999;
		$this->assertFalse( $this->store->delete( $non_existent_post_id ) );
	}

	public function testItCanSetGetAndDeleteMultiplePosts(): void {
		$data     = $this->fixture( 'resources/optimizer/result.json' );
		$analysis = WebsiteAnalysis::from( json_decode( $data, true ) );

		$post_id_1 = $this->factory()->post->create();
		$post_id_2 = $this->factory()->post->create();

		try {
			// Set data for both posts.
			$this->assertTrue( $this->store->set( $post_id_1, $analysis ) );
			$this->assertTrue( $this->store->set( $post_id_2, $analysis ) );

			// Verify both posts have the correct data.
			$this->assertEquals( $analysis, $this->store->get( $post_id_1 ) );
			$this->assertEquals( $analysis, $this->store->get( $post_id_2 ) );

			// Delete first post's data.
			$this->assertTrue( $this->store->delete( $post_id_1 ) );
			$this->assertNull( $this->store->get( $post_id_1 ) );

			// Verify second post's data is still there.
			$this->assertEquals( $analysis, $this->store->get( $post_id_2 ) );

			// Clean up second post.
			$this->assertTrue( $this->store->delete( $post_id_2 ) );
			$this->assertNull( $this->store->get( $post_id_2 ) );
		} finally {
			// Ensure cleanup even if test fails.
			$this->store->delete( $post_id_1 );
			$this->store->delete( $post_id_2 );
		}
	}

	public function testDataIntegrityAfterSerializationAndDeserialization(): void {
		$data              = $this->fixture( 'resources/optimizer/result.json' );
		$original_analysis = WebsiteAnalysis::from( json_decode( $data, true ) );

		$this->assertTrue( $this->store->set( $this->post_id, $original_analysis ) );
		$retried_analysis = $this->store->get( $this->post_id );

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
}
