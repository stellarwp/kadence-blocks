<?php
/**
 * Tells whether the row has a rounded corner.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the row has a rounded corner.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Radius_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether any corner has a radius that is a number and not zero.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( [ 0, 1, 2, 3 ] as $corner ) {
			$radius = $input->item( 'borderRadius', $corner );

			if ( is_numeric( $radius ) && 0 !== $radius ) {
				return true;
			}
		}

		return false;
	}
}
