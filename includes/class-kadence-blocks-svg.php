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
						$value = trim($value);
						if ( empty( $value ) ) {
							continue;
						}
						$data_split = explode( '=', $value, 2 );
						if ( $data_split[0] === 'title' || $data_split[0] === 'class' ) {
							$data_split[1] = str_replace( '_', ' ', $data_split[1] );
						}
						$args[ $data_split[0] ] = str_replace( '"', '', $data_split[1] );
					}
					$type = substr( $args['name'] , 0, 2 );
					$type_fas = ( 'fas' === substr( $args['name'] , 0, 3 ) ? true : false );
					$line_icon = ( ! empty( $type ) && 'fe' == $type ? true : false );
					$fill = ( $line_icon ? 'none' : 'currentColor' );
					$stroke_width = false;
					if ( $line_icon ) {
						$stroke_width = ( ! empty( $args['stroke'] ) ? $args['stroke'] : 2 );
					}
					$hidden = ( ! empty( $args['title'] ) ? true : false );
					$svg    = self::render( $args['name'], $fill, $stroke_width, $args['title'], $hidden );
					return '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $args['name'] ) . ( ! empty( $args['class'] ) ? ' ' . esc_attr( $args['class'] ) : '' ) . '">' . $svg . '</span>';
				},
				$block_content
			);
			// if the regex errored out, don't replace the $block_content.
			$block_content = is_null( $replaced_block_content ) ? $block_content : $replaced_block_content;
		}
		return $block_content;
	}
	/**
	 * Return or echo an SVG icon matching the provided key
	 *
	 * @param string  $name the name of the svg.
	 * @param boolean $echo wheather or not to echo.
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
		if ( ! empty( self::$all_icons[ $name ] ) ) {
			$icon = self::$all_icons[ $name ];
			$vb = ( ! empty( $icon['vB'] ) ? $icon['vB'] : '0 0 24 24' );
			$preserve = '';
			$vb_array = explode( ' ', $vb );
			$typeL = substr( $name, 0, 3 );
			if( $typeL && 'fas' !== $typeL && isset( $vb_array[2] ) && isset( $vb_array[3] ) && $vb_array[2] !== $vb_array[3] ) {
				$preserve = 'preserveAspectRatio="xMinYMin meet"';
			}
			$svg .= '<svg viewBox="' . $vb . '" ' . $preserve . ' fill="' . esc_attr( $fill ) . '"' . ( ! empty( $stroke_width ) ? ' stroke="currentColor" stroke-width="' . esc_attr( $stroke_width ) . '" stroke-linecap="round" stroke-linejoin="round"' : '' ) . ' xmlns="http://www.w3.org/2000/svg" ' . ( ! empty( $extras ) ? ' ' . $extras : '' ) . ( $hidden ? ' aria-hidden="true"' : '' ) . '>';
			if ( ! empty( $title ) ) {
				$svg .= '<title>' . $title . '</title>';
			}
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

}

Kadence_Blocks_Svg_Render::get_instance();
