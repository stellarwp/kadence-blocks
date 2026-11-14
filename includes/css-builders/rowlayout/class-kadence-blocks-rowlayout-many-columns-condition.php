<?php
/**
 * Tells whether the row has more than four columns.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the row has more than four columns.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Many_Columns_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the row has more than four columns.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return $input->derived( 'columns' )->count() > 4;
	}
}
