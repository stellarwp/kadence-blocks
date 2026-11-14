<?php
/**
 * Whether the image has a mask.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Whether the image has a mask.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Mask_Enabled_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether a mask other than none is saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$mask = $input->attribute( 'maskSvg' );

		return ! empty( $mask ) && 'none' !== $mask;
	}
}
