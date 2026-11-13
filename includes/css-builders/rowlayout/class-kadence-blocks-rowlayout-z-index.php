<?php
/**
 * Writes the stacking order of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Writes the stacking order of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Z_Index_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the stacking order.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$index = $input->attribute( 'zIndex' );

		if ( ! is_numeric( $index ) ) {
			return;
		}

		Kadence_Blocks_Rowlayout_Selector::set( $input, $input->derived( 'selectors' )->is_updated() ? 'base' : 'inner' );
		$input->css()->add_property( 'z-index', $index );
		$input->css()->add_property( 'position', 'relative' );
	}
}
