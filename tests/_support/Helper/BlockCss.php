<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Kadence_Blocks_Abstract_Block;
use Kadence_Blocks_CSS;

/**
 * Builds a block's CSS the way its render callback does and compares it with a
 * stored copy under `tests/_data/block-css/`.
 */
final class BlockCss extends Module {

	/**
	 * @param Kadence_Blocks_Abstract_Block $block      The block.
	 * @param array<string, mixed>          $attributes Block attributes, `uniqueID` included.
	 *
	 * @return string
	 */
	public function block_css( Kadence_Blocks_Abstract_Block $block, array $attributes ): string {
		return $block->build_css( $attributes, new Kadence_Blocks_CSS(), $attributes['uniqueID'], $attributes['uniqueID'] );
	}

	/**
	 * @param string $name File name, without extension, in `tests/_data/block-css/`.
	 * @param string $css  The CSS to compare.
	 */
	public function assert_block_css_matches( string $name, string $css ): void {
		$this->assertStringEqualsFile( codecept_data_dir( 'block-css/' . $name . '.css' ), $css );
	}
}
