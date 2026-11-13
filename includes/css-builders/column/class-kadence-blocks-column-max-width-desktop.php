<?php
/**
 * Writes the maximum width of the column on desktop.
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
 * Writes the maximum width of the column on desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Max_Width_Desktop_Css implements Kadence_Blocks_Css_Section {

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
		$width = $input->item( 'maxWidth', 0 );

		if ( empty( $width ) ) {
			return;
		}

		$size = $width . $input->derived( 'layout' )->device( 0 )->max_width_unit();

		$this->write_column( $input, $size );
		$this->write_row( $input, $size );
	}

	/**
	 * Write the maximum width of the column.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $size  The width with its unit.
	 *
	 * @return void
	 */
	private function write_column( Kadence_Blocks_Css_Build_Input $input, $size ): void {
		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'column' );
		$css->add_property( 'max-width', $size );
		$css->add_property( 'margin-left', 'auto' );
		$css->add_property( 'margin-right', 'auto' );
	}

	/**
	 * Write the width of the column inside a row.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $size  The width with its unit.
	 *
	 * @return void
	 */
	private function write_row( Kadence_Blocks_Css_Build_Input $input, $size ): void {
		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column.kb-section-dir-horizontal:not(.kb-section-md-dir-vertical)>.kt-inside-inner-col>{col}' );
		$css->add_property( 'flex', '0 1 ' . $size );
		$this->write_unset( $css );

		if ( apply_filters( 'kadence_blocks_css_output_media_queries', true ) ) {
			$this->write_desktop_only( $input, $size );
		}
	}

	/**
	 * Write the width of the column inside a row, for desktop only.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $size  The width with its unit.
	 *
	 * @return void
	 */
	private function write_desktop_only( Kadence_Blocks_Css_Build_Input $input, $size ): void {
		$css = $input->css();

		$css->set_media_state( 'desktopOnly' );
		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column.kb-section-dir-horizontal>.kt-inside-inner-col>{col}' );
		$css->add_property( 'flex', '0 1 ' . $size );
		$this->write_unset( $css );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Let the row decide the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css The CSS builder.
	 *
	 * @return void
	 */
	private function write_unset( $css ): void {
		$css->add_property( 'max-width', 'unset' );
		$css->add_property( 'margin-left', 'unset' );
		$css->add_property( 'margin-right', 'unset' );
	}
}
