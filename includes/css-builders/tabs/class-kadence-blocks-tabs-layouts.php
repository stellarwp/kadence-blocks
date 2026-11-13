<?php
/**
 * Works out the layout of the tabs on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Works out the layout of the tabs on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Layouts {

	/**
	 * The layout of the tabs on desktop, tablet and mobile. A device inherits the layout of the one before
	 * it.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array
	 */
	public static function resolve( array $attributes ): array {
		$layout = ! empty( $attributes['layout'] ) ? $attributes['layout'] : 'tabs';
		$tablet = ! empty( $attributes['tabletLayout'] ) && 'inherit' !== $attributes['tabletLayout'] ? $attributes['tabletLayout'] : $layout;
		$mobile = ! empty( $attributes['mobileLayout'] ) && 'inherit' !== $attributes['mobileLayout'] ? $attributes['mobileLayout'] : $tablet;

		return [
			'layout'        => $layout,
			'tablet_layout' => $tablet,
			'mobile_layout' => $mobile,
		];
	}
}
