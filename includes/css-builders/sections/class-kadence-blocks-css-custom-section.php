<?php
/**
 * Writes the custom CSS the editor saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the custom CSS the editor saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Custom_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The selector that stands for the block. `{id}` is the block unique id.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * The attribute that stores the custom CSS.
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
	 * @param string $selector  The selector that replaces the word `selector` in the custom CSS. `{id}` is the block unique id.
	 * @param string $attribute The attribute that stores the custom CSS.
	 */
	public function __construct( $selector, $attribute ) {
		$this->selector  = $selector;
		$this->attribute = $attribute;
	}

	/**
	 * Add the custom CSS.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$custom = $input->attribute( $this->attribute );

		if ( empty( $custom ) ) {
			return;
		}

		$input->css()->add_css_string( str_replace( 'selector', str_replace( '{id}', $input->unique_id(), $this->selector ), $custom ) );
	}
}
