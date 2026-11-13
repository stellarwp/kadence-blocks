<?php
/**
 * Writes the font weight of a part of the countdown.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-countdown-font.php';

/**
 * Writes the font weight of a part of the countdown, unless it is the regular one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Font_Weight_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $font_attribute The attribute that stores the font.
	 */
	public function __construct( string $font_attribute ) {
		$this->font_attribute = $font_attribute;
	}

	/**
	 * Write the font weight.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$weight = Kadence_Blocks_Countdown_Font::from_input( $input, $this->font_attribute )->get( 'weight' );

		if ( empty( $weight ) || 'regular' === $weight ) {
			return;
		}

		$input->css()->add_property( 'font-weight', $weight );
	}
}
