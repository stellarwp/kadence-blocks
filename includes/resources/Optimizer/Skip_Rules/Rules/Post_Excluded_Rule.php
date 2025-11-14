<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Skip_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use WP_Post;

/**
 * Skip Optimization if the post was excluded via the
 * Gutenberg plugins sidebar which stores to post meta.
 */
final class Post_Excluded_Rule implements Skip_Rule {

	private Status $status;

	public function __construct( Status $status ) {
		$this->status = $status;
	}

	/**
	 * @inheritDoc
	 */
	public function should_skip(): bool {
		$current_post = get_post();

		if ( ! $current_post instanceof WP_Post ) {
			return false;
		}

		return $this->status->is_excluded( $current_post->ID );
	}
}
