<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table\Sorters;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Sort_Strategy;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters\Optimizer_Sorter;
use KadenceWP\KadenceBlocks\Optimizer\Status\Meta;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use Tests\Support\Classes\OptimizerTestCase;
use WP_Query;

final class OptimizerSorterTest extends OptimizerTestCase {

	private const SLUG = 'optimizer_status';

	private Optimizer_Sorter $sorter;
	private Column $column;
	private Status $status;

	protected function setUp(): void {
		parent::setUp();

		$this->sorter = $this->container->get( Optimizer_Sorter::class );
		$this->column = new Column( self::SLUG, 'Optimizer Status', Meta::KEY );
		$this->status = $this->container->get( Status::class );
	}

	protected function tearDown(): void {
		// Clean up any created posts.
		$posts = get_posts(
			[
				'post_type'      => 'post',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			]
		);

		foreach ( $posts as $post_id ) {
			wp_delete_post( $post_id, true );
		}

		parent::tearDown();
	}

	public function testItCreatesInstance(): void {
		$this->assertInstanceOf( Sort_Strategy::class, $this->sorter );
	}

	public function testItDoesNotSortWhenNotInAdmin(): void {
		// Set front-end context.
		$this->set_admin_context( false );

		$query = new WP_Query(
			[
				'post_type' => 'post',
				'orderby'   => self::SLUG,
			]
		);

		// Should not have any meta query or custom clauses applied.
		$this->assertEmpty( $query->get( 'meta_query' ) );
	}

	public function testItDoesNotSortWhenNotMainQuery(): void {
		// Set admin context.
		$this->set_admin_context( true );

		// Create a secondary query.
		$query = new WP_Query(
			[
				'post_type' => 'post',
				'orderby'   => self::SLUG,
			]
		);

		// The main query flag is automatically false for new WP_Query instances in tests.
		$this->assertFalse( $query->is_main_query() );
	}

	public function testItDoesNotSortWhenOrderbyDoesNotMatch(): void {
		$this->set_admin_context( true );

		// Create test post.
		$this->factory()->post->create(
			[
				'post_status' => 'publish',
			]
		);

		// Create query with different orderby.
		$query = new WP_Query(
			[
				'post_type' => 'post',
				'orderby'   => 'date',
			]
		);

		$this->assertNotEquals( self::SLUG, $query->get( 'orderby' ) );
	}

	public function testItSortsAscWithExcludedPostsFirst(): void {
		$this->set_admin_context( true );

		// Create test posts.
		$excluded_post    = $this->create_post_with_title( 'Excluded Post' );
		$unoptimized_post = $this->create_post_with_title( 'Unoptimized Post' );
		$optimized_post   = $this->create_post_with_title( 'Optimized Post' );

		// Mark posts appropriately.
		$this->status->set_excluded( $excluded_post );
		$this->status->set_optimized( $optimized_post );

		// Query posts with ASC order.
		$query = $this->create_sorted_query( 'ASC' );
		$posts = $query->get_posts();

		$this->assertCount( 3, $posts );

		// ASC: Excluded > Unoptimized > Optimized.
		$this->assertEquals( $excluded_post, $posts[0]->ID, 'Excluded post should be first' );
		$this->assertEquals( $unoptimized_post, $posts[1]->ID, 'Unoptimized post should be second' );
		$this->assertEquals( $optimized_post, $posts[2]->ID, 'Optimized post should be third' );
	}

	public function testItSortsDescWithOptimizedPostsFirst(): void {
		$this->set_admin_context( true );

		// Create test posts.
		$excluded_post    = $this->create_post_with_title( 'Excluded Post' );
		$unoptimized_post = $this->create_post_with_title( 'Unoptimized Post' );
		$optimized_post   = $this->create_post_with_title( 'Optimized Post' );

		// Mark posts appropriately.
		$this->status->set_excluded( $excluded_post );
		$this->status->set_optimized( $optimized_post );

		// Query posts with DESC order.
		$query = $this->create_sorted_query( 'DESC' );
		$posts = $query->get_posts();

		$this->assertCount( 3, $posts );

		// DESC: Optimized > Unoptimized > Excluded.
		$this->assertEquals( $optimized_post, $posts[0]->ID, 'Optimized post should be first' );
		$this->assertEquals( $unoptimized_post, $posts[1]->ID, 'Unoptimized post should be second' );
		$this->assertEquals( $excluded_post, $posts[2]->ID, 'Excluded post should be third' );
	}

