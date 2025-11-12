<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Admin\Post_Meta;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Post_Excluded_Rule;
use Tests\Support\Classes\OptimizerTestCase;

final class PostExcludedRuleTest extends OptimizerTestCase {

	private Post_Excluded_Rule $rule;

	protected function setUp(): void {
		parent::setUp();

		$this->rule = $this->container->get( Post_Excluded_Rule::class );
	}

	protected function tearDown(): void {
		// Clean up post globals.
		unset( $GLOBALS['post'] );

		parent::tearDown();
	}

	/**
	 * Data provider for post types.
	 *
	 * @return array<string, array<string>>
	 */
	public function postTypeProvider(): array {
		return [
			'post' => [ 'post' ],
			'page' => [ 'page' ],
		];
	}

	public function testItDoesNotSkipWhenNoPostFound(): void {
		$this->assertFalse( $this->rule->should_skip() );
	}

	/**
	 * @dataProvider postTypeProvider
	 */
	public function testItDoesNotSkipPostWhenNoMeta( string $post_type ): void {
		global $post;

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Rule Test',
				'post_content' => 'This post should not be skipped',
				'post_status'  => 'publish',
				'post_type'    => $post_type,
			]
		);

		$this->assertFalse( $this->rule->should_skip() );
	}

	/**
	 * @dataProvider postTypeProvider
	 */
	public function testItDoesNotSkipPostWhenMetaIsFalsely( string $post_type ): void {
		global $post;

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Rule Test',
				'post_content' => 'This post should not be skipped',
				'post_status'  => 'publish',
				'post_type'    => $post_type,
			]
		);

		$result = update_post_meta( $post->ID, Post_Meta::META_KEY, 0 );

		$this->assertGreaterThan( 0, $result );

		$this->assertFalse( $this->rule->should_skip() );
	}

	/**
	 * @dataProvider postTypeProvider
	 */
	public function testItSkipsPostWithMeta( string $post_type ): void {
		global $post;

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Rule Test',
				'post_content' => 'This post will be skipped',
				'post_status'  => 'publish',
				'post_type'    => $post_type,
			]
		);

		$result = update_post_meta( $post->ID, Post_Meta::META_KEY, 1 );

		$this->assertGreaterThan( 0, $result );

		$this->assertTrue( $this->rule->should_skip() );
	}
}
