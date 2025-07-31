<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Indexing;

use KadenceWP\KadenceBlocks\Optimizer\Indexing\Post_Sort_Indexer;
use Tests\Support\Classes\TestCase;

final class PostSortIndexerTest extends TestCase {

	private Post_Sort_Indexer $indexer;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->indexer = $this->container->get( Post_Sort_Indexer::class );

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
			$this->indexer->delete( $this->post_id );
		}

		parent::tearDown();
	}

	public function testGetReturnsFalseForUnindexedPost(): void {
		$this->assertFalse( $this->indexer->get( $this->post_id ) );
	}

	public function testSetIndexesPostSuccessfully(): void {
		$result = $this->indexer->set( $this->post_id );

		$this->assertTrue( $result );
		$this->assertTrue( $this->indexer->get( $this->post_id ) );
	}

	public function testGetReturnsTrueForIndexedPost(): void {
		// First index the post.
		$this->indexer->set( $this->post_id );

		// Then verify it's indexed.
		$this->assertTrue( $this->indexer->get( $this->post_id ) );
	}

	public function testDeleteRemovesIndexSuccessfully(): void {
		// First index the post.
		$this->indexer->set( $this->post_id );
		$this->assertTrue( $this->indexer->get( $this->post_id ) );

		// Then delete the index.
		$result = $this->indexer->delete( $this->post_id );

		$this->assertTrue( $result );
		$this->assertFalse( $this->indexer->get( $this->post_id ) );
	}

	public function testDeleteReturnsFalseForNonExistentIndex(): void {
		// Try to delete an index that doesn't exist.
		$result = $this->indexer->delete( $this->post_id );

		$this->assertFalse( $result );
		$this->assertFalse( $this->indexer->get( $this->post_id ) );
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
		$this->indexer->set( $this->post_id );
		$this->indexer->set( $post_id_3 );

		// Verify indexing status.
		$this->assertTrue( $this->indexer->get( $this->post_id ) );
		$this->assertFalse( $this->indexer->get( $post_id_2 ) );
		$this->assertTrue( $this->indexer->get( $post_id_3 ) );

		// Clean up additional posts.
		$this->indexer->delete( $post_id_2 );
		$this->indexer->delete( $post_id_3 );
	}

	public function testHandlesZeroPostId(): void {
		// Test get with zero post ID.
		$this->assertFalse( $this->indexer->get( 0 ) );

		// Test set with zero post ID.
		$result = $this->indexer->set( 0 );
		$this->assertFalse( $result );

		// Test delete with zero post ID.
		$result = $this->indexer->delete( 0 );
		$this->assertFalse( $result );
	}

	public function testMetaKeyConstant(): void {
		// Test that the meta key constant is accessible.
		$this->assertEquals( '_kb_has_optimizer_data', Post_Sort_Indexer::KEY );
	}
}
