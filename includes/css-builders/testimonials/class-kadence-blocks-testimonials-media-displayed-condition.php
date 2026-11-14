<?php
/**
 * Tells whether the media of the testimonials is shown.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the media of the testimonials is shown.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Media_Displayed_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the media is shown. It is unless it was turned off.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$displayed = $input->attribute( 'displayMedia' );

		return null === $displayed || (bool) $displayed;
	}
}
