<?php
/**
 * Works out the unit of the width of the divider.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

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
