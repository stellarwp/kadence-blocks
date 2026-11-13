<?php
/**
 * Tells whether a font, or the minimum height saved next to it, has any setting to write.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-testimonials-min-height.php';

/**
 * Tells whether a font, or the minimum height saved next to it, has any setting to write.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Gate_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font;

	/**
	 * The attribute that stores the minimum heights, if any.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $min_height;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string      $font       The attribute that stores the font.
	 * @param string|null $min_height The attribute that stores the minimum heights, if any.
	 */
	public function __construct( $font, $min_height ) {
		$this->font       = $font;
		$this->min_height = $min_height;
	}

	/**
	 * Whether the font has settings or the minimum height of desktop is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$font = $input->item( $this->font, 0 );

		if ( is_array( $font ) && ! empty( $font ) ) {
			return true;
		}

		return null !== $this->min_height && Kadence_Blocks_Testimonials_Min_Height::is_set( $input, $this->min_height, 0 );
	}
}
