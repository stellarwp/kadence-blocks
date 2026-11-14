<?php
/**
 * Builds the CSS for the table data block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the table data block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Data_Css extends Kadence_Blocks_Css_Block_Builder {

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
			new Kadence_Blocks_Css_Selector_Section( [ '.kb-table-container tr td.kb-table-data{id}', '.kb-table-container tr th.kb-table-data{id}' ] ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
		];
	}
}
