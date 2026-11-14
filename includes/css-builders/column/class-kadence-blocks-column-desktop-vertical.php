<?php
/**
 * Writes the desktop layout of a column that flows from top to bottom.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the desktop layout of a column that flows from top to bottom.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Desktop_Vertical_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the layout.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css    = $input->css();
		$device = $input->derived( 'layout' )->device( 0 );

		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( 'flex-direction', 'vertical-reverse' === $device->direction() ? 'column-reverse' : 'column' );

		$this->write_alignment( $input, $device );

		Kadence_Blocks_Column_Selector::set( $input, 'aligncenter' );
		$css->add_property( 'width', '100%' );
	}

	/**
	 * Write the alignment on both axes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Column_Device   $device The values of desktop.
	 *
	 * @return void
	 */
	private function write_alignment( Kadence_Blocks_Css_Build_Input $input, $device ): void {
		$css = $input->css();

		if ( ! empty( $device->vertical_align() ) ) {
			$css->add_property( 'justify-content', ( new Kadence_Blocks_Column_Flex_Values() )->main( $device->vertical_align() ) );
		}

		if ( empty( $device->horizontal_align() ) ) {
			return;
		}

		$css->add_property( 'align-items', $device->horizontal_align() );
		Kadence_Blocks_Column_Selector::set( $input, 'ratio' );
		$css->add_property( 'align-self', 'stretch' );
		Kadence_Blocks_Column_Selector::set( $input, '{col} > .kt-inside-inner-col > .wp-block-kadence-advancedgallery' );
		$css->add_property( 'align-self', 'stretch' );
	}
}
