<?php
/**
 * Navigation link media ratio.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * The aspect ratio of the image of the media of the navigation link: either a preset or the one of the
 * saved image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Media_Ratio {

	/**
	 * The padding that makes the box as high as the preset ratio, by preset.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const PRESETS = [
		'land43'  => '75%',
		'land32'  => '66.67%',
		'land169' => '56.25%',
		'land21'  => '50%',
		'land31'  => '33%',
		'land41'  => '25%',
		'port34'  => '133.33%',
		'port23'  => '150%',
	];

	/**
	 * The padding of a preset the builder does not know.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FALLBACK = '100%';

	/**
	 * The padding that gives the box its ratio, null when there is none.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $padding;

	/**
	 * Whether a preset ratio is saved.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $has_ratio;

	/**
	 * Work out the ratio.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public function __construct( array $attributes ) {
		$from_image = $this->from_image( $attributes );

		$this->has_ratio = (bool) ( $attributes['imageRatio'] && 'inherit' !== $attributes['imageRatio'] );
		$this->padding   = $this->has_ratio ? $this->from_preset( $attributes['imageRatio'] ) : $from_image;
	}

	/**
	 * The padding that gives the box its ratio.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function padding() {
		return $this->padding;
	}

	/**
	 * Whether a preset ratio is saved.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_ratio(): bool {
		return $this->has_ratio;
	}

	/**
	 * The padding from the height and the width of the saved image.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string|null
	 */
	private function from_image( array $attributes ) {
		$height = $attributes['mediaImage'][0]['height'];

		if ( ! is_numeric( $height ) ) {
			return null;
		}

		return ( $height / $attributes['mediaImage'][0]['width'] ) * 100 . '%';
	}

	/**
	 * The padding of a preset. The comparison is loose, as it was in the original `switch`.
	 *
	 * @since TBD
	 *
	 * @param mixed $preset The saved preset.
	 *
	 * @return string
	 */
	private function from_preset( $preset ) {
		foreach ( self::PRESETS as $name => $padding ) {
			// phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual -- Kept loose on purpose: it is the comparison a switch makes.
			if ( $preset == $name ) {
				return $padding;
			}
		}

		return self::FALLBACK;
	}
}
