<?php
/**
 * Writes sections for one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes sections for one device, then returns to desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Device_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The device, `tablet` or `mobile`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The sections that write for the device.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $sections;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string                       $device   The device, `tablet` or `mobile`.
	 * @param Kadence_Blocks_Css_Section[] $sections The sections that write for the device.
	 */
	public function __construct( $device, array $sections ) {
		$this->device   = $device;
		$this->sections = $sections;
	}

	/**
	 * Write the sections under the device media query.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->set_media_state( $this->device );

		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}

		$css->set_media_state( 'desktop' );
	}
}
