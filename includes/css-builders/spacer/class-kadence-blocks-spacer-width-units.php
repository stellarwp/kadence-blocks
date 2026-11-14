<?php
/**
 * Works out the unit of the width of the divider.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Works out the unit of the width of the divider.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Width_Units {

	/**
	 * The unit the editor saved, or percent.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public static function resolve( array $attributes ) {
		return ! empty( $attributes['dividerWidthUnits'] ) ? $attributes['dividerWidthUnits'] : '%';
	}
}
