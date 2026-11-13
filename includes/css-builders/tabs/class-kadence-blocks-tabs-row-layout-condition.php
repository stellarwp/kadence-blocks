<?php
/**
 * Tells whether the tab titles sit in a row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the tab titles sit in a row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Row_Layout_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the editor saved no layout, or the tabs layout.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$layout = $input->attribute( 'layout' );

		return null === $layout || 'tabs' === $layout;
	}
}
