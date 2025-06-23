<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use WP_Post;

final class Optimizer {

	/**
	 * Add an "Optimize" link to post/page row actions.
	 *
	 * @param array   $actions An array of row action links.
	 * @param WP_Post $post    The post object.
	 *
	 * @return array Modified array of row action links.
	 */
	public function add_optimize_row_action( array $actions, WP_Post $post ): array {
		// Only show for published posts/pages.
		if ( $post->post_status !== 'publish' ) {
			return $actions;
		}

		// Only show for public post types that have public URLs.
		$post_type_object = get_post_type_object( $post->post_type );

		if ( ! is_post_type_viewable( $post_type_object ) ) {
			return $actions;
		}

		// Only add the optimize link if we can get the post URL.
		$post_url = get_permalink( $post->ID );

		if ( ! $post_url || is_wp_error( $post_url ) ) {
			return $actions;
		}

		// Permission check.
		if ( ! current_user_can( 'edit_post', $post->ID ) ) {
			return $actions;
		}

		// Add the optimize action.
		$actions['optimize'] = sprintf(
			'<a href="#" class="kb-optimize-post" data-post-id="%d" data-post-url="%s" data-nonce="%s">%s</a>',
			$post->ID,
			esc_attr( esc_url( $post_url ) ),
			esc_attr( wp_create_nonce( 'kb_optimize_post_' . $post->ID ) ),
			esc_html__( 'Optimize', 'kadence-blocks' )
		);

		return $actions;
	}
}
