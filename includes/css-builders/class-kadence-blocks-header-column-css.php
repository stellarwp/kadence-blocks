<?php
/**
 * Builds the CSS for the header column block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the header column block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Column_Css extends Kadence_Blocks_Css_Block_Builder {


	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [ new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-column{id}' ) ];
	}
}
