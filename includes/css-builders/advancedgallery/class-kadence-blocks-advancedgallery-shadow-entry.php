<?php
/**
 * Shadow entry.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Finds the first shadow saved under an attribute.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Shadow_Entry {

	/**
	 * The shadow of an image when none was saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const FALLBACK = [
		[
			'hOffset' => 4,
			'vOffset' => 2,
			'blur'    => 14,
			'spread'  => 0,
			'color'   => '#000000',
			'opacity' => 0.2,
		],
	];

	/**
	 * The attribute that stores the shadows.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Whether a missing attribute falls back to the default shadow.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $with_fallback;

	/**
	 * Create the entry.
	 *
	 * @since TBD
	 *
	 * @param string $attribute     The attribute that stores the shadows.
	 * @param bool   $with_fallback Whether a missing attribute falls back to the default shadow.
	 */
	public function __construct( $attribute, $with_fallback ) {
		$this->attribute     = $attribute;
		$this->with_fallback = $with_fallback;
	}

	/**
	 * The first shadow, or null when there is none.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return array|null
	 */
	public function first( Kadence_Blocks_Css_Build_Input $input ) {
		$shadows = $input->attribute( $this->attribute, $this->with_fallback ? self::FALLBACK : null );

		if ( ! is_array( $shadows ) ) {
			return null;
		}

		$first = $shadows[0] ?? null;

		return is_array( $first ) ? $first : null;
	}
}
