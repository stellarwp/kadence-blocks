<?php
/**
 * Asks for the Google font of a part of the form to be loaded.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Asks for the Google font of a part of the form to be loaded.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Google_Font_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the font.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Ask for the font.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$font = $input->item( $this->attribute, 0 );

		if ( ! is_array( $font ) || empty( $font['google'] ) || ! isset( $font['family'] ) ) {
			return;
		}

		if ( isset( $font['loadGoogle'] ) && true !== $font['loadGoogle'] ) {
			return;
		}

		$input->css()->maybe_add_google_font( $font['family'], $font['variant'] ?? '', $font['subset'] ?? '' );
	}
}
