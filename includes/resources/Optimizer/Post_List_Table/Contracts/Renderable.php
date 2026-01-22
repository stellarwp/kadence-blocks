<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts;

interface Renderable {

	/**
	 * Echo a column value in a post list table.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	public function render( int $post_id ): void;
}
