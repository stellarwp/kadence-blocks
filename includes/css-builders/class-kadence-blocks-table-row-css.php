<?php
/**
 * Builds the CSS for the table row block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Builds the CSS for the table row block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Row_Css extends Kadence_Blocks_Css_Block_Builder {

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
			new Kadence_Blocks_Css_Selector_Section( '.kb-table-container .kb-table tr.kb-table-row{id}' ),
			new Kadence_Blocks_Css_Rendered_Color_Section( 'background-color', 'backgroundColor' ),
			new Kadence_Blocks_Css_Responsive_Size_Section( [ 'minHeight', 'tabletMinHeight', 'mobileMinHeight' ], 'height', '' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-table-container  .kb-table tr.kb-table-row{id}:hover' ),
			new Kadence_Blocks_Css_Rendered_Color_Section( 'background-color', 'backgroundHoverColor' ),
		];
	}
}
