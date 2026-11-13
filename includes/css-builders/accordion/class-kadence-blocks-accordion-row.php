<?php
/**
 * Lays the panes out in one column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-accordion-selectors.php';
require_once __DIR__ . '/class-kadence-blocks-accordion-title-margin.php';
require_once __DIR__ . '/class-kadence-blocks-accordion-title-margin-condition.php';

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
