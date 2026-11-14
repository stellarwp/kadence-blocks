<?php
/**
 * Tells whether the text has a shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the text has a shadow.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Text_Shadow_Condition implements Kadence_Blocks_Css_Input_Condition {

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
		return ! empty( $input->attribute( 'enableTextShadow' ) ) || ! empty( $input->attributes()['textShadow'][0]['enable'] );
	}
}
