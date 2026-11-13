<?php
/**
 * The CSS properties of the sides of a box.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * Names the CSS property of each side of a box, keyed by the position of the side in the saved list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Side_Map {

	/**
	 * The border radius properties.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function radius(): array {
		return [
			'border-top-left-radius'     => 0,
			'border-top-right-radius'    => 1,
			'border-bottom-right-radius' => 2,
			'border-bottom-left-radius'  => 3,
		];
	}

	/**
	 * The border width properties.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function border_width(): array {
		return [
			'border-top-width'    => 0,
			'border-right-width'  => 1,
			'border-bottom-width' => 2,
			'border-left-width'   => 3,
		];
	}

	/**
	 * The padding properties.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function padding(): array {
		return [
			'padding-top'    => 0,
			'padding-right'  => 1,
			'padding-bottom' => 2,
			'padding-left'   => 3,
		];
	}

	/**
	 * The border width properties of the top and the bottom.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function vertical_border_width(): array {
		return [
			'border-top-width'    => 0,
			'border-bottom-width' => 2,
		];
	}

	/**
	 * The padding properties of the top and the bottom.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function vertical_padding(): array {
		return [
			'padding-top'    => 0,
			'padding-bottom' => 2,
		];
	}
}
