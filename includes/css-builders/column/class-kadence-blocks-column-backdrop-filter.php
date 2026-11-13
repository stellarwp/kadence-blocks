<?php
/**
 * Writes the backdrop filter of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector-css.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';
require_once __DIR__ . '/class-kadence-blocks-column-layout.php';
require_once __DIR__ . '/class-kadence-blocks-column-flex-values.php';

/**
 * Writes the backdrop filter of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Backdrop_Filter_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the filter.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$type = $input->attribute( 'backdropFilterType' );

		if ( empty( $type ) || 'none' === $type ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( '-webkit-backdrop-filter', $input->attribute( 'backdropFilterString' ) );
		$css->add_property( 'backdrop-filter', $input->attribute( 'backdropFilterString' ) );
	}
}
