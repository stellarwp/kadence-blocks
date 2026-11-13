<?php
/**
 * Advanced Buttons button selectors.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selector of one button, replacing the block unique id and the button position.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Selector_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selectors, joined with commas. `{id}` is the block unique id and `{key}` the button position.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $selectors;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string|string[] $selectors One selector, or several that share a rule.
	 */
	public function __construct( $selectors ) {
		$this->selectors = (array) $selectors;
	}

	/**
	 * Set the selector.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$search  = [ '{id}', '{key}' ];
		$replace = [ $input->unique_id(), $input->derived( 'key' ) ];

		$input->css()->set_selector( implode( ', ', str_replace( $search, $replace, $this->selectors ) ) );
	}
}
