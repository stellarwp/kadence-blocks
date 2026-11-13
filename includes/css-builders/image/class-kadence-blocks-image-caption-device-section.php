<?php
/**
 * Writes the size and the line height of the caption on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the size and the line height of the caption on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Device_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device: 1 tablet, 2 mobile.
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
	 * @param int $index The position of the device: 1 tablet, 2 mobile.
	 */
	public function __construct( int $index ) {
		$this->index = $index;
	}

	/**
	 * Write the size and the line height of the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$caption = $input->attributes()['captionStyles'][0];
		$writer  = new Kadence_Blocks_Css_Writer( $input->css() );

		$writer->not_empty_with_unit( 'font-size', $caption['size'][ $this->index ] ?? null, $caption['sizeType'] ?? 'px' );
		$writer->not_empty_with_unit( 'line-height', $caption['lineHeight'][ $this->index ] ?? null, $caption['lineType'] ?? 'px' );
	}
}
