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

		// Render pro styles
		if( class_exists( 'Kadence_Blocks_Pro' ) && class_exists( 'Kadence_Blocks_Pro_Video_Popup_Block' ) ) {
			$pro_videopopup = new Kadence_Blocks_Pro_Video_Popup_Block();
			$pro_videopopup->build_css( $attributes, $css, $unique_id, $unique_style_id );
		}

		if ( ! empty( $attributes['maxWidth'] ) ) {
			$css->set_selector('.kadence-video-popup' . $unique_id . ' .kadence-video-popup-wrap' );
			$css->add_property('max-width', $attributes['maxWidth'] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) . ';');
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

		//popup styles
		if ( isset( $attributes['popup'] ) && is_array( $attributes['popup'] ) && is_array( $attributes['popup'][0] ) ) {
			$popup = $attributes['popup'][0];
			if ( ( isset( $popup['background'] ) && ! empty( $popup['background'] ) ) || isset( $popup['backgroundOpacity'] ) && ! empty( $popup['backgroundOpacity'] ) ) {
				$css->set_selector('.glightbox-kadence-dark.kadence-popup-' . $unique_id . ' .goverlay');
				if ( isset( $popup['background'] ) && ! empty( $popup['background'] ) ) {
					$css->add_property('background', $css->render_color( $popup['background'] ) );
				}
				if ( isset( $popup['backgroundOpacity'] ) && ! empty( $popup['backgroundOpacity'] ) ) {
					$css->add_property('opacity', $popup['backgroundOpacity'] );
				}

				$css->set_selector( '.glightbox-container.kadence-popup-' . $unique_id . ' .gclose, .glightbox-container.kadence-popup-' . $unique_id . ' .gnext, .glightbox-container.kadence-popup-' . $unique_id . ' .gprev' );
				if ( isset( $popup['closeBackground'] ) && ! empty( $popup['closeBackground'] ) ) {
					$css->add_property( 'background', $css->render_color( $popup['closeBackground'] ) );
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
	 * Returns if this block should register or not.
	 */
	public function should_register() {
		//this block was moved to here from pro after this version
		if ( $this->get_pro_version() === null || ( version_compare( $this->get_pro_version(), '2.6.0', '>' ) ) ) {
			return true;
		}
		return false;
	}
}

Kadence_Blocks_Videopopup_Block::get_instance();
