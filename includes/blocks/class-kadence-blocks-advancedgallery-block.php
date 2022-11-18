<?php
/**
 * Class to Build the Advanced Gallery Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Gallery Block.
 *
 * @category class
 */
class Kadence_Blocks_Advancedgallery_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'advancedgallery';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

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
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		if ( $this->has_style ) {
			if ( ! wp_style_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_style( 'kadence-blocks-' . $this->block_name );
				if ( $inline ) {
					$this->should_render_inline_stylesheet( 'kadence-blocks-' . $this->block_name );
				}
			}
		}
		if ( isset( $attributes['type'] ) && ( 'carousel' === $attributes['type'] || 'fluidcarousel' === $attributes['type'] || 'slider' === $attributes['type'] || 'thumbslider' === $attributes['type'] ) ) {
			$this->enqueue_style( 'kadence-blocks-splide' );
			$this->should_render_inline_stylesheet( 'kadence-blocks-splide' );

			$this->enqueue_script( 'kadence-blocks-splide-init' );

		} elseif ( ! isset( $attributes['type'] ) || ( isset( $attributes['type'] ) && 'masonry' === $attributes['type'] ) ) {
			$this->enqueue_script( 'kadence-blocks-masonry-init' );
		}
		if ( isset( $attributes['linkTo'] ) && 'media' == isset( $attributes['linkTo'] ) && isset( $attributes['lightbox'] ) && 'magnific' === $attributes['lightbox'] ) {
			$this->enqueue_style( 'kadence-simplelightbox-css' );
			$this->should_render_inline_stylesheet( 'kadence-simplelightbox-css' );
			$this->enqueue_script( 'kadence-blocks-simplelightbox-init' );
		}
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		$css->set_selector('.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id );

		if ( isset( $attributes['margin'][0] ) ) {
			$css->render_measure_output( $attributes['margin'][0], 'margin', 'margin', [
				'desktop_key' => 'desk',
				'tablet_key'  => 'tablet',
				'mobile_key'  => 'mobile',
				'unit_key'    => 'marginUnit'
			] );
		}

		if ( isset( $attributes['type'] ) && 'carousel' === $attributes['type'] ) {
			$css->set_selector('.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id );
			$css->add_property( 'overflow', 'hidden' );
		}

		if ( isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][0] ) && is_numeric( $attributes['gutter'][0] ) ) {
			$css->set_selector('.wp-block-kadence-advancedgallery ul.kb-gallery-id-' . $unique_id );
			$css->add_property('margin','-' . ( $attributes['gutter'][0] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
			$css->add_property('padding', ( $attributes['gutter'][0] / 2 ) . 'px' );

			$css->add_property('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
			$css->add_property('margin', '0 -' . ( $attributes['gutter'][0] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-carousel .kt-blocks-carousel-init:not(.slick-initialized) .kb-slide-item');
			$css->add_property('padding', '4px ' . ( $attributes['gutter'][0] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item' );
			$css->add_property('padding', '4px ' . ( $attributes['gutter'][0] ) . 'px 4px 0' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev' );
			$css->add_property('left', ( $attributes['gutter'][0] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next' );
			$css->add_property('right', ( $attributes['gutter'][0] / 2 ) . 'px' );
		}
		
		if ( isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][1] ) && is_numeric( $attributes['gutter'][1] ) ) {
			$css->set_media_state( 'tablet');
			$css->set_selector('.wp-block-kadence-advancedgallery ul.kb-gallery-id-' . $unique_id );
			$css->add_property('margin', ' -' . ( $attributes['gutter'][1] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
			$css->add_property('padding', ( $attributes['gutter'][1] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
			$css->set_selector('margin', '0 -' . ( $attributes['gutter'][1] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kt-blocks-carousel-init:not(.slick-initialized) .kb-slide-item' );
			$css->set_selector('padding', '4px ' . ( $attributes['gutter'][1] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item' );
			$css->set_selector('padding', '4px ' . ( $attributes['gutter'][1] ) . 'px 4px 0' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev' );
			$css->set_selector('left', ( $attributes['gutter'][1] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next' );
			$css->set_selector('right', ( $attributes['gutter'][1] / 2 ) . 'px' );
			$css->set_media_state( 'desktop');

		}

		if ( isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][2] ) && is_numeric( $attributes['gutter'][2] ) ) {
			$css->set_media_state( 'mobile');
			$css->set_selector('.wp-block-kadence-advancedgallery ul.kb-gallery-id-' . $unique_id );
			$css->add_property('margin', '-' . ( $attributes['gutter'][2] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
			$css->add_property('padding',( $attributes['gutter'][2] / 2 ) . 'px' );

			$css->add_property('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
			$css->add_property('margin', '0 -' . ( $attributes['gutter'][2] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kt-blocks-carousel-init:not(.slick-initialized) .kb-slide-item' );
			$css->add_property('padding', '4px ' . ( $attributes['gutter'][2] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item' );
			$css->add_property('padding', '4px ' . ( $attributes['gutter'][2] ) . 'px 4px 0' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev' );
			$css->add_property('left', ( $attributes['gutter'][2] / 2 ) . 'px' );

			$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next' );
			$css->add_property('right', ( $attributes['gutter'][2] / 2 ) . 'px' );
			$css->set_media_state( 'desktop');

		}

		if ( isset( $attributes['type'] ) && 'fluidcarousel' === $attributes['type'] && isset( $attributes['carouselHeight'] ) && is_array( $attributes['carouselHeight'] ) ) {
			if ( isset( $attributes['carouselHeight'][0] ) && is_numeric( $attributes['carouselHeight'][0] ) ) {
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img' );
				$css->add_property('height', $attributes['carouselHeight'][0] . 'px' );

			}
			if ( isset( $attributes['carouselHeight'][1] ) && is_numeric( $attributes['carouselHeight'][1] ) ) {
				$css->set_media_state( 'tablet');
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img' );
				$css->add_property('height', $attributes['carouselHeight'][1] . 'px' );


			}
			if ( isset( $attributes['carouselHeight'][2] ) && is_numeric( $attributes['carouselHeight'][2] ) ) {
				$css->set_media_state( 'mobile');
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img' );
				$css->add_property('height', $attributes['carouselHeight'][2] . 'px' );
			}

			$css->set_media_state( 'desktop');
		}

		if ( isset( $attributes['type'] ) && 'tiles' === $attributes['type'] && isset( $attributes['carouselHeight'] ) && is_array( $attributes['carouselHeight'] ) ) {
			if ( isset( $attributes['carouselHeight'][0] ) && is_numeric( $attributes['carouselHeight'][0] ) ) {
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles > .kadence-blocks-gallery-item' );
				$css->add_property('height', $attributes['carouselHeight'][0] . 'px' );
			}
			if ( isset( $attributes['carouselHeight'][1] ) && is_numeric( $attributes['carouselHeight'][1] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles > .kadence-blocks-gallery-item' );
				$css->add_property('height', $attributes['carouselHeight'][1] . 'px' );
			}
			if ( isset( $attributes['carouselHeight'][2] ) && is_numeric( $attributes['carouselHeight'][2] ) ) {
				$css->set_media_state('mobile');
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles > .kadence-blocks-gallery-item' );
				$css->add_property('height', $attributes['carouselHeight'][2] . 'px' );
			}

			$css->set_media_state( 'desktop');
		}

		if ( isset( $attributes['imageRadius'] ) && is_array( $attributes['imageRadius'] ) && isset( $attributes['imageRadius'][0] ) && is_numeric( $attributes['imageRadius'][0] ) ) {
			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kb-gal-image-radius' );
			$css->add_property('border-radius', $attributes['imageRadius'][0] . 'px ' . ( is_numeric( $attributes['imageRadius'][1] ) ? $attributes['imageRadius'][1] : 0 ) . 'px ' . ( is_numeric( $attributes['imageRadius'][2] ) ? $attributes['imageRadius'][2] : 0 ) . 'px ' . ( is_numeric( $attributes['imageRadius'][3] ) ? $attributes['imageRadius'][3] : 0 ) . 'px' );
		}

		if ( isset( $attributes['displayShadow'] ) && ! empty( $attributes['displayShadow'] ) && true === $attributes['displayShadow'] ) {
			$css->set_selector('.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id );
			$css->add_property('overflow', 'visible' );

			if ( ! isset( $attributes['shadow'] ) ) {
				$attributes['shadow'] = array();
				$attributes['shadow'][0] = array(
					'hOffset' => 4,
					'vOffset'=> 2,
					'blur' => 14,
					'spread' => 0,
					'color' => '#000000',
					'opacity' => 0.2
				);
			}
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && is_array( $attributes['shadow'][ 0 ] ) ) {
				$shadow = $attributes['shadow'][ 0 ];
				$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kb-gal-image-radius' );
				$css->add_property('box-shadow', $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $css->render_color( $shadow['color'], $shadow['opacity'] ) );
			}
			if ( isset( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'][ 0 ] ) ) {
				$shadow_hover = $attributes['shadowHover'][ 0 ];
				$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item:hover .kb-gal-image-radius' );
				$css->add_property('box-shadow', $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $css->render_color( $shadow_hover['color'], $shadow_hover['opacity'] ) );

			} else {
				$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item:hover .kb-gal-image-radius' );
				$css->add_property('box-shadow', '4px 2px 14px 0px rgba(0,0,0,0.2)' );

			}
		}

		if ( isset( $attributes['showCaption'] ) && true === $attributes['showCaption'] && isset( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'][0] ) ) {
			$caption_font = $attributes['captionStyles'][0];
			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption' );
			if ( isset( $caption_font['color'] ) && ! empty( $caption_font['color'] ) ) {
				$css->add_property('color', $css->render_color( $caption_font['color'] ) );
			}
			if ( isset( $caption_font['background'] ) && ! empty( $caption_font['background'] ) ) {
				$css->add_property('background', 'linear-gradient( 0deg, ' . $css->render_color( $caption_font['background'], ( isset( $caption_font['backgroundOpacity'] ) && is_numeric(  $caption_font['backgroundOpacity'] ) ) ?  $caption_font['backgroundOpacity'] : '0.5' ) . ' 0, ' . $css->render_color( $caption_font['background'], 0 ) . ' 100% )' );
			}
			if ( isset( $caption_font['size'] ) && is_array( $caption_font['size'] ) && ! empty( $caption_font['size'][0] ) ) {
				$css->add_property('font-size', $caption_font['size'][0] . ( ! isset( $caption_font['sizeType'] ) ? 'px' : $caption_font['sizeType'] ) );
			}
			if ( isset( $caption_font['lineHeight'] ) && is_array( $caption_font['lineHeight'] ) && ! empty( $caption_font['lineHeight'][0] ) ) {
				$css->add_property('line-height', $caption_font['lineHeight'][0] . ( ! isset( $caption_font['lineType'] ) ? 'px' : $caption_font['lineType'] ) );
			}
			if ( isset( $caption_font['letterSpacing'] ) && ! empty( $caption_font['letterSpacing'] ) ) {
				$css->add_property('letter-spacing', $caption_font['letterSpacing'] . 'px' );
			}
			if ( isset( $caption_font['textTransform'] ) && ! empty( $caption_font['textTransform'] ) ) {
				$css->add_property('text-transform', $caption_font['textTransform'] );
			}
			if ( isset( $caption_font['family'] ) && ! empty( $caption_font['family'] ) ) {
				$css->add_property('font-family', $caption_font['family'] );
			}
			if ( isset( $caption_font['style'] ) && ! empty( $caption_font['style'] ) ) {
				$css->add_property('font-style', $caption_font['style'] );
			}
			if ( isset( $caption_font['weight'] ) && ! empty( $caption_font['weight'] ) ) {
				$css->add_property('font-weight', $caption_font['weight'] );
			}

			if ( isset( $caption_font['background'] ) && ! empty( $caption_font['background'] ) ) {
				$css->set_selector('.kb-gallery-caption-style-cover-hover.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption, .kb-gallery-caption-style-below.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption' );
				$css->add_property('background', $css->render_color( $caption_font['background'], ( isset( $caption_font['backgroundOpacity'] ) && is_numeric(  $caption_font['backgroundOpacity'] ) ) ?  $caption_font['backgroundOpacity'] : '0.5' ) );
			}
		}

		if ( isset( $attributes['showCaption'] ) && true === $attributes['showCaption'] && isset( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'] ) && isset( $attributes['captionStyles'][0] ) && is_array( $attributes['captionStyles'][0] ) && ( ( isset( $attributes['captionStyles'][0]['size'] ) && is_array( $attributes['captionStyles'][0]['size'] ) && isset( $attributes['captionStyles'][0]['size'][1] ) && ! empty( $attributes['captionStyles'][0]['size'][1] ) ) || ( isset( $attributes['captionStyles'][0]['lineHeight'] ) && is_array( $attributes['captionStyles'][0]['lineHeight'] ) && isset( $attributes['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption' );
			if ( isset( $attributes['captionStyles'][0]['size'][1] ) && ! empty( $attributes['captionStyles'][0]['size'][1] ) ) {
				$css->add_property('font-size', $attributes['captionStyles'][0]['size'][1] . ( ! isset( $attributes['captionStyles'][0]['sizeType'] ) ? 'px' : $attributes['captionStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][1] ) ) {
				$css->add_property('line-height', $attributes['captionStyles'][0]['lineHeight'][1] . ( ! isset( $attributes['captionStyles'][0]['lineType'] ) ? 'px' : $attributes['captionStyles'][0]['lineType'] ) );
			}

			$css->set_media_state( 'desktop' );
		}

		if ( isset( $attributes['showCaption'] ) && true === $attributes['showCaption'] && isset( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'] ) && isset( $attributes['captionStyles'][0] ) && is_array( $attributes['captionStyles'][0] ) && ( ( isset( $attributes['captionStyles'][0]['size'] ) && is_array( $attributes['captionStyles'][0]['size'] ) && isset( $attributes['captionStyles'][0]['size'][2] ) && ! empty( $attributes['captionStyles'][0]['size'][2] ) ) || ( isset( $attributes['captionStyles'][0]['lineHeight'] ) && is_array( $attributes['captionStyles'][0]['lineHeight'] ) && isset( $attributes['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector('.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption' );
			if ( isset( $attributes['captionStyles'][0]['size'][2] ) && ! empty( $attributes['captionStyles'][0]['size'][2] ) ) {
				$css->add_property('font-size', $attributes['captionStyles'][0]['size'][2] . ( ! isset( $attributes['captionStyles'][0]['sizeType'] ) ? 'px' : $attributes['captionStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][2] ) ) {
				$css->add_property('line-height', $attributes['captionStyles'][0]['lineHeight'][2] . ( ! isset( $attributes['captionStyles'][0]['lineType'] ) ? 'px' : $attributes['captionStyles'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}

		return $css->css_output();
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_style( 'kadence-blocks-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-blocks-splide.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-simplelightbox-css', KADENCE_BLOCKS_URL . 'includes/assets/css/simplelightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-blocks-splide', KADENCE_BLOCKS_URL . 'includes/assets/js/splide.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-splide-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-splide-init.min.js', array( 'kadence-blocks-splide' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-masonry-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-masonry-init.min.js', array( 'masonry' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-simplelightbox-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-gallery-simple-init.min.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );

	}
}

Kadence_Blocks_Advancedgallery_Block::get_instance();
