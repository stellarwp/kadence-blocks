<?php
/**
 * Lays the panes out in one column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Lays the panes out in one column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Row_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the column.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( 'display', 'block' );

		if ( ! ( new Kadence_Blocks_Accordion_Title_Margin_Condition() )->is_met( $input ) ) {
			return;
		}

		( new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'pane' ) ) )->write( $input );
		( new Kadence_Blocks_Accordion_Title_Margin_Css( 'margin-top' ) )->write( $input );
		( new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'inner' ) ) )->write( $input );
	}
}
