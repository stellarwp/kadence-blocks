<?php
/**
 * Render an SVG given a key.
 *
 * @since   2.4.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Enqueue CSS/JS of all the blocks.
 *
 * @category class
 */
class Kadence_Blocks_Svg_Render {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * All SVG Icons
	 *
	 * @var null
	 */
	private static $allIcons = null;

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Return or echo an SVG icon matching the provided key
	 *
	 * @param $key
	 * @param $echo
	 *
	 * @return string|void
	 */
	public static function render( $key, $echo = true ) {

		if ( null === self::$allIcons ) {
			self::$allIcons = self::getIcons();
		}

		$svg = '';

		if ( ! empty( self::$allIcons[ $key ] ) ) {
			$icon = self::$allIcons[ $key ];

			$svg .= '<svg style="display: inline-block; vertical-align: middle;" viewBox="' . ( isset( $icon['vB'] ) ? $icon['vB'] : '0 0 24 24' ) . '">';

			if ( ! empty( $icon['cD'] ) ) {
				foreach ( $icon['cD'] as $cd ) {
					$nE      = $cd['nE'];
					$aBs     = $cd['aBs'];
					$tmpAttr = array();

					foreach ( $aBs as $key => $attribute ) {
						if ( ! in_array( $key, array( 'fill', 'stroke', 'none' ) ) ) {
							$tmpAttr[ $key ] = $key . '="' . $attribute . '"';
						}
					}

					if ( isset( $aBs['fill'], $aBs['stroke'] ) && $aBs['fill'] === 'none' ) {
						$tmpAttr['stroke'] = 'stroke="currentColor"';
					}

					$svg .= '<' . $nE . ' ' . implode( ' ', $tmpAttr ) . '/>';
				}
			}

			$svg .= '</svg>';

		}

		if ( $echo ) {
			echo $svg;

			return;
		}

		return $svg;

	}

	private function getIcons() {
		include KADENCE_BLOCKS_PATH . 'dist/icons-ico-array.php';
		include KADENCE_BLOCKS_PATH . 'dist/icons-array.php';

		return apply_filters( 'kadence_svg_icons', array_merge( $ico, $faico ) );
	}

}

Kadence_Blocks_Svg_Render::get_instance();
