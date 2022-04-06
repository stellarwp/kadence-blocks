<?php
/**
 * Kadence Blocks Helper Functions
 *
 * @since   1.8.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if we are in AMP Mode.
 */
function kadence_blocks_is_not_amp() {
	$not_amp = true;
	if ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ) {
		$not_amp = false;
	}
	return $not_amp;
}


/**
 * Hex to RGBA
 *
 * @param string $hex string hex code.
 * @param number $alpha alpha number.
 */
function kadence_blocks_hex2rgba( $hex, $alpha ) {
	if ( empty( $hex ) ) {
		return '';
	}
	if ( 'transparent' === $hex ) {
		return $hex;
	}
	$hex = str_replace( '#', '', $hex );
	if ( strlen( $hex ) == 3 ) {
		$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
		$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
		$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
	} else {
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );
	}
	$rgba = 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
	return $rgba;
}


/**
 * Return or echo an SVG icon matching the provided key
 *
 * @param $key
 * @param $echo
 *
 * @return string|void
 */
function kadence_blocks_render_svg( $key, $echo = true) {
	include KADENCE_BLOCKS_PATH . 'dist/icons-ico-array.php';
	include KADENCE_BLOCKS_PATH . 'dist/icons-array.php';

	$allIcons = array_merge($ico, $faico);
	$svg = '';

	if( !empty( $allIcons[$key] ) ) {
		$icon = $allIcons[$key];

		// height={ props.size } width={ props.size } fill={ fill } stroke={ stroke } xmlns={ props.xmlns } preserveAspectRatio={ ( typeL && 'fas' !== typeL && viewB && undefined !== viewB[ 2 ] && undefined !== viewB[ 3 ] && viewB[ 2 ] !== viewB[ 3 ] ? 'xMinYMin meet' : undefined ) } stroke-width={ strokeWidth } stroke-linecap={ strokeLinecap } stroke-linejoin={ strokeLinejoin }
		// 				{ props.title ? <title>{ props.title }</title> : null }
		$svg .= '<svg style="display: inline-block; vertical-align: middle;" viewBox="' . (isset($icon['vB']) ? $icon['vB'] : '0 0 24 24') . '">';

		if( !empty($icon['cD']) ){
			foreach($icon['cD'] as $cd ){
				$nE = $cd['nE'];
				$aBs = $cd['aBs'];
				$tmpAttr = array();

				foreach($aBs as $key => $attribute ){
					if( !in_array( $key, array('fill', 'stroke', 'none'))){
						$tmpAttr[$key] = $key . '="' . $attribute . '"';
					}
				}

				if( isset($aBs['fill'], $aBs['stroke'] ) && $aBs['fill'] === 'none' ){
					$tmpAttr['stroke'] =  'stroke="currentColor"';
				}

				$svg .= '<' . $nE . ' ' . implode(' ', $tmpAttr) . '/>';
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
