<?php
/**
 * Rowlayout old gradient.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * Puts together the old gradient of an overlay.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Old_Gradient {

	/**
	 * The gradient from its parts.
	 *
	 * @since TBD
	 *
	 * @param string $type            `linear` or `radial`.
	 * @param string $angle           The angle or the position.
	 * @param string $first           The first color.
	 * @param string $first_location  Where the first color is, in percent.
	 * @param string $second          The second color.
	 * @param string $second_location Where the second color is, in percent.
	 *
	 * @return string
	 */
	public function compose( $type, $angle, $first, $first_location, $second, $second_location ) {
		return $type . '-gradient(' . $angle . ', ' . $first . ' ' . $first_location . '%, ' . $second . ' ' . $second_location . '%)';
	}
}
