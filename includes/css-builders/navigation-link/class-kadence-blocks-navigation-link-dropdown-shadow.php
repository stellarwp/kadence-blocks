<?php
/**
 * Navigation link dropdown shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Navigation link dropdown shadow.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Dropdown_Shadow implements Kadence_Blocks_Css_Section {

	/**
	 * Write the shadow variable of the dropdown.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( '--kb-nav-dropdown-box-shadow', $css->render_shadow( $input->attributes() ) );
	}
}
