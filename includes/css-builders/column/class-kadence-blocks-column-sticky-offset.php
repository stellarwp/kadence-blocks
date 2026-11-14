<?php
/**
 * Writes the sticky offset of the column on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the sticky offset of the column on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Sticky_Offset_Css implements Kadence_Blocks_Css_Section {

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
	 * @param string $device The device.
	 * @param int    $index  The position of the device.
	 */
	public function __construct( $device, $index ) {
		$this->device = $device;
		$this->index  = $index;
	}

	/**
	 * Write the sticky offset.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$offset = $input->item( 'stickyOffset', $this->index );

		if ( empty( $offset ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Column_Selector::set( $input, 'column' );
		$css->add_property( '--kb-section-setting-offset', $offset . $input->attribute( 'stickyOffsetUnit', 'px' ) );
		$css->set_media_state( 'desktop' );
	}
}
