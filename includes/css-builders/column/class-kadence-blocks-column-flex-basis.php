<?php
/**
 * Writes the flex basis of the content on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the flex basis of the content on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Flex_Basis_Css implements Kadence_Blocks_Css_Section {

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
	 * Write the basis.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$basis = $input->item( 'flexBasis', $this->index );

		if ( empty( $basis ) ) {
			return;
		}

		Kadence_Blocks_Column_Selector::set( $input, 'children' );
		$input->css()->add_property( 'flex-basis', $basis . ( ! empty( $input->attribute( 'flexBasisUnit' ) ) ? $input->attribute( 'flexBasisUnit' ) : 'px' ) );
	}
}
