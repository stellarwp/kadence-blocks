<?php
/**
 * Writes the line height or the letter spacing of a part of the countdown.
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
 * Writes the line height or the letter spacing of a part of the countdown for a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Font_Measure_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font_attribute;

	/**
	 * The font setting that stores the list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $key;

	/**
	 * The font setting that stores the unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $type_key;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $font_attribute The attribute that stores the font.
	 * @param string $key            The font setting that stores the list.
	 * @param string $type_key       The font setting that stores the unit.
	 * @param string $property       The CSS property.
	 * @param int    $index          The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 */
	public function __construct( string $font_attribute, string $key, string $type_key, string $property, int $index ) {
		$this->font_attribute = $font_attribute;
		$this->key            = $key;
		$this->type_key       = $type_key;
		$this->property       = $property;
		$this->index          = $index;
	}

	/**
	 * Write the line height or the letter spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$value = Kadence_Blocks_Countdown_Font::from_input( $input, $this->font_attribute )->measure( $this->key, $this->type_key, $this->index );

		if ( null === $value ) {
			return;
		}

		$input->css()->add_property( $this->property, $value );
	}
}
