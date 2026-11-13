<?php
/**
 * Writes the size of the caption font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the size of the caption font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Font_Size_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The device of every position of a size.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEVICES = [
		0 => null,
		1 => 'tablet',
		2 => 'mobile',
	];

	/**
	 * Write the size of every device that saved one.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$sizes = $input->attribute( 'size' );

		if ( ! is_array( $sizes ) ) {
			return;
		}

		$unit = $input->attribute( 'sizeType' );
		$unit = ! empty( $unit ) ? $unit : 'px';

		foreach ( self::DEVICES as $index => $device ) {
			$this->write_device( $input, $sizes, $index, $unit );
		}
	}

	/**
	 * Write the size of a device when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param array                          $sizes The sizes.
	 * @param int                            $index The position of the device.
	 * @param string                         $unit The unit.
	 *
	 * @return void
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, array $sizes, int $index, string $unit ): void {
		if ( empty( $sizes[ $index ] ) ) {
			return;
		}

		$css    = $input->css();
		$device = self::DEVICES[ $index ];

		if ( null !== $device ) {
			$css->set_media_state( $device );
		}

		$css->add_property( 'font-size', $css->get_font_size( $sizes[ $index ], $unit ) );

		if ( null !== $device ) {
			$css->set_media_state( 'desktop' );
		}
	}
}
