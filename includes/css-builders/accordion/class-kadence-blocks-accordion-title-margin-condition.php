<?php
/**
 * Whether the editor saved a margin for the title of a pane.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the editor saved a margin for the title of a pane.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Title_Margin_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The first title style has a margin.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return isset( $input->attributes()['titleStyles'][0]['marginTop'] );
	}
}
