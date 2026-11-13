<?php
/**
 * Works out the font of the percentage: the label font with what the number font changes.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Works out the font of the percentage: the label font with what the number font changes.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Number_Font_Merge {

	/**
	 * The label font, with the values of the number font that differ from the defaults.
	 *
	 * @since TBD
	 *
	 * @param mixed                            $number  The number font.
	 * @param mixed                            $label   The label font.
	 * @param Kadence_Blocks_Css_Block_Context $context What the builder needs from the block.
	 *
	 * @return array
	 */
	public static function resolve( $number, $label, Kadence_Blocks_Css_Block_Context $context ): array {
		$diff = $context->call( 'array_recursive_diff', $number, $context->call( 'get_default_font' ) );

		// The line height unit goes with the line height it belongs to; a font saved without a unit keeps the label's.
		if ( ! isset( $diff['lineHeight'] ) ) {
			unset( $diff['lineType'] );

			return array_merge( $label, $diff );
		}

		if ( array_key_exists( 'lineType', $number ) ) {
			$diff['lineType'] = $number['lineType'];
		}

		return array_merge( $label, $diff );
	}
}