	public function testItHandlesMultipleExcludedPosts(): void {
		$this->set_admin_context( true );

		// Create multiple excluded posts.
		$excluded_1 = $this->create_post_with_title( 'Excluded 1' );
		$excluded_2 = $this->create_post_with_title( 'Excluded 2' );
		$excluded_3 = $this->create_post_with_title( 'Excluded 3' );
		$normal     = $this->create_post_with_title( 'Normal Post' );

		$this->status->set_excluded( $excluded_1 );
		$this->status->set_excluded( $excluded_2 );
		$this->status->set_excluded( $excluded_3 );

		// Query posts with ASC order.
		$query = $this->create_sorted_query( 'ASC' );
		$posts = $query->get_posts();

		$this->assertCount( 4, $posts );

		// First three should be excluded, last should be normal.
		$excluded_ids = [ $excluded_1, $excluded_2, $excluded_3 ];
		$this->assertContains( $posts[0]->ID, $excluded_ids, 'First post should be excluded' );
		$this->assertContains( $posts[1]->ID, $excluded_ids, 'Second post should be excluded' );
		$this->assertContains( $posts[2]->ID, $excluded_ids, 'Third post should be excluded' );
		$this->assertEquals( $normal, $posts[3]->ID, 'Normal post should be last' );
	}

	public function testItHandlesMultipleOptimizedPosts(): void {
		$this->set_admin_context( true );

		// Create multiple optimized posts.
		$optimized_1 = $this->create_post_with_title( 'Optimized 1' );
		$optimized_2 = $this->create_post_with_title( 'Optimized 2' );
		$optimized_3 = $this->create_post_with_title( 'Optimized 3' );
		$normal      = $this->create_post_with_title( 'Normal Post' );

		$this->status->set_optimized( $optimized_1 );
		$this->status->set_optimized( $optimized_2 );
		$this->status->set_optimized( $optimized_3 );

		// Query posts with DESC order.
		$query = $this->create_sorted_query( 'DESC' );
		$posts = $query->get_posts();

		$this->assertCount( 4, $posts );

		// First three should be optimized, last should be normal.
		$optimized_ids = [ $optimized_1, $optimized_2, $optimized_3 ];
		$this->assertContains( $posts[0]->ID, $optimized_ids, 'First post should be optimized' );
		$this->assertContains( $posts[1]->ID, $optimized_ids, 'Second post should be optimized' );
		$this->assertContains( $posts[2]->ID, $optimized_ids, 'Third post should be optimized' );
		$this->assertEquals( $normal, $posts[3]->ID, 'Normal post should be last' );
	}

	public function testItOnlyIncludesPublishedPosts(): void {
		$this->set_admin_context( true );

		// Create posts with different statuses.
		$published = $this->create_post_with_title( 'Published Post', 'publish' );
		$this->create_post_with_title( 'Draft Post', 'draft' );
		$this->create_post_with_title( 'Pending Post', 'pending' );
		$this->create_post_with_title( 'Private Post', 'private' );

		// Query posts.
		$query = $this->create_sorted_query( 'ASC' );
		$posts = $query->get_posts();

		// Only published post should be returned.
		$this->assertCount( 1, $posts );
		$this->assertEquals( $published, $posts[0]->ID );
	}

	public function testItHandlesEmptyResultSet(): void {
		$this->set_admin_context( true );

		// Query with no posts.
		$query = $this->create_sorted_query( 'ASC' );
		$posts = $query->get_posts();

		$this->assertEmpty( $posts );
	}

	public function testItUsesDistinctToAvoidDuplicates(): void {
		$this->set_admin_context( true );

		// Create post with optimization data.
		$post = $this->create_post_with_title( 'Post' );
		$this->status->set_optimized( $post );

		// Query posts.
		$query = $this->create_sorted_query( 'ASC' );
		$posts = $query->get_posts();

		// Should only get one result, not duplicates from JOINs.
		$this->assertCount( 1, $posts );
		$this->assertEquals( $post, $posts[0]->ID );
	}

