<?php
/**
 * Builds the CSS for the header section block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the header section block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Section_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-desktop{id}' ),
			new Kadence_Blocks_Css_Static_Section( 'display', 'block' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Css_Static_Section( 'display', 'none' ) ] ),
		];
	}
}
