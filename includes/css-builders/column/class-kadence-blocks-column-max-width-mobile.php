<?php
/**
 * Writes the maximum width of the column on mobile.
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
 * Writes the maximum width of the column on mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Max_Width_Mobile_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the maximum width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$width = $input->item( 'maxWidth', 2 );

		if ( empty( $width ) ) {
			return;
		}

		$css  = $input->css();
		$size = $width . $input->derived( 'layout' )->device( 2 )->max_width_unit();

		Kadence_Blocks_Column_Selector::set( $input, 'column' );
		$css->add_property( 'max-width', $size );
		$css->add_property( 'margin-left', 'auto' );
		$css->add_property( 'margin-right', 'auto' );
		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>{col}' );
		$css->add_property( 'flex', '0 1 ' . $size );
		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column>.kt-inside-inner-col>{col}' );
		$css->add_property( 'flex', '1 ' . $size );
		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column.kb-section-sm-dir-horizontal>.kt-inside-inner-col>{col}, .wp-block-kadence-column.kb-section-dir-horizontal:not(.kb-section-sm-dir-vertical):not(.kb-section-md-dir-vertical) >.kt-inside-inner-col>{col}' );
		$css->add_property( 'flex', '0 1 ' . $size );
		$css->add_property( 'max-width', 'unset' );
		$css->add_property( 'margin-left', 'unset' );
		$css->add_property( 'margin-right', 'unset' );
	}
}
