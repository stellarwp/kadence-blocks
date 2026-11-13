<?php
/**
 * Writes the font size of the tab titles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size of the tab titles.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font size.
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
	 * @param string $attribute The attribute that stores the font size.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the font size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->attribute( $this->attribute );

		if ( null === $size ) {
			return;
		}

		$input->css()->add_property( 'font-size', $input->css()->get_font_size( $size, $input->attribute( 'sizeType', 'px' ) ) );
	}
}
