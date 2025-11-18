<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Row_Action;
use KadenceWP\KadenceBlocks\Optimizer\Request\Request;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;
use WP_Post;

final class RowActionTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Row_Action $row_action;
	private Store $store;
	private Nonce $nonce;
	private int $post_id;
	private Path $path;

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
				'post_name'   => 'test-post',
			]
		);

		$post_path = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path       = new Path( $post_path, $this->post_id );
		$this->store      = $this->container->get( Store::class );
		$this->nonce      = $this->container->get( Nonce::class );
		$this->row_action = new Row_Action( $this->nonce, $this->store );
	}

	protected function tearDown(): void {
		// Clean up test data.
		if ( $this->post_id > 0 ) {
			$post_path = $this->get_post_path( $this->post_id );
			if ( $post_path ) {
				$path = new Path( $post_path, $this->post_id );
				$this->store->delete( $path );
			}
			wp_delete_post( $this->post_id, true );
		}

		parent::tearDown();
	}

	public function testItHasActionConstant(): void {
		$this->assertSame( 'kb_optimizer_view_optimized', Row_Action::ACTION );
	}

	public function testItReturnsActionsUnchangedWhenStoreDoesNotHavePath(): void {
		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [
			'edit'   => '<a href="#">Edit</a>',
			'delete' => '<a href="#">Delete</a>',
		];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		$this->assertSame( $actions, $result );
		$this->assertArrayNotHasKey( Row_Action::ACTION, $result );
	}

	public function testItReturnsActionsUnchangedWhenPermalinkIsFalse(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		// Create a post without a permalink (e.g., draft or invalid post).
		$draft_post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Draft Post',
				'post_status' => 'draft',
			]
		);

		$draft_post = get_post( $draft_post_id );
		$this->assertInstanceOf( WP_Post::class, $draft_post );

		$actions = [
			'edit' => '<a href="#">Edit</a>',
		];

		$result = $this->row_action->add_view_optimized_link( $actions, $draft_post );

		// Draft posts don't have permalinks, so should return unchanged.
		$this->assertSame( $actions, $result );
		$this->assertArrayNotHasKey( Row_Action::ACTION, $result );

		wp_delete_post( $draft_post_id, true );
	}

	public function testItAddsViewOptimizedLinkWhenConditionsAreMet(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [
			'edit' => '<a href="#">Edit</a>',
		];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		$this->assertArrayHasKey( Row_Action::ACTION, $result );
		$this->assertStringContainsString( 'View Optimized', $result[ Row_Action::ACTION ] );
		$this->assertStringContainsString( 'target="_blank"', $result[ Row_Action::ACTION ] );
	}

	public function testItIncludesNonceTokenInLink(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		$nonce_value = $this->nonce->create();
		$permalink   = get_permalink( $this->post_id );

		$this->assertStringContainsString( Request::QUERY_TOKEN . '=' . $nonce_value, $result[ Row_Action::ACTION ] );
		$this->assertStringContainsString( esc_url( $permalink ), $result[ Row_Action::ACTION ] );
	}

	public function testItEscapesUrlCorrectly(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		// Verify the URL is properly escaped.
		$this->assertStringNotContainsString( '<script>', $result[ Row_Action::ACTION ] );
		$this->assertStringNotContainsString( 'javascript:', $result[ Row_Action::ACTION ] );
		$this->assertStringContainsString( 'href="', $result[ Row_Action::ACTION ] );
	}

	public function testItPreservesExistingActions(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [
			'edit'   => '<a href="#">Edit</a>',
			'delete' => '<a href="#">Delete</a>',
		];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		$this->assertArrayHasKey( 'edit', $result );
		$this->assertArrayHasKey( 'delete', $result );
		$this->assertArrayHasKey( Row_Action::ACTION, $result );
		$this->assertSame( $actions['edit'], $result['edit'] );
		$this->assertSame( $actions['delete'], $result['delete'] );
	}

	public function testItWorksWithPages(): void {
		// Create a page.
		$page_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Page',
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_name'   => 'test-page',
			]
		);

		$page_path = $this->get_post_path( $page_id );
		$this->assertNotEmpty( $page_path );

		$path = new Path( $page_path, $page_id );

		// Set optimization data in store.
		$this->store->set( $path, $this->createTestAnalysis() );

		$page = get_post( $page_id );
		$this->assertInstanceOf( WP_Post::class, $page );

		$actions = [];

		$result = $this->row_action->add_view_optimized_link( $actions, $page );

		$this->assertArrayHasKey( Row_Action::ACTION, $result );
		$this->assertStringContainsString( 'View Optimized', $result[ Row_Action::ACTION ] );

		// Clean up.
		$this->store->delete( $path );
		wp_delete_post( $page_id, true );
	}

	public function testItHandlesPostWithSpecialCharactersInTitle(): void {
		// Create a post with special characters.
		$special_post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Post with "quotes" & <tags>',
				'post_status' => 'publish',
				'post_name'   => 'post-with-quotes-tags',
			]
		);

		$post_path = $this->get_post_path( $special_post_id );
		$this->assertNotEmpty( $post_path );

		$path = new Path( $post_path, $special_post_id );

		// Set optimization data in store.
		$this->store->set( $path, $this->createTestAnalysis() );

		$post = get_post( $special_post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		$this->assertArrayHasKey( Row_Action::ACTION, $result );
		$this->assertStringContainsString( 'View Optimized', $result[ Row_Action::ACTION ] );

		// Clean up.
		$this->store->delete( $path );
		wp_delete_post( $special_post_id, true );
	}

	public function testItReturnsEmptyArrayWhenGivenEmptyActions(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [];

		$result = $this->row_action->add_view_optimized_link( $actions, $post );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( Row_Action::ACTION, $result );
		$this->assertCount( 1, $result );
	}

	public function testItHandlesMultipleCallsCorrectly(): void {
		// Set optimization data in store.
		$this->store->set( $this->path, $this->createTestAnalysis() );

		$post = get_post( $this->post_id );
		$this->assertInstanceOf( WP_Post::class, $post );

		$actions = [];

		// First call.
		$result1 = $this->row_action->add_view_optimized_link( $actions, $post );
		$this->assertArrayHasKey( Row_Action::ACTION, $result1 );

		// Second call with the result from first call.
		$result2 = $this->row_action->add_view_optimized_link( $result1, $post );
		$this->assertArrayHasKey( Row_Action::ACTION, $result2 );

		// Should still have only one View Optimized link (overwrites previous).
		$this->assertArrayHasKey( Row_Action::ACTION, $result2 );
		$this->assertIsString( $result2[ Row_Action::ACTION ] );
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
}
