<?php
/**
 * Tells whether a part of the countdown has a font or a color.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-countdown-font.php';

/**
 * Tells whether the font or the color of a part of the countdown was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Font_Used_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font_attribute;

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $color_attribute;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $font_attribute  The attribute that stores the font.
	 * @param string $color_attribute The attribute that stores the color.
	 */
	public function __construct( string $font_attribute, string $color_attribute ) {
		$this->font_attribute  = $font_attribute;
		$this->color_attribute = $color_attribute;
	}

	/**
	 * Whether the part has a font or a color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		if ( ! Kadence_Blocks_Countdown_Font::from_input( $input, $this->font_attribute )->is_empty() ) {
			return true;
		}

		return ! empty( $input->attribute( $this->color_attribute ) );
	}
}
