<?php
/**
 * Icon item selector section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selector of the icon the section is writing, or of a state of it.
 *
 * @since TBD
 */
final class Kadence_Blocks_Icon_Item_Selector_Css implements Kadence_Blocks_Css_Section {

	/**
	 * What follows the icon in the selector.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $suffix;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $suffix What follows the icon in the selector.
	 */
	public function __construct( $suffix ) {
		$this->suffix = $suffix;
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
		$input->css()->set_selector( '.kt-svg-icons' . $input->unique_id() . ' .kt-svg-item-' . $input->derived( 'icon_key' ) . $this->suffix );
	}
}
