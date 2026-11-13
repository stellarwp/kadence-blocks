<?php
/**
 * Puts the grid above the separators of a row saved by version one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Puts the grid above the separators of a row saved by version one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Separator_Layer_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the layer.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( $input->derived( 'selectors' )->is_updated() || ! ( $this->has_separator( $input, 'topSep' ) || $this->has_separator( $input, 'bottomSep' ) ) ) {
			return;
		}

		$input->css()->add_property( 'z-index', '10' );
		$input->css()->add_property( 'position', 'relative' );
	}

	/**
	 * Whether the row has a separator on an edge.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $attribute The attribute that stores the separator.
	 *
	 * @return bool
	 */
	private function has_separator( Kadence_Blocks_Css_Build_Input $input, $attribute ): bool {
		$separator = $input->attribute( $attribute );

		return ! empty( $separator ) && 'none' !== $separator;
	}
}
