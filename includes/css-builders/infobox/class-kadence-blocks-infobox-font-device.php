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
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Writes the font size and the line height of a font on tablet or mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Font_Device_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The selector template.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The position of the device.
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
	 * @param string $attribute The attribute that stores the font.
	 * @param string $selector  The selector template.
	 * @param string $device    The device.
	 * @param int    $index     The position of the device: 1 tablet, 2 mobile.
	 */
	public function __construct( $attribute, $selector, $device, $index ) {
		$this->attribute = $attribute;
		$this->selector  = $selector;
		$this->device    = $device;
		$this->index     = $index;
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
		$font = $input->item( $this->attribute, 0 );

		if ( ! is_array( $font ) ) {
			return;
		}

		$has_size = is_array( $font['size'] ?? null ) && ! empty( $font['size'][ $this->index ] );
		$has_line = is_array( $font['lineHeight'] ?? null ) && ! empty( $font['lineHeight'][ $this->index ] );

		if ( ! $has_size && ! $has_line ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Infobox_Selector::set( $input, $this->selector );
		$this->write_size( $input, $font, $has_size );
		( new Kadence_Blocks_Css_Writer( $css ) )->not_empty_with_unit( 'line-height', $font['lineHeight'][ $this->index ] ?? null, $font['lineType'] ?? 'px' );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Write the font size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param array                          $font     The saved font.
	 * @param bool                           $has_size Whether the font has a size for the device.
	 *
	 * @return void
	 */
	private function write_size( Kadence_Blocks_Css_Build_Input $input, array $font, $has_size ): void {
		if ( $has_size ) {
			$input->css()->add_property( 'font-size', $input->css()->get_font_size( $font['size'][ $this->index ], $font['sizeType'] ?? 'px' ) );
		}
	}
}
