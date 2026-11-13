<?php
/**
 * Writes a color of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Writes a color of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Color_Output_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The selector template.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the color.
	 * @param string $selector  The selector template, with `{base}` for the row.
	 */
	public function __construct( $attribute, $selector ) {
		$this->attribute = $attribute;
		$this->selector  = $selector;
	}

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( $this->attribute ) ) ) {
			return;
		}

		Kadence_Blocks_Rowlayout_Selector::set( $input, $this->selector );
		$input->css()->render_color_output( $input->attributes(), $this->attribute, 'color' );
	}
}
