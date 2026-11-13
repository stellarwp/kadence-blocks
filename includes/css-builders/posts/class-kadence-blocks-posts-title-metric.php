<?php
/**
 * Reads one value of the title font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Reads the value of the title font for one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Posts_Title_Metric {

	/**
	 * The value of a list in the title font for a device, or null when it is not an array or the value is empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input The input scoped to the title font.
	 * @param string                         $key   The attribute that stores one value per device.
	 * @param int                            $index The position of the device.
	 *
	 * @return mixed
	 */
	public static function read( Kadence_Blocks_Css_Build_Input $input, string $key, int $index ) {
		$values = $input->attribute( $key );

		if ( ! is_array( $values ) || empty( $values[ $index ] ) ) {
			return null;
		}

		return $values[ $index ];
	}
}
