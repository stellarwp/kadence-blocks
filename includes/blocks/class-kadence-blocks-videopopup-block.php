<?php
/**
 * Class to Build the Video Popup Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Video Popup Block.
 *
 * @category class
 */
class Kadence_Blocks_Videopopup_Block extends Kadence_Blocks_Abstract_Block {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'videopopup';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

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
	 * Builds CSS for block.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$this->enqueue_script( 'kadence-blocks-pro-glight-video-init' );
		$this->enqueue_script( 'kadence-glightbox' );
		$this->enqueue_style( 'kadence-glightbox' );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		if ( ! empty( $attributes['maxWidth'] ) ) {
			$css->set_selector('.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap' );
			$css->add_property('max-width', $attributes['maxWidth'] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) . ';');
		}
		if ( isset( $attributes['backgroundOverlay'] ) && is_array( $attributes['backgroundOverlay'] ) && is_array( $attributes['backgroundOverlay'][0] ) ) {
			$overlay = $attributes['backgroundOverlay'][0];
			$css->set_selector('.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kadence-video-overlay');
			if ( isset( $overlay['opacity'] ) && is_numeric( $overlay['opacity'] ) ) {
				$css->add_property('opacity', $overlay['opacity'] . ';');
			}
			if ( isset( $overlay['blendMode'] ) && ! empty( $overlay['blendMode'] ) && 'normal' !== $overlay['blendMode'] ) {
				$css->add_property('mix-blend-mode', $overlay['blendMode'] . ';');
			}
			if ( ! isset( $overlay['type'] ) || 'gradient' !== $overlay['type'] ) {
				if ( isset( $overlay['fill'] ) || isset( $overlay['fillOpacity'] ) ) {
					$css->add_property('background', $css->render_color( ( ! empty( $overlay['fill'] ) ? $overlay['fill'] : '#000000' ), ( ! empty( $overlay['fillOpacity'] ) ? $overlay['fillOpacity'] : '1' ) ) . ';');
				}
			} else {
				$type = ( isset( $overlay['gradType'] ) ? $overlay['gradType'] : 'linear' );
				if ( 'radial' === $type ) {
					$angle = ( isset( $overlay['gradPosition'] ) ? 'at ' . $overlay['gradPosition'] : 'at center center' );
				} else {
					$angle = ( isset( $overlay['gradAngle'] ) ? $overlay['gradAngle'] . 'deg' : '180deg' );
				}
				$loc = ( isset( $overlay['gradLoc'] ) ? $overlay['gradLoc'] : '0' );
				$color = $css->render_color( ( isset( $overlay['fill'] ) ? $overlay['fill'] : '#000000' ), ( ! empty( $overlay['fillOpacity'] ) ? $overlay['fillOpacity'] : '1' ) );
				$locsecond = ( isset( $overlay['gradLocSecond'] ) ? $overlay['gradLocSecond'] : '100' );
				$colorsecond = $css->render_color( ( isset( $overlay['secondFill'] ) ? $overlay['secondFill'] : '#000000' ), ( ! empty( $overlay['secondFillOpacity'] ) ? $overlay['secondFillOpacity'] : '0' ) );

				$css->add_property('background', $type . '-gradient(' . $angle. ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
			}
			if ( isset( $overlay['opacityHover'] ) && is_numeric( $overlay['opacityHover'] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap:hover .kadence-video-overlay' );
				$css->add_property( 'opacity', $overlay['opacityHover'] . ';' );
			}
		}
		if ( isset( $attributes['kadenceDynamic'] ) && is_array( $attributes['kadenceDynamic'] ) ) {
			if ( isset( $attributes['ratio'] ) && 'custom' === $attributes['ratio'] ) {
				if ( isset( $attributes['background'] ) && is_array( $attributes['background'] ) && is_array( $attributes['background'][0] ) ) {
					$background = $attributes['background'][0];
					if ( ! empty( $background['imageHeight'] ) && ! empty( $background['imgWidth'] ) ) {
						$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kadence-video-intrinsic.kadence-video-set-ratio-custom' );
						$css->add_property( 'padding-bottom', floor( $background['imageHeight'] / $background['imgWidth'] * 100 ) . '% !important' );
					}
				}
			}
		}
		$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap' );

		if ( isset( $attributes['displayShadow'] ) && ! empty( $attributes['displayShadow'] ) && true === $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && is_array( $attributes['shadow'][0] ) ) {
				$shadow = $attributes['shadow'][ 0 ];
				$css->add_property('box-shadow', $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $css->render_color( $shadow['color'], $shadow['opacity'] ) );
			} else {
				$css->add_property('box-shadow', '4px 2px 14px 0px ' . $css->render_color( '#000000', 0.2 ) );
			}
		}
		// Support borders saved pre 3.0.
		if ( empty( $attributes['borderStyle'] ) ) {
			if ( isset( $attributes['borderWidth'] ) && is_array( $attributes['borderWidth'] ) && is_numeric( $attributes['borderWidth'][0] ) ) {
				$css->add_property('border-width', $attributes['borderWidth'][0] . 'px ' . $attributes['borderWidth'][1] . 'px ' . $attributes['borderWidth'][2] . 'px ' . $attributes['borderWidth'][3] . 'px');
			}
			if ( isset( $attributes['borderColor'] ) && ! empty( $attributes['borderColor'] ) ) {
				$css->add_property('border-color', $css->render_color( $attributes['borderColor'], ( isset( $attributes['borderOpacity'] ) ? $attributes['borderOpacity'] : 1 ) ) );
			}
			if ( isset( $attributes['borderRadius'] ) && is_array( $attributes['borderRadius'] ) && is_numeric( $attributes['borderRadius'][0] ) ) {
				$css->add_property( 'border-radius', $attributes['borderRadius'][0] . 'px ' . $attributes['borderRadius'][1] . 'px ' . $attributes['borderRadius'][2] . 'px ' . $attributes['borderRadius'][3] . 'px' );
			}
		} else {
			$css->render_border_styles( $attributes, 'borderStyle', true );
			$css->render_measure_output( $attributes, 'borderRadius', 'border-radius' );
		}

		if ( isset( $attributes['displayShadow'] ) && ! empty( $attributes['displayShadow'] ) && true === $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'] ) && is_array( $attributes['shadow'][0] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap:hover' );
				$shadow = $attributes['shadowHover'][0];
				$css->add_property( 'box-shadow', $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $css->render_color( $shadow['color'], $shadow['opacity'] ) );
			} else {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap:hover' );
				$css->add_property( 'box-shadow', '4px 2px 14px 0px ' . $css->render_color( '#000000', 0.2 ) );
			}
		}
		if ( ! empty( $attributes['maxWidth'] ) ) {
			$css->set_selector('.kb-section-dir-horizontal > .kt-inside-inner-col > .kadence-video-popup' . $unique_id);
			$css->add_property('max-width', $attributes['maxWidth'] . 'px');
			$css->add_property('width', '100%');
		}

		$css->set_selector('.kadence-video-popup' . $unique_id);

		if ( isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ){
			$padding = $attributes['padding'][0];
			$padding_attr = array(
				'padding'       => ( isset( $padding['desk'] ) && is_array( $padding['desk'] ) ) ? $padding['desk'] : array(),
				'paddingTablet' => ( isset( $padding['tablet'] ) && is_array( $padding['tablet'] ) ) ? $padding['tablet'] : array(),
				'paddingMobile' => ( isset( $padding['mobile'] ) && is_array( $padding['mobile'] ) ) ? $padding['mobile'] : array(),
				'paddingType'   => ( ! empty( $attributes['paddingUnit'] ) ) ? $attributes['paddingUnit'] : 'px',
			);

			$css->render_measure_output( $padding_attr, 'padding', 'padding' );
		}

		if ( isset( $attributes['margin'] ) && is_array( $attributes['margin'] ) ){
			$margin = $attributes['margin'][0];
			$margin_attr = array(
				'margin'       => ( isset( $margin['desk'] ) && is_array( $margin['desk'] ) ) ? $margin['desk'] : array(),
				'marginTablet' => ( isset( $margin['tablet'] ) && is_array( $margin['tablet'] ) ) ? $margin['tablet'] : array(),
				'marginMobile' => ( isset( $margin['mobile'] ) && is_array( $margin['mobile'] ) ) ? $margin['mobile'] : array(),
				'marginType'   => ( ! empty( $attributes['marginUnit'] ) ) ? $attributes['marginUnit'] : 'px',
			);

			$css->render_measure_output( $margin_attr, 'margin', 'margin' );
		}

		if ( isset( $attributes['background'] ) && is_array( $attributes['background'] ) && is_array( $attributes['background'][0] ) ) {
			$background = $attributes['background'][0];
			if ( isset( $background['color'] ) && ! empty( $background['color'] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kadence-video-intrinsic' );
				$css->add_property( 'background-color', $css->render_color( $background['color'], ( isset( $background['colorOpacity'] ) ? $background['colorOpacity'] : 1 ) ) );
			}
		}
		if ( isset( $attributes['playBtn'] ) && is_array( $attributes['playBtn'] ) && is_array( $attributes['playBtn'][ 0 ] ) ) {
			$play_btn = $attributes['playBtn'][0];
			if ( isset( $play_btn['color'] ) && ! empty( $play_btn['color'] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kt-video-svg-icon' );
				$css->add_property( 'color', $css->render_color( $play_btn['color'], ( isset( $play_btn['opacity'] ) ? $play_btn['opacity'] : 1 ) ) );
			}
			if ( isset( $play_btn['size'] ) && ! empty( $play_btn['size'] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kt-video-svg-icon' );
				$css->add_property( 'font-size', $play_btn['size'] . 'px' );
			}
			if ( isset( $play_btn['width'] ) && ! empty( $play_btn['width'] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kt-video-svg-icon > svg' );
				$css->add_property( 'stroke-width', $play_btn['width'] );
			}
			if ( isset( $play_btn['colorHover'] ) && ! empty( $play_btn['colorHover'] ) ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap:hover .kt-video-svg-icon' );
				$css->add_property( 'color', $css->render_color( $play_btn['colorHover'], ( isset( $play_btn['opacityHover'] ) ? $play_btn['opacityHover'] : 1 ) ) );
			}
			if ( isset( $play_btn['style'] ) && 'stacked' === $play_btn['style'] ) {
				$css->set_selector( '.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap .kt-video-svg-icon.kt-video-svg-icon-style-stacked' );
				if ( isset( $play_btn['background'] ) && ! empty( $play_btn['background'] ) ) {
					$css->add_property( 'background', $css->render_color( $play_btn['background'], ( isset( $play_btn['backgroundOpacity'] ) ? $play_btn['backgroundOpacity'] : 1 ) ) );
				}
				if ( isset( $play_btn['border'] ) && ! empty( $play_btn['border'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $play_btn['border'], ( isset( $play_btn['borderOpacity'] ) ? $play_btn['borderOpacity'] : 1 ) ) );
				}
				if ( isset( $play_btn['borderRadius'] ) && is_array( $play_btn['borderRadius'] ) && is_numeric( $play_btn['borderRadius'][0] ) ) {
					$css->add_property( 'border-radius', $play_btn['borderRadius'][0] . '% ' . $play_btn['borderRadius'][1] . '% ' . $play_btn['borderRadius'][2] . '% ' . $play_btn['borderRadius'][3] . '%' );
				}
				if ( isset( $play_btn['borderWidth'] ) && is_array( $play_btn['borderWidth'] ) && is_numeric( $play_btn['borderWidth'][0] ) ) {
					$css->add_property( 'border-width', $play_btn['borderWidth'][0] . 'px ' . $play_btn['borderWidth'][1] . 'px ' . $play_btn['borderWidth'][2] . 'px ' . $play_btn['borderWidth'][3] . 'px' );
				}
				if ( isset( $play_btn['padding'] ) && ! empty( $play_btn['padding'] ) ) {
					$css->add_property( 'padding', $play_btn['padding'] . 'px' );
				}

				// Hover.
				$css->set_selector('.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap:hover .kt-video-svg-icon.kt-video-svg-icon-style-stacked');
				if (isset($play_btn['backgroundHover']) && !empty($play_btn['backgroundHover'])) {
					$css->add_property('background', $css->render_color($play_btn['backgroundHover'], (isset($play_btn['backgroundOpacityHover']) ? $play_btn['backgroundOpacityHover'] : 1)));
				}
				if (isset($play_btn['borderHover']) && !empty($play_btn['borderHover'])) {
					$css->add_property('border-color', $css->render_color($play_btn['borderHover'], (isset($play_btn['borderOpacityHover']) ? $play_btn['borderOpacityHover'] : 1)));
				}
			}
		}

		//popup styles
		if ( isset( $attributes['popup'] ) && is_array( $attributes['popup'] ) && is_array( $attributes['popup'][0] ) ) {
			$popup = $attributes['popup'][0];
			if ( ( isset( $popup['background'] ) && ! empty( $popup['background'] ) ) || isset( $popup['backgroundOpacity'] ) && ! empty( $popup['backgroundOpacity'] ) ) {
				$css->set_selector('.glightbox-kadence-dark.kadence-popup-' . $unique_id . ' .goverlay');
				if ( isset( $popup['background'] ) && ! empty( $popup['background'] ) ) {
					$css->add_property('background', $css->render_color( $popup['background'] ), '');
				}
				if ( isset( $popup['backgroundOpacity'] ) && ! empty( $popup['backgroundOpacity'] ) ) {
					$css->add_property('opacity', $popup['backgroundOpacity'], '');
				}

				$css->set_selector( '.glightbox-container.kadence-popup-' . $unique_id . ' .gclose, .glightbox-container.kadence-popup-' . $unique_id . ' .gnext, .glightbox-container.kadence-popup-' . $unique_id . ' .gprev' );
				if ( isset( $popup['closeBackground'] ) && ! empty( $popup['closeBackground'] ) ) {
					$css->add_property( 'background', $css->render_color( $popup['closeBackground'] ), '' );
				}
			}
			if ( isset( $popup['closeColor'] ) && ! empty( $popup['closeColor'] ) ) {
				$css->set_selector( '.glightbox-container.kadence-popup-' . $unique_id . ' .gclose path, .glightbox-container.kadence-popup-' . $unique_id . ' .gnext path, .glightbox-container.kadence-popup-' . $unique_id . ' .gprev path' );
				$css->add_property( 'fill', $css->render_color( $popup['closeColor'] ) );
			}
			if ( isset( $popup['maxWidth'] ) && ! empty( $popup['maxWidth'] ) ) {
				$css->set_selector( '.glightbox-container.kadence-popup-' . $unique_id . ' .gslide-video, .glightbox-container.kadence-popup-' . $unique_id . ' .gvideo-local' );
				$css->add_property( 'max-width', $popup['maxWidth'] . ( $popup['maxWidthUnit'] ? $popup['maxWidthUnit'] : 'px' ) . ' !important' );
			}
			if ( isset( $popup['maxWidthTablet'] ) && ! empty( $popup['maxWidthTablet'] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.glightbox-container.kadence-popup-' . $unique_id . ' .gslide-video, .glightbox-container.kadence-popup-' . $unique_id . ' .gvideo-local' );
				$css->add_property( 'max-width', $popup['maxWidthTablet'] . ( $popup['maxWidthUnit'] ? $popup['maxWidthUnit'] : 'px' ) . ' !important' );
			}
			if ( isset( $popup['maxWidthMobile'] ) && ! empty( $popup['maxWidthMobile'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.glightbox-container.kadence-popup-' . $unique_id . ' .gslide-video, .glightbox-container.kadence-popup-' . $unique_id . ' .gvideo-local' );
				$css->add_property( 'max-width', $popup['maxWidthMobile'] . ( $popup['maxWidthUnit'] ? $popup['maxWidthUnit'] : 'px' ), 'important' );
			}
		}

		$css->set_media_state( 'desktop' );

		if( isset( $attributes['url'], $attributes['isVimeoPrivate'] ) && strpos( $attributes['url'], 'vimeo.com/') !== false && $attributes['isVimeoPrivate'] ) {
			$css->set_selector( '.kadence-popup-' . $unique_id . ' .vimeo-video .plyr__control--overlaid, .kadence-popup-' . $unique_id . ' .vimeo-video .plyr__poster' );
			$css->add_property( 'display', 'none !important');
		}

		return $css->css_output();
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		if( !empty( $attributes['url'] ) && !empty( $attributes['type'] ) && $attributes['type'] === 'iframe' ) {
			$shorts_prefix_www = 'https://www.youtube.com/shorts/';
			$shorts_prefix = 'https://youtube.com/shorts/';

			if( substr($attributes['url'], 0, strlen($shorts_prefix_www)) === $shorts_prefix_www || substr($attributes['url'], 0, strlen($shorts_prefix)) === $shorts_prefix ) {
				$content = str_replace( $shorts_prefix, 'https://www.youtube.com/watch?v=', $content );
			}
		}

		return $content;
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS file.
		 parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_style( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-glightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/glightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-pro-glight-video-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-glight-video-pop-init.min.js', array( 'kadence-glightbox' ), KADENCE_BLOCKS_VERSION, true );

		$pop_video_array = array(
			'plyr_js'          => KADENCE_BLOCKS_URL . 'includes/assets/js/plyr.min.js',
			'plyr_css'         => KADENCE_BLOCKS_URL . 'includes/assets/css/plyr.min.css',
		);
		wp_localize_script( 'kadence-blocks-pro-glight-video-init', 'kadence_pro_video_pop', $pop_video_array );
	}

	/**
	 * Registers scripts and styles.
	 */
	public function should_register() {
		if ( ! defined( 'KBP_VERSION' ) || ( defined( 'KBP_VERSION' ) && version_compare( KBP_VERSION, '2.6.0', '>' ) ) ) {
			return true;
		}
		return false;
	}
}

Kadence_Blocks_Videopopup_Block::get_instance();
