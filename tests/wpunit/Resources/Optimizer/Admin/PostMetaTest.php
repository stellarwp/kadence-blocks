<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Admin;

use KadenceWP\KadenceBlocks\Optimizer\Admin\Post_Meta;
use Tests\Support\Classes\OptimizerTestCase;

final class PostMetaTest extends OptimizerTestCase {

	private Post_Meta $post_meta;

	protected function setUp(): void {
		parent::setUp();

		$this->post_meta = $this->container->get( Post_Meta::class );
	}

	public function testItHasMetaKey(): void {
		$this->assertSame( '_kb_optimizer_exclude', Post_Meta::META_KEY );
	}

	public function testItHasScriptHandle(): void {
		$this->assertSame( 'kadence-optimizer-meta', Post_Meta::META_SCRIPT_HANDLE );
	}

	public function testItRegistersPostMeta(): void {
		$this->post_meta->register_meta();

		// Verify the meta is registered.
		$registered = get_registered_meta_keys( 'post' );

		$this->assertArrayHasKey( Post_Meta::META_KEY, $registered );

		$meta_config = $registered[ Post_Meta::META_KEY ];

		$this->assertTrue( $meta_config['show_in_rest'] );
		$this->assertTrue( $meta_config['single'] );
		$this->assertSame( 'boolean', $meta_config['type'] );
		$this->assertSame( 'Exclude this post from optimization.', $meta_config['description'] );
	}

	public function testItDoesNotExcludePostWithoutMeta(): void {
		$post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Excluded Post',
				'post_status' => 'publish',
			]
		);

		$this->assertFalse( $this->post_meta->is_excluded( $post_id ) );
	}

	public function testItExcludesPost(): void {
		$post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Excluded Post',
				'post_status' => 'publish',
			]
		);

		$this->assertTrue( $this->post_meta->exclude( $post_id ) );
		$this->assertTrue( $this->post_meta->is_excluded( $post_id ) );
	}
}
