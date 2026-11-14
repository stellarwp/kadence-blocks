<?php
/**
 * Class to Build the Advanced Gallery Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore Csvg NODEFDTD NOIMPLIED alignnone arrowstyle dotstyle figcap fluidcarousel glight kses outlinedark outlinelight relcustom tcolumns thumbslider .

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Utils\Cast;

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Advancedgallery_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * Parse images from saved HTML content.
	 *
	 * This extracts image data from the block's saved HTML when the images attribute
	 * is not available (due to source-based attribute parsing only working in the editor).
	 *
	 * @param string $content The saved HTML content of the block.
	 * @return array Array of image data extracted from the HTML.
	 */
	public function parse_images_from_content( $content ) {
		$images = array();

		if ( empty( $content ) ) {
			return $images;
		}

		$doc = new \DOMDocument();
		// Suppress warnings for malformed HTML and load with UTF-8 encoding.
		libxml_use_internal_errors( true );
		$doc->loadHTML( '<?xml encoding="UTF-8">' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();

		$xpath = new \DOMXPath( $doc );

		// Find all gallery items (use word boundary matching to exclude kadence-blocks-gallery-item-inner, etc.).
		$gallery_items = $xpath->query( "//*[contains(concat(' ', normalize-space(@class), ' '), ' kadence-blocks-gallery-item ')]" );

		foreach ( $gallery_items as $item ) {
			// Find the img element within this gallery item.
			$img_nodes = $xpath->query( ".//img", $item );

			if ( $img_nodes->length === 0 ) {
				continue;
			}

			$img = $img_nodes->item( 0 );

			// Extract image data from attributes.
			$image_data = array(
				'url'          => $img->getAttribute( 'data-full-image' ) ?: '',
				'thumbUrl'     => $img->getAttribute( 'src' ) ?: '',
				'lightUrl'     => $img->getAttribute( 'data-light-image' ) ?: '',
				'link'         => $img->getAttribute( 'data-link' ) ?: '',
				'customLink'   => $img->getAttribute( 'data-custom-link' ) ?: '',
				'linkTarget'   => $img->getAttribute( 'data-custom-link-target' ) ?: '',
				'width'        => $img->getAttribute( 'width' ) ?: '',
				'height'       => $img->getAttribute( 'height' ) ?: '',
				'alt'          => $img->getAttribute( 'alt' ) ?: '',
				'id'           => $img->getAttribute( 'data-id' ) ?: '',
				'linkSponsored' => $img->getAttribute( 'data-sponsored' ) ?: '',
				'caption'      => '',
			);

			// Find caption element within this gallery item.
			$caption_nodes = $xpath->query( ".//*[contains(@class, 'kadence-blocks-gallery-item__caption')]", $item );
			if ( $caption_nodes->length > 0 ) {
				$caption_node = $caption_nodes->item( 0 );
				// Get inner HTML of caption.
				$inner_html = '';
				foreach ( $caption_node->childNodes as $child ) {
					$inner_html .= $doc->saveHTML( $child );
				}
				$image_data['caption'] = trim( $inner_html );
			}

			$images[] = $image_data;
		}

		return $images;
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
		if ( empty( $attributes['kbVersion'] ) || $attributes['kbVersion'] < 2 ) {
			if ( strpos( $content, 'data-columns-ss' ) === false && strpos( $content, 'kb-gallery-type-grid' ) !== false ) {
				$content = str_replace( 'data-columns-xs="1"', 'data-columns-xs="1" data-columns-ss="1"', $content );
			}

			// Parse images from content if imagesDynamic is not set.
			// The 'images' attribute uses source-based parsing which only works in the editor,
			// so we need to extract image data from the saved HTML content for frontend rendering.
			if ( empty( $attributes['imagesDynamic'] ) ) {
				$parsed_images = $this->parse_images_from_content( $content );
				if ( ! empty( $parsed_images ) ) {
					$attributes['imagesDynamic'] = $parsed_images;
				}
			}
		}

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
		$arrow_position     = ! empty( $attributes['arrowPosition'] ) ? $attributes['arrowPosition'] : 'center';
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
		$show_pause_button = ( ! empty( $attributes['showPauseButton'] ) && $attributes['showPauseButton'] ? true : false );
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
			$content .= '<div class="kt-blocks-carousel splide kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . ' kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . ' kb-slider-group-' . esc_attr( 'center' !== $arrow_position && 'outside-top' !== $arrow_position && 'outside-bottom' !== $arrow_position ? 'arrows' : 'arrow' ) . ' kb-slider-arrow-position-' . esc_attr( $arrow_position ) . '" data-columns-xxl="' . esc_attr( $columns_xxl ) . '" data-columns-xl="' . esc_attr( $columns_xl ) . '" data-columns-md="' . esc_attr( $columns_md ) . '" data-columns-sm="' . esc_attr( $columns_sm ) . '" data-columns-xs="' . esc_attr( $columns_xs ) . '" data-columns-ss="' . esc_attr( $columns_ss ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="' . esc_attr( $slides_sc ) . '" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $tablet_gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $mobile_gap . $gap_unit ) . '" data-show-pause-button="' . esc_attr( $show_pause_button ? 'true' : 'false' ) . '" data-slider-label="' . esc_attr( __( 'Photo Gallery Carousel', 'kadence-blocks' ) ) . '">';
			$content .= '<div class="splide__track">';
			$content .= '<ul class="kt-blocks-carousel-init kb-gallery-carousel splide__list">';

			foreach ( $images as $key => $image ) {
				$content .= '<li class="kb-slide-item kb-gallery-carousel-item splide__slide">';
				$content .= $this->render_gallery_images( $image, $attributes );
				$content .= '</li>';
			}
			$content .= '</ul>';
			$content .= '</div>';
			if ( $autoplay && $show_pause_button ) {
				$content .= '<button class="kb-gallery-pause-button splide__toggle" type="button" aria-label="' . esc_attr( __( 'Toggle autoplay', 'kadence-blocks' ) ) . '">';
				$content .= '<span class="kb-gallery-pause-icon splide__toggle__pause"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg></span>';
				$content .= '<span class="kb-gallery-play-icon splide__toggle__play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';
				$content .= '</button>';
			}
			$content .= '</div>';
			$content .= '</div>';
			break;
		case 'fluidcarousel':
			$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
			$content .= '<div class="kt-blocks-carousel splide kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . ' kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . ' kb-slider-group-' . esc_attr( 'center' !== $arrow_position && 'outside-top' !== $arrow_position && 'outside-bottom' !== $arrow_position ? 'arrows' : 'arrow' ) . ' kb-slider-arrow-position-' . esc_attr( $arrow_position ) . ( $car_align ? '' : ' kb-carousel-mode-align-left' ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-type="fluidcarousel" data-slider-center-mode="' . esc_attr( ( $car_align ? 'true' : 'false' ) ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $tablet_gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $mobile_gap . $gap_unit ) . '" data-show-pause-button="' . esc_attr( $show_pause_button ? 'true' : 'false' ) . '">';
			$content .= '<div class="splide__track">';
			$content .= '<ul class="kt-blocks-carousel-init kb-blocks-fluid-carousel splide__list">';
			foreach ( $images as $key => $image ) {
				$content .= '<li class="kb-slide-item kb-gallery-carousel-item splide__slide">';
				$content .= $this->render_gallery_images( $image, $attributes );
				$content .= '</li>';
			}
			$content .= '</ul>';
			$content .= '</div>';
			if ( $autoplay && $show_pause_button ) {
				$content .= '<button class="kb-gallery-pause-button splide__toggle" type="button" aria-label="' . esc_attr( __( 'Toggle autoplay', 'kadence-blocks' ) ) . '">';
				$content .= '<span class="kb-gallery-pause-icon splide__toggle__pause"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg></span>';
				$content .= '<span class="kb-gallery-play-icon splide__toggle__play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';
				$content .= '</button>';
			}
			$content .= '</div>';
			$content .= '</div>';
			break;
		case 'slider':
			$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
			$content .= '<div class="kt-blocks-carousel splide kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . ' kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . ' kb-slider-group-' . esc_attr( 'center' !== $arrow_position && 'outside-top' !== $arrow_position && 'outside-bottom' !== $arrow_position ? 'arrows' : 'arrow' ) . ' kb-slider-arrow-position-' . esc_attr( $arrow_position ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $slider_fade ? 'true' : 'false' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-type="slider" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-show-pause-button="' . esc_attr( $show_pause_button ? 'true' : 'false' ) . '">';
			$content .= '<div class="splide__track">';
			$content .= '<ul class="kt-blocks-carousel-init kb-blocks-slider splide__list">';
			foreach ( $images as $key => $image ) {
				$content .= '<li class="kb-slide-item kb-gallery-slide-item splide__slide">';
				$content .= $this->render_gallery_images( $image, $attributes );
				$content .= '</li>';
			}
			$content .= '</ul>';
			$content .= '</div>';
			if ( $autoplay && $show_pause_button ) {
				$content .= '<button class="kb-gallery-pause-button splide__toggle" type="button" aria-label="' . esc_attr( __( 'Toggle autoplay', 'kadence-blocks' ) ) . '">';
				$content .= '<span class="kb-gallery-pause-icon splide__toggle__pause"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg></span>';
				$content .= '<span class="kb-gallery-play-icon splide__toggle__play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';
				$content .= '</button>';
			}
			$content .= '</div>';
			$content .= '</div>';
			break;
		case 'thumbslider':
			$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '">';
			$content .= '<div class="kt-blocks-carousel kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . '">';
			$content .= '<div id="kb-slider-' . esc_attr( $unique_id ) . '" class="kt-blocks-carousel-init splide kb-blocks-slider kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . ' kb-slider-group-' . esc_attr( 'center' !== $arrow_position && 'outside-top' !== $arrow_position && 'outside-bottom' !== $arrow_position ? 'arrows' : 'arrow' ) . ' kb-slider-arrow-position-' . esc_attr( $arrow_position ) . '" data-columns-xxl="' . esc_attr( $tcolumns_xxl ) . '" data-columns-xl="' . esc_attr( $tcolumns_xl ) . '" data-columns-md="' . esc_attr( $tcolumns_md ) . '" data-columns-sm="' . esc_attr( $tcolumns_sm ) . '" data-columns-xs="' . esc_attr( $tcolumns_xs ) . '" data-columns-ss="' . esc_attr( $tcolumns_ss ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $slider_fade ? 'true' : 'false' ) . '" data-slider-dots="false" data-slider-hover-pause="false" data-slider-type="thumbnail" data-slider-nav="kb-thumb-slider-' . esc_attr( $unique_id ) . '"  data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $tablet_gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $mobile_gap . $gap_unit ) . '" data-show-pause-button="' . esc_attr( $show_pause_button ? 'true' : 'false' ) . '">';
			$content .= '<div class="splide__track">';
			$content .= '<ul class="splide__list">';
			foreach ( $images as $key => $image ) {
				$content .= '<li class="kb-slide-item kb-gallery-carousel-item splide__slide">';
				$content .= $this->render_gallery_images( $image, $attributes );
				$content .= '</li>';
			}
			$content .= '</ul>';
			$content .= '</div>';
			$content .= '</div>';
			$content .= '<div id="kb-thumb-slider-' . esc_attr( $unique_id ) . '" class="kb-blocks-slider splide kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="1" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $slider_fade ? 'true' : 'false' ) . '" data-slider-dots="false" data-slider-hover-pause="false" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-type="thumbnail" data-slider-nav="kb-slider-' . esc_attr( $unique_id ) . '">';
			$content .= '<div class="splide__track">';
			$content .= '<ul class="splide__list">';
			foreach ( $images as $key => $image ) {
				$content .= '<li class="kb-slide-item kb-gallery-carousel-item splide__slide">';
				$content .= $this->render_gallery_thumb_images( $image, $attributes );
				$content .= '</li>';
			}
			$content .= '</ul>';
			$content .= '</div>';
			if ( $autoplay && $show_pause_button ) {
				$content .= '<button class="kb-gallery-pause-button splide__toggle" type="button" aria-label="' . esc_attr( __( 'Toggle autoplay', 'kadence-blocks' ) ) . '">';
				$content .= '<span class="kb-gallery-pause-icon splide__toggle__pause"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg></span>';
				$content .= '<span class="kb-gallery-play-icon splide__toggle__play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';
				$content .= '</button>';
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
			case 'mosaic':
				$content .= $this->render_mosaic_gallery( $images, $attributes, $gallery_classes, $image_filter, $lightbox_cap );
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

		return $content;
	}
	/**
	 * Render mosaic gallery layout.
	 *
	 * This function can be used by Kadence Blocks Pro for dynamic content.
	 * It creates a mosaic pattern layout for gallery images with specific grid classes.
	 *
	 * @param array  $images          Array of image objects with image data.
	 * @param array  $attributes      Gallery block attributes.
	 * @param array  $gallery_classes Array of CSS classes for the gallery container.
	 * @param string $image_filter    Image filter setting.
	 * @param bool   $lightbox_cap    Whether lightbox captions are enabled.
	 * @return string HTML markup for the mosaic gallery.
	 */
	public function render_mosaic_gallery( $images, $attributes, $gallery_classes = array(), $image_filter = 'none', $lightbox_cap = false ) {
		$content = '';
		$content .= '<div class="' . esc_attr( implode( ' ', $gallery_classes ) ) . '" data-image-filter="' . esc_attr( $image_filter ) . '" data-lightbox-caption="' . ( $lightbox_cap ? 'true' : 'false' ) . '"kb-mosaic-gallery grid-pattern-gallery">';
		$content .= '<div class="grid-pattern-container">';

		$grouped_images = array_chunk($images, 8);

		foreach ($grouped_images as $group) {
			foreach ($group as $image_index => $image) {
				// Determine which grid item pattern to use (patterns repeat every 8 images)
				$pattern_index = $image_index % 8;

				$grid_class = '';
				$is_last_image = $image_index === count($group) - 1;
				$next_to_last_image = $image_index === count($group) - 2;

				switch ($pattern_index) {
					case 0: // First image: 1 row, 2 columns
						$grid_class = $is_last_image ? 'grid-item-wide only-one' : 'grid-item-wide';
						break;
					case 1: // Second image: 2 columns, 2 rows
						$grid_class = 'grid-item-large';
						$grid_class .= $is_last_image ? ' only-two' : '';
						break;
					case 2: // Third image: 2 rows, 1 column
						$grid_class = 'grid-item-tall';
						$grid_class .= $is_last_image ? ' only-three' : '';
						$grid_class .= $next_to_last_image ? ' only-four' : '';
						break;
					case 3: // Fourth image: 1 row, 1 column
						$grid_class = 'grid-item-small';
						break;
					case 4: // Fifth image: 2 columns, 2 rows
						$grid_class = 'grid-item-large';
						$grid_class .= $is_last_image ? ' only-five' : '';
						$grid_class .= $next_to_last_image ? ' only-six' : '';
						break;
					case 5: // Sixth image: 1 row, 1 column
						$grid_class = $next_to_last_image ? 'grid-item-small only-seven' : 'grid-item-small';
						break;
					case 6: // Seventh image: 1 row, 1 column
					case 7: // Eighth image: 1 row, 1 column
						$grid_class = 'grid-item-small';
						break;
					default:
						$grid_class = 'grid-item-small';
				}

				$content .= '<div class="kadence-blocks-gallery-item ' . esc_attr($grid_class) . '">';
				$content .= $this->render_gallery_images($image, $attributes);
				$content .= '</div>';
			}
		}

		$content .= '</div>';
		$content .= '</div>';

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
	 * Output Gallery image markup.
	 *
	 * @param array<string, mixed> $image      Image data.
	 * @param array<string, mixed> $attributes Gallery block attributes.
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
						'relate'       => ( isset( $attributes['kadenceDynamic']['link']['relate'] ) ? $attributes['kadenceDynamic']['link']['relate'] : '' ),
						'relcustom'    => ( isset( $attributes['kadenceDynamic']['link']['relcustom'] ) ? $attributes['kadenceDynamic']['link']['relcustom'] : '' ),
					);
					if ( class_exists( 'Kadence_Blocks_Pro_Dynamic_Content' ) ) {
						$dynamic_content_class = Kadence_Blocks_Pro_Dynamic_Content::get_instance();
						$href                  = $dynamic_content_class->get_content( $args );
					} else {
						$href = ( ! empty( $image['customLink'] ) ? $image['customLink'] : '' );
					}
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
		$item_tag = ( ( 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type || 'fluidcarousel' === $type || 'mosaic' === $type ) ? 'div' : 'li' );
		$fig_tag = ( empty( $href ) && 'below' === $caption_style ? 'figcaption' : 'div' );
		$figcap = '<' . $fig_tag . ' class="kadence-blocks-gallery-item__caption">' . ( ! empty( $caption ) && is_string( $caption ) ? wp_kses_post( $caption ) : '' ) . '</' . $fig_tag . '>';

		//links in the main gallery caption can mess with lightbox function, strip them out.
		// they're okay in the lightbox though.
		if( $link_to === 'media' && $lightbox === 'magnific' && ! empty( $figcap ) && is_string( $figcap ) ) {
			$figcap = preg_replace('#<a.*?>(.*?)</a>#i', '\1', $figcap);
		}

		$image_classes = array( 'wp-image-' . $image_id );
		if ( 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type || 'fluidcarousel' === $type ) {
			$image_classes[] = 'skip-lazy';
		}
		$padding_bottom = '';
		if ( ( 'masonry' === $type ) && ! empty( $image['width'] ) && ! empty( $image['height'] ) ) {
			$padding_bottom = esc_attr( floor( ( $image['height'] / $image['width'] ) * 100 ) );
		} else if ( ! empty( $image_ratio ) && 'inherit' === $image_ratio && 'grid' === $type && ! empty( $image['width'] ) && ! empty( $image['height'] ) ) {
			$padding_bottom = esc_attr( floor( ( $image['height'] / $image['width'] ) * 100 ) );
		}
		if ( $lazy_load && ( 'carousel' === $type || 'slider' === $type || 'thumbslider' === $type || 'fluidcarousel' === $type ) ) {
			$img = '<div class="' . esc_attr( implode( ' ', $image_contain_classes ) ) . '" ' . ( ! empty( $padding_bottom ) ? 'style="padding-bottom:' . $padding_bottom . '%;"' : '' ) . '><img src="' . "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201000%20667'%3E%3C/svg%3E" . '"  data-splide-lazy="' . esc_attr( $image_src ) . '" ' . ( ! empty( $image['width'] ) ? 'width="' . esc_attr( $image['width'] ) . '"' : '' ) . ' ' . ( ! empty( $image['height'] ) ? 'height="' . esc_attr( $image['height'] ) . '"' : '' ) . ' alt="' . esc_attr( $image_alt ) . '" data-full-image="' . esc_attr( $image_full ) . '" data-light-image="' . esc_attr( $image_full ) . '" ' . $this->get_image_srcset_output( $image_id, $image_src, $image['width'], $image['height'] ) . 'data-id="' . esc_attr( $image_id ) . '" class="' . esc_attr( implode( ' ', $image_classes ) ) . '"/></div>';
		} else {
			$img = '<div class="' . esc_attr( implode( ' ', $image_contain_classes ) ) . '" ' . ( ! empty( $padding_bottom ) ? 'style="padding-bottom:' . $padding_bottom . '%;"' : '' ) . '><img src="' . esc_attr( $image_src ) . '" ' . ( ! empty( $image['width'] ) ? 'width="' . esc_attr( $image['width'] ) . '"' : '' ) . ' ' . ( ! empty( $image['height'] ) ? 'height="' . esc_attr( $image['height'] ) . '"' : '' ) . ' alt="' . esc_attr( $image_alt ) . '" data-full-image="' . esc_attr( $image_full ) . '" data-light-image="' . esc_attr( $image_full ) . '" data-id="' . esc_attr( $image_id ) . '" class="' . esc_attr( implode( ' ', $image_classes ) ) . '"/></div>';
		}
		// Add tabindex for accessibility when no link and caption is shown on hover (exclude carousel types)
		$tabindex_attr = '';
		if ( empty( $href ) && ( 'bottom-hover' === $caption_style || 'cover-hover' === $caption_style ) && 'carousel' !== $type && 'slider' !== $type && 'thumbslider' !== $type && 'fluidcarousel' !== $type ) {
			$tabindex_attr = ' tabindex="0"';
		}
		$output = '<' . $item_tag . ' class="kadence-blocks-gallery-item"' . $tabindex_attr . '>';
		$output .= '<div class="kadence-blocks-gallery-item-inner">';
		$figure_style = '';
		if ( ! empty( $padding_bottom ) && 'below' === $caption_style ) {
			$figure_style = ' style="max-width:' . esc_attr( Cast::to_string( $image['width'] ) ) . 'px;"';
		}
		$output .= '<figure class="' . esc_attr( implode( ' ', $fig_classes ) ) . '"' . $figure_style . '>';
		if ( ! empty( $href ) ) {
			$safe_caption = '';
			if( $link_to === 'media' && $lightbox === 'magnific' && $lightbox_cap && ! empty( $caption ) && is_string( $caption ) ) {
				$safe_caption = wp_kses(html_entity_decode($caption, ENT_QUOTES, 'UTF-8'), array(
					'a' => array(
						'href' => true,
						'target' => array('_blank', '_self'),
						'rel' => true,
					)
				));
			}
			$output .= '<a href="' . esc_url( $href ) . '"' . ( !empty( $safe_caption ) ? ' data-description="' . esc_attr( $safe_caption ) . '"' : '' ) . '' . ( $link_to === 'media' && $lightbox === 'magnific' && ! empty( $image_alt ) && is_string( $image_alt ) ? ' data-alt="' . esc_attr( $image_alt ) . '"' : '' ) . ' class="kb-gallery-item-link" ' . ( ( $link_to === 'custom' && '_blank' === $link_target ) || ( $link_to === 'media' && $lightbox === 'new_tab' ) ? 'target="_blank"' : '' ) . ' ' . ( ( $link_to === 'custom' && ! empty( $rel_attr ) ) || ( $link_to === 'media' && ! empty( $rel_attr ) ) ? 'rel="' . esc_attr( $rel_attr ) . '"' : '' ) . ( $link_to === 'media' && 'none' !== $lightbox ? ' role="button" aria-haspopup="dialog"' : '' ) . '>';
		}
		$image_radius_style = '';
		if ( ! empty( $padding_bottom ) ) {
			$image_radius_style = ' style="max-width:' . esc_attr( $image['width'] ) . 'px;"';
		}
		$output .= '<div class="kb-gal-image-radius"' . $image_radius_style . '>';
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
	 * Output Gallery image markup.
	 *
	 * @param array<string, mixed> $image      Image data.
	 * @param array<string, mixed> $attributes Gallery block attributes.
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
		$img = '<div class="' . esc_attr( implode( ' ', $image_contain_classes ) ) . '" ' . ( ! empty( $padding_bottom ) ? 'style="padding-bottom:' . $padding_bottom . '%;"' : '' ) . '><img src="' . esc_attr( $image_src ) . '" ' . ( ! empty( $image['width'] ) ? 'width="' . esc_attr( $image['width'] ) . '"' : '' ) . ' ' . ( ! empty( $image['height'] ) ? 'height="' . esc_attr( $image['height'] ) . '"' : '' ) . ' alt="' . esc_attr( $image_alt ) . '" data-full-image="' . esc_attr( $image_full ) . '" data-light-image="' . esc_attr( $image_full ) . '" data-id="' . esc_attr( $image_id ) . '" class="wp-image-' . esc_attr( $image_id ) . ' skip-lazy"/></div>';
		$output = '<div class="kadence-blocks-gallery-thumb-item">';
		$output .= '<div class="kadence-blocks-gallery-thumb-item-inner">';
		$output .= '<figure class="' . esc_attr( implode( ' ', $fig_classes ) ) . '">';
		$thumb_image_radius_style = '';
		if ( ! empty( $padding_bottom ) ) {
			$thumb_image_radius_style = ' style="max-width:' . $image['width'] . 'px;"';
		}
		$output .= '<div class="kb-gal-image-radius"' . $thumb_image_radius_style . '>';
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

		wp_register_style( 'kadence-kb-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kadence-splide.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-blocks-splide.min.css', array( 'kadence-kb-splide' ), KADENCE_BLOCKS_VERSION );
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
				'lightBoxAriaLabel' => __('Display lightbox image:', 'kadence-blocks'),
			)
		);
		wp_localize_script(
			'kadence-blocks-splide-init',
			'kb_splide',
			array(
				'i18n' => array(
					'prev' => __( 'Previous slide', 'kadence-blocks' ),
					'next' => __( 'Next slide', 'kadence-blocks' ),
					'first' => __( 'Go to first slide', 'kadence-blocks' ),
					'last' => __( 'Go to last slide', 'kadence-blocks' ),
					'slideX' => __( 'Go to slide %s', 'kadence-blocks' ),
					'pageX' => __( 'Go to page %s', 'kadence-blocks' ),
					'play' => __( 'Start autoplay', 'kadence-blocks' ),
					'pause' => __( 'Pause autoplay', 'kadence-blocks' ),
					'carousel' => __( 'carousel', 'kadence-blocks' ),
					'slide' => __( 'slide', 'kadence-blocks' ),
					'select' => __( 'Select a slide to show', 'kadence-blocks' ),
					'slideLabel' => __( '%s of %s', 'kadence-blocks' ),
				),
			)
		);
	}
}

Kadence_Blocks_Advancedgallery_Block::get_instance();
