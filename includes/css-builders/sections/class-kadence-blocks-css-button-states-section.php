<?php
/**
 * Button states.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the colors, background, border, radius and shadow of a button with its hover and active
 * states.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_States_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The settings of the CSS builder: the attribute bases and how to render them.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $arguments;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param array $arguments The settings of the CSS builder.
	 */
	public function __construct( array $arguments ) {
		$this->arguments = $arguments;
	}

	/**
	 * Write the states.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_button_styles_with_states( $this->arguments, $input->attributes() );
	}
}
