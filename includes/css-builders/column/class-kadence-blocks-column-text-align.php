<?php
/**
 * Writes the text alignment of the column on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the text alignment of the column on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Text_Align_Css implements Kadence_Blocks_Css_Section {

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
	 * @param int $index The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 */
	public function __construct( $index ) {
		$this->index = $index;
	}

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$align = $input->item( 'textAlign', $this->index );

		if ( empty( $align ) ) {
			return;
		}

		Kadence_Blocks_Column_Selector::set( $input, 'column' );
		$input->css()->add_property( 'text-align', $align );
	}
}
