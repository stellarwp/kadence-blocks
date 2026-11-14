<?php
/**
 * Writes the gap between the tab titles on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the gap between the tab titles on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Gutter_Css implements Kadence_Blocks_Css_Section {

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
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$gutter = $input->item( 'gutter', $this->index );

		if ( ! is_array( $input->attribute( 'gutter' ) ) || ! is_numeric( $gutter ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		( new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li .kt-tab-title' ) )->write( $input );
		$css->add_property( 'margin-right', $gutter . 'px' );
		Kadence_Blocks_Tabs_Rtl_Margin::write( $input, $gutter );
		$css->set_media_state( 'desktop' );
	}
}
