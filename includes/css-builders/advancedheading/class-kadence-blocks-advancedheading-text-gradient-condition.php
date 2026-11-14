<?php
/**
 * Tells whether the text is filled with a gradient.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the text is filled with a gradient.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Text_Gradient_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the condition is met.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return ! empty( $input->attribute( 'textGradient' ) ) && ! empty( $input->attribute( 'enableTextGradient' ) );
	}
}
