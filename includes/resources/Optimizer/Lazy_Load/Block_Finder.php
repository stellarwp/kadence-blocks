<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use WP_Block;

final class Block_Finder {

	/**
	 * Check if a block has a certain inner block.
	 *
	 * @param WP_Block $block The block.
	 * @param string   $block_name The block to search for.
	 *
	 * @return bool
	 */
	public function contains_block( WP_Block $block, string $block_name ): bool {
		foreach ( $block->inner_blocks as $inner_block ) {
			if ( $inner_block->name === $block_name ) {
				return true;
			}

			// Recurse into this block's inner blocks.
			if ( $this->contains_block( $inner_block, $block_name ) ) {
				return true;
			}
		}

		return false;
	}
}
