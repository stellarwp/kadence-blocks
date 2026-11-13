<?php
/**
 * Lays out the vertical tabs on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-tabs-vertical-width.php';

/**
 * Lays out the vertical tabs on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Vertical {

	/**
	 * The sections that lay out the vertical tabs on a device.
	 *
	 * @since TBD
	 *
	 * @param int $index The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 *
	 * @return array
	 */
	public static function sections( $index ): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id}' ),
			new Kadence_Blocks_Css_Static_Section( 'display', 'flex' ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list' ),
			new Kadence_Blocks_Css_Static_Section( 'float', 'none' ),
			new Kadence_Blocks_Tabs_Vertical_Width_Css( $index ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-content-wrap' ),
			new Kadence_Blocks_Css_Static_Section( 'float', 'none' ),
			new Kadence_Blocks_Css_Static_Section( 'width', 'auto' ),
			new Kadence_Blocks_Css_Static_Section( 'flex', '1' ),
		];
	}
}