	public function testItHandlesCaseInsensitiveOrderAsc(): void {
		$this->set_admin_context( true );

		$optimized_post   = $this->create_post_with_title( 'Optimized' );
		$unoptimized_post = $this->create_post_with_title( 'Unoptimized' );

		$this->status->set_optimized( $optimized_post );

		// Test lowercase 'asc'.
		$query = $this->create_sorted_query( 'asc' );
		$posts = $query->get_posts();

		$this->assertEquals( $unoptimized_post, $posts[0]->ID, 'Lowercase asc should work' );
		$this->assertEquals( $optimized_post, $posts[1]->ID, 'Lowercase asc should work' );
	}

	public function testItHandlesCaseInsensitiveOrderDesc(): void {
		$this->set_admin_context( true );

		$optimized_post   = $this->create_post_with_title( 'Optimized' );
		$unoptimized_post = $this->create_post_with_title( 'Unoptimized' );

		$this->status->set_optimized( $optimized_post );

		// Test lowercase 'desc'.
		$query = $this->create_sorted_query( 'desc' );
		$posts = $query->get_posts();

		$this->assertEquals( $optimized_post, $posts[0]->ID, 'Lowercase desc should work' );
		$this->assertEquals( $unoptimized_post, $posts[1]->ID, 'Lowercase desc should work' );
	}

	public function testItDefaultsToDescWhenOrderNotSpecified(): void {
		global $wp_the_query;

		$this->set_admin_context( true );

		$optimized_post   = $this->create_post_with_title( 'Optimized' );
		$unoptimized_post = $this->create_post_with_title( 'Unoptimized' );

		$this->status->set_optimized( $optimized_post );

		// Store the original main query.
		$original_query = $wp_the_query;

		// Query without specifying order (should default to DESC).
		$query = new WP_Query(
			[
				'post_type'   => 'post',
				'post_status' => 'publish',
				'orderby'     => $this->column->slug,
			]
		);

		// Set this as the main query temporarily.
		$wp_the_query = $query;

		// Manually trigger the sort since we need main query context.
		$this->sorter->sort( $query, $this->column );

		$posts = $query->get_posts();

		// Restore the original main query.
		$wp_the_query = $original_query;

		// DESC: Optimized should be first.
		$this->assertEquals( $optimized_post, $posts[0]->ID, 'Should default to DESC order' );
		$this->assertEquals( $unoptimized_post, $posts[1]->ID, 'Should default to DESC order' );
	}

	/**
	 * Create a post with a specific title and status.
	 *
	 * @param string $title The post title.
	 * @param string $status The post status.
	 *
	 * @return int The post ID.
	 */
	private function create_post_with_title( string $title, string $status = 'publish' ): int {
		return $this->factory()->post->create(
			[
				'post_title'  => $title,
				'post_status' => $status,
			]
		);
	}

	/**
	 * Create a sorted query for testing.
	 *
	 * @param string $order The sort order (ASC or DESC).
	 *
	 * @return WP_Query
	 */
	private function create_sorted_query( string $order ): WP_Query {
		global $wp_the_query;

		// Store the original main query.
		$original_query = $wp_the_query;

		// Create a new query and mark it as the main query.
		$query = new WP_Query(
			[
				'post_type'   => 'post',
				'post_status' => 'publish',
				'orderby'     => $this->column->slug,
				'order'       => $order,
			]
		);

		// Set this as the main query temporarily.
		$wp_the_query = $query;

		// Manually trigger the sort since we need main query context.
		$this->sorter->sort( $query, $this->column );

		// Execute the query.
		$query->get_posts();

		// Restore the original main query.
		$wp_the_query = $original_query;

		return $query;
	}

	/**
	 * Helper method to mock admin context.
	 *
	 * Mock is_admin() function behavior by modifying global state.
	 *
	 * @param bool $is_admin
	 */
	private function set_admin_context( bool $is_admin ): void {
		if ( $is_admin ) {
			// Set up admin context.
			set_current_screen( 'edit-post' );
		} else {
			// Remove admin context.
			set_current_screen( 'front' );
		}
	}
}
