<?php
/**
 * Tells whether the captions sit at the bottom of the images.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the captions sit at the bottom of the images.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Caption_Placement_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the captions have no style, or sit at the bottom.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$style = $input->attribute( 'captionStyle' );

		return empty( $style ) || in_array( $style, [ 'bottom', 'bottom-hover' ], true );
	}
}
