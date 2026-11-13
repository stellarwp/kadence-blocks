<?php
/**
 * Advanced Buttons button icon.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the color, size, padding and hover color of the icon of a button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Icon_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the icon rules.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( 'icon' ) ) ) {
			return;
		}

		$this->write_icon( $input );
		$this->write_hover( $input );
		$this->write_padding( $input, 'iconPadding' );
		$this->write_device( $input, 'tablet', 1, 'iconTabletPadding' );
		$this->write_device( $input, 'mobile', 2, 'iconMobilePadding' );
	}

	/**
	 * Write the color and desktop size of the icon.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_icon( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$this->select( $input, '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button .kt-btn-svg-icon' );
		( new Kadence_Blocks_Css_Writer( $css ) )->not_empty_color( 'color', $input->attribute( 'iconColor' ) );
		$this->write_size( $input, 0 );
	}

	/**
	 * Write the hover color of the icon, with its transition.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_hover( Kadence_Blocks_Css_Build_Input $input ): void {
		$hover = $input->attribute( 'iconColorHover' );

		if ( empty( $hover ) ) {
			return;
		}

		$css = $input->css();

		$this->select( $input, '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button .kt-btn-svg-icon' );
		$css->add_property( 'transition', 'all .3s ease-in-out' );
		$this->select( $input, '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button:hover .kt-btn-svg-icon' );
		$css->add_property( 'color', $css->render_color( $hover ) );
	}

	/**
	 * Write the padding of the icon when it is saved as a list.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $attribute The attribute that stores the padding.
	 *
	 * @return void
	 */
	private function write_padding( Kadence_Blocks_Css_Build_Input $input, $attribute ): void {
		$padding = $input->attribute( $attribute );

		if ( ! is_array( $padding ) ) {
			return;
		}

		$this->select( $input, '.kt-btns{id} .kt-btn-wrap-{key} .kt-btn-svg-icon' );
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_sides( 'padding', $padding, 'px' );
	}

	/**
	 * Write the font size of the icon for a device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int                            $index The position of the device in the stored sizes.
	 *
	 * @return void
	 */
	private function write_size( Kadence_Blocks_Css_Build_Input $input, $index ): void {
		$size = $input->attribute( 'iconSize' )[ $index ] ?? null;

		if ( ! is_numeric( $size ) ) {
			return;
		}

		$css = $input->css();

		$this->select( $input, '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button .kt-btn-svg-icon' );
		$css->add_property( 'font-size', $css->get_font_size( $size, $input->attribute( 'iconSizeType' ) ?: 'px' ) );
	}

	/**
	 * Write the size and padding of the icon for tablet or mobile.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $device    The device.
	 * @param int                            $index     The position of the device.
	 * @param string                         $attribute The attribute that stores the padding.
	 *
	 * @return void
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, $device, $index, $attribute ): void {
		$size = $input->attribute( 'iconSize' )[ $index ] ?? null;

		if ( ! is_array( $input->attribute( $attribute ) ) && ! is_numeric( $size ) ) {
			return;
		}

		$input->css()->set_media_state( $device );
		$this->write_size( $input, $index );
		$this->write_padding( $input, $attribute );
		$input->css()->set_media_state( 'desktop' );
	}

	/**
	 * Set the selector of the icon, replacing the unique id and the button position.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $selector The selector.
	 *
	 * @return void
	 */
	private function select( Kadence_Blocks_Css_Build_Input $input, $selector ): void {
		$input->css()->set_selector( str_replace( [ '{id}', '{key}' ], [ $input->unique_id(), $input->derived( 'key' ) ], $selector ) );
	}
}
