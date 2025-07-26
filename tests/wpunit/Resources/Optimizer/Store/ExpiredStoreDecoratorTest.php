<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Expired_Store_Decorator;
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

		$this->store   = $this->container->get( Expired_Store_Decorator::class );
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
