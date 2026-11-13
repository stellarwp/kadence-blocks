<?php
/**
 * The size of the mask of the bar on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The size of the mask of the bar on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Mask_Size {

	/**
	 * How many pixels of height one unit of the progress width stands for.
	 *
	 * @since TBD
	 *
	 * @var float
	 */
	private const UNIT_HEIGHT = 11.5;

	/**
	 * The height, in pixels.
	 *
	 * @since TBD
	 *
	 * @var int|float
	 */
	private $height;

	/**
	 * The width, in pixels.
	 *
	 * @since TBD
	 *
	 * @var int|float
	 */
	private $width;

	/**
	 * Whether a height or a width of zero is left out.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $optional;

	/**
	 * Create the size.
	 *
	 * @since TBD
	 *
	 * @param int|float        $height     The height, in pixels.
	 * @param int|float|string $iterations How many masks the bar repeats.
	 * @param bool             $optional   Whether a height or a width of zero is left out.
	 */
	public function __construct( $height, $iterations, $optional ) {
		$this->height   = $height;
		$this->optional = $optional;
		$this->width    = ( $optional && ! $height ) ? 0 : $height * $iterations;
	}

	/**
	 * The size on desktop: the width saved, or 2 units of it.
	 *
	 * @since TBD
	 *
	 * @param mixed            $saved      The progress width the editor saved.
	 * @param int|float|string $iterations How many masks the bar repeats.
	 *
	 * @return self
	 */
	public static function desktop( $saved, $iterations ) {
		$width = ! empty( $saved ) ? absint( $saved ) : 2;

		return new self( ! empty( $width ) ? $width * self::UNIT_HEIGHT : 80, $iterations, false );
	}

	/**
	 * The size on tablet or mobile: none, when the editor saved no width.
	 *
	 * @since TBD
	 *
	 * @param mixed            $saved      The progress width the editor saved.
	 * @param int|float|string $iterations How many masks the bar repeats.
	 *
	 * @return self
	 */
	public static function responsive( $saved, $iterations ) {
		return new self( ! empty( $saved ) ? absint( $saved ) * self::UNIT_HEIGHT : 0, $iterations, true );
	}

	/**
	 * The height as CSS.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function height_css() {
		return ( $this->optional && ! $this->height ) ? '' : $this->height . 'px';
	}

	/**
	 * The width as CSS.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function width_css() {
		return ( $this->optional && ! $this->width ) ? '' : $this->width . 'px';
	}
}
