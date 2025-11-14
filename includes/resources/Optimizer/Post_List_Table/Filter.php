<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Status\Meta;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals;

/**
 * Post List Table filter.
 */
final class Filter {

	public const STATUS = 'kb_optimizer_status';

	/**
	 * Add a filter dropdown to the Post List Table.
	 *
	 * @action restrict_manage_posts
	 *
	 * @param string $post_type The current post type being viewed.
	 *
	 * @return void
	 */
	public function render_filter( string $post_type ): void {
		if ( ! is_post_type_viewable( $post_type ) ) {
			return;
		}

		$current = SuperGlobals::get_get_var( self::STATUS, '' );
		?>
		<label for="kb-optimizer-filter" class="screen-reader-text"><?php echo esc_html__( 'Filter by Optimizer Status', 'kadence-blocks' ); ?></label>
		<select name="<?php echo esc_attr( self::STATUS ); ?>" id="kb-optimizer-filter">
			<option value="">
				<?php echo esc_html__( 'All Optimizer Statuses', 'kadence-blocks' ); ?>
			</option>
			<option
				value="<?php echo esc_attr( Status::STALE ); ?>"
				<?php selected( $current, Status::STALE ); ?>>
				<?php echo esc_html__( 'Outdated', 'kadence-blocks' ); ?>
			</option>
			<option
				value="<?php echo esc_attr( Status::EXCLUDED ); ?>"
				<?php selected( $current, Status::EXCLUDED ); ?>>
				<?php echo esc_html__( 'Excluded', 'kadence-blocks' ); ?>
			</option>
			<option
				value="<?php echo esc_attr( Status::OPTIMIZED ); ?>"
				<?php selected( $current, Status::OPTIMIZED ); ?>>
				<?php echo esc_html__( 'Optimized', 'kadence-blocks' ); ?>
			</option>
			<option
				value="<?php echo esc_attr( Status::NOT_OPTIMIZED ); ?>"
				<?php selected( $current, Status::NOT_OPTIMIZED ); ?>>
				<?php echo esc_html__( 'Not Optimized', 'kadence-blocks' ); ?>
			</option>
		</select>
		<?php
	}

	/**
	 * Filter posts on the Post List Table by their optimization status.
	 *
	 * @action pre_get_posts
	 *
	 * @param \WP_Query $query
	 *
	 * @return void
	 */
	public function filter_posts( \WP_Query $query ) {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		$status = SuperGlobals::get_get_var( self::STATUS );

		if ( $status === null || $status === '' ) {
			return;
		}

		// Filter by everything besides "not optimized".
		$meta_query = [
			[
				'key'     => Meta::KEY,
				'compare' => '=',
				'value'   => $status,
				'type'    => 'NUMERIC',
			],
		];

		if ( Status::NOT_OPTIMIZED === (int) $status ) {
			$meta_query = [
				'relation' => 'OR',
				[
					'key'     => Meta::KEY,
					'compare' => 'NOT EXISTS',
				],
				[
					'key'     => Meta::KEY,
					'compare' => '=',
					'value'   => $status,
					'type'    => 'NUMERIC',
				],
			];
		}

		$query->set( 'meta_query', $meta_query );
	}
}
