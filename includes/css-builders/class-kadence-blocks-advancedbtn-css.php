<?php
/**
 * Builds the CSS for the advancedbtn block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/advancedbtn/loader.php';

/**
 * Builds the CSS for the advancedbtn block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( [ '.wp-block-kadence-advancedbtn.kt-btns{id}', '.site .entry-content .wp-block-kadence-advancedbtn.kt-btns{id}', '.wp-block-kadence-advancedbtn.kb-btns{id}', '.site .entry-content .wp-block-kadence-advancedbtn.kb-btns{id}' ] ),
			new Kadence_Blocks_Advancedbtn_Group_Margin_Css(),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advancedbtn.kb-btns{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			new Kadence_Blocks_Advancedbtn_Group_Gap_Css(),
			new Kadence_Blocks_Advancedbtn_Alignment_Css(),
			new Kadence_Blocks_Advancedbtn_Video_Assets_Css(),
			new Kadence_Blocks_Advancedbtn_Typography_Css(),
			new Kadence_Blocks_Advancedbtn_Buttons_Css(),
		];
	}
}
