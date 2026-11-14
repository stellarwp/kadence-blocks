<?php
/**
 * Aligns the content of a column that flows from left to right.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Aligns the content of a column that flows from left to right.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Text_Justify_Css implements Kadence_Blocks_Css_Section {

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
	 * Write the justification.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$layout = $input->derived( 'layout' );
		$device = $layout->device( $this->index );
		$css    = $input->css();

		if ( ! empty( $device->horizontal_align() ) ) {
			$css->add_property( 'justify-content', $device->horizontal_align() );
			return;
		}

		if ( ! $layout->is_version_two() && ! empty( $device->text_align() ) ) {
			$css->add_property( 'justify-content', ( new Kadence_Blocks_Column_Flex_Values() )->text( $device->text_align() ) );
		}
	}
}
