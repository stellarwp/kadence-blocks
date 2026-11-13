<?php
/**
 * Writes the font size and the line height of a font on tablet or mobile.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-form-selector.php';
require_once __DIR__ . '/class-kadence-blocks-form-checkbox-style.php';

/**
 * Writes the font size and the line height of a font on tablet or mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Font_Device_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the sizes.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $size;

	/**
	 * The attribute that stores the unit of the sizes.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $size_unit;

	/**
	 * The position of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The selector template.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Whether the accept checkbox is sized by the line height as well.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $checkbox;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $size      The attribute that stores the sizes.
	 * @param string $size_unit The attribute that stores the unit of the sizes.
	 * @param int    $index     The position of the device: 1 tablet, 2 mobile.
	 * @param string $device    The device.
	 * @param string $selector  The selector template.
	 * @param bool   $checkbox  Whether the accept checkbox is sized by the line height as well.
	 */
	public function __construct( $size, $size_unit, $index, $device, $selector, $checkbox ) {
		$this->size      = $size;
		$this->size_unit = $size_unit;
		$this->index     = $index;
		$this->device    = $device;
		$this->selector  = $selector;
		$this->checkbox  = $checkbox;
	}

	/**
	 * Write the sizes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->attribute( $this->size );
		$line = $input->attribute( 'lineHeight' );

		if ( ! $this->is_number( $size ) && ! $this->is_number( $line ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Form_Selector::set( $input, $this->selector );
		$this->write_sizes( $input, $line );

		if ( $this->checkbox ) {
			( new Kadence_Blocks_Form_Checkbox_Style_Css( $this->index, true ) )->write( $input );
		}

		$css->set_media_state( 'desktop' );
	}

	/**
	 * Whether the sizes have a number for the device.
	 *
	 * @since TBD
	 *
	 * @param mixed $sizes The saved sizes.
	 *
	 * @return bool
	 */
	private function is_number( $sizes ): bool {
		return is_array( $sizes ) && is_numeric( $sizes[ $this->index ] ?? null );
	}

	/**
	 * Write the font size and the line height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param mixed                          $line  The saved line heights.
	 *
	 * @return void
	 */
	private function write_sizes( Kadence_Blocks_Css_Build_Input $input, $line ): void {
		$css  = $input->css();
		$size = $input->item( $this->size, $this->index );

		if ( ! empty( $size ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $size, $input->attribute( $this->size_unit ) ?: 'px' ) );
		}

		if ( $this->is_number( $line ) ) {
			$css->add_property( 'line-height', $line[ $this->index ] . ( $input->attribute( 'lineType' ) ?: 'px' ) );
		}
	}
}
