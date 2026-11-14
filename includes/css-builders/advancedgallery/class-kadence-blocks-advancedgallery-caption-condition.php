<?php
/**
 * Tells whether the images have a styled caption.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the images have a styled caption.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Caption_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the captions are shown and styled.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$styles = $input->attribute( 'captionStyles' );

		return true === $input->attribute( 'showCaption' ) && is_array( $styles ) && is_array( $styles[0] ?? null );
	}
}
