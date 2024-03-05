<?php
/**
 * Class to Build the Testimonial Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Testimonials Block.
 *
 * @category class
 */
class Kadence_Blocks_Testimonials_Block extends Kadence_Blocks_Abstract_Block {

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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		/* Load any Google fonts that are needed */
		$attributes_with_fonts = array( 'titleFont', 'contentFont', 'nameFont', 'occupationFont' );
		foreach ( $attributes_with_fonts as $attribute_font_key ) {
			if ( isset( $attributes[ $attribute_font_key ][0] ) && isset( $attributes[ $attribute_font_key ][0]['google'] ) && ( isset( $attributes[ $attribute_font_key ][0]['loadGoogle'] ) && true === $attributes[ $attribute_font_key ][0]['loadGoogle'] ) && isset( $attributes[ $attribute_font_key ][0]['family'] ) && true === $attributes[ $attribute_font_key ][0]['google']) {
				$title_font = $attributes[ $attribute_font_key ][0];

				$font_variant = isset( $title_font['variant'] ) ? $title_font['variant'] : null;
				$font_subset  = isset( $title_font['subset'] ) ? $title_font['subset'] : null;

				$css->maybe_add_google_font( $title_font['family'], $font_variant, $font_subset );
			}
		}
		$style = ! empty( $attributes['style'] ) ? $attributes['style'] : 'basic';
		/* Tiny slider is required if we're using a carousel layout */
		if ( isset( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ) {
			$this->enqueue_style( 'kadence-blocks-splide' );
			$this->enqueue_script( 'kadence-blocks-splide-init' );
		}
		// Main Icon.
		if ( isset( $attributes['iconStyles'][0] ) && is_array( $attributes['iconStyles'][0] ) ) {
			$icon_styles = $attributes['iconStyles'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-svg-testimonial-global-icon' );
			if ( ! empty( $icon_styles['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $icon_styles['color'] ) );
			}
			if ( $css->is_number( $icon_styles['size'] ) ) {
				$css->add_property( 'font-size', $icon_styles['size'] . 'px' );
			}
			if ( $css->is_number( $icon_styles['borderRadius'] ) ) {
				$css->add_property( 'border-radius', $icon_styles['borderRadius'] . 'px' );
			} else {
				$css->render_border_radius( $attributes, 'iconBorderRadius', ( isset( $attributes['iconBorderRadiusUnit'] ) ? $attributes['iconBorderRadiusUnit'] : 'px') );
			}
			if ( ! empty( $icon_styles['background'] ) ) {
				$alpha = ( $css->is_number( $icon_styles['backgroundOpacity'] ) ? $icon_styles['backgroundOpacity'] : 1 );
				$css->add_property( 'background', $css->render_color( $icon_styles['background'], $alpha ) );
			}
			if ( ! empty( $icon_styles['border'] ) ) {
				$alpha = ( $css->is_number( $icon_styles['borderOpacity'] ) ? $icon_styles['borderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $icon_styles['border'], $alpha ) );
			}

			if( !empty( $icon_styles['borderWidth'][0] ) || !empty( $icon_styles['borderWidth'][1] ) || !empty( $icon_styles['borderWidth'][2] ) || !empty( $icon_styles['borderWidth'][3] ) ) {
				$css->render_measure_range( $icon_styles, 'borderWidth', 'border-width' );
			} else {
				$css->render_border_styles( $attributes, 'iconBorderStyle', 'border' );
			}

			if( array_filter( $icon_styles['padding'] ) ){
				$css->render_measure_range( $icon_styles, 'padding', 'padding' );
			} else {
				$css->render_measure_output( $attributes, 'iconPadding', 'padding' );
			}

			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-svg-testimonial-global-icon-wrap' );
			if( array_filter( $icon_styles['margin'] ) ){
				$css->render_measure_range( $icon_styles, 'margin', 'margin' );
			} else {
				$css->render_measure_output( $attributes, 'iconMargin', 'margin' );
			}
		}
		// Testimonial specific Icon.
		if ( isset( $attributes['testimonials'] ) && is_array( $attributes['testimonials'] ) ) {
			foreach ( $attributes['testimonials'] as $key => $value ) {
				$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-' . $key . ' .kt-svg-testimonial-icon' );
				if ( ! empty( $value['color'] ) ) {
					$css->add_property( 'color', $css->render_color( $value['color'] ) );
				}
				if ( $css->is_number( $value['isize'] ) ) {
					$css->add_property( 'font-size', $value['isize'] . 'px' );
				}
			}
		}
		// Rating icons.
		if ( isset( $attributes['ratingStyles'][0] ) && is_array( $attributes['ratingStyles'][0] ) ) {
			$rating_styles = $attributes['ratingStyles'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-rating-wrap' );
			$css->render_measure_range( $rating_styles, 'margin', 'margin' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-rating-wrap .kb-svg-icon-wrap' );
			if ( ! empty( $rating_styles['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $rating_styles['color'] ) );
			}
			if ( $css->is_number( $rating_styles['size'] ) ) {
				$css->add_property( 'font-size', $rating_styles['size'] . 'px' );
			}
		}
		/*
		 *  Wrapper padding
		 */
		$wrapper_padding_type = ! empty( $attributes['wrapperPaddingType'] ) ? $attributes['wrapperPaddingType'] : 'px';
		$wrapper_margin_type = ! empty( $attributes['wrapperMarginUnit'] ) ? $attributes['wrapperMarginUnit'] : 'px';

		$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id );

		// Desktop wrapper padding L/R
		if ( isset( $attributes['wrapperPadding'][1] ) ) {
			$css->add_property( 'padding-right', $this->get_usable_value( $css, $attributes['wrapperPadding'][1], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['wrapperPadding'][3] ) ) {
			$css->add_property( 'padding-left', $this->get_usable_value( $css, $attributes['wrapperPadding'][3], $wrapper_padding_type ) );
		}

		if ( isset( $attributes['wrapperMargin'][1] ) ) {
			$css->add_property( 'margin-right', $this->get_usable_value( $css, $attributes['wrapperMargin'][1], $wrapper_margin_type ) );
		}
		if ( isset( $attributes['wrapperMargin'][3] )) {
			$css->add_property( 'margin-left', $this->get_usable_value( $css, $attributes['wrapperMargin'][3], $wrapper_margin_type ) );
		}

		// Tablet wrapper padding L/R
		$css->set_media_state( 'tablet' );
		if ( isset( $attributes['wrapperTabletPadding'][1] )) {
			$css->add_property( 'padding-right', $this->get_usable_value( $css, $attributes['wrapperTabletPadding'][1], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['wrapperTabletPadding'][3] )) {
			$css->add_property( 'padding-left', $this->get_usable_value( $css, $attributes['wrapperTabletPadding'][3], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['tabletWrapperMargin'][1] ) ) {
			$css->add_property( 'margin-right', $this->get_usable_value( $css, $attributes['tabletWrapperMargin'][1], $wrapper_margin_type ) );
		}
		if ( isset( $attributes['tabletWrapperMargin'][3] ) ) {
			$css->add_property( 'margin-left', $this->get_usable_value( $css, $attributes['tabletWrapperMargin'][3], $wrapper_margin_type ) );
		}

		// Mobile wrapper padding L/R
		$css->set_media_state( 'mobile' );
		if ( isset( $attributes['wrapperMobilePadding'][1] ) ) {
			$css->add_property( 'padding-right', $this->get_usable_value( $css, $attributes['wrapperMobilePadding'][1], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['wrapperMobilePadding'][3] ) ) {
			$css->add_property( 'padding-left', $this->get_usable_value( $css, $attributes['wrapperMobilePadding'][3], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['mobileWrapperMargin'][1] ) ) {
			$css->add_property( 'margin-right', $this->get_usable_value( $css, $attributes['mobileWrapperMargin'][1], $wrapper_margin_type ) );
		}
		if ( isset( $attributes['mobileWrapperMargin'][3] ) ) {
			$css->add_property( 'margin-left', $this->get_usable_value( $css, $attributes['mobileWrapperMargin'][3], $wrapper_margin_type ) );
		}

		$css->set_media_state( 'desktop' );

		/*
		 * If the layout style is carousel, we set the top & bottom wrapper padding on the carousel item instead of the wrapper.
		 */
		if ( isset( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-carousel .kt-blocks-testimonial-carousel-item' );

			// If a box shadow is enabled with a carousel, lets give some padding by default, they can override with a value from the wrapper section.
			if ( isset( $attributes['displayShadow'] ) && $attributes['displayShadow'] ) {
				$css->add_property( 'padding-top', 'var(--global-kb-spacing-xxs, .5rem)' );
				$css->add_property( 'padding-bottom', 'var(--global-kb-spacing-xxs, .5rem)' );

				$css->set_media_state( 'mobile' );
				$css->add_property( 'padding', 'var(--global-kb-spacing-xxs, .5rem)' );
				$css->set_media_state( 'desktop' );
			}
		}

		// Desktop wrapper padding T/B.
		if ( isset( $attributes['wrapperPadding'][0] ) ) {
			$css->add_property( 'padding-top', $this->get_usable_value( $css, $attributes['wrapperPadding'][0], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['wrapperPadding'][2] ) ) {
			$css->add_property( 'padding-bottom', $this->get_usable_value( $css, $attributes['wrapperPadding'][2], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['wrapperMargin'][0] ) ) {
			$css->add_property( 'margin-top', $this->get_usable_value( $css, $attributes['wrapperMargin'][0], $wrapper_margin_type ) );
		}
		if ( isset( $attributes['wrapperMargin'][2] ) ) {
			$css->add_property( 'margin-bottom', $this->get_usable_value( $css, $attributes['wrapperMargin'][2], $wrapper_margin_type ) );
		}
		// Tablet wrapper padding T/B
		$css->set_media_state( 'tablet' );
		if ( isset( $attributes['wrapperTabletPadding'][0] ) ) {
			$css->add_property( 'padding-top', $this->get_usable_value( $css, $attributes['wrapperTabletPadding'][0], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['wrapperTabletPadding'][2] ) ) {
			$css->add_property( 'padding-bottom', $this->get_usable_value( $css, $attributes['wrapperTabletPadding'][2], $wrapper_padding_type ) );
		}
		if ( isset( $attributes['tabletWrapperMargin'][0] ) ) {
			$css->add_property( 'margin-top', $this->get_usable_value( $css, $attributes['tabletWrapperMargin'][0], $wrapper_margin_type ) );
		}
		if ( isset( $attributes['tabletWrapperMargin'][2] ) ) {
			$css->add_property( 'margin-bottom', $this->get_usable_value( $css, $attributes['tabletWrapperMargin'][2], $wrapper_margin_type ) );
		}

		// Mobile wrapper padding T/B
		$css->set_media_state( 'mobile' );
		if ( isset( $attributes['wrapperMobilePadding'][0] ) ) {
			$css->add_property( 'padding-top', $attributes['wrapperMobilePadding'][0] . $wrapper_padding_type );
		}
		if ( isset( $attributes['wrapperMobilePadding'][2] ) ) {
			$css->add_property( 'padding-bottom', $attributes['wrapperMobilePadding'][2] . $wrapper_padding_type );
		}
		if ( isset( $attributes['mobileWrapperMargin'][0] ) ) {
			$css->add_property( 'margin-top', $attributes['mobileWrapperMargin'][0] . $wrapper_margin_type );
		}
		if ( isset( $attributes['mobileWrapperMargin'][2] ) ) {
			$css->add_property( 'margin-bottom', $attributes['mobileWrapperMargin'][2] . $wrapper_margin_type );
		}
		$css->set_media_state( 'desktop' );


		/*
		 * columnGap
		 */
		$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-grid-wrap' );
		$css->render_gap( $attributes );
		if ( ! empty( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider) .kb-slide-item' );
			$css->add_property( 'display', 'none' );
			$gap_unit = ! empty( $attributes['gap_unit'] ) ? $attributes['gap_unit'] : 'px';
			$gap = isset( $attributes['gap'][0] ) && '' !== $attributes['gap'][0] ? $attributes['gap'][0] : '32';
			$tablet_gap   = ( isset( $attributes['gap'][1] ) && '' !== $attributes['gap'][1] ? $attributes['gap'][1] : $gap );
			$mobile_gap   = ( isset( $attributes['gap'][2] ) && '' !== $attributes['gap'][2] ? $attributes['gap'][2] : $tablet_gap );
			$columns_xxl  = ( ! empty( $attributes['columns'][0] ) ? $attributes['columns'][0] : '1' );
			$columns_md   = ( ! empty( $attributes['columns'][2] ) ? $attributes['columns'][2] : '1' );
			$columns_ss   = ( ! empty( $attributes['columns'][5] ) ? $attributes['columns'][5] : '1' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider) .kb-slide-item:nth-child(-n+' . $columns_xxl . ')' );
			$css->add_property( 'padding-left', $gap . $gap_unit );
			$css->add_property( 'display', 'block' );
			$css->add_property( 'float', 'left' );
			$css->add_property( 'width', 'calc(100% / ' . $columns_xxl . ')' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider)' );
			$css->add_property( 'margin-left', '-' . $gap . $gap_unit );
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider) .kb-slide-item' );
			$css->add_property( 'display', 'none' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider) .kb-slide-item:nth-child(-n+' . $columns_md . ')' );
			$css->add_property( 'padding-left', $tablet_gap . $gap_unit );
			$css->add_property( 'display', 'block' );
			$css->add_property( 'float', 'left' );
			$css->add_property( 'width', 'calc(100% / ' . $columns_md . ')' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider)' );
			$css->add_property( 'margin-left', '-' . $tablet_gap . $gap_unit );
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider) .kb-slide-item' );
			$css->add_property( 'display', 'none' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider) .kb-slide-item:nth-child(-n+' . $columns_ss . ')' );
			$css->add_property( 'display', 'block' );
			$css->add_property( 'float', 'left' );
			$css->add_property( 'width', 'calc(100% / ' . $columns_ss . ')' );
			$css->add_property( 'padding-left', $mobile_gap . $gap_unit );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider)' );
			$css->add_property( 'margin-left', '-' . $mobile_gap . $gap_unit );
			$css->set_media_state( 'desktop' );
		}

		if ( 'bubble' === $style || 'inlineimage' === $style ) {
			$css->set_selector( '.wp-block-kadence-testimonials.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-text-wrap:after' );
			if ( isset( $attributes['containerBorderWidth'] ) && is_array( $attributes['containerBorderWidth'] ) && ! empty( $attributes['containerBorderWidth'][2] ) ) {
				$css->add_property( 'margin-top', $attributes['containerBorderWidth'][2] . 'px' );
			} else if ( ! empty( $attributes['borderStyle'][0]['bottom'][2] ) ) {
				$css->add_property( 'margin-top', $attributes['borderStyle'][0]['bottom'][2] . ( !empty( $attributes['borderStyle'][0]['unit'] ) ? $attributes['borderStyle'][0]['unit'] : 'px' ) );
			}
			if ( ! empty( $attributes['borderStyle'][0]['bottom'][0] ) ) {
				$css->add_property( 'border-top-color', $css->render_color( $attributes['borderStyle'][0]['bottom'][0] ) );
			} else if ( isset( $attributes['containerBorder'] ) && ! empty( $attributes['containerBorder'] ) ) {
				$alpha = ( isset( $attributes['containerBorderOpacity'] ) && is_numeric( $attributes['containerBorderOpacity'] ) ? $attributes['containerBorderOpacity'] : 1 );
				$css->add_property( 'border-top-color', $css->render_color( $attributes['containerBorder'], $alpha ) );
			}
		}

		// See if container styles are applied to the item or text.
		if ( 'bubble' !== $style && 'inlineimage' !== $style ){
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
		} else {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap .kt-testimonial-text-wrap' );
		}
		/* Container Padding */
		$css->render_measure_output( $attributes, 'containerPadding', 'padding' );

		$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
		/* Container min-height */
		$css->render_responsive_range( $attributes, 'containerMinHeight', 'min-height' );

		// Title font.
		$title_font = null;
		if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) ) {
			$title_font = $attributes['titleFont'][0];
		}
		if ( $title_font || ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][0] ) && is_numeric( $attributes['titleMinHeight'][0] ) ) ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap .kt-testimonial-title' );
			if ( isset( $title_font['color'] ) && ! empty( $title_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $title_font['color'] ) );
			}
			if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && ! empty( $title_font['size'][0] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $title_font['size'][0], ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ), true ) );

			}
			if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && ! empty( $title_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $title_font['lineHeight'][0] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
			}
			if ( isset( $title_font['letterSpacing'] ) && ! empty( $title_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $title_font['letterSpacing'] . 'px' );
			}
			if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $title_font['textTransform'] );
			}
			if ( isset( $title_font['family'] ) && ! empty( $title_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $title_font['family'] ) );
			}
			if ( isset( $title_font['style'] ) && ! empty( $title_font['style'] ) ) {
				$css->add_property( 'font-style', $title_font['style'] );
			}
			if ( isset( $title_font['weight'] ) && ! empty( $title_font['weight'] ) && 'regular' !== $title_font['weight'] ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $title_font['weight'] ) );
			}

			if ( isset( $title_font['margin'] ) && is_array( $title_font['margin'] ) && array_filter( $title_font['margin'] ) ) {
				if ( isset( $title_font['margin'][0] ) && is_numeric( $title_font['margin'][0] ) ) {
					$css->add_property( 'margin-top', $title_font['margin'][0] . 'px' );
				}
				if ( isset( $title_font['margin'][1] ) && is_numeric( $title_font['margin'][1] ) ) {
					$css->add_property( 'margin-right', $title_font['margin'][1] . 'px' );
				}
				if ( isset( $title_font['margin'][2] ) && is_numeric( $title_font['margin'][2] ) ) {
					$css->add_property( 'margin-bottom', $title_font['margin'][2] . 'px' );
				}
				if ( isset( $title_font['margin'][3] ) && is_numeric( $title_font['margin'][3] ) ) {
					$css->add_property( 'margin-left', $title_font['margin'][3] . 'px' );
				}
			} else {
				$css->render_measure_output( $attributes, 'titleMargin', 'margin' );
			}

			if ( isset( $title_font['padding'] ) && is_array( $title_font['padding'] ) && array_filter( $title_font['padding'] ) ) {
				if ( isset( $title_font['padding'][0] ) && is_numeric( $title_font['padding'][0] ) ) {
					$css->add_property( 'padding-top', $title_font['padding'][0] . 'px' );
				}
				if ( isset( $title_font['padding'][1] ) && is_numeric( $title_font['padding'][1] ) ) {
					$css->add_property( 'padding-right', $title_font['padding'][1] . 'px' );
				}
				if ( isset( $title_font['padding'][2] ) && is_numeric( $title_font['padding'][2] ) ) {
					$css->add_property( 'padding-bottom', $title_font['padding'][2] . 'px' );
				}
				if ( isset( $title_font['padding'][3] ) && is_numeric( $title_font['padding'][3] ) ) {
					$css->add_property( 'padding-left', $title_font['padding'][3] . 'px' );
				}
			} else {
				$css->render_measure_output( $attributes, 'titlePadding', 'padding' );
			}
			if ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][0] ) && is_numeric( $attributes['titleMinHeight'][0] ) ) {
				$css->add_property( 'min-height', $attributes['titleMinHeight'][0] . 'px' );
			}
		}

		if ( ( $title_font && ( ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][1] ) && ! empty( $title_font['size'][1] ) ) || ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && isset( $title_font['lineHeight'][1] ) && ! empty( $title_font['lineHeight'][1] ) ) ) ) || ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][1] ) && is_numeric( $attributes['titleMinHeight'][1] ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap .kt-testimonial-title' );
			if ( isset( $title_font['size'][1] ) && ! empty( $title_font['size'][1] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $title_font['size'][1], ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ), true ) );
			}
			if ( isset( $title_font['lineHeight'][1] ) && ! empty( $title_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $title_font['lineHeight'][1] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
			}
			if ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][1] ) && is_numeric( $attributes['titleMinHeight'][1] ) ) {
				$css->add_property( 'min-height', $attributes['titleMinHeight'][1] . 'px' );
			}
			$css->set_media_state( 'desktop' );
		}

		if ( ( $title_font && ( ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][2] ) && ! empty( $title_font['size'][2] ) ) || ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && isset( $title_font['lineHeight'][2] ) && ! empty( $title_font['lineHeight'][2] ) ) ) ) || ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][1] ) && is_numeric( $attributes['titleMinHeight'][1] ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap .kt-testimonial-title' );
			if ( isset( $title_font['size'][2] ) && ! empty( $title_font['size'][2] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $title_font['size'][2], ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ), true ) );
			}
			if ( isset( $title_font['lineHeight'][2] ) && ! empty( $title_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $title_font['lineHeight'][2] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
			}
			if ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][2] ) && is_numeric( $attributes['titleMinHeight'][2] ) ) {
				$css->add_property( 'min-height', $attributes['titleMinHeight'][2] . 'px' );
			}
			$css->set_media_state( 'desktop' );
		}

		// Content font.
		$content_font = null;
		if ( isset( $attributes['contentFont'] ) && is_array( $attributes['contentFont'] ) && isset( $attributes['contentFont'][0] ) && is_array( $attributes['contentFont'][0] ) ) {
			$content_font = $attributes['contentFont'][0];
		}
		if ( $content_font || ( isset( $attributes['contentMinHeight'] ) && is_array( $attributes['contentMinHeight'] ) && isset( $attributes['contentMinHeight'][0] ) && is_numeric( $attributes['contentMinHeight'][0] ) ) ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-content' );
			if ( isset( $content_font['color'] ) && ! empty( $content_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $content_font['color'] ) );
			}
			if ( isset( $content_font['size'] ) && is_array( $content_font['size'] ) && ! empty( $content_font['size'][0] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $content_font['size'][0], ( ! isset( $content_font['sizeType'] ) ? 'px' : $content_font['sizeType'] ), true ) );
			}
			if ( isset( $content_font['lineHeight'] ) && is_array( $content_font['lineHeight'] ) && ! empty( $content_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $content_font['lineHeight'][0] . ( ! isset( $content_font['lineType'] ) ? 'px' : $content_font['lineType'] ) );
			}
			if ( isset( $content_font['letterSpacing'] ) && ! empty( $content_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $content_font['letterSpacing'] . 'px' );
			}
			if ( isset( $content_font['textTransform'] ) && ! empty( $content_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $content_font['textTransform'] );
			}
			if ( isset( $content_font['family'] ) && ! empty( $content_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $content_font['family'] ) );
			}
			if ( isset( $content_font['style'] ) && ! empty( $content_font['style'] ) ) {
				$css->add_property( 'font-style', $content_font['style'] );
			}
			if ( isset( $content_font['weight'] ) && ! empty( $content_font['weight'] ) && 'regular' !== $content_font['weight'] ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $content_font['weight'] ) );
			}
			if ( isset( $content_font['margin'] ) && is_array( $content_font['margin'] ) && isset( $content_font['margin'][0] ) && is_numeric( $content_font['margin'][0] ) ) {
				$css->add_property( 'margin-top', $content_font['margin'][0] . 'px' );
			}
			if ( isset( $content_font['margin'] ) && is_array( $content_font['margin'] ) && isset( $content_font['margin'][1] ) && is_numeric( $content_font['margin'][1] ) ) {
				$css->add_property( 'margin-right', $content_font['margin'][1] . 'px' );
			}
			if ( isset( $content_font['margin'] ) && is_array( $content_font['margin'] ) && isset( $content_font['margin'][2] ) && is_numeric( $content_font['margin'][2] ) ) {
				$css->add_property( 'margin-bottom', $content_font['margin'][2] . 'px' );
			}
			if ( isset( $content_font['margin'] ) && is_array( $content_font['margin'] ) && isset( $content_font['margin'][3] ) && is_numeric( $content_font['margin'][3] ) ) {
				$css->add_property( 'margin-left', $content_font['margin'][3] . 'px' );
			}
			if ( isset( $content_font['padding'] ) && is_array( $content_font['padding'] ) && isset( $content_font['padding'][0] ) && is_numeric( $content_font['padding'][0] ) ) {
				$css->add_property( 'padding-top', $content_font['padding'][0] . 'px' );
			}
			if ( isset( $content_font['padding'] ) && is_array( $content_font['padding'] ) && isset( $content_font['padding'][1] ) && is_numeric( $content_font['padding'][1] ) ) {
				$css->add_property( 'padding-right', $content_font['padding'][1] . 'px' );
			}
			if ( isset( $content_font['padding'] ) && is_array( $content_font['padding'] ) && isset( $content_font['padding'][2] ) && is_numeric( $content_font['padding'][2] ) ) {
				$css->add_property( 'padding-bottom', $content_font['padding'][2] . 'px' );
			}
			if ( isset( $content_font['padding'] ) && is_array( $content_font['padding'] ) && isset( $content_font['padding'][3] ) && is_numeric( $content_font['padding'][3] ) ) {
				$css->add_property( 'padding-left', $content_font['padding'][3] . 'px' );
			}
			if ( isset( $attributes['contentMinHeight'] ) && is_array( $attributes['contentMinHeight'] ) && isset( $attributes['contentMinHeight'][0] ) && is_numeric( $attributes['contentMinHeight'][0] ) ) {
				$css->add_property( 'min-height', $attributes['contentMinHeight'][0] . 'px' );
			}
		}
		if ( ( $content_font && ( ( isset( $content_font['size'] ) && is_array( $content_font['size'] ) && isset( $content_font['size'][1] ) && ! empty( $content_font['size'][1] ) ) || ( isset( $content_font['lineHeight'] ) && is_array( $content_font['lineHeight'] ) && isset( $content_font['lineHeight'][1] ) && ! empty( $content_font['lineHeight'][1] ) ) ) ) || ( isset( $attributes['contentMinHeight'] ) && is_array( $attributes['contentMinHeight'] ) && isset( $attributes['contentMinHeight'][1] ) && is_numeric( $attributes['contentMinHeight'][1] ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-content' );
			if ( isset( $content_font['size'][1] ) && ! empty( $content_font['size'][1] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $content_font['size'][1], ( ! isset( $content_font['sizeType'] ) ? 'px' : $content_font['sizeType'] ), true ) );
			}
			if ( isset( $content_font['lineHeight'][1] ) && ! empty( $content_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $content_font['lineHeight'][1] . ( ! isset( $content_font['lineType'] ) ? 'px' : $content_font['lineType'] ) );
			}
			if ( isset( $attributes['contentMinHeight'] ) && is_array( $attributes['contentMinHeight'] ) && isset( $attributes['contentMinHeight'][1] ) && is_numeric( $attributes['contentMinHeight'][1] ) ) {
				$css->add_property( 'min-height', $attributes['contentMinHeight'][1] . 'px' );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( ( $content_font && ( ( isset( $content_font['size'] ) && is_array( $content_font['size'] ) && isset( $content_font['size'][2] ) && ! empty( $content_font['size'][2] ) ) || ( isset( $content_font['lineHeight'] ) && is_array( $content_font['lineHeight'] ) && isset( $content_font['lineHeight'][2] ) && ! empty( $content_font['lineHeight'][2] ) ) ) ) || ( isset( $attributes['contentMinHeight'] ) && is_array( $attributes['contentMinHeight'] ) && isset( $attributes['contentMinHeight'][2] ) && is_numeric( $attributes['contentMinHeight'][2] ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-content' );
			if ( isset( $content_font['size'][2] ) && ! empty( $content_font['size'][2] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $content_font['size'][2], ( ! isset( $content_font['sizeType'] ) ? 'px' : $content_font['sizeType'] ), true ) );
			}
			if ( isset( $content_font['lineHeight'][2] ) && ! empty( $content_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $content_font['lineHeight'][2] . ( ! isset( $content_font['lineType'] ) ? 'px' : $content_font['lineType'] ) );
			}
			if ( isset( $attributes['contentMinHeight'] ) && is_array( $attributes['contentMinHeight'] ) && isset( $attributes['contentMinHeight'][2] ) && is_numeric( $attributes['contentMinHeight'][2] ) ) {
				$css->add_property( 'min-height', $attributes['contentMinHeight'][2] . 'px' );
			}
			$css->set_media_state( 'desktop' );
		}

		// Name font.
		$name_font = null;
		if ( isset( $attributes['nameFont'] ) && is_array( $attributes['nameFont'] ) && isset( $attributes['nameFont'][0] ) && is_array( $attributes['nameFont'][0] ) ) {
			$name_font = $attributes['nameFont'][0];
		}
		if ( $name_font ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-name' );
			if ( isset( $name_font['color'] ) && ! empty( $name_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $name_font['color'] ) );
			}
			if ( isset( $name_font['size'] ) && is_array( $name_font['size'] ) && ! empty( $name_font['size'][0] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $name_font['size'][0], ( ! isset( $name_font['sizeType'] ) ? 'px' : $name_font['sizeType'] ), true ) );
			}
			if ( isset( $name_font['lineHeight'] ) && is_array( $name_font['lineHeight'] ) && ! empty( $name_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $name_font['lineHeight'][0] . ( ! isset( $name_font['lineType'] ) ? 'px' : $name_font['lineType'] ) );
			}
			if ( isset( $name_font['letterSpacing'] ) && ! empty( $name_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $name_font['letterSpacing'] . 'px' );
			}
			if ( isset( $name_font['textTransform'] ) && ! empty( $name_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $name_font['textTransform'] );
			}
			if ( isset( $name_font['family'] ) && ! empty( $name_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $name_font['family'] ) );
			}
			if ( isset( $name_font['style'] ) && ! empty( $name_font['style'] ) ) {
				$css->add_property( 'font-style', $name_font['style'] );
			}
			if ( isset( $name_font['weight'] ) && ! empty( $name_font['weight'] ) && 'regular' !== $name_font['weight'] ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $name_font['weight'] ) );
			}
		}
		if ( $name_font && ( ( isset( $name_font['size'] ) && is_array( $name_font['size'] ) && isset( $name_font['size'][1] ) && ! empty( $name_font['size'][1] ) ) || ( isset( $name_font['lineHeight'] ) && is_array( $name_font['lineHeight'] ) && isset( $name_font['lineHeight'][1] ) && ! empty( $name_font['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-name' );
			if ( isset( $name_font['size'][1] ) && ! empty( $name_font['size'][1] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $name_font['size'][1], ( ! isset( $name_font['sizeType'] ) ? 'px' : $name_font['sizeType'] ), true ) );
			}
			if ( isset( $name_font['lineHeight'][1] ) && ! empty( $name_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $name_font['lineHeight'][1] . ( ! isset( $name_font['lineType'] ) ? 'px' : $name_font['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( $name_font && ( ( isset( $name_font['size'] ) && is_array( $name_font['size'] ) && isset( $name_font['size'][2] ) && ! empty( $name_font['size'][2] ) ) || ( isset( $name_font['lineHeight'] ) && is_array( $name_font['lineHeight'] ) && isset( $name_font['lineHeight'][2] ) && ! empty( $name_font['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-name' );
			if ( isset( $name_font['size'][2] ) && ! empty( $name_font['size'][2] ) ) {
				$css->add_property( 'font-size', $this->get_usable_value( $css, $name_font['size'][2], ( ! isset( $name_font['sizeType'] ) ? 'px' : $name_font['sizeType'] ), true ) );
			}
			if ( isset( $name_font['lineHeight'][2] ) && ! empty( $name_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $name_font['lineHeight'][2] . ( ! isset( $name_font['lineType'] ) ? 'px' : $name_font['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['occupationFont'] ) && is_array( $attributes['occupationFont'] ) && is_array( $attributes['occupationFont'][0] ) ) {
			$occupation_font = $attributes['occupationFont'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-occupation' );
			if ( isset( $occupation_font['color'] ) && ! empty( $occupation_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $occupation_font['color'] ) );
			}
			if ( isset( $occupation_font['size'] ) && is_array( $occupation_font['size'] ) && ! empty( $occupation_font['size'][0] ) ) {
				$css->add_property( 'font-size', $occupation_font['size'][0] . ( ! isset( $occupation_font['sizeType'] ) ? 'px' : $occupation_font['sizeType'] ) );
			}
			if ( isset( $occupation_font['lineHeight'] ) && is_array( $occupation_font['lineHeight'] ) && ! empty( $occupation_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $occupation_font['lineHeight'][0] . ( ! isset( $occupation_font['lineType'] ) ? 'px' : $occupation_font['lineType'] ) );
			}
			if ( isset( $occupation_font['letterSpacing'] ) && ! empty( $occupation_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $occupation_font['letterSpacing'] . 'px' );
			}
			if ( isset( $occupation_font['textTransform'] ) && ! empty( $occupation_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $occupation_font['textTransform'] );
			}
			if ( isset( $occupation_font['family'] ) && ! empty( $occupation_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $occupation_font['family'] ) );
			}
			if ( isset( $occupation_font['style'] ) && ! empty( $occupation_font['style'] ) ) {
				$css->add_property( 'font-style', $occupation_font['style'] );
			}
			if ( isset( $occupation_font['weight'] ) && ! empty( $occupation_font['weight'] ) && 'regular' !== $occupation_font['weight'] ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $occupation_font['weight'] ) );
			}
		}
		if ( isset( $attributes['occupationFont'] ) && is_array( $attributes['occupationFont'] ) && isset( $attributes['occupationFont'][0] ) && is_array( $attributes['occupationFont'][0] ) && ( ( isset( $attributes['occupationFont'][0]['size'] ) && is_array( $attributes['occupationFont'][0]['size'] ) && isset( $attributes['occupationFont'][0]['size'][1] ) && ! empty( $attributes['occupationFont'][0]['size'][1] ) ) || ( isset( $attributes['occupationFont'][0]['lineHeight'] ) && is_array( $attributes['occupationFont'][0]['lineHeight'] ) && isset( $attributes['occupationFont'][0]['lineHeight'][1] ) && ! empty( $attributes['occupationFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-occupation' );
			if ( isset( $attributes['occupationFont'][0]['size'][1] ) && ! empty( $attributes['occupationFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attributes['occupationFont'][0]['size'][1] . ( ! isset( $attributes['occupationFont'][0]['sizeType'] ) ? 'px' : $attributes['occupationFont'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['occupationFont'][0]['lineHeight'][1] ) && ! empty( $attributes['occupationFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attributes['occupationFont'][0]['lineHeight'][1] . ( ! isset( $attributes['occupationFont'][0]['lineType'] ) ? 'px' : $attributes['occupationFont'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['occupationFont'] ) && is_array( $attributes['occupationFont'] ) && isset( $attributes['occupationFont'][0] ) && is_array( $attributes['occupationFont'][0] ) && ( ( isset( $attributes['occupationFont'][0]['size'] ) && is_array( $attributes['occupationFont'][0]['size'] ) && isset( $attributes['occupationFont'][0]['size'][2] ) && ! empty( $attributes['occupationFont'][0]['size'][2] ) ) || ( isset( $attributes['occupationFont'][0]['lineHeight'] ) && is_array( $attributes['occupationFont'][0]['lineHeight'] ) && isset( $attributes['occupationFont'][0]['lineHeight'][2] ) && ! empty( $attributes['occupationFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-occupation' );
			if ( isset( $attributes['occupationFont'][0]['size'][2] ) && ! empty( $attributes['occupationFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attributes['occupationFont'][0]['size'][2] . ( ! isset( $attributes['occupationFont'][0]['sizeType'] ) ? 'px' : $attributes['occupationFont'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['occupationFont'][0]['lineHeight'][2] ) && ! empty( $attributes['occupationFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attributes['occupationFont'][0]['lineHeight'][2] . ( ! isset( $attributes['occupationFont'][0]['lineType'] ) ? 'px' : $attributes['occupationFont'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}

		/*
		 * Global styles to apply to all testimonial items
		 */
		if( 'bubble' === $style || 'inlineimage' === $style ){
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );

			$css->add_property( 'max-width', ( isset( $attributes['containerMaxWidth'] ) ? $attributes['containerMaxWidth'] : 500 ) . 'px');
			if ( isset( $attributes['displayIcon'] ) && $attributes['displayIcon'] && $attributes['iconStyles'][ 0 ]['icon'] && $attributes['iconStyles'][ 0 ]['margin'] && $attributes['iconStyles'][ 0 ]['margin'][ 0 ] && ( $attributes['iconStyles'][ 0 ]['margin'][ 0 ] < 0 ) ) {
				$css->add_property( 'padding-top', abs( $attributes['iconStyles'][0]['margin'][0] ) . 'px' );
			}
		} elseif ( $style === 'basic' ){
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
		    $css->add_property( 'max-width', ( isset( $attributes['containerMaxWidth'] ) ? $attributes['containerMaxWidth'] : 500 ) . 'px');
		}

		// See if container styles are applied to the item or text
		if ( 'bubble' !== $style && 'inlineimage' !== $style ){
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
		} else {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap .kt-testimonial-text-wrap' );
		}
		if( isset( $attributes['displayShadow'] ) && $attributes['displayShadow'] ){
			$default_shadow = array(
				'color' => '#000000',
				'opacity' => 0.2,
				'spread' => 0,
				'blur' => 14,
				'hOffset' => 4,
				'vOffset' => 2,

			);
			$shadow = isset( $attributes['shadow'][0] ) ? $attributes['shadow'][0] : $default_shadow;

			$css->add_property( 'box-shadow', $shadow['hOffset'] .'px '. $shadow['vOffset'] .'px '. $shadow['blur'] . 'px '. $shadow['spread'] . 'px ' . $css->render_color( $shadow['color'], $shadow['opacity'] ) );
		}

		if( !empty( $attributes['containerBorderWidth'][0] ) || !empty( $attributes['containerBorderWidth'][1] ) || !empty( $attributes['containerBorderWidth'][2] ) || !empty( $attributes['containerBorderWidth'][3] ) ) {
			$css->render_measure_range( $attributes, 'containerBorderWidth', 'border-width' );

			if ( ! isset( $attributes['containerBorder'] )){
				$attributes['containerBorder'] = '#eeeeee';
			}
			$css->render_color_output( $attributes, 'containerBorder', 'border-color', 'containerBorderOpacity' );
		} else {
			$css->render_border_styles( $attributes, 'borderStyle' );
		}

		$css->render_color_output( $attributes, 'containerBackground', 'background', 'containerBackgroundOpacity' );

		if( !empty( $attributes['containerBorderRadius'] ) ){
			$css->render_range( $attributes, 'containerBorderRadius', 'border-radius' );
		} else {
			$br_attributes = array(
				'unit_key' => 'containerBorderRadiusUnit',
				'desktop_key' => 'responsiveContainerBorderRadius',
				'tablet_key' => 'tabletContainerBorderRadius',
				'mobile_key' => 'mobileContainerBorderRadius',
			);
			$css->render_measure_output( $attributes, 'containerBorderRadius', 'border-radius', $br_attributes );
		}

		// $css->render_range( $attributes, 'containerPadding', 'padding' );

		if ( in_array( $style, array( 'card', 'inlineimage', 'bubble') ) ) {
			$css->add_property( 'max-width', isset( $attributes['containerMaxWidth'] ) ? $attributes['containerMaxWidth'] . 'px' : '500px' );
		}

		/*
		 * Global Media styles
		 */
		if ( ! isset( $attributes['displayMedia'] ) || ( isset( $attributes['displayMedia'] ) && $attributes['displayMedia'] ) ){
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-media-inner-wrap' );
			if ( isset( $attributes['mediaStyles'][0]['width'] ) && $style !== 'card' ) {
				$css->add_property( 'width', $attributes['mediaStyles'][0]['width'] . 'px' );
			}


			if ( ! empty( $attributes['mediaStyles'][0]['borderWidth'][0] ) || ! empty( $attributes['mediaStyles'][0]['borderWidth'][1] ) || ! empty( $attributes['mediaStyles'][0]['borderWidth'][2] ) || ! empty( $attributes['mediaStyles'][0]['borderWidth'][3] ) ) {
				if ( ! isset( $attributes['mediaStyles'][0]['border'] ) ) {
					$attributes['mediaStyles'][0]['border'] = '#555555';
				}

				$css->render_color_output( $attributes['mediaStyles'][0], 'border', 'border-color' );
				$css->render_measure_range( $attributes['mediaStyles'][0], 'borderWidth', 'border-width' );
				$css->render_range( $attributes['mediaStyles'][0], 'borderRadius', 'border-radius' );
			} else {
				$css->render_border_styles( $attributes, 'mediaBorderStyle', 'border' );
				$css->render_border_radius( $attributes, 'mediaBorderRadius', ( isset( $attributes['mediaBorderRadiusUnit'] ) ? $attributes['mediaBorderRadiusUnit'] : 'px' ) );
			}

			if ( isset( $attributes['mediaStyles'][0] ) ) {
				$css->render_color_output( $attributes['mediaStyles'][0], 'background', 'background-color', 'backgroundOpacity' );
			}

			if( isset( $attributes['mediaStyles'][0] ) && array_filter( $attributes['mediaStyles'][0]['padding'] )  ) {
				$css->render_range( $attributes['mediaStyles'][0], 'padding', 'padding' );
			} else {
				$css->render_measure_output( $attributes, 'mediaPadding', 'padding' );
			}

			if( isset( $attributes['mediaStyles'][0] ) && array_filter( $attributes['mediaStyles'][0]['margin'] )  ) {
				$css->render_range( $attributes['mediaStyles'][0], 'margin', 'margin' );
			} else {
				$css->render_measure_output( $attributes, 'mediaMargin', 'margin' );
			}

			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-svg-testimonial-icon' );
			$css->add_property( 'justify-content', 'center' );
			$css->add_property( 'align-items', 'center' );

			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-media-inner-wrap .kadence-testimonial-image-intrisic' );
			if ( $style === 'card' && ! empty( $attributes['mediaStyles'][0]['ratio'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['mediaStyles'][0]['ratio'] . '%' );
			}
		}

		/*
		 * Rating Styles
		 */
		if( isset( $attributes['displayRating'] ) && $attributes['displayRating'] ){
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-rating-wrap' );

			if( isset( $attributes['ratingStyles'][0]['margin'] ) && array_filter( $attributes['ratingStyles'][0]['margin'] ) ){
				$css->render_range( $attributes['ratingStyles'][0], 'margin', 'margin' );
			} else {
				$css->render_measure_output( $attributes, 'ratingMargin', 'margin' );
			}

			$css->render_measure_output( $attributes, 'ratingPadding', 'padding' );

			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-rating-wrap .kt-svg-testimonial-rating-icon' );
			$css->render_color_output( isset( $attributes['ratingStyles'][0] ) ? $attributes['ratingStyles'][0] : array( 'color' => '#ffd700' ), 'color', 'color' );
			$css->add_property( 'font-size', isset( $attributes['ratingStyles'][0] ) && isset( $attributes['ratingStyles'][0]['size'] ) ? $attributes['ratingStyles'][0]['size'] . 'px' : '16px' );

			$css->add_property( 'display', 'inline-flex' );
			$css->add_property( 'justify-content', 'center' );
			$css->add_property( 'align-items', 'center' );
		}

		/*
		 * Icon Styles
		 */
		if( isset( $attributes['displayIcon'] ) && $attributes['displayIcon'] ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-svg-testimonial-global-icon svg' );
			$css->add_property( 'display', 'inline-block' );
			$css->add_property( 'vertical-align', 'middle' );
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

				$carousel_content .= '<div class="kt-blocks-carousel-init kb-gallery-carousel kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-columns-xxl="' . esc_attr( $columns_xxl ) . '" data-columns-xl="' . esc_attr( $columns_xl ) . '" data-columns-md="' . esc_attr( $columns_md ) . '" data-columns-sm="' . esc_attr( $columns_sm ) . '" data-columns-xs="' . esc_attr( $columns_xs ) . '" data-columns-ss="' . esc_attr( $columns_ss ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-scroll="' . esc_attr( $slides_sc ) . '" data-slider-type="' . esc_attr( $slider_type ) . '" data-slider-arrows="' . esc_attr( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-dots="' . esc_attr( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-speed="' . esc_attr( $auto_speed ) . '" data-slider-gap="' . esc_attr( $this->get_usable_value( $css_class, $gap, $gap_unit ) ) . '" data-slider-gap-tablet="' . esc_attr( $this->get_usable_value( $css_class, $tablet_gap, $gap_unit ) ) . '" data-slider-gap-mobile="' . esc_attr( $this->get_usable_value( $css_class, $mobile_gap, $gap_unit ) ) . '">';
				$carousel_content .= $content;
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
				$inner_content = sprintf( '<div %1$s>%2$s</div>', $inner_wrapper_attributes, $content );
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
	}
}

Kadence_Blocks_Testimonials_Block::get_instance();
