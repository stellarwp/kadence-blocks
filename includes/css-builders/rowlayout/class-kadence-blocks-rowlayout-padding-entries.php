<?php
/**
 * Writes old padding attributes on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes old padding attributes on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Padding_Entries_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The properties, with the attribute that stores them and their position in it, or null.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $entries;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $device  The device.
	 * @param array  $entries The properties, with the attribute that stores them and their position in it, or null.
	 */
	public function __construct( $device, array $entries ) {
		$this->device  = $device;
		$this->entries = $entries;
	}

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css    = $input->css();
		$writer = new Kadence_Blocks_Css_Writer( $css );
		$unit   = $input->attribute( 'paddingUnit' ) ?: 'px';

		$css->set_media_state( $this->device );

		foreach ( $this->entries as $entry ) {
			$writer->numeric_with_unit( $entry[0], null === $entry[2] ? $input->attribute( $entry[1] ) : $input->item( $entry[1], $entry[2] ), $unit );
		}

		$css->set_media_state( 'desktop' );
	}
}
