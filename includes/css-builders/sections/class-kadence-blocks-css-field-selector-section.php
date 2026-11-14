<?php
/**
 * Sets the selector of an advanced form field.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selector to the field wrapper that carries the class id the form saved for the field.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Field_Selector_Section implements Kadence_Blocks_Css_Section {

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
		$class_id = $input->context()->call( 'class_id', $input->attributes() );

		$input->css()->set_selector( '.wp-block-kadence-advanced-form .kb-field' . $class_id );
	}
}
