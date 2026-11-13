<?php
/**
 * The mask of a bar made of masks: the image, how often it repeats and the size on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-progress-bar-mask-size.php';

/**
 * The mask of a bar made of masks: the image, how often it repeats and the size on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Mask {

	/**
	 * How many masks the bar repeats when the editor saved none.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const DEFAULT_ITERATIONS = 5;

	/**
	 * How many masks the bar repeats.
	 *
	 * @since TBD
	 *
	 * @var int|float|string
	 */
	private $iterations;

	/**
	 * The address of the image of the mask.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $url;

	/**
	 * The size of the mask on every device.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Progress_Bar_Mask_Size[]
	 */
	private $sizes;

	/**
	 * Create the mask.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public function __construct( array $attributes ) {
		$this->iterations = $attributes['maskIterations'] ?? self::DEFAULT_ITERATIONS;
		$this->url        = $this->url_of( $attributes );
		$this->sizes      = [
			'desktop' => Kadence_Blocks_Progress_Bar_Mask_Size::desktop( $attributes['progressWidth'] ?? null, $this->iterations ),
			'tablet'  => Kadence_Blocks_Progress_Bar_Mask_Size::responsive( $attributes['progressWidthTablet'] ?? null, $this->iterations ),
			'mobile'  => Kadence_Blocks_Progress_Bar_Mask_Size::responsive( $attributes['progressWidthMobile'] ?? null, $this->iterations ),
		];
	}

	/**
	 * The address of the image: a custom one when the editor chose it, the star otherwise.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	private function url_of( array $attributes ) {
		$mask = ! empty( $attributes['maskSvg'] ) ? $attributes['maskSvg'] : 'star';
		$base = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/';

		if ( 'custom' !== $mask ) {
			return $base . $mask . '.svg';
		}

		return ! empty( $attributes['maskUrl'] ) ? $attributes['maskUrl'] : $base . 'star.svg';
	}

	/**
	 * The image of every repeat.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function image() {
		return trim( str_repeat( 'url(' . esc_url_raw( $this->url ) . '),', $this->iterations ), ',' );
	}

	/**
	 * The repeat of every image.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function repeat() {
		return trim( str_repeat( 'no-repeat,', $this->iterations ), ',' );
	}

	/**
	 * The position of every image.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function position() {
		$positions = $this->iterations > 1 ? range( 0, 100, 100 / ( $this->iterations - 1 ) ) : [ 0 ];

		return trim( implode( '%,', $positions ) . '%', ',' );
	}

	/**
	 * The aspect ratio of the whole bar.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function aspect_ratio() {
		return $this->iterations . '/1';
	}

	/**
	 * The size of the mask on a device.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 *
	 * @return Kadence_Blocks_Progress_Bar_Mask_Size
	 */
	public function size( $device ) {
		return $this->sizes[ $device ];
	}
}
