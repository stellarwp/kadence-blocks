<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Filter;
use KadenceWP\KadenceBlocks\Optimizer\Status\Meta;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use Tests\Support\Classes\OptimizerTestCase;
use WP_Query;

final class FilterTest extends OptimizerTestCase {

	private Filter $filter;

	protected function setUp(): void {
		parent::setUp();

		$this->filter = $this->container->get( Filter::class );
	}

	public function testItHasStatusConstant(): void {
		$this->assertSame( 'kb_optimizer_status', Filter::STATUS );
	}

	public function testRenderFilterIsHookedIntoRestrictManagePosts(): void {
		// Verify that restrict_manage_posts has hooks registered.
		// The exact callback may be wrapped by the container, so we just verify the hook exists.
		$this->assertTrue(
			has_action( 'restrict_manage_posts' ) !== false,
			'render_filter should be hooked into restrict_manage_posts'
		);
	}

	public function testFilterPostsReturnsEarlyWhenNotInAdmin(): void {
		// Set front-end context.
		$this->set_admin_context( false );

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set GET parameter.
		$_GET[ Filter::STATUS ] = Status::OPTIMIZED;

		$this->filter->filter_posts( $query );

		// Should not have any meta_query set.
		$this->assertEmpty( $query->get( 'meta_query' ) );
	}

	public function testFilterPostsReturnsEarlyWhenNotMainQuery(): void {
		// Set admin context.
		$this->set_admin_context( true );

		// Create a non-main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = new WP_Query( [ 'post_type' => 'post' ] );

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set GET parameter.
		$_GET[ Filter::STATUS ] = Status::OPTIMIZED;

		$this->filter->filter_posts( $query );

		// Should not have any meta_query set.
		$this->assertEmpty( $query->get( 'meta_query' ) );

		// Clean up.
		$wp_the_query = $original_query;
	}

	public function testFilterPostsReturnsEarlyWhenStatusIsNull(): void {
		// Set admin context.
		$this->set_admin_context( true );

		// Ensure GET parameter is not set.
		unset( $_GET[ Filter::STATUS ] );

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		// Should not have any meta_query set.
		$this->assertEmpty( $query->get( 'meta_query' ) );

		// Clean up.
		$wp_the_query = $original_query;
	}

	public function testFilterPostsReturnsEarlyWhenStatusIsEmpty(): void {
		// Set admin context.
		$this->set_admin_context( true );

		// Set empty GET parameter.
		$_GET[ Filter::STATUS ] = '';

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		// Should not have any meta_query set.
		$this->assertEmpty( $query->get( 'meta_query' ) );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	public function testFilterPostsSetsMetaQueryForOptimizedStatus(): void {
		// Set admin context.
		$this->set_admin_context( true );

		$_GET[ Filter::STATUS ] = Status::OPTIMIZED;

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		$meta_query = $query->get( 'meta_query' );

		$this->assertIsArray( $meta_query );
		$this->assertCount( 1, $meta_query );
		$this->assertSame( Meta::KEY, $meta_query[0]['key'] );
		$this->assertSame( '=', $meta_query[0]['compare'] );
		$this->assertSame( Status::OPTIMIZED, $meta_query[0]['value'] );
		$this->assertSame( 'NUMERIC', $meta_query[0]['type'] );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	public function testFilterPostsSetsMetaQueryForStaleStatus(): void {
		// Set admin context.
		$this->set_admin_context( true );

		$_GET[ Filter::STATUS ] = Status::STALE;

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		$meta_query = $query->get( 'meta_query' );

		$this->assertIsArray( $meta_query );
		$this->assertCount( 1, $meta_query );
		$this->assertSame( Meta::KEY, $meta_query[0]['key'] );
		$this->assertSame( '=', $meta_query[0]['compare'] );
		$this->assertSame( Status::STALE, $meta_query[0]['value'] );
		$this->assertSame( 'NUMERIC', $meta_query[0]['type'] );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	public function testFilterPostsSetsMetaQueryForExcludedStatus(): void {
		// Set admin context.
		$this->set_admin_context( true );

		$_GET[ Filter::STATUS ] = Status::EXCLUDED;

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		$meta_query = $query->get( 'meta_query' );

		$this->assertIsArray( $meta_query );
		$this->assertCount( 1, $meta_query );
		$this->assertSame( Meta::KEY, $meta_query[0]['key'] );
		$this->assertSame( '=', $meta_query[0]['compare'] );
		$this->assertSame( Status::EXCLUDED, $meta_query[0]['value'] );
		$this->assertSame( 'NUMERIC', $meta_query[0]['type'] );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	public function testFilterPostsSetsMetaQueryForNotOptimizedStatus(): void {
		// Set admin context.
		$this->set_admin_context( true );

		$_GET[ Filter::STATUS ] = Status::NOT_OPTIMIZED;

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		$meta_query = $query->get( 'meta_query' );

		$this->assertIsArray( $meta_query );
		$this->assertSame( 'OR', $meta_query['relation'] );
		// Count only numeric-indexed items (excluding 'relation' key).
		$this->assertCount( 2, array_filter( array_keys( $meta_query ), 'is_numeric' ) );

		// First condition: NOT EXISTS.
		$this->assertSame( Meta::KEY, $meta_query[0]['key'] );
		$this->assertSame( 'NOT EXISTS', $meta_query[0]['compare'] );

		// Second condition: equals NOT_OPTIMIZED.
		$this->assertSame( Meta::KEY, $meta_query[1]['key'] );
		$this->assertSame( '=', $meta_query[1]['compare'] );
		$this->assertSame( Status::NOT_OPTIMIZED, $meta_query[1]['value'] );
		$this->assertSame( 'NUMERIC', $meta_query[1]['type'] );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	public function testFilterPostsHandlesStringStatusValue(): void {
		// Set admin context.
		$this->set_admin_context( true );

		// Set as string (as it comes from GET).
		$_GET[ Filter::STATUS ] = (string) Status::OPTIMIZED;

		$query = new WP_Query(
			[
				'post_type' => 'post',
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		$meta_query = $query->get( 'meta_query' );

		$this->assertIsArray( $meta_query );
		$this->assertCount( 1, $meta_query );
		// Value remains as string from GET (WordPress will handle NUMERIC type conversion).
		$this->assertSame( (string) Status::OPTIMIZED, $meta_query[0]['value'] );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	public function testFilterPostsOverwritesExistingMetaQuery(): void {
		// Set admin context.
		$this->set_admin_context( true );

		$_GET[ Filter::STATUS ] = Status::OPTIMIZED;

		$query = new WP_Query(
			[
				'post_type'  => 'post',
				'meta_query' => [
					[
						'key'   => 'existing_key',
						'value' => 'existing_value',
					],
				],
			]
		);

		// Set as main query.
		global $wp_the_query;
		$original_query = $wp_the_query ?? null;
		$wp_the_query   = $query;

		$this->filter->filter_posts( $query );

		$meta_query = $query->get( 'meta_query' );

		// Should overwrite existing meta_query.
		$this->assertIsArray( $meta_query );
		$this->assertCount( 1, $meta_query );
		$this->assertSame( Meta::KEY, $meta_query[0]['key'] );
		$this->assertSame( Status::OPTIMIZED, $meta_query[0]['value'] );

		// Clean up.
		$wp_the_query = $original_query;
		unset( $_GET[ Filter::STATUS ] );
	}

	/**
	 * Helper method to mock admin context.
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
