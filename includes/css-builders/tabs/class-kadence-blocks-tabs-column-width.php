<?php
/**
 * Writes how wide a tab title is on a device when the tabs are in columns.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes how wide a tab title is on a device when the tabs are in columns.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Column_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device: 1 tablet, 2 mobile.
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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int    $index  The position of the device: 1 tablet, 2 mobile.
	 * @param string $device The device.
	 */
	public function __construct( $index, $device ) {
		$this->index  = $index;
		$this->device = $device;
	}

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$columns = $input->item( 'tabWidth', $this->index );

		if ( ! is_array( $input->attribute( 'tabWidth' ) ) || empty( $columns ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		( new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list.kb-tabs-list-columns > li' ) )->write( $input );
		$css->add_property( 'flex', '0 1 ' . round( 100 / $columns, 2 ) . '%' );
		$css->set_media_state( 'desktop' );
	}
}
