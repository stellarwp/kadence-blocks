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
	private static $all_icons = null;

	/*
	 * Cache rendered SVG elements
	 */
	private static $cached_render = [];

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
	 * Class Constructor.
	 */
	public function __construct() {
		add_filter( 'render_block', array( $this, 'render_icons_dynamically' ), 10, 2 );
		if ( apply_filters( 'kadence_blocks_fix_svg_dimensions', false ) ) {
			add_filter( 'wp_get_attachment_image_src', array( $this, 'fix_wp_get_attachment_image_svg' ), 10, 4 );
		}
	}
	/**
	 * On build convert icons into svgs.
	 *
	 * @param string $block_content the name of the svg.
	 * @param object $block the block data.
	 *
	 * @return string|void
	 */
	public function render_icons_dynamically( $block_content, $block ) {
		if ( is_admin() ) {
			return $block_content;
		}
		if ( ! empty( $block_content ) ) {
			$replaced_block_content = preg_replace_callback(
				'/<span\s+((?:data-[\w\-]+=["\']+.*["\']+[\s]+)+)class=["\'].*kadence-dynamic-icon.*["\']\s*>(.*)<\/span>/U',
				function ( $matches ) {
					$options = explode( ' ', str_replace( 'data-', '', $matches[1] ) );
					$args = array( 'title' => '' );
					foreach ( $options as $key => $value ) {
						$value = trim( $value );
						if ( empty( $value ) ) {
							continue;
						}
						$data_split = explode( '=', $value, 2 );
						if ( ! empty( $data_split[0] ) && ( $data_split[0] === 'title' || $data_split[0] === 'class' ) ) {
							if ( ! empty( $data_split[1] ) ) {
								$data_split[1] = str_replace( '_', ' ', $data_split[1] );
							}
						}
						if ( ! empty( $data_split[1] ) ) {
							$args[ $data_split[0] ] = str_replace( '"', '', $data_split[1] );
						}
					}
					$type = substr( $args['name'] , 0, 2 );
					$line_icon = ( ! empty( $type ) && 'fe' == $type ? true : false );
					$fill = ( $line_icon ? 'none' : 'currentColor' );
					$stroke_width = false;
					if ( $line_icon ) {
						$stroke_width = ( ! empty( $args['stroke'] ) ? $args['stroke'] : 2 );
					}
					$hidden = empty( $args['title'] );
					$extras = '';
					if ( ! empty( $args['tooltip-id'] ) ) {
						$extras = 'data-tooltip-id="' . esc_attr( $args['tooltip-id'] ) . '"';
						if ( ! empty( $args['tooltip-placement'] ) ) {
							$extras .= ' data-tooltip-placement="' . esc_attr( $args['tooltip-placement'] ) . '"';
						}
					}
					$svg    = self::render( $args['name'], $fill, $stroke_width, $args['title'], $hidden );
					return '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $args['name'] ) . ( ! empty( $args['class'] ) ? ' ' . esc_attr( $args['class'] ) : '' ) . '"' . $extras . '>' . $svg . '</span>';
				},
				$block_content
			);
			// if the regex errored out, don't replace the $block_content.
			$block_content = is_null( $replaced_block_content ) ? $block_content : $replaced_block_content;
		}
		return $block_content;
	}

	/**
	 *  Return or echo an SVG icon matching the provided key
	 *
	 * @param $name
	 * @param $fill
	 * @param $stroke_width
	 * @param $title
	 * @param $hidden
	 * @param $extras string Escape any attributes passed to this
	 * @param $echo
	 *
	 * @return string|void
	 */
	public static function render( $name, $fill = 'currentColor', $stroke_width = false, $title = '', $hidden = true, $extras = '', $echo = false ) {

		if ( null === self::$all_icons ) {
			self::$all_icons = self::get_icons();
		}

		$svg = '';
		if ( 'fa_facebook' === $name ) {
			$name = 'fa_facebook-n';
		}

		$key = md5( $name . $fill . $stroke_width . $title . $hidden . $extras );
		if( !empty( self::$cached_render[$key] ) ) {
			return self::$cached_render[$key];
		}

		// Custom SVGs
		$is_custom_svg = strpos($name, 'kb-custom-') === 0;
		if ( $is_custom_svg && !isset(  self::$all_icons[ $name ] ) ) {
			$custom_post = get_post( str_replace('kb-custom-', '', $name) );

			if ( ! empty( $custom_post ) && ! is_wp_error( $custom_post ) && 'kadence_custom_svg' === $custom_post->post_type && 'publish' === $custom_post->post_status ) {
				self::$all_icons[ $name ] = json_decode( $custom_post->post_content, true );
			}
		}

		if ( ! empty( self::$all_icons[ $name ] ) ) {
			$icon = self::$all_icons[ $name ];
			$vb = ( ! empty( $icon['vB'] ) ? $icon['vB'] : '0 0 24 24' );
			$preserve = '';
			$vb_array = explode( ' ', $vb );
			$typeL = substr( $name, 0, 3 );

			// This is added because some people upload icons that have negative values in the viewbox which cause part of the icons to get cut off unless this is added.
			if ( $typeL && 'fas' !== $typeL && 'fe_' !== $typeL && 'ic_' !== $typeL && ( ( isset( $vb_array[0] ) && absint( $vb_array[0] ) > 0 ) || ( isset( $vb_array[1] ) && absint( $vb_array[1] ) > 0 ) ) ) {
				$preserve = 'preserveAspectRatio="xMinYMin meet"';
			}
			$svg .= '<svg viewBox="' . $vb . '" ' . $preserve . ' fill="' . esc_attr( $fill ) . '"' . ( ! empty( $stroke_width ) ? ' stroke="currentColor" stroke-width="' . esc_attr( $stroke_width ) . '" stroke-linecap="round" stroke-linejoin="round"' : '' ) . ' xmlns="http://www.w3.org/2000/svg" ' . ( ! empty( $extras ) ? ' ' . $extras : '' ) . ( $hidden ? ' aria-hidden="true"' : ' role="img"' ) . '>';
			if ( ! empty( $title ) ) {
				$svg .= '<title>' . $title . '</title>';
			}
			if ( ! empty( $icon['cD'] ) ) {
				$svg .= self::generate_svg_elements($icon['cD']);
			}

			$svg .= '</svg>';

		}

		self::$cached_render[$key] = $svg;

		if ( $echo ) {
			echo $svg;

			return;
		}

		return $svg;

	}

	/**
	 * Recursively generate SVG elements
	 * Out native SVGs do not have children, but user uploaded SVGs in pro can contain children elements.
	 *
	 * @param $elements
	 *
	 * @return string
	 */
	private static function generate_svg_elements( $elements ) {
		$output = '';
		foreach ( $elements as $element ) {
			$nE       = $element['nE'];
			$aBs      = $element['aBs'];
			$children = ! empty( $element['children'] ) ? $element['children'] : [];
			$tmpAttr  = array();

			foreach ( $aBs as $key => $attribute ) {
				if ( ! in_array( $key, array( 'fill', 'stroke', 'none' ) ) ) {
					$tmpAttr[ $key ] = $key . '="' . esc_attr( $attribute ) . '"';
				}
			}

			if ( isset( $aBs['fill'], $aBs['stroke'] ) && $aBs['fill'] === 'none' ) {
				$tmpAttr['stroke'] = 'stroke="currentColor"';
			}

			$output .= '<' . $nE . ' ' . implode( ' ', $tmpAttr );
			if ( ! empty( $children ) ) {
				$output .= '>' . self::generate_svg_elements( $children ) . '</' . $nE . '>';
			} else {
				$output .= '/>';
			}
		}

		return $output;
	}
	/**
	 * Return an array of icons.
	 *
	 * @return array();
	 */
	private static function get_icons() {
		$ico   = include KADENCE_BLOCKS_PATH . 'includes/icons-ico-array.php';
		$faico = include KADENCE_BLOCKS_PATH . 'includes/icons-array.php';

		return apply_filters( 'kadence_svg_icons', array_merge( $ico, $faico ) );
	}

	/**
	 * Fix an issue where wp_get_attachment_source returns non-values for width and height on svg's
	 *
	 * @param string  $image the image retrieved.
	 * @param boolean $attachment_id The attachment id.
	 * @param boolean $size The size request.
	 * @param boolean $icon If it was requested as an icon.
	 *
	 * @return array|boolean
	 */
	public function fix_wp_get_attachment_image_svg( $image, $attachment_id, $size, $icon ) {
		// If the image requested is an svg and the width is unset (1 or less in this case).
		if ( is_array( $image ) && preg_match( '/\.svg$/i', $image[0] ) && $image[1] <= 1 ) {
			// Use the requested size's dimensions first if available.
			if ( is_array( $size ) ) {
				$image[1] = $size[0];
				$image[2] = $size[1];
			} elseif ( ini_get( 'allow_url_fopen' ) && ( $xml = simplexml_load_file( $image[0], SimpleXMLElement::class, LIBXML_NOWARNING ) ) !== false ) {
				$attr = $xml->attributes();
				$viewbox = explode( ' ', $attr->viewBox );
				$image[1] = isset( $attr->width ) && preg_match( '/\d+/', $attr->width, $value ) ? (int) $value[0] : ( count( $viewbox ) == 4 ? (int) $viewbox[2] : null );
				$image[2] = isset( $attr->height ) && preg_match( '/\d+/', $attr->height, $value ) ? (int) $value[0] : ( count( $viewbox ) == 4 ? (int) $viewbox[3] : null );
			} else {
				$image[1] = null;
				$image[2] = null;
			}
		}
		return $image;
	}

}

Kadence_Blocks_Svg_Render::get_instance();
