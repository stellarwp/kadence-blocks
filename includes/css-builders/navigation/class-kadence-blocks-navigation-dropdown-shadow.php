<?php
/**
 * Navigation dropdown shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the shadow of the dropdown when it is switched on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Dropdown_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = $input->item( 'dropdownShadow', 0 );

		if ( empty( $shadow['enable'] ) ) {
			return;
		}

		$css = $input->css();
		$css->add_property( '--kb-nav-dropdown-box-shadow', $css->render_shadow( $shadow ) );
	}
}
