<?php
/**
 * The gaps and the columns of the carousel on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The gaps and the columns of the carousel on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Carousel_Layout {

	/**
	 * The unit of the gaps.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * The gaps, by device.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $gaps;

	/**
	 * The columns, by device.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $columns;

	/**
	 * Create the layout.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public function __construct( array $attributes ) {
		$desktop = self::gap_at( $attributes, 0, '32' );
		$tablet  = self::gap_at( $attributes, 1, $desktop );
		$mobile  = self::gap_at( $attributes, 2, $tablet );

		$this->unit    = ! empty( $attributes['gap_unit'] ) ? $attributes['gap_unit'] : 'px';
		$this->gaps    = [
			'desktop' => $desktop,
			'tablet'  => $tablet,
			'mobile'  => $mobile,
		];
		$this->columns = [
			'desktop' => self::columns_at( $attributes, 0 ),
			'tablet'  => self::columns_at( $attributes, 2 ),
			'mobile'  => self::columns_at( $attributes, 5 ),
		];
	}

	/**
	 * The unit of the gaps.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function unit() {
		return $this->unit;
	}

	/**
	 * The gap of a device.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 *
	 * @return mixed
	 */
	public function gap( $device ) {
		return $this->gaps[ $device ];
	}

	/**
	 * The number of columns of a device.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 *
	 * @return mixed
	 */
	public function columns( $device ) {
		return $this->columns[ $device ];
	}

	/**
	 * A gap that was saved, or the fallback when it was not.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 * @param int   $index      The index of the device.
	 * @param mixed $fallback   The gap to use when none was saved.
	 *
	 * @return mixed
	 */
	private static function gap_at( array $attributes, $index, $fallback ) {
		$value = $attributes['gap'][ $index ] ?? null;

		return null !== $value && '' !== $value ? $value : $fallback;
	}

	/**
	 * The number of columns that was saved, or one when none was.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 * @param int   $index      The index of the device.
	 *
	 * @return mixed
	 */
	private static function columns_at( array $attributes, $index ) {
		return ! empty( $attributes['columns'][ $index ] ) ? $attributes['columns'][ $index ] : '1';
	}
}
