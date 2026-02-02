<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Request\Request;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use WP_Post;

final class Row_Action {

	use Permalink_Trait;

	public const ACTION = 'kb_optimizer_view_optimized';

	private Nonce $nonce;
	private Store $store;

	public function __construct(
		Nonce $nonce,
		Store $store
	) {
		$this->nonce = $nonce;
		$this->store = $store;
	}

	/**
	 * Add a "View Optimized" link to the post/page row actions.
	 *
	 * @filter post_row_actions
	 * @filter page_row_actions
	 *
	 * @param string[] $actions An array of row actions links.
	 * @param WP_Post  $post The post object.
	 *
	 * @return string[]
	 */
	public function add_view_optimized_link( array $actions, WP_Post $post ): array {
		$permalink = get_permalink( $post->ID );

		if ( ! $permalink ) {
			return $actions;
		}

		$post_path = $this->get_post_path( $post->ID );

		try {
			$path = new Path( $post_path, $post->ID );
		} catch ( InvalidArgumentException $e ) {
			return $actions;
		}

		$analysis = $this->store->get( $path );

		if ( ! $analysis || $analysis->isStale ) {
			return $actions;
		}

		$url = add_query_arg(
			[
				Request::QUERY_TOKEN             => $this->nonce->create(),
				Request::QUERY_OPTIMIZER_PREVIEW => 1,
			],
			$permalink 
		);

		$actions[ self::ACTION ] = sprintf(
			'<a href="%s" target="_blank">%s</a>',
			esc_url( $url ),
			esc_html__( 'View Optimized', 'kadence-blocks' )
		);

		return $actions;
	}
}
