<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table\Renderers;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers\Optimizer_Renderer;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;
use Tests\Support\Classes\TestCase;

final class OptimizerRendererTest extends TestCase {

	private Store $store;
	private Text_Repository $text_repository;
	private Optimizer_Renderer $renderer;
	private int $post_id;

	protected function setUp(): void {
		parent::setUp();

		$this->store           = $this->container->get( Store::class );
		$this->text_repository = $this->container->get( Text_Repository::class );
		$this->renderer        = new Optimizer_Renderer( $this->store, $this->text_repository );
		$this->post_id         = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);
	}

	protected function tearDown(): void {
		$this->store->delete( $this->post_id );
		wp_delete_post( $this->post_id, true );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function testItCreatesWithStoreInjection(): void {
		$renderer = new Optimizer_Renderer( $this->store, $this->text_repository );

		$this->assertInstanceOf( Optimizer_Renderer::class, $renderer );
	}

	public function testItRendersNotOptimizableForNonExistentPost(): void {
		$non_existent_post_id = 999999;

		$this->expectOutputString( 'Not Optimizable' );
		$this->renderer->render( $non_existent_post_id );
	}

	public function testItRendersNotOptimizableForDraftPost(): void {
		$draft_post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Draft Post',
				'post_status' => 'draft',
			]
		);

		$this->expectOutputString( 'Not Optimizable' );
		$this->renderer->render( $draft_post_id );

		wp_delete_post( $draft_post_id, true );
	}

	public function testItRendersNotOptimizableForPrivatePost(): void {
		$private_post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Private Post',
				'post_status' => 'private',
			]
		);

		$this->expectOutputString( 'Not Optimizable' );
		$this->renderer->render( $private_post_id );

		wp_delete_post( $private_post_id, true );
	}

	public function testItRendersNotOptimizedStatusForUserWithoutEditPermission(): void {
		// Create a subscriber user (limited permissions).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'subscriber',
			]
		);

		wp_set_current_user( $user_id );

		$this->expectOutputString( 'Not Optimized' );
		$this->renderer->render( $this->post_id );
	}

	public function testItRendersOptimizedStatusForUserWithoutDeletePermission(): void {
		// Create a subscriber user (limited permissions).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'subscriber',
			]
		);

		wp_set_current_user( $user_id );

		// Set optimization data.
		$this->store->set( $this->post_id, $this->createTestAnalysis() );

		$this->expectOutputString( 'Optimized' );
		$this->renderer->render( $this->post_id );
	}

	public function testItRendersRunOptimizerLinkForUserWithEditPermission(): void {
		// Create an editor user (has edit_post permission).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		$post_url        = get_permalink( $this->post_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s">Run Optimizer</a>',
			$this->post_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	public function testItRendersRemoveOptimizationLinkForUserWithDeletePermission(): void {
		// Create an editor user (has delete_post permission).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		// Set optimization data.
		$this->store->set( $this->post_id, $this->createTestAnalysis() );

		$post_url        = get_permalink( $this->post_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-remove-post-optimization" data-post-id="%d" data-post-url="%s">Remove Optimization</a>',
			$this->post_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	public function testItRendersCorrectAttributesForOptimizeAction(): void {
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		$post_url        = get_permalink( $this->post_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s">Run Optimizer</a>',
			$this->post_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	public function testItRendersCorrectAttributesForRemoveAction(): void {
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		// Set optimization data.
		$this->store->set( $this->post_id, $this->createTestAnalysis() );

		$post_url        = get_permalink( $this->post_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-remove-post-optimization" data-post-id="%d" data-post-url="%s">Remove Optimization</a>',
			$this->post_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	public function testItEscapesOutputCorrectly(): void {
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		$post_url        = get_permalink( $this->post_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s">Run Optimizer</a>',
			$this->post_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	public function testItHandlesPostWithSpecialCharactersInUrl(): void {
		// Create a post with special characters that might need URL encoding.
		$special_post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Post with "quotes" & <tags>',
				'post_status' => 'publish',
			]
		);

		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		$post_url        = get_permalink( $special_post_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s">Run Optimizer</a>',
			$special_post_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $special_post_id );

		wp_delete_post( $special_post_id, true );
	}

	public function testItHandlesDifferentPostTypes(): void {
		// Create a page instead of a post.
		$page_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Page',
				'post_type'   => 'page',
				'post_status' => 'publish',
			]
		);

		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		$post_url        = get_permalink( $page_id );
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s">Run Optimizer</a>',
			$page_id,
			esc_url( $post_url )
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $page_id );

		wp_delete_post( $page_id, true );
	}

	/**
	 * Create a website analysis object for testing.
	 *
	 * @return WebsiteAnalysis
	 */
	private function createTestAnalysis(): WebsiteAnalysis {
		$analysis_data = [
			'desktop' => [
				'criticalImages'   => 3,
				'backgroundImages' => [],
				'sections'         => [],
			],
			'mobile'  => [
				'criticalImages'   => 2,
				'backgroundImages' => [],
				'sections'         => [],
			],
			'images'  => [],
		];

		return WebsiteAnalysis::from( $analysis_data );
	}
}
