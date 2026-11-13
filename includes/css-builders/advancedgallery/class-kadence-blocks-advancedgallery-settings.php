<?php
/**
 * Settings.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * Works out the values every section of the gallery CSS shares.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Settings {

	/**
	 * The values derived from the block attributes.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array
	 */
	public static function derive( array $attributes ): array {
		return [
			'updated_version' => ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1,
			'gallery_type'    => ! empty( $attributes['type'] ) ? $attributes['type'] : 'masonry',
			'gutter_unit'     => ! empty( $attributes['gutterUnit'] ) ? $attributes['gutterUnit'] : 'px',
		];
	}
}
