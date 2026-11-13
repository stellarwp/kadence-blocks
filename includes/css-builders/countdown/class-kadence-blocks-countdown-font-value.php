<?php
/**
 * Writes a text setting of a font.
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
 * Writes a font setting that is written as it is, such as the text transform or the style.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Font_Value_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font_attribute;

	/**
	 * The font setting.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $key;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $font_attribute The attribute that stores the font.
	 * @param string $key            The font setting.
	 * @param string $property       The CSS property.
	 */
	public function __construct( string $font_attribute, string $key, string $property ) {
		$this->font_attribute = $font_attribute;
		$this->key            = $key;
		$this->property       = $property;
	}

	/**
	 * Write the setting.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$font = Kadence_Blocks_Countdown_Font::from_input( $input, $this->font_attribute );

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty( $this->property, $font->get( $this->key ) );
	}
}
