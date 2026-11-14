<?php
/**
 * Advanced Buttons button type.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether a button uses a gradient background in either state.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Type {

	/**
	 * Whether the normal or the hover background of the button is a gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_gradient( Kadence_Blocks_Css_Build_Input $input ): bool {
		return 'gradient' === $input->attribute( 'backgroundType' ) || 'gradient' === $input->attribute( 'backgroundHoverType' );
	}
}
