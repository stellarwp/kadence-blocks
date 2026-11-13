<?php
/**
 * Advanced Buttons gradients.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Builds a button background gradient from its saved stops.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Stops_Gradient {

	/**
	 * The gradient: radial or linear, from a first color to a second one.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css   The CSS builder.
	 * @param mixed                                     $stops The saved stops: second color, its opacity, start and end percentages, type, angle and position.
	 * @param string                                    $first The first color.
	 *
	 * @return string
	 */
	public function value( $css, $stops, $first ) {
		$second = $css->render_color( ! empty( $stops[0] ?? null ) ? $stops[0] : '#999999', is_numeric( $stops[1] ?? null ) ? $stops[1] : 1 );
		$start  = is_numeric( $stops[2] ?? null ) ? $stops[2] : '0';
		$end    = is_numeric( $stops[3] ?? null ) ? $stops[3] : '100';
		$tail   = $first . ' ' . $start . '%, ' . $second . ' ' . $end . '%)';

		if ( 'radial' === ( $stops[4] ?? null ) ) {
			return 'radial-gradient(at ' . ( ! empty( $stops[6] ?? null ) ? $stops[6] : 'center center' ) . ', ' . $tail;
		}

		return 'linear-gradient(' . ( ! empty( $stops[5] ?? null ) ? $stops[5] : '180' ) . 'deg, ' . $tail;
	}
}
