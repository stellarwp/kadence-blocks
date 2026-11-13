<?php
/**
 * Advanced Buttons button size.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the width, padding, text color and font size of a button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the size rules.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$this->write_width( $input );
		$this->write_padding( $input );

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_color( 'color', $input->attribute( 'color' ) );

		$this->write_font_size( $input );
	}

	/**
	 * Write the fixed width of the button.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_width( Kadence_Blocks_Css_Build_Input $input ): void {
		$width = $input->attribute( 'width' );

		if ( 'fixed' !== $input->derived( 'width_type' ) || empty( is_array( $width ) ? $width[0] ?? null : null ) ) {
			return;
		}

		$input->css()->add_property( 'width', $width[0] . 'px' );
	}

	/**
	 * Write the padding of a custom sized button.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_padding( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->attribute( 'btnSize' );

		if ( null !== $size && 'custom' !== $size ) {
			return;
		}

		$css = $input->css();

		if ( is_numeric( $input->attribute( 'paddingLR' ) ) ) {
			$css->add_property( 'padding-left', $input->attribute( 'paddingLR' ) . 'px' );
			$css->add_property( 'padding-right', $input->attribute( 'paddingLR' ) . 'px' );
		}

		if ( is_numeric( $input->attribute( 'paddingBT' ) ) ) {
			$css->add_property( 'padding-top', $input->attribute( 'paddingBT' ) . 'px' );
			$css->add_property( 'padding-bottom', $input->attribute( 'paddingBT' ) . 'px' );
		}
	}

	/**
	 * Write the font size of the button.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_font_size( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->attribute( 'size' );

		if ( empty( $size ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'font-size', $css->get_font_size( $size, $input->attribute( 'sizeType' ) ?: 'px' ) );
	}
}
