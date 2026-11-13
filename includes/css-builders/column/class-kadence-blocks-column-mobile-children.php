<?php
/**
 * Writes how the content of a mobile column that flows from top to bottom sizes itself.
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

/**
 * Writes how the content of a mobile column that flows from top to bottom sizes itself.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Mobile_Children_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the sizes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! $input->derived( 'layout' )->device( 1 )->is_horizontal() ) {
			return;
		}

		$this->write_basis( $input );

		if ( ! empty( $input->item( 'direction', 2 ) ) ) {
			Kadence_Blocks_Column_Selector::set( $input, 'infobox' );
			$input->css()->add_property( 'align-self', 'unset' );
		}
	}

	/**
	 * Let the content fill the column when it had a basis on a larger device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_basis( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->item( 'flexBasis', 0 ) ) && empty( $input->item( 'flexBasis', 1 ) ) ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column.kb-section-dir-horizontal{col} > .kt-inside-inner-col > *,.wp-block-kadence-column.kb-section-md-dir-vertical{col} > .kt-inside-inner-col > *' );
		$css->add_property( 'flex', '1' );
		$css->add_property( 'max-width', '100%' );
		Kadence_Blocks_Column_Selector::set( $input, 'infobox' );
		$css->add_property( 'width', 'auto' );
		$css->add_property( 'align-self', 'unset' );
	}
}
