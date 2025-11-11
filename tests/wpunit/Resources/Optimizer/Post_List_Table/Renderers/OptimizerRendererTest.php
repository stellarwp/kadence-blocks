<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table\Renderers;

use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Renderable;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers\Optimizer_Renderer;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;

final class OptimizerRendererTest extends OptimizerTestCase {

	use Permalink_Trait;

	private int $post_id;
	private Path $path;
	private Store $store;
	private Nonce $nonce;
	private Optimizer_Renderer $renderer;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		// Need to call this manually to get page permalinks working.
		global $wp_rewrite;
		$wp_rewrite->set_permalink_structure( '/%postname%/' );
		$wp_rewrite->flush_rules();

		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		$post_path = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		$this->store    = $this->container->get( Store::class );
		$this->nonce    = $this->container->get( Nonce::class );
		$this->renderer = $this->container->get( Optimizer_Renderer::class );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );
		wp_delete_post( $this->post_id, true );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function testItImplementsInterface(): void {
		$this->assertInstanceOf( Renderable::class, $this->renderer );
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
		$this->store->set( $this->path, $this->createTestAnalysis() );

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
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Run Optimizer</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
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
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post_url        = get_permalink( $this->post_id );
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-remove-post-optimization" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Remove Optimization</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
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
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Run Optimizer</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
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
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post_url        = get_permalink( $this->post_id );
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-remove-post-optimization" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Remove Optimization</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
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
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Run Optimizer</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
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
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Run Optimizer</a>',
			$special_post_id,
			esc_url( $post_url ),
			$this->get_post_path( $special_post_id ),
			$nonce_value
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
				'post_name'   => 'test-page',
			]
		);

		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		$post_url        = get_permalink( $page_id );
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Run Optimizer</a>',
			$page_id,
			esc_url( $post_url ),
			'/test-page/',
			$nonce_value
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $page_id );

		wp_delete_post( $page_id, true );
	}

	public function testItRendersOutdatedOptimizationStatusForUserWithoutDeletePermission(): void {
		// Create a subscriber user (limited permissions).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'subscriber',
			]
		);

		wp_set_current_user( $user_id );

		// Set outdated optimization data.
		$this->store->set( $this->path, $this->createOutdatedAnalysis() );

		$this->expectOutputString( 'Optimization Outdated' );
		$this->renderer->render( $this->post_id );
	}

	public function testItRendersOutdatedOptimizationLinkForUserWithDeletePermission(): void {
		// Create an editor user (has delete_post permission).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		// Set outdated optimization data.
		$this->store->set( $this->path, $this->createOutdatedAnalysis() );

		$post_url        = get_permalink( $this->post_id );
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Optimization Outdated. Run again?</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	public function testItCorrectlyIdentifiesOutdatedOptimization(): void {
		// Create an editor user (has delete_post permission).
		$user_id = $this->factory()->user->create(
			[
				'role' => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		// Set optimization data that is not outdated.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post_url        = get_permalink( $this->post_id );
		$nonce_value     = $this->nonce->create();
		$expected_output = sprintf(
			'<a href="#" class="kb-remove-post-optimization" data-post-id="%d" data-post-url="%s" data-post-path="%s" data-nonce="%s">Remove Optimization</a>',
			$this->post_id,
			esc_url( $post_url ),
			$this->path->path(),
			$nonce_value
		);

		$this->expectOutputString( $expected_output );
		$this->renderer->render( $this->post_id );
	}

	/**
	 * Create a website analysis object for testing.
	 *
	 * @return WebsiteAnalysis
	 */
	private function createTestAnalysis(): WebsiteAnalysis {
		$analysis_data = [
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
		];

		return WebsiteAnalysis::from( $analysis_data );
	}

	/**
	 * Create an outdated website analysis object for testing.
	 *
	 * @return WebsiteAnalysis
	 */
	private function createOutdatedAnalysis(): WebsiteAnalysis {
		$analysis_data = [
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
		];

		return WebsiteAnalysis::from( $analysis_data );
	}
}
