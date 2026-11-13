<?php
/**
 * Tells whether the tab titles share the width of the tabs.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the tab titles share the width of the tabs.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Percent_Width_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the layout is not vertical and the width type is percent.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return 'vtabs' !== $input->derived( 'layout' ) && 'percent' === $input->attribute( 'widthType' );
	}
}
