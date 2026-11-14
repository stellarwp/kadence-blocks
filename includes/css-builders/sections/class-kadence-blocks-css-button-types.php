<?php
/**
 * Works out the types a button section needs: its width, its background and its hover background.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Works out the types a button section needs: its width, its background and its hover background.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Types {

	/**
	 * The width type, the background type and the hover background type, each with its default.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array
	 */
	public static function derive( array $attributes ): array {
		return [
			'width_type'    => ! empty( $attributes['widthType'] ) ? $attributes['widthType'] : 'auto',
			'bg_type'       => ! empty( $attributes['backgroundType'] ) ? $attributes['backgroundType'] : 'normal',
			'bg_hover_type' => ! empty( $attributes['backgroundHoverType'] ) ? $attributes['backgroundHoverType'] : 'normal',
		];
	}
}
