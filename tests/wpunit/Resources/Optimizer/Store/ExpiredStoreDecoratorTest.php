<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Expired_Store_Decorator;
use Tests\Support\Classes\TestCase;

final class ExpiredStoreDecoratorTest extends TestCase {

	private Expired_Store_Decorator $store;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->store   = $this->container->get( Expired_Store_Decorator::class );
		$this->post_id = $this->factory()->post->create();

		$this->assertGreaterThan( 0, $this->post_id );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->post_id );

		parent::tearDown();
	}

	public function testItGetsNullValueWhenNoOptimizationDataExists(): void {
		$this->assertNull( $this->store->get( $this->post_id ) );
	}

	public function testItSetsGetsAndDeletesOptimizationData(): void {
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture() );

		$this->assertTrue( $this->store->set( $this->post_id, $analysis ) );
		$this->assertEquals( $analysis, $this->store->get( $this->post_id ) );
		$this->assertTrue( $this->store->delete( $this->post_id ) );
		$this->assertNull( $this->store->get( $this->post_id ) );
	}

	public function testItReturnsNullWhenPostModifiedAfterAnalysis(): void {
		// Force last modified to -1 minute ago so we aren't dealing with time shifting.
		$analysis = WebsiteAnalysis::from( $this->getResultsFixture( '-1 minute' ) );

		$this->assertTrue( $this->store->set( $this->post_id, $analysis ) );

		// Update the post to make it newer than the analysis.
		wp_update_post(
			[
				'ID'           => $this->post_id,
				'post_title'   => 'Updated Post',
				'post_content' => 'Updated content',
			]
		);

		$this->assertNull( $this->store->get( $this->post_id ) );
	}

	/**
	 * Get the results fixture with the lastModified appended to it.
	 */
	private function getResultsFixture( string $datetime = 'now' ): array {
		$data    = $this->fixture( 'resources/optimizer/result.json' );
		$decoded = json_decode( $data, true );

		$decoded['lastModified'] = new DateTimeImmutable( $datetime, new DateTimeZone( 'UTC' ) );

		return $decoded;
	}
}
