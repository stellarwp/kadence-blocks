<?php
/**
 * Infobox selector.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selectors of the info box, replacing the placeholders for the base selector and the title
 * tag.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Selector {

	/**
	 * Set the selector from a template.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $template The template, with `{base}` for the info box and `{tag}` for the title tag.
	 *
	 * @return void
	 */
	public static function set( Kadence_Blocks_Css_Build_Input $input, $template ): void {
		$input->css()->set_selector( str_replace( [ '{base}', '{tag}' ], [ $input->derived( 'base' ), $input->derived( 'title_tag' ) ], $template ) );
	}
}
