<?php
/**
 * Tells whether the number has a font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the number has a font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Number_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the number has a family, a style or a weight.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$number = $input->derived( 'media' )->number();

		return ! empty( $number['family'] ) || ! empty( $number['style'] ) || ! empty( $number['weight'] );
	}
}
