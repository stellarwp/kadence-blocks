<?php
/**
 * Advanced Buttons button device rules.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the tablet or mobile gap, size, width and padding of a button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Device_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device, `tablet` or `mobile`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The position of the device in the stored font sizes.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $size_index;

	/**
	 * The position of the device in the stored widths and paddings.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $device     The device, `tablet` or `mobile`.
	 * @param int    $size_index The position of the device in the stored font sizes.
	 * @param int    $index      The position of the device in the stored widths and paddings.
	 */
	public function __construct( $device, $size_index, $index ) {
		$this->device     = $device;
		$this->size_index = $size_index;
		$this->index      = $index;
	}

	/**
	 * Write the rules of the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$this->write_gap( $input );
		$this->write_size( $input );
		$this->write_padding( $input );
	}

	/**
	 * Write the space after the button.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_gap( Kadence_Blocks_Css_Build_Input $input ): void {
		$gap = $input->attribute( $this->device . 'Gap' );

		if ( ! is_numeric( $gap ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->set_selector( '.kt-btns' . $input->unique_id() . ' .kt-btn-wrap-' . $input->derived( 'key' ) );
		$css->add_property( 'margin-right', $gap . 'px' );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Write the font size and fixed width of the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_size( Kadence_Blocks_Css_Build_Input $input ): void {
		$size  = $input->attribute( 'responsiveSize' )[ $this->size_index ] ?? null;
		$width = $this->fixed_width( $input );

		if ( ! is_numeric( $size ) && empty( $width ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $input->unique_id() . ' .kt-btn-wrap-' . $input->derived( 'key' ) . ' .kt-button' );

		if ( is_numeric( $size ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $size, $input->attribute( 'sizeType' ) ?: 'px' ) );
		}

		if ( ! empty( $width ) ) {
			$css->add_property( 'width', $width . 'px' );
		}

		$css->set_media_state( 'desktop' );
	}

	/**
	 * The fixed width of the device, or null when the buttons are not a fixed width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	private function fixed_width( Kadence_Blocks_Css_Build_Input $input ) {
		$widths = $input->attribute( 'width' );

		if ( 'fixed' !== $input->derived( 'width_type' ) || ! is_array( $widths ) ) {
			return null;
		}

		return $widths[ $this->index + 1 ] ?? null;
	}

	/**
	 * Write the padding of a custom sized button for the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_padding( Kadence_Blocks_Css_Build_Input $input ): void {
		$vertical   = $input->attribute( 'responsivePaddingBT' )[ $this->size_index ] ?? null;
		$horizontal = $input->attribute( 'responsivePaddingLR' )[ $this->size_index ] ?? null;

		if ( 'custom' !== $input->attribute( 'btnSize' ) || ( ! is_numeric( $vertical ) && ! is_numeric( $horizontal ) ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $input->unique_id() . ' .kt-btn-wrap-' . $input->derived( 'key' ) . ' .kt-button' );
		$this->write_pair( $css, 'padding-left', 'padding-right', $horizontal );
		$this->write_pair( $css, 'padding-top', 'padding-bottom', $vertical );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Write one number on two opposite sides when it is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css    The CSS builder.
	 * @param string                                    $first  The first property.
	 * @param string                                    $second The second property.
	 * @param mixed                                     $value  The value in pixels.
	 *
	 * @return void
	 */
	private function write_pair( $css, $first, $second, $value ): void {
		if ( ! is_numeric( $value ) ) {
			return;
		}

		$css->add_property( $first, $value . 'px' );
		$css->add_property( $second, $value . 'px' );
	}
}
