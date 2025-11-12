<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Admin\Post_Meta;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Skip_Rule;
use WP_Post;

/**
 * Skip Optimization if the post was excluded via the
 * Gutenberg plugins sidebar.
 */
final class Post_Excluded_Rule implements Skip_Rule {

	/**
	 * @inheritDoc
	 */
	public function should_skip(): bool {
		$current_post = get_post();

		if ( ! $current_post instanceof WP_Post ) {
			return false;
		}

		return (bool) get_post_meta( $current_post->ID, Post_Meta::META_KEY, true );
	}
}
