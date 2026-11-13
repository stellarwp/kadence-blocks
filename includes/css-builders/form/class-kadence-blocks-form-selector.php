<?php
/**
 * Form selector.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selectors of the form, replacing the placeholder for the unique id.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Selector {

	/**
	 * Set the selector from a template.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $template The template, with `{id}` for the unique id of the form.
	 *
	 * @return void
	 */
	public static function set( Kadence_Blocks_Css_Build_Input $input, $template ): void {
		$input->css()->set_selector( str_replace( '{id}', $input->unique_id(), $template ) );
	}
}
