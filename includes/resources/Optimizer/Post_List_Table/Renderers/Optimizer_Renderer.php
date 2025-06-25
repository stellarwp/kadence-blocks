<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Renderable;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;

final class Optimizer_Renderer implements Renderable {

	private Store $store;
	private Text_Repository $text_repository;

	public function __construct(
		Store $store,
		Text_Repository $text_repository
	) {
		$this->store           = $store;
		$this->text_repository = $text_repository;
	}

	/**
	 * Display a link to run/remove optimization data if the current user has the correct permissions.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	public function render( int $post_id ): void {
		$post_url = get_permalink( $post_id );
		$status   = get_post_status( $post_id );

		if ( ! $post_url || is_wp_error( $post_url ) || $status !== 'publish' ) {
			echo esc_html( $this->text_repository->get( Text_Repository::NOT_OPTIMIZABLE ) );

			return;
		}

		// Optimization found.
		if ( $this->store->get( $post_id ) ) {
			$class = 'kb-remove-post-optimization';
			$text  = $this->text_repository->get( Text_Repository::REMOVE_OPTIMIZATION );

			// User can't manage this, just display the status.
			if ( ! current_user_can( 'delete_post', $post_id ) ) {
				echo esc_html( $this->text_repository->get( Text_Repository::OPTIMIZED ) );

				return;
			}
		} else {
			$class = 'kb-optimize-post';
			$text  = $this->text_repository->get( Text_Repository::RUN_OPTIMIZER );

			// User can't manage this, just display the status.
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				echo esc_html( $this->text_repository->get( Text_Repository::NOT_OPTIMIZED ) );

				return;
			}
		}

		// Print the URL to manage the optimization data via frontend scripts.
		printf(
			'<a href="#" class="%s" data-post-id="%d" data-post-url="%s">%s</a>',
			esc_attr( $class ),
			esc_attr( $post_id ),
			esc_attr( esc_url( $post_url ) ),
			esc_html( $text )
		);
	}
}
