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
	 * Block determines if generic scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Block determines if generic styles need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = true;

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
		if ( isset( $attributes['type'] ) && ( 'tiles' === $attributes['type'] || 'thumbslider' === $attributes['type'] ) ) {
			if ( wp_style_is( 'kadence-blocks-gallery-pro', 'registered' ) ) {
				$this->enqueue_style( 'kadence-blocks-gallery-pro' );
				$this->should_render_inline_stylesheet( 'kadence-blocks-gallery-pro' );
			}
		}
		if ( isset( $attributes['linkTo'] ) && 'media' == isset( $attributes['linkTo'] ) && isset( $attributes['lightbox'] ) && 'magnific' === $attributes['lightbox'] ) {
			$this->enqueue_style( 'kadence-glightbox' );
			$this->should_render_inline_stylesheet( 'kadence-glightbox' );
			$this->enqueue_script( 'kadence-blocks-glight-init' );
		}
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
		$updated_version = ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ? true : false;
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$gallery_type = ! empty( $attributes['type'] ) ? $attributes['type'] : 'masonry';

		$css->set_selector('.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id );

		if ( isset( $attributes['margin'][0] ) ) {
			// Fix for this margin unit being in a non-standard locaiton in array, should be updated.
			$margin_unit = ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' );
			$css->render_measure_output(
				array_merge( $attributes['margin'][0], array( 'marginType' => $margin_unit ) ),
				'margin',
				'margin',
				array(
					'desktop_key' => 'desk',
					'tablet_key'  => 'tablet',
					'mobile_key'  => 'mobile',
				)
			);
		}
		$css->render_measure_output(
			$attributes,
			'padding',
			'padding',
			array(
				'unit_key' => 'paddingUnit',
			)
		);

		if ( isset( $attributes['type'] ) && 'carousel' === $attributes['type'] ) {
			$css->set_selector('.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id );
			$css->add_property( 'overflow', 'hidden' );
		}

		$desk_gutter = ( $css->is_number( $attributes['gutter'][0] ) ? $attributes['gutter'][0] : 10 );
		$gutter_unit = ! empty( $attributes['gutterUnit'] ) ? $attributes['gutterUnit'] : 'px';
		// Masonry.
		if ( 'masonry' === $gallery_type ) {
			$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-masonry.kb-gallery-id-' . $unique_id );
			$css->add_property('margin','-' . ( $desk_gutter / 2 ) . $gutter_unit );
			$css->set_selector('.kb-gallery-type-masonry.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
			$css->add_property('padding', ( $desk_gutter / 2 ) . $gutter_unit );
		} else if ( 'grid' === $gallery_type ) {
			// Grid.
			$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-grid.kb-gallery-id-' . $unique_id );
			$css->add_property('margin','-' . ( $desk_gutter / 2 ) . $gutter_unit );
			$css->set_selector('.kb-gallery-type-grid.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
			$css->add_property('padding', ( $desk_gutter / 2 ) . $gutter_unit );
		} else if ( 'tiles' === $gallery_type ) {
			// Tiles.
			$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-' . $unique_id );
			$css->add_property('margin','-' . ( $desk_gutter / 2 ) . $gutter_unit );
			$css->set_selector('.kb-gallery-type-tiles.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
			$css->add_property('padding', ( $desk_gutter / 2 ) . $gutter_unit );
		} else if ( 'carousel' === $gallery_type ) {
			// Carousel.
			if ( ! $updated_version ) {
				$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
				$css->add_property('margin', '0 -' . ( $desk_gutter / 2 ) . $gutter_unit );

				$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item');
				$css->add_property('padding', '4px ' . ( $desk_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev' );
				$css->add_property('left', ( $desk_gutter / 2 ) . $gutter_unit );

				$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next' );
				$css->add_property('right', ( $desk_gutter / 2 ) . $gutter_unit );
			} else {
				$css->set_selector( '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init:not( .splide-initialized )' );
				$css->add_property( 'margin-left', '-' . ( $desk_gutter / 2 ) . $gutter_unit );
				$css->add_property( 'margin-right', '-' . ( $desk_gutter / 2 ) . $gutter_unit );

				$css->set_selector( '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init:not( .splide-initialized ) .kb-slide-item' );
				$css->add_property( 'padding-left', ( $desk_gutter / 2 ) . $gutter_unit );
				$css->add_property( 'padding-right', ( $desk_gutter / 2 ) . $gutter_unit );
			}
		} else if ( 'fluidcarousel' === $gallery_type ) {
			if ( ! $updated_version ) {
				// Fluid Carousel.
				$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item');
				$css->add_property('padding', '4px ' . ( $desk_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item' );
				$css->add_property('padding', '4px ' . ( $desk_gutter ) . $gutter_unit . ' 4px 0' );
			}
		} else if ( 'thumbslider' === $gallery_type ) {
			if ( $updated_version ) {
				// Thumbnail.
				$css->set_selector('.kb-gallery-type-thumbslider.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel-init ');
				$css->add_property('margin-bottom', $desk_gutter . $gutter_unit );
			}
		}
		if ( $css->is_number( $attributes['gutter'][1] ) ) {
			$tablet_gutter = $attributes['gutter'][1];
			$css->set_media_state( 'tablet');
			// Masonry.
			if ( 'masonry' === $gallery_type ) {
				$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-masonry.kb-gallery-id-' . $unique_id );
				$css->add_property('margin','-' . ( $tablet_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-masonry.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
				$css->add_property('padding', ( $tablet_gutter / 2 ) . $gutter_unit );
			} else if ( 'grid' === $gallery_type ) {
				// Grid.
				$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-grid.kb-gallery-id-' . $unique_id );
				$css->add_property('margin','-' . ( $tablet_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-grid.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
				$css->add_property('padding', ( $tablet_gutter / 2 ) . $gutter_unit );
			} else if ( 'tiles' === $gallery_type ) {
				// Tiles.
				$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-' . $unique_id );
				$css->add_property('margin','-' . ( $tablet_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-tiles.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
				$css->add_property('padding', ( $tablet_gutter / 2 ) . $gutter_unit );
			} else if ( 'carousel' === $gallery_type ) {
				// Carousel.
				if ( ! $updated_version ) {
					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
					$css->add_property('margin', '0 -' . ( $tablet_gutter / 2 ) . $gutter_unit );

					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item');
					$css->add_property('padding', '4px ' . ( $tablet_gutter / 2 ) . $gutter_unit );
					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev' );
					$css->add_property('left', ( $tablet_gutter / 2 ) . $gutter_unit );

					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next' );
					$css->add_property('right', ( $tablet_gutter / 2 ) . $gutter_unit );
				} else {
					$css->set_selector( '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init:not( .splide-initialized )' );
					$css->add_property( 'margin-left', '-' . ( $tablet_gutter / 2 ) . $gutter_unit );
					$css->add_property( 'margin-right', '-' . ( $tablet_gutter / 2 ) . $gutter_unit );

					$css->set_selector( '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init:not( .splide-initialized ) .kb-slide-item' );
					$css->add_property( 'padding-left', ( $tablet_gutter / 2 ) . $gutter_unit );
					$css->add_property( 'padding-right', ( $tablet_gutter / 2 ) . $gutter_unit );
				}
			} else if ( 'fluidcarousel' === $gallery_type ) {
				if ( ! $updated_version ) {
					// Fluid Carousel.
					$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item');
					$css->add_property('padding', '4px ' . ( $tablet_gutter / 2 ) . $gutter_unit );
					$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item' );
					$css->add_property('padding', '4px ' . ( $tablet_gutter ) . $gutter_unit . ' 4px 0' );
				}
			} else if ( 'thumbslider' === $gallery_type ) {
				if ( $updated_version ) {
					// Thumbnail.
					$css->set_selector('.kb-gallery-type-thumbslider.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel-init ');
					$css->add_property('margin-bottom', $tablet_gutter . $gutter_unit );
				}
			}
			$css->set_media_state( 'desktop');

		}

		if ( isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][2] ) && is_numeric( $attributes['gutter'][2] ) ) {
			$css->set_media_state( 'mobile');
			$mobile_gutter = $attributes['gutter'][2];
			// Masonry.
			if ( 'masonry' === $gallery_type ) {
				$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-masonry.kb-gallery-id-' . $unique_id );
				$css->add_property('margin','-' . ( $mobile_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-masonry.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
				$css->add_property('padding', ( $mobile_gutter / 2 ) . $gutter_unit );
			} else if ( 'grid' === $gallery_type ) {
				// Grid.
				$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-grid.kb-gallery-id-' . $unique_id );
				$css->add_property('margin','-' . ( $mobile_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-grid.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
				$css->add_property('padding', ( $mobile_gutter / 2 ) . $gutter_unit );
			} else if ( 'tiles' === $gallery_type ) {
				// Tiles.
				$css->set_selector('.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-' . $unique_id );
				$css->add_property('margin','-' . ( $mobile_gutter / 2 ) . $gutter_unit );
				$css->set_selector('.kb-gallery-type-tiles.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item' );
				$css->add_property('padding', ( $mobile_gutter / 2 ) . $gutter_unit );
			} else if ( 'carousel' === $gallery_type ) {
				// Carousel.
				if ( ! $updated_version ) {
					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
					$css->add_property('margin', '0 -' . ( $mobile_gutter / 2 ) . $gutter_unit );

					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item');
					$css->add_property('padding', '4px ' . ( $mobile_gutter / 2 ) . $gutter_unit );
					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev' );
					$css->add_property('left', ( $mobile_gutter / 2 ) . $gutter_unit );

					$css->set_selector('.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next' );
					$css->add_property('right', ( $mobile_gutter / 2 ) . $gutter_unit );
				} else {
					$css->set_selector( '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init:not( .splide-initialized )' );
					$css->add_property( 'margin-left', '-' . ( $mobile_gutter / 2 ) . $gutter_unit );
					$css->add_property( 'margin-right', '-' . ( $mobile_gutter / 2 ) . $gutter_unit );

					$css->set_selector( '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init:not( .splide-initialized ) .kb-slide-item' );
					$css->add_property( 'padding-left', ( $mobile_gutter / 2 ) . $gutter_unit );
					$css->add_property( 'padding-right', ( $mobile_gutter / 2 ) . $gutter_unit );
				}
			} else if ( 'fluidcarousel' === $gallery_type ) {
				if ( ! $updated_version ) {
					// Fluid Carousel.
					$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item');
					$css->add_property('padding', '4px ' . ( $mobile_gutter / 2 ) . $gutter_unit );
					$css->set_selector('.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item' );
					$css->add_property('padding', '4px ' . ( $mobile_gutter ) . $gutter_unit . ' 4px 0' );
				}
			} else if ( 'thumbslider' === $gallery_type ) {
				if ( $updated_version ) {
					// Thumbnail.
					$css->set_selector('.kb-gallery-type-thumbslider.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel-init ');
					$css->add_property('margin-bottom', $mobile_gutter . $gutter_unit );
				}
			}
			$css->set_media_state( 'desktop');

		}

		if ( isset( $attributes['type'] ) && 'fluidcarousel' === $attributes['type'] && isset( $attributes['carouselHeight'] ) && is_array( $attributes['carouselHeight'] ) ) {
			if ( isset( $attributes['carouselHeight'][0] ) && is_numeric( $attributes['carouselHeight'][0] ) ) {
				$css->set_selector('.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img' );
				$css->add_property('height', $attributes['carouselHeight'][0] . 'px' );

			}
			if ( isset( $attributes['carouselHeight'][1] ) && is_numeric( $attributes['carouselHeight'][1] ) ) {
				$css->set_media_state( 'tablet' );
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
			if ( ! empty( $caption_font['size'][0] ) ) {
				$css->add_property('font-size', $css->get_font_size( $caption_font['size'][0], ( ! isset( $caption_font['sizeType'] ) ? 'px' : $caption_font['sizeType'] ) ) );
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
				$css->add_property('font-size', $css->get_font_size( $attributes['captionStyles'][0]['size'][1], ( ! isset( $attributes['captionStyles'][0]['sizeType'] ) ? 'px' : $attributes['captionStyles'][0]['sizeType'] ) ) );
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
				$css->add_property('font-size', $css->get_font_size( $attributes['captionStyles'][0]['size'][2], ( ! isset( $attributes['captionStyles'][0]['sizeType'] ) ? 'px' : $attributes['captionStyles'][0]['sizeType'] ) ) );
			}
			if ( isset( $attributes['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][2] ) ) {
				$css->add_property('line-height', $attributes['captionStyles'][0]['lineHeight'][2] . ( ! isset( $attributes['captionStyles'][0]['lineType'] ) ? 'px' : $attributes['captionStyles'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
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
		if ( ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ) {
			$images       = ( ! empty( $attributes['imagesDynamic'] ) ? $attributes['imagesDynamic'] : false );
			if ( ! $images ) {
				return $content;
			}
			$unique_id    = ( ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : 'dynamic' );
			$type         = ( ! empty( $attributes['type'] ) ? $attributes['type'] : 'masonry' );
			$slider_fade  = ( ! empty( $attributes['slideType'] ) && 'fade' == $attributes['slideType'] );
			$image_filter = ( ! empty( $attributes['imageFilter'] ) ? $attributes['imageFilter'] : 'none' );
			$dot_style    = ( ! empty( $attributes['dotStyle'] ) ? $attributes['dotStyle'] : 'dark' );
			$arrow_style  = ( ! empty( $attributes['arrowStyle'] ) ? $attributes['arrowStyle'] : 'dark' );
			$link_to      = ( ! empty( $attributes['linkTo'] ) ? $attributes['linkTo'] : 'none' );
			$lightbox     = ( ! empty( $attributes['lightbox'] ) ? $attributes['lightbox'] : 'none' );
			$lightbox_cap = ( ! empty( $attributes['lightboxCaption'] ) && $attributes['lightboxCaption'] ? true : false );
			$autoplay     = ( ! empty( $attributes['autoPlay'] ) && $attributes['autoPlay'] ? true : false );
			$trans_speed  = ( ! empty( $attributes['transSpeed'] ) ? $attributes['transSpeed'] : 400 );
			$auto_speed   = ( ! empty( $attributes['autoSpeed'] ) ? $attributes['autoSpeed'] : 7000 );
			$slides_sc    = ( ! empty( $attributes['slidesScroll'] ) ? $attributes['slidesScroll'] : '1' );
			$columns_xxl  = ( ! empty( $attributes['columns'][0] ) ? $attributes['columns'][0] : '3' );
			$columns_xl   = ( ! empty( $attributes['columns'][1] ) ? $attributes['columns'][1] : '3' );
			$columns_md   = ( ! empty( $attributes['columns'][2] ) ? $attributes['columns'][2] : '3' );
			$columns_sm   = ( ! empty( $attributes['columns'][3] ) ? $attributes['columns'][3] : '2' );
			$columns_xs   = ( ! empty( $attributes['columns'][4] ) ? $attributes['columns'][4] : '1' );
			$columns_ss   = ( ! empty( $attributes['columns'][5] ) ? $attributes['columns'][5] : '1' );
			$tcolumns_xxl = ( ! empty( $attributes['thumbnailColumns'][0] ) ? $attributes['thumbnailColumns'][0] : '4' );
			$tcolumns_xl  = ( ! empty( $attributes['thumbnailColumns'][1] ) ? $attributes['thumbnailColumns'][1] : '4' );
			$tcolumns_md  = ( ! empty( $attributes['thumbnailColumns'][2] ) ? $attributes['thumbnailColumns'][2] : '4' );
			$tcolumns_sm  = ( ! empty( $attributes['thumbnailColumns'][3] ) ? $attributes['thumbnailColumns'][3] : '4' );
			$tcolumns_xs  = ( ! empty( $attributes['thumbnailColumns'][4] ) ? $attributes['thumbnailColumns'][4] : '4' );
			$tcolumns_ss  = ( ! empty( $attributes['thumbnailColumns'][5] ) ? $attributes['thumbnailColumns'][5] : '4' );
			$car_align    = ( isset( $attributes['carouselAlign'] ) && false === $attributes['carouselAlign'] ? false : true );
			$gap          = ( isset( $attributes['gutter'][0] ) && is_numeric( $attributes['gutter'][0] ) ? $attributes['gutter'][0] : '10' );
			$tablet_gap   = ( isset( $attributes['gutter'][1] ) && is_numeric( $attributes['gutter'][1] ) ? $attributes['gutter'][1] : $gap );
			$mobile_gap   = ( isset( $attributes['gutter'][2] ) && is_numeric( $attributes['gutter'][2] ) ? $attributes['gutter'][2] : $tablet_gap );
			$gap_unit     = ( ! empty( $attributes['gutterUnit'] ) ? $attributes['gutterUnit'] : 'px' );
			if ( 'slider' === $type && is_array( $images ) && 1 === count( $images ) ) {
				$arrow_style = 'none';
				//$dot_style   = 'none';
			}
			$outer_classes = array( 'kb-gallery-wrap-id-' . $unique_id );
			$outer_classes[] = ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : 'alignnone';
			// Gallery Class.
			$gallery_classes = array( 'kb-gallery-ul', 'kb-gallery-non-static' );
			$gallery_classes[] = 'kb-gallery-type-' . esc_attr( $type );
			if ( 'masonry' === $type ) {
				$gallery_classes[] = 'kb-masonry-init';
			}
			if ( isset( $attributes['mobileForceHover'] ) && true === $attributes['mobileForceHover'] ) {
				$gallery_classes[] = 'kb-mobile-force-hover';
			}
			$gallery_classes[] = 'kb-gallery-id-' . esc_attr( $unique_id );
			$gallery_classes[] = 'kb-gallery-caption-style-' . ( ! empty( $attributes['captionStyle'] ) ? esc_attr( $attributes['captionStyle'] ) : 'bottom-hover' );
			$gallery_classes[] = 'kb-gallery-filter-' . ( ! empty( $attributes['imageFilter'] ) ? esc_attr( $attributes['imageFilter'] ) : 'none' );
			if ( 'media' === $link_to && 'magnific' === $lightbox ) {
				$gallery_classes[] = 'kb-gallery-magnific-init';
			}
			$wrapper_args = array(
				'class' => implode( ' ', $outer_classes ),
			);
			if ( ! empty( $attributes['anchor'] ) ) {
				$wrapper_args['id'] = $attributes['anchor'];
			}
			$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
			$content = '';
			switch ( $type ) {
				case 'carousel':
					$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
					$content .= '<div class="kt-blocks-carousel kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . '">';
					$content .= '<div class="kt-blocks-carousel-init kb-gallery-carousel kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-columns-xxl="' . esc_attr( $columns_xxl ) . '" data-columns-xl="' . esc_attr( $columns_xl ) . '" data-columns-md="' . esc_attr( $columns_md ) . '" data-columns-sm="' . esc_attr( $columns_sm ) . '" data-columns-xs="' . esc_attr( $columns_xs ) . '" data-columns-ss="' . esc_attr( $columns_ss ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="' . esc_attr( $slides_sc ) . '" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $tablet_gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $mobile_gap . $gap_unit ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= '<div class="kb-slide-item kb-gallery-carousel-item">';
						$content .= $this->render_gallery_images( $image, $attributes );
						$content .= '</div>';
					}
					$content .= '</div>';
					$content .= '</div>';
					$content .= '</div>';
					break;
				case 'fluidcarousel':
					$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
					$content .= '<div class="kt-blocks-carousel kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . '">';
					$content .= '<div class="kt-blocks-carousel-init kb-blocks-fluid-carousel kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . ( $car_align ? '' : ' kb-carousel-mode-align-left' ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-type="fluidcarousel" data-slider-center-mode="' . esc_attr( ( $car_align ? 'true' : 'false' ) ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $tablet_gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $mobile_gap . $gap_unit ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= '<div class="kb-slide-item kb-gallery-carousel-item">';
						$content .= $this->render_gallery_images( $image, $attributes );
						$content .= '</div>';
					}
					$content .= '</div>';
					$content .= '</div>';
					$content .= '</div>';
					break;
				case 'slider':
					$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
					$content .= '<div class="kt-blocks-carousel kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . '">';
					$content .= '<div class="kt-blocks-carousel-init kb-blocks-slider kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $slider_fade ? 'true' : 'false' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '"data-slider-type="slider"  data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= '<div class="kb-slide-item kb-gallery-slide-item">';
						$content .= $this->render_gallery_images( $image, $attributes );
						$content .= '</div>';
					}
					$content .= '</div>';
					$content .= '</div>';
					$content .= '</div>';
					break;
				case 'thumbslider':
					$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
					$content .= '<div class="kt-blocks-carousel kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . '">';
					$content .= '<div id="kb-slider-' . esc_attr( $unique_id ) . '" class="kt-blocks-carousel-init kb-blocks-slider kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-columns-xxl="' . esc_attr( $tcolumns_xxl ) . '" data-columns-xl="' . esc_attr( $tcolumns_xl ) . '" data-columns-md="' . esc_attr( $tcolumns_md ) . '" data-columns-sm="' . esc_attr( $tcolumns_sm ) . '" data-columns-xs="' . esc_attr( $tcolumns_xs ) . '" data-columns-ss="' . esc_attr( $tcolumns_ss ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $slider_fade ? 'true' : 'false' ) . '" data-slider-dots="false" data-slider-hover-pause="false" data-slider-type="thumbnail" data-slider-nav="kb-thumb-slider-' . esc_attr( $unique_id ) . '"  data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $tablet_gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $mobile_gap . $gap_unit ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= '<div class="kb-slide-item kb-gallery-carousel-item">';
						$content .= $this->render_gallery_images( $image, $attributes );
						$content .= '</div>';
					}
					$content .= '</div>';
					$content .= '<div id="kb-thumb-slider-' . esc_attr( $unique_id ) . '" class="kb-blocks-slider kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $slider_fade ? 'true' : 'false' ) . '" data-slider-dots="false" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-type="thumbnail" data-slider-nav="kb-slider-' . esc_attr( $unique_id ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= '<div class="kb-slide-item kb-gallery-carousel-item">';
						$content .= $this->render_gallery_thumb_images( $image, $attributes );
						$content .= '</div>';
					}
					$content .= '</div>';
					$content .= '</div>';
					$content .= '</div>';
					break;
				case 'tiles':
					$content .= '<ul class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= $this->render_gallery_images( $image, $attributes );
					}
					$content .= '</ul>';
					break;
				default:
					$content .= '<ul class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-item-selector=".kadence-blocks-gallery-item" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '" data-columns-xxl="' . esc_attr( $columns_xxl ) . '" data-columns-xl="' . esc_attr( $columns_xl ) . '" data-columns-md="' . esc_attr( $columns_md ) . '" data-columns-sm="' . esc_attr( $columns_sm ) . '" data-columns-xs="' . esc_attr( $columns_xs ) . '" data-columns-ss="' . esc_attr( $columns_ss ) . '">';
					foreach ( $images as $key => $image ) {
						$content .= $this->render_gallery_images( $image, $attributes );
					}
					$content .= '</ul>';
					break;
			}
			$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
		}
		return $content;
	}
	/**
	 * Get the image srcset.
	 *
	 * @param integer $id the image ID.
	 * @param string  $url the image url.
	 * @param string  $width the image width.
	 * @param string  $height the image height.
	 */
	public function get_image_srcset( $id = null, $url = null, $width = null, $height = null ) {
		if ( empty( $id ) || empty( $url ) || empty( $width ) || empty( $height ) ) {
			return '';
		}
		$image_meta = wp_get_attachment_metadata( $id );
		if ( ! $image_meta ) {
			return '';
		}
		if ( function_exists( 'wp_calculate_image_srcset' ) ) {
			$output = wp_calculate_image_srcset( array( $width, $height ), $url, $image_meta, $id );
		} else {
			$output = '';
		}

		return $output;
	}
	/**
	 * Get the image srcset output.
	 *
	 * @param integer $id the image ID.
	 * @param string  $url the image url.
	 * @param string  $width the image width.
	 * @param string  $height the image height.
	 */
	public function get_image_srcset_output( $id = null, $url = null, $width = null, $height = null ) {
		$img_srcset = $this->get_image_srcset( $id, $url, $width, $height );
		if ( ! empty( $img_srcset ) ) {
			$output = 'data-splide-lazy-srcset="' . esc_attr( $img_srcset ) . '" sizes="(max-width: ' . esc_attr( $width ) . 'px) 100vw, ' . esc_attr( $width ) . 'px"';
		} else {
			$output = '';
		}
		return $output;
	}
	/**
	 * Output Gallery image markeup.
	 */
	public function render_gallery_images( $image, $attributes ) {
		$type          = ( ! empty( $attributes['type'] ) ? $attributes['type'] : 'masonry' );
		$image_ratio   = ( ! empty( $attributes['imageRatio'] ) ? $attributes['imageRatio'] : 'land32' );
		$show_caption  = ( ! empty( $attributes['showCaption'] ) && $attributes['showCaption'] ? true : false );
		$lazy_load     = ( ! empty( $attributes['lazyLoad'] ) && $attributes['lazyLoad'] ? true : false );
		$caption_style = ( ! empty( $attributes['captionStyle'] ) ? $attributes['captionStyle'] : 'bottom-hover' );
		$link_to       = ( ! empty( $attributes['linkTo'] ) ? $attributes['linkTo'] : 'none' );
		$link_target   = ( ! empty( $image['linkTarget'] ) ? $image['linkTarget'] : '' );
		$link_target   = apply_filters( 'kadence_blocks_pro_dynamic_gallery_link_target', $link_target, $image, $attributes );
		$lightbox      = ( ! empty( $attributes['lightbox'] ) ? $attributes['lightbox'] : 'none' );
		$lightbox_cap = ( ! empty( $attributes['lightboxCaption'] ) && $attributes['lightboxCaption'] ? true : false );
		$image_id = ( ! empty( $image['ID'] ) ? $image['ID'] : '' );
		if ( empty( $image_id ) ) {
			$image_id = ( ! empty( $image['id'] ) ? $image['id'] : '' );
		}
		$caption       = ( ! empty( $image['caption'] ) ? $image['caption'] : '' );
		if ( empty( $caption ) && ! empty( $image_id ) ) {
			$caption_source = wp_get_attachment_caption( $image_id );
			if ( $caption_source ) {
				$caption = $caption_source;
			}
		}
		$rel_attr = '';
		if ( 'custom' === $link_to && '_blank' === $link_target ) {
			$rel_attr = 'noopener noreferrer';
		}
		if ( 'media' === $link_to && 'new_tab' === $lightbox ) {
			$rel_attr = 'noopener noreferrer';
		}
		if ( isset( $image['linkSponsored'] ) && true == $image['linkSponsored'] ) {
			$rel_attr .= ( ! empty( $rel_attr ) ? ' sponsored' : 'sponsored' );
		}
		$caption       = apply_filters( 'kadence_blocks_pro_dynamic_gallery_caption', $caption, $image, $attributes );
		$href = '';
		$image_src  = ( ! empty( $image['thumbUrl'] ) ? $image['thumbUrl'] : $image['url'] );
		$image_full = ( ! empty( $image['fullUrl'] ) ? $image['fullUrl'] : $image['url'] );
		$image_lightbox = ( ! empty( $image['lightUrl'] ) ? $image['lightUrl'] : $image['url'] );
		$image_alt  = ( ! empty( $image['alt'] ) ? $image['alt'] : '' );
		if ( ! empty( $image_id ) ) {
			$image_alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
		}
		if ( empty( $image_alt ) && ! empty( $image['alt'] ) ) {
			$image_alt = $image['alt'];
		}
		switch ( $link_to ) {
			case 'media':
				if ( 'none' !== $lightbox ) {
					$href = ( ! empty( $image_lightbox ) ? $image_lightbox : '' );
				} else {
					$href = ( ! empty( $image_full ) ? $image_full : '' );
				}
				break;
			case 'custom':
				if ( ! empty( $image_id ) && isset( $attributes['kadenceDynamic'] ) && is_array( $attributes['kadenceDynamic'] ) && isset( $attributes['kadenceDynamic']['link'] ) && is_array( $attributes['kadenceDynamic']['link'] ) && isset( $attributes['kadenceDynamic']['link']['enable'] ) && $attributes['kadenceDynamic']['link']['enable'] ) {
					if ( ! empty( $attributes['kadenceDynamic']['link']['field'] ) && strpos( $attributes['kadenceDynamic']['link']['field'], '|' ) !== false ) {
						$field_split = explode( '|', $attributes['kadenceDynamic']['link']['field'], 2 );
						$group = ( isset( $field_split[0] ) && ! empty( $field_split[0] ) ? $field_split[0] : 'post' );
						$field = ( isset( $field_split[1] ) && ! empty( $field_split[1] ) ? $field_split[1] : '' );
					} else {
						$field = '';
						$group = '';
					}
					$args = array(
						'source'       => $image_id,
						'origin'       => 'core',
						'group'        => $group,
						'type'         => 'link',
						'field'        => $field,
						'custom'       => $attributes['kadenceDynamic']['link']['custom'],
						'para'         => $attributes['kadenceDynamic']['link']['para'],
						'force-string' => false,
						'before'       => $attributes['kadenceDynamic']['link']['before'],
						'after'        => null,
						'fallback'     => false,
						'relate'       => ( isset( $blockattr['kadenceDynamic']['link']['relate'] ) ? $blockattr['kadenceDynamic']['link']['relate'] : '' ),
						'relcustom'    => ( isset( $blockattr['kadenceDynamic']['link']['relcustom'] ) ? $blockattr['kadenceDynamic']['link']['relcustom'] : '' ),
					);
					$href = $this->get_content( $args );
				} else {
					$href = ( ! empty( $image['customLink'] ) ? $image['customLink'] : '' );
				}
				break;
			case 'attachment':
				if ( ! empty( $image_id ) ) {
					$href = get_permalink( $image_id );
				}
				break;
		}
		$image_contain_classes = array( 'kb-gallery-image-contain' );
		if ( ( ( 'grid' === $type || 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type ) && ! empty( $image_ratio ) ) || ( 'fluidcarousel' !== $type && 'tiles' !== $type && ! empty( $image['width'] ) && ! empty( $image['height'] ) ) ) {
			$image_contain_classes[] = 'kadence-blocks-gallery-intrinsic';
		}
		if ( ! empty( $image_ratio ) && ( 'grid' === $type || 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type ) ) {
			$image_contain_classes[] = 'kb-gallery-image-ratio-' . $image_ratio;
		}
		$fig_classes = array( 'kb-gallery-figure' );
		if ( ! empty( $href ) ) {
			$fig_classes[] = 'kb-gallery-item-has-link';
		}
		if ( $show_caption ) {
			if ( ! empty( $caption ) ) {
				$fig_classes[] = 'kadence-blocks-gallery-item-has-caption';
			}
		} else {
			$fig_classes[] = 'kadence-blocks-gallery-item-hide-caption';
		}
		if ( ! empty( $image_ratio ) && ( 'grid' === $type || 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type ) ) {
			$image_contain_classes[] = 'kb-has-image-ratio-' . $image_ratio;
		}
		$item_tag = ( ( 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type || 'fluidcarousel' === $type ) ? 'div' : 'li' );
		$fig_tag = ( empty( $href ) && 'below' === $caption_style ? 'figcaption' : 'div' );
		$figcap = '<' . $fig_tag . ' class="kadence-blocks-gallery-item__caption">' . ( ! empty( $caption ) && is_string( $caption ) ? $caption : '' ) . '</' . $fig_tag . '>';
		$image_classes = array( 'wp-image-' . $image_id );
		if ( 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type || 'fluidcarousel' === $type ) {
			$image_classes[] = 'skip-lazy';
		}
		$padding_bottom = '';
		if ( ( 'masonry' === $type ) && ! empty( $image['width'] ) && ! empty( $image['height'] ) ) {
			$padding_bottom = floor( ( $image['height'] / $image['width'] ) * 100 );
		} else if ( ! empty( $image_ratio ) && 'inherit' === $image_ratio && 'grid' === $type && ! empty( $image['width'] ) && ! empty( $image['height'] ) ) {
			$padding_bottom = floor( ( $image['height'] / $image['width'] ) * 100 );
		}
		if ( $lazy_load && ( 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type || 'fluidcarousel' === $type ) ) {
			$img = '<div class="' . esc_attr( implode( ' ', $image_contain_classes ) ) . '" ' . ( ! empty( $padding_bottom ) ? 'style="padding-bottom:' . $padding_bottom . '%;"' : '' ) . '><img src="' . "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201000%20667'%3E%3C/svg%3E" . '"  data-splide-lazy="' . esc_attr( $image_src ) . '" ' . ( ! empty( $image['width'] ) ? 'width="' . $image['width'] . '"' : '' ) . ' ' . ( ! empty( $image['height'] ) ? 'height="' . $image['height'] . '"' : '' ) . ' alt="' . esc_attr( $image_alt ) . '" data-full-image="' . esc_attr( $image_full ) . '" data-light-image="' . esc_attr( $image_full ) . '" ' . $this->get_image_srcset_output( $image_id, $image_src, $image['width'], $image['height'] ) . 'data-id="' . esc_attr( $image_id ) . '" class="' . esc_attr( implode( ' ', $image_classes ) ) . '"/></div>';
		} else {
			$img = '<div class="' . esc_attr( implode( ' ', $image_contain_classes ) ) . '" ' . ( ! empty( $padding_bottom ) ? 'style="padding-bottom:' . $padding_bottom . '%;"' : '' ) . '><img src="' . esc_attr( $image_src ) . '" ' . ( ! empty( $image['width'] ) ? 'width="' . $image['width'] . '"' : '' ) . ' ' . ( ! empty( $image['height'] ) ? 'height="' . $image['height'] . '"' : '' ) . ' alt="' . esc_attr( $image_alt ) . '" data-full-image="' . esc_attr( $image_full ) . '" data-light-image="' . esc_attr( $image_full ) . '" data-id="' . esc_attr( $image_id ) . '" class="' . esc_attr( implode( ' ', $image_classes ) ) . '"/></div>';
		}
		$output = '<' . $item_tag . ' class="kadence-blocks-gallery-item">';
		$output .= '<div class="kadence-blocks-gallery-item-inner">';
		$output .= '<figure class="' . esc_attr( implode( ' ', $fig_classes ) ) . '">';
		if ( ! empty( $href ) ) {
			$output .= '<a href="' . esc_url( $href ) . '"' . ( $link_to === 'media' && $lightbox === 'magnific' && $lightbox_cap && ! empty( $caption ) && is_string( $caption ) ? ' data-description="' . esc_attr( $caption ) . '"' : '' ) . '' . ( $link_to === 'media' && $lightbox === 'magnific' && ! empty( $image_alt ) && is_string( $image_alt ) ? ' data-alt="' . esc_attr( $image_alt ) . '"' : '' ) . ' class="kb-gallery-item-link" ' . ( ( $link_to === 'custom' && '_blank' === $link_target ) || ( $link_to === 'media' && $lightbox === 'new_tab' ) ? 'target="_blank"' : '' ) . ' ' . ( ( $link_to === 'custom' && ! empty( $rel_attr ) ) || ( $link_to === 'media' && ! empty( $rel_attr ) ) ? 'rel="' . esc_attr( $rel_attr ) . '"' : '' ) . '>';
		}
		$output .= '<div class="kb-gal-image-radius" ' . ( ! empty( $padding_bottom ) ? 'style="max-width:' . $image['width'] . 'px;"' : '' ) . '>';
		$output .= $img;
		if ( $show_caption && ! empty( $caption ) && is_string( $caption ) && 'below' !== $caption_style ) {
			$output .= $figcap;
		}
		$output .= '</div>';
		if ( $show_caption && ! empty( $caption ) && is_string( $caption ) && 'below' === $caption_style ) {
			$output .= $figcap;
		}
		if ( ! empty( $href ) ) {
			$output .= '</a>';
		}
		$output .= '</figure>';
		$output .= '</div>';
		$output .= '</' . $item_tag . '>';
		return $output;
	}
	/**
	 * Output Gallery image markeup.
	 */
	public function render_gallery_thumb_images( $image, $attributes ) {
		$type          = ( ! empty( $attributes['type'] ) ? $attributes['type'] : 'masonry' );
		$image_ratio   = ( ! empty( $attributes['thumbnailRatio'] ) ? $attributes['thumbnailRatio'] : 'land32' );
		$image_id = ( ! empty( $image['ID'] ) ? $image['ID'] : '' );
		if ( empty( $image_id ) ) {
			$image_id = ( ! empty( $image['id'] ) ? $image['id'] : '' );
		}
		$image_src = ( ! empty( $image['url'] ) ? $image['url'] : '' );
		$image_alt = ( ! empty( $image['alt'] ) ? $image['alt'] : get_post_meta( $image_id, '_wp_attachment_image_alt', true ) );
		$image_full = ( ! empty( $image['fullUrl'] ) ? $image['fullUrl'] : $image['url'] );
		$image_contain_classes = array( 'kb-gallery-image-contain kadence-blocks-gallery-intrinsic' );
		if ( ! empty( $image_ratio ) ) {
			$image_contain_classes[] = 'kb-gallery-image-ratio-' . $image_ratio;
		}
		$fig_classes = array( 'kb-gallery-figure' );
		if ( ! empty( $image_ratio ) ) {
			$image_contain_classes[] = 'kb-has-image-ratio-' . $image_ratio;
		}
		$padding_bottom = '';
		$img = '<div class="' . esc_attr( implode( ' ', $image_contain_classes ) ) . '" ' . ( ! empty( $padding_bottom ) ? 'style="padding-bottom:' . $padding_bottom . '%;"' : '' ) . '><img src="' . esc_attr( $image_src ) . '" ' . ( ! empty( $image['width'] ) ? 'width="' . $image['width'] . '"' : '' ) . ' ' . ( ! empty( $image['height'] ) ? 'height="' . $image['height'] . '"' : '' ) . ' alt="' . esc_attr( $image_alt ) . '" data-full-image="' . esc_attr( $image_full ) . '" data-light-image="' . esc_attr( $image_full ) . '" data-id="' . esc_attr( $image_id ) . '" class="wp-image-' . esc_attr( $image_id ) . ' skip-lazy"/></div>';
		$output = '<div class="kadence-blocks-gallery-thumb-item">';
		$output .= '<div class="kadence-blocks-gallery-thumb-item-inner">';
		$output .= '<figure class="' . esc_attr( implode( ' ', $fig_classes ) ) . '">';
		$output .= '<div class="kb-gal-image-radius" ' . ( ! empty( $padding_bottom ) ? 'style="max-width:' . $image['width'] . 'px;"' : '' ) . '>';
		$output .= $img;
		$output .= '</div>';
		$output .= '</figure>';
		$output .= '</div>';
		$output .= '</div>';
		return $output;
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

		wp_register_style( 'kad-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kadence-splide.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-blocks-splide.min.css', array( 'kad-splide' ), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-glightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kad-splide', KADENCE_BLOCKS_URL . 'includes/assets/js/splide.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-splide-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-splide-init.min.js', array( 'kad-splide' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-masonry-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-masonry-init.min.js', array( 'masonry' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/glightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-glight-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-gallery-glight-init.min.js', array( 'kadence-glightbox' ), KADENCE_BLOCKS_VERSION, true );
		wp_localize_script(
			'kadence-blocks-glight-init',
			'kb_glightbox',
			array(
				'moreText' => __( 'See more', 'kadence-blocks' ),
			)
		);
	}
}

Kadence_Blocks_Advancedgallery_Block::get_instance();
