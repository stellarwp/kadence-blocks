<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer;

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

	public function testItGetsArrayAsEmptyValue(): void {
		$this->assertSame( [], $this->store->get( $this->post_id ) );
	}

	public function testItSetsGetsAndDeletesOptimizationData(): void {
		$data = $this->fixture( 'resources/optimizer/result.json' );

		$this->assertTrue( $this->store->set( $this->post_id, $data ) );
		$this->assertEquals( json_decode( $data, true ), $this->store->get( $this->post_id ) );
		$this->assertTrue( $this->store->delete( $this->post_id ) );
		$this->assertEmpty( $this->store->get( $this->post_id ) );
	}
}
