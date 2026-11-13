<?php
/**
 * Writes the widths of the columns, and fixes the layout when one has a width.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-table-column-width.php';

/**
 * Writes the widths of the columns, and fixes the layout when one has a width.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Column_Settings_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the widths.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->attribute( 'columnSettings' );

		if ( empty( $settings ) || ! is_array( $settings ) ) {
			return;
		}

		$has_fixed_columns = false;

		foreach ( $settings as $index => $column ) {
			if ( ! empty( $column['useAuto'] ) ) {
				continue;
			}

			$has_fixed_columns = true;
			( new Kadence_Blocks_Table_Column_Width_Css( $index, $column ) )->write( $input );
		}

		// Only set table-layout fixed if we have any fixed width columns.
		if ( $has_fixed_columns ) {
			$this->fix_layout( $input );
		}
	}

	/**
	 * Fix the layout of the table.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function fix_layout( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->set_selector( '.kb-table' . $input->derived( 'id' ) );
		$css->add_property( 'table-layout', 'fixed' );
		$css->add_property( 'width', '100%' );
	}
}
