<?php
/**
 * Identity aligned layout condition.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the layout puts the logo next to the text, so the text can be aligned.
 *
 * @since TBD
 */
final class Kadence_Blocks_Identity_Aligned_Layout_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The layouts that put the logo next to the text.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const LAYOUTS = [ 'logo-left', 'logo-right', 'logo-right-stacked', 'logo-left-stacked' ];

	/**
	 * Whether the layout puts the logo next to the text.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return in_array( $input->attributes()['layout'], self::LAYOUTS, true );
	}
}
