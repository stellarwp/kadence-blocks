<?php
/**
 * Writes the icon sizes saved by icon lists made before the sizes moved to the list.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the icon sizes saved by icon lists made before the sizes moved to the list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Legacy_Size_Css implements Kadence_Blocks_Css_Section {

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
		$items = $input->attribute( 'items' );

		if ( empty( $items ) || ! is_array( $items ) ) {
			return;
		}

		foreach ( $items as $level => $item ) {
			$this->write_item( $input, $level, $item );
		}
	}

	/**
	 * Write the size of one level.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int|string                     $level The level of the item.
	 * @param mixed                          $item  The item settings.
	 *
	 * @return void
	 */
	private function write_item( Kadence_Blocks_Css_Build_Input $input, $level, $item ): void {
		if ( ! isset( $item['size'] ) || ! is_numeric( $item['size'] ) ) {
			return;
		}

		$input->css()->set_selector( '.kt-svg-icon-list-items' . $input->unique_id() . ' ul.kt-svg-icon-list .kt-svg-icon-list-level-' . $level . ' .kt-svg-icon-list-single svg' );
		$input->css()->add_property( 'font-size', $item['size'] . 'px' );
	}
}
