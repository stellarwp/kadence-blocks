<?php
/**
 * Class to Build the Testimonial Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore arrowstyle dotstyle halign inlineimage intrisic isize whiteondark .

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Legacy_Group_Attributes;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the Testimonials Block.
 *
 * @category class
 */
class Kadence_Blocks_Testimonials_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Legacy_Group_Attributes {

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
	protected $block_name = 'testimonials';

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Testimonials_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
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
		$css_class = Kadence_Blocks_CSS::get_instance();

		if ( ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ) {
			$columns_xxl  = ( ! empty( $attributes['columns'][0] ) ? $attributes['columns'][0] : '1' );
			$columns_xl   = ( ! empty( $attributes['columns'][1] ) ? $attributes['columns'][1] : '1' );
			$columns_md   = ( ! empty( $attributes['columns'][2] ) ? $attributes['columns'][2] : '1' );
			$columns_sm   = ( ! empty( $attributes['columns'][3] ) ? $attributes['columns'][3] : '1' );
			$columns_xs   = ( ! empty( $attributes['columns'][4] ) ? $attributes['columns'][4] : '1' );
			$columns_ss   = ( ! empty( $attributes['columns'][5] ) ? $attributes['columns'][5] : '1' );
			$gap          = ( ! empty( $attributes['gap'][0] ) ? $attributes['gap'][0] : '32' );
			$tablet_gap   = ( ! empty( $attributes['gap'][1] ) ? $attributes['gap'][1] : $gap );
			$mobile_gap   = ( ! empty( $attributes['gap'][2] ) ? $attributes['gap'][2] : $tablet_gap );
			$gap_unit     = ( ! empty( $attributes['gapUnit'] ) ? $attributes['gapUnit'] : 'px' );
			$dot_style    = ( ! empty( $attributes['dotStyle'] ) ? $attributes['dotStyle'] : 'dark' );
			$arrow_style  = ( ! empty( $attributes['arrowStyle'] ) ? $attributes['arrowStyle'] : 'whiteondark' );
			$autoplay     = ( ! empty( $attributes['autoPlay'] ) && $attributes['autoPlay'] ? true : false );
			$show_pause_button = ( ! empty( $attributes['showPauseButton'] ) && $attributes['showPauseButton'] ? true : false );
			$trans_speed  = ( ! empty( $attributes['transSpeed'] ) ? $attributes['transSpeed'] : 400 );
			$auto_speed   = ( ! empty( $attributes['autoSpeed'] ) ? $attributes['autoSpeed'] : 7000 );
			$slides_sc    = ( ! empty( $attributes['slidesScroll'] ) ? $attributes['slidesScroll'] : '1' );
			$slider_type  = ( ! empty( $attributes['carouselType'] ) ? $attributes['carouselType'] : 'loop' );

			$outer_classes = array( 'kt-blocks-testimonials-wrap' . $unique_id );
			$outer_classes[] = ! empty( $attributes['hAlign'] ) ? 'kt-testimonial-halign-' . $attributes['hAlign'] : 'kt-testimonial-halign-center';
			$outer_classes[] = ! empty( $attributes['style'] ) ? 'kt-testimonial-style-' . $attributes['style'] : 'kt-testimonial-style-basic';
			$outer_classes[] = isset( $attributes['displayMedia'] ) && $attributes['displayMedia'] ? 'kt-testimonials-media-on' : 'kt-testimonials-media-off';
			$outer_classes[] = isset( $attributes['displayIcon'] ) && $attributes['displayIcon'] ? 'kt-testimonials-icon-on' : 'kt-testimonials-icon-off';
			$outer_classes[] = 'kt-testimonial-columns-' . $columns_xxl; // assume column count is the one set for the biggest size.
			$outer_classes[] = 'kt-t-xxl-col-' . $columns_xxl;
			$outer_classes[] = 'kt-t-xl-col-' . $columns_xl;
			$outer_classes[] = 'kt-t-lg-col-' . $columns_md;
			$outer_classes[] = 'kt-t-md-col-' . $columns_sm;
			$outer_classes[] = 'kt-t-sm-col-' . $columns_xs;
			$outer_classes[] = 'kt-t-xs-col-' . $columns_ss;

			$inner_classes = array( 'kt-blocks-testimonials-inner-wrap' );
			$inner_classes[] = ! empty( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ? 'kt-blocks-carousel' : 'kt-testimonial-grid-wrap';
			if ( ! empty( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ) {
				$inner_classes[] = 'kt-carousel-container-dotstyle-' . $dot_style;
				$inner_classes[] = 'kt-carousel-container-arrowstyle-' . $arrow_style;

				$inner_args = array(
					'class' => implode( ' ', $inner_classes ),
				);
				$inner_wrap_attributes = array();
				foreach ( $inner_args as $key => $value ) {
					$inner_wrap_attributes[] = $key . '="' . esc_attr( $value ) . '"';
				}
				$inner_wrapper_attributes = implode( ' ', $inner_wrap_attributes );
				$carousel_content = '';

				// Output proper Splide.js structure: splide > splide__track > splide__list > splide__slide
				// Add splide__slide class to testimonial items that have kb-slide-item class
				$content = str_replace( 'class="kt-blocks-testimonial-carousel-item kb-slide-item"', 'class="kt-blocks-testimonial-carousel-item kb-slide-item splide__slide"', $content );
				$content = str_replace( 'class="kb-slide-item"', 'class="kb-slide-item splide__slide"', $content );
				$carousel_content .= '<div class="kt-blocks-carousel-init splide kb-gallery-carousel kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-columns-xxl="' . esc_attr( $columns_xxl ) . '" data-columns-xl="' . esc_attr( $columns_xl ) . '" data-columns-md="' . esc_attr( $columns_md ) . '" data-columns-sm="' . esc_attr( $columns_sm ) . '" data-columns-xs="' . esc_attr( $columns_xs ) . '" data-columns-ss="' . esc_attr( $columns_ss ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="' . esc_attr( $slides_sc ) . '" data-slider-type="' . esc_attr( $slider_type ) . '" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-gap="' . esc_attr( $this->get_usable_value( $css_class, $gap, $gap_unit ) ) . '" data-slider-gap-tablet="' . esc_attr( $this->get_usable_value( $css_class, $tablet_gap, $gap_unit ) ) . '" data-slider-gap-mobile="' . esc_attr( $this->get_usable_value( $css_class, $mobile_gap, $gap_unit ) ) . '" data-show-pause-button="' . esc_attr( $show_pause_button ? 'true' : 'false' ) . '">';
				$carousel_content .= '<div class="splide__track">';
				$carousel_content .= '<ul class="splide__list">';
				$carousel_content .= $content;
				$carousel_content .= '</ul>';
				$carousel_content .= '</div>';
				if ( $autoplay && $show_pause_button ) {
					$carousel_content .= '<button class="kb-gallery-pause-button splide__toggle" type="button" aria-label="' . esc_attr( __( 'Toggle autoplay', 'kadence-blocks' ) ) . '">';
					$carousel_content .= '<span class="kb-gallery-pause-icon splide__toggle__pause"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg></span>';
					$carousel_content .= '<span class="kb-gallery-play-icon splide__toggle__play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';
					$carousel_content .= '</button>';
				}
				$carousel_content .= '</div>';
				$inner_content = sprintf( '<div %1$s>%2$s</div>', $inner_wrapper_attributes, $carousel_content );
			} else {
				$inner_args = array(
					'class' => implode( ' ', $inner_classes ),
				);
				$inner_wrap_attributes = array();
				foreach ( $inner_args as $key => $value ) {
					$inner_wrap_attributes[] = $key . '="' . esc_attr( $value ) . '"';
				}
				$inner_wrapper_attributes = implode( ' ', $inner_wrap_attributes );
				$inner_content = sprintf( '<ul %1$s>%2$s</ul>', $inner_wrapper_attributes, $content );
			}
			$wrapper_args = array(
				'class' => implode( ' ', $outer_classes ),
			);
			if(isset($attributes['anchor']) && !empty($attributes['anchor'])) {
				$wrapper_args['id'] = $attributes['anchor'];
			}
			$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
			$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
		} elseif ( ! empty( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ) {
			$gap        = isset( $attributes['columnGap'] ) && '' !== $attributes['columnGap'] ? $attributes['columnGap'] : 30;
			$columns_ss = ! empty( $attributes['columns'][5] ) ? $attributes['columns'][5] : '1';
			$gap_unit   = 'px';
			$content = str_replace( 'data-columns-ss="' . esc_attr( $columns_ss ) . '"', 'data-columns-ss="' . esc_attr( $columns_ss ) . '" data-slider-gap="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-tablet="' . esc_attr( $gap . $gap_unit ) . '" data-slider-gap-mobile="' . esc_attr( $gap . $gap_unit ) . '"', $content );
		}
		return $content;
	}

	public function get_usable_value( $css, $value, $unit = 'px', $is_font = false ) {
		if ( $is_font ) {
			if ( $css->is_variable_font_size_value( $value ) ) {
				return $css->get_variable_font_size_value( $value );
			}
		} else {
			if ( $css->is_variable_value( $value ) ) {
				return $css->get_variable_value( $value );
			}
		}

		if ( is_numeric( $value ) ) {
			return $value . $unit;
		}

		return '';
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
		wp_register_script( 'kad-splide', KADENCE_BLOCKS_URL . 'includes/assets/js/splide.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-splide-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-splide-init.min.js', array( 'kad-splide' ), KADENCE_BLOCKS_VERSION, true );
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

	/**
	 * The editor paints every container, spacing and font value in its own
	 * style tag, and the instance rules outrank core's, so every site value
	 * goes through the overlay. Values the testimonials read through block
	 * context stay per block, since the context carries the stored values.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( ...$this->site_styles_attribute_groups() );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * Each color keeps its opacity, each spacing set, border and radius keeps
	 * its tablet and mobile values and its unit, the shadow keeps its toggle,
	 * and each font is kept whole.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'containerBackground', 'containerBackgroundOpacity' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle' ],
			[ 'responsiveContainerBorderRadius', 'tabletContainerBorderRadius', 'mobileContainerBorderRadius', 'containerBorderRadiusUnit' ],
			[ 'containerPadding', 'tabletContainerPadding', 'mobileContainerPadding', 'containerPaddingType' ],
			[ 'containerMinHeight' ],
			[ 'titleMinHeight' ],
			[ 'contentMinHeight' ],
			[ 'displayShadow', 'shadow' ],
			[ 'wrapperPadding', 'wrapperTabletPadding', 'wrapperMobilePadding', 'wrapperPaddingType' ],
			[ 'wrapperMargin', 'tabletWrapperMargin', 'mobileWrapperMargin', 'wrapperMarginUnit' ],
			[ 'gap', 'gapUnit' ],
			[ 'contentFont' ],
			[ 'nameFont' ],
			[ 'occupationFont' ],
		];
	}

	/**
	 * Testimonials saved before the responsive settings carry the old border
	 * width and color and the old radius, which build_css() renders instead of
	 * the border and radius, and the old column gap, which the carousel reads
	 * instead of the gap.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_legacy_group_attributes(): array {
		return [
			'borderStyle'                     => [ 'containerBorderWidth', 'containerBorder' ],
			'responsiveContainerBorderRadius' => [ 'containerBorderRadius' ],
			'gap'                             => [ 'columnGap' ],
		];
	}
}

Kadence_Blocks_Testimonials_Block::get_instance();
