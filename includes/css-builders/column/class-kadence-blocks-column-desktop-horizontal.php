<?php
/**
 * Writes the desktop layout of a column that flows from left to right.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector-css.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';
require_once __DIR__ . '/class-kadence-blocks-column-layout.php';
require_once __DIR__ . '/class-kadence-blocks-column-flex-values.php';
require_once __DIR__ . '/class-kadence-blocks-column-text-justify.php';
require_once __DIR__ . '/class-kadence-blocks-column-row-wrap.php';

/**
 * Writes the desktop layout of a column that flows from left to right.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Desktop_Horizontal_Css implements Kadence_Blocks_Css_Section {

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
		$css->add_property( 'flex-direction', 'horizontal-reverse' === $device->direction() ? 'row-reverse' : 'row' );
		$css->add_property( 'flex-wrap', 'wrap' );
		$css->add_property( 'align-items', ( new Kadence_Blocks_Column_Flex_Values() )->main( $device->vertical_align() ) );

		( new Kadence_Blocks_Column_Text_Justify_Css( 0 ) )->write( $input );
		( new Kadence_Blocks_Column_Row_Wrap_Css( 0 ) )->write( $input );
		$this->write_children( $input );
		$this->write_basis( $input );
	}

	/**
	 * Remove the vertical margins of the content and let ratio images grow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_children( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'plain_children' );
		$css->add_property( 'margin-top', '0px' );
		$css->add_property( 'margin-bottom', '0px' );
		Kadence_Blocks_Column_Selector::set( $input, 'ratio' );
		$css->add_property( 'flex-grow', 1 );
	}

	/**
	 * Write the flex basis of the content.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_basis( Kadence_Blocks_Css_Build_Input $input ): void {
		$basis = $input->item( 'flexBasis', 0 );

		if ( empty( $basis ) ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'children' );
		$css->add_property( 'flex-basis', $basis . ( ! empty( $input->attribute( 'flexBasisUnit' ) ) ? $input->attribute( 'flexBasisUnit' ) : 'px' ) );
		Kadence_Blocks_Column_Selector::set( $input, 'infobox' );
		$css->add_property( 'width', '0px' );
	}
}
