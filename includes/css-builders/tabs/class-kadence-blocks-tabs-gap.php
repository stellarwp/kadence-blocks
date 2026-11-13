<?php
/**
 * Works out the gap between the tabs.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Works out the gap between the tabs.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Gap {

	/**
	 * The gap, in pixels, when the editor saved none.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const DEFAULT_GAP = 10;

	/**
	 * The gap between the tabs on desktop: the one saved when it is a number.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public static function resolve( array $attributes ) {
		$gutter = $attributes['gutter'][0] ?? null;

		return is_numeric( $gutter ) ? $gutter : self::DEFAULT_GAP;
	}
}
