<?php
/**
 * Writes the direction of a column that flows from left to right.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the direction of a column that flows from left to right.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Row_Direction_Css implements Kadence_Blocks_Css_Section {

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
	 * Write the direction.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( 'flex-direction', 'horizontal-reverse' === $input->derived( 'layout' )->device( $this->index )->direction() ? 'row-reverse' : 'row' );
		$css->add_property( 'flex-wrap', 'wrap' );
	}
}
