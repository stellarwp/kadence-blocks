<?php
/**
 * Works out the gap between the tabs.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

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
