<?php
/**
 * Class to Build the Form Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Form Block.
 *
 * @category class
 */
class Kadence_Blocks_Form_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'form';

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

		$this->enqueue_script( 'kadence-blocks-form' );

		if ( isset( $attributes['recaptcha'] ) && $attributes['recaptcha'] ) {
			if ( isset( $attributes['recaptchaVersion'] ) && 'v2' === $attributes['recaptchaVersion'] ) {
				$this->enqueue_script( 'kadence-blocks-google-recaptcha-v2' );
			} else {
				$this->enqueue_script( 'kadence-blocks-google-recaptcha-v3' );
			}
		}

		// Add Label heading font.
		if ( isset( $attributes['labelFont'] ) && is_array( $attributes['labelFont'] ) && isset( $attributes['labelFont'][0] ) && is_array( $attributes['labelFont'][0] ) && isset( $attributes['labelFont'][0]['google'] ) && $attributes['labelFont'][0]['google'] && ( ! isset( $attributes['labelFont'][0]['loadGoogle'] ) || true === $attributes['labelFont'][0]['loadGoogle'] ) && isset( $attributes['labelFont'][0]['family'] ) ) {
			$label_font = $attributes['labelFont'][0];

			$font_family  = ( isset( $label_font['family'] ) ? $label_font['family'] : '' );
			$font_variant = ( isset( $label_font['variant'] ) ? $label_font['variant'] : '' );
			$font_subset  = ( isset( $label_font['subset'] ) ? $label_font['subset'] : '' );

			$css->maybe_add_google_font( $font_family, $font_variant, $font_subset );
		}
		// Add submit font.
		if ( isset( $attributes['submitFont'] ) && is_array( $attributes['submitFont'] ) && isset( $attributes['submitFont'][0] ) && is_array( $attributes['submitFont'][0] ) && isset( $attributes['submitFont'][0]['google'] ) && $attributes['submitFont'][0]['google'] && ( ! isset( $attributes['submitFont'][0]['loadGoogle'] ) || true === $attributes['submitFont'][0]['loadGoogle'] ) && isset( $attributes['submitFont'][0]['family'] ) ) {
			$submit_font = $attributes['submitFont'][0];

			$font_family  = ( isset( $submit_font['family'] ) ? $submit_font['family'] : '' );
			$font_variant = ( isset( $submit_font['variant'] ) ? $submit_font['variant'] : '' );
			$font_subset  = ( isset( $submit_font['subset'] ) ? $submit_font['subset'] : '' );

			$css->maybe_add_google_font( $font_family, $font_variant, $font_subset );
		}
		// Add Message font.
		if ( isset( $attributes['messageFont'] ) && is_array( $attributes['messageFont'] ) && isset( $attributes['messageFont'][0] ) && is_array( $attributes['messageFont'][0] ) && isset( $attributes['messageFont'][0]['google'] ) && $attributes['messageFont'][0]['google'] && ( ! isset( $attributes['messageFont'][0]['loadGoogle'] ) || true === $attributes['messageFont'][0]['loadGoogle'] ) && isset( $attributes['messageFont'][0]['family'] ) ) {
			$message_font = $attributes['messageFont'][0];

			$font_family  = ( isset( $message_font['family'] ) ? $message_font['family'] : '' );
			$font_variant = ( isset( $message_font['variant'] ) ? $message_font['variant'] : '' );
			$font_subset  = ( isset( $message_font['subset'] ) ? $message_font['subset'] : '' );

			$css->maybe_add_google_font( $font_family, $font_variant, $font_subset );
		}

		$css->set_selector( '.wp-block-kadence-form.kadence-form-' . $unique_id . '.kb-form-wrap' );
		$css->render_measure_output( $attributes, 'containerMargin', 'margin');

		if ( isset( $attributes['style'] ) && is_array( $attributes['style'] ) && isset( $attributes['style'][0] ) && is_array( $attributes['style'][0] ) ) {
			$style = $attributes['style'][0];
			if ( isset( $style['rowGap'] ) && is_numeric( $style['rowGap'] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field' );
				$css->add_property( 'margin-bottom', $style['rowGap'] . ( isset( $style['rowGapType'] ) && ! empty( $style['rowGapType'] ) ? $style['rowGapType'] : 'px' ) );

				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-submit-field' );
				$css->add_property( 'margin-bottom', 0 );
			}
			if ( isset( $style['gutter'] ) && is_numeric( $style['gutter'] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field' );
				$css->add_property( 'padding-right', floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) );
				$css->add_property( 'padding-left', floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) );

				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form' );
				$css->add_property( 'margin-right', '-' . floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) );
				$css->add_property( 'margin-left', '-' . floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) );

			}
			if ( isset( $style['tabletRowGap'] ) && is_numeric( $style['tabletRowGap'] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field' );
				$css->add_property( 'margin-bottom', $style['tabletRowGap'] . ( isset( $style['rowGapType'] ) && ! empty( $style['rowGapType'] ) ? $style['rowGapType'] : 'px' ) );

				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-submit-field' );
				$css->add_property( 'margin-bottom', 0 );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $style['tabletGutter'] ) && is_numeric( $style['tabletGutter'] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field' );
				$css->add_property( 'padding-right', ( floor( $style['tabletGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );
				$css->add_property( 'padding-left', ( floor( $style['tabletGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );

				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form' );
				$css->add_property( 'margin-right', '-' . ( floor( $style['tabletGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );
				$css->add_property( 'margin-left', '-' . ( floor( $style['tabletGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $style['mobileRowGap'] ) && is_numeric( $style['mobileRowGap'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field' );
				$css->add_property( 'margin-bottom', $style['mobileRowGap'] . ( isset( $style['rowGapType'] ) && ! empty( $style['rowGapType'] ) ? $style['rowGapType'] : 'px' ) );

				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-submit-field' );
				$css->add_property( 'margin-bottom', 0 );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $style['mobileGutter'] ) && is_numeric( $style['mobileGutter'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field' );
				$css->add_property( 'padding-right', ( floor( $style['mobileGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );
				$css->add_property( 'padding-left', ( floor( $style['mobileGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );

				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form' );
				$css->add_property( 'margin-right', '-' . ( floor( $style['mobileGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );
				$css->add_property( 'margin-left', '-' . ( floor( $style['mobileGutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) ) );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $style['requiredColor'] ) && ! empty( $style['requiredColor'] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field label .required' );
				$css->add_property( 'color', $css->render_color( $style['requiredColor'] ) );

			}
			if ( ( isset( $style['color'] ) && ! empty( $style['color'] ) ) || ( isset( $style['background'] ) && ! empty( $style['background'] ) ) || ( isset( $style['border'] ) && ! empty( $style['border'] ) ) || ( isset( $style['backgroundType'] ) && 'gradient' === $style['backgroundType'] ) || ( isset( $style['boxShadow'] ) && is_array( $style['boxShadow'] ) && isset( $style['boxShadow'][0] ) && true === $style['boxShadow'][0] ) || ( isset( $style['borderRadius'] ) && is_numeric( $style['borderRadius'] ) ) || ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) ) || ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][0] ) ) || ( isset( $style['borderWidth'] ) && is_array( $style['borderWidth'] ) && is_numeric( $style['borderWidth'][0] ) ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field' );
				if ( isset( $style['color'] ) && ! empty( $style['color'] ) ) {
					$css->add_property( 'color', $css->render_color( $style['color'] ) );
				}
				if ( isset( $style['borderRadius'] ) && is_numeric( $style['borderRadius'] ) ) {
					$css->add_property( 'border-radius', $style['borderRadius'] . 'px' );
				}
				if ( !empty( $style['fontSize'][0] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $style['fontSize'][0], ( isset( $style['fontSizeType'] ) && ! empty( $style['fontSizeType'] ) ? $style['fontSizeType'] : 'px' ) ) );
				}
				if ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][0] ) ) {
					$css->add_property( 'line-height', $style['lineHeight'][0] . ( isset( $style['lineType'] ) && ! empty( $style['lineType'] ) ? $style['lineType'] : 'px' ) );
				}
				if ( isset( $style['borderWidth'] ) && is_array( $style['borderWidth'] ) && is_numeric( $style['borderWidth'][0] ) ) {
					$css->add_property( 'border-width', $style['borderWidth'][0] . 'px ' . $style['borderWidth'][1] . 'px ' . $style['borderWidth'][2] . 'px ' . $style['borderWidth'][3] . 'px' );
				}
				if ( isset( $style['backgroundType'] ) && 'gradient' === $style['backgroundType'] ) {
					$bg1 = ( ! isset( $style['background'] ) || 'transparent' === $style['background'] ? 'rgba(255,255,255,0)' : $css->render_color( $style['background'], ( isset( $style['backgroundOpacity'] ) && is_numeric( $style['backgroundOpacity'] ) ? $style['backgroundOpacity'] : 1 ) ) );
					$bg2 = ( isset( $style['gradient'][0] ) && ! empty( $style['gradient'][0] ) ? $css->render_color( $style['gradient'][0], ( isset( $style['gradient'][1] ) && is_numeric( $style['gradient'][1] ) ? $style['gradient'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $style['gradient'][1] ) && is_numeric( $style['gradient'][1] ) ? $style['gradient'][1] : 1 ) ) );
					if ( isset( $style['gradient'][4] ) && 'radial' === $style['gradient'][4] ) {
						$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $style['gradient'][6] ) && ! empty( $style['gradient'][6] ) ? $style['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $style['gradient'][2] ) && is_numeric( $style['gradient'][2] ) ? $style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradient'][3] ) && is_numeric( $style['gradient'][3] ) ? $style['gradient'][3] : '100' ) . '%)' );
					} else if ( ! isset( $style['gradient'][4] ) || 'radial' !== $style['gradient'][4] ) {
						$css->add_property( 'background', 'linear-gradient(' . ( isset( $style['gradient'][5] ) && ! empty( $style['gradient'][5] ) ? $style['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $style['gradient'][2] ) && is_numeric( $style['gradient'][2] ) ? $style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradient'][3] ) && is_numeric( $style['gradient'][3] ) ? $style['gradient'][3] : '100' ) . '%)' );
					}
				} else if ( isset( $style['background'] ) && ! empty( $style['background'] ) ) {
					$alpha = ( isset( $style['backgroundOpacity'] ) && is_numeric( $style['backgroundOpacity'] ) ? $style['backgroundOpacity'] : 1 );
					$css->add_property( 'background', $css->render_color( $style['background'], $alpha ) );
				}
				if ( isset( $style['border'] ) && ! empty( $style['border'] ) ) {
					$alpha = ( isset( $style['borderOpacity'] ) && is_numeric( $style['borderOpacity'] ) ? $style['borderOpacity'] : 1 );
					$css->add_property( 'border-color', $css->render_color( $style['border'], $alpha ) );
				}
				if ( isset( $style['boxShadow'] ) && is_array( $style['boxShadow'] ) && isset( $style['boxShadow'][0] ) && true === $style['boxShadow'][0] ) {
					$css->add_property( 'box-shadow', ( isset( $style['boxShadow'][7] ) && true === $style['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $style['boxShadow'][3] ) && is_numeric( $style['boxShadow'][3] ) ? $style['boxShadow'][3] : '1' ) . 'px ' . ( isset( $style['boxShadow'][4] ) && is_numeric( $style['boxShadow'][4] ) ? $style['boxShadow'][4] : '1' ) . 'px ' . ( isset( $style['boxShadow'][5] ) && is_numeric( $style['boxShadow'][5] ) ? $style['boxShadow'][5] : '2' ) . 'px ' . ( isset( $style['boxShadow'][6] ) && is_numeric( $style['boxShadow'][6] ) ? $style['boxShadow'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $style['boxShadow'][1] ) && ! empty( $style['boxShadow'][1] ) ? $style['boxShadow'][1] : '#000000' ), ( isset( $style['boxShadow'][2] ) && is_numeric( $style['boxShadow'][2] ) ? $style['boxShadow'][2] : 0.2 ) ) );
				}

			}
			if ( ( isset( $style['colorActive'] ) && ! empty( $style['colorActive'] ) ) || ( isset( $style['backgroundActive'] ) && ! empty( $style['backgroundActive'] ) ) || ( isset( $style['borderActive'] ) && ! empty( $style['borderActive'] ) ) || ( isset( $style['backgroundActiveType'] ) && 'gradient' === $style['backgroundActiveType'] ) || ( isset( $style['boxShadow'] ) && is_array( $style['boxShadow'] ) && isset( $style['boxShadow'][0] ) && true === $style['boxShadow'][0] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field:focus, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field:focus' );
				if ( isset( $style['colorActive'] ) && ! empty( $style['colorActive'] ) ) {
					$css->add_property( 'color', $css->render_color( $style['colorActive'] ) );
				}
				if ( isset( $style['borderActive'] ) && ! empty( $style['borderActive'] ) ) {
					$alpha = ( isset( $style['borderActiveOpacity'] ) && is_numeric( $style['borderActiveOpacity'] ) ? $style['borderActiveOpacity'] : 1 );
					$css->add_property( 'border-color', $css->render_color( $style['borderActive'], $alpha ) );
				}
				if ( isset( $style['boxShadowActive'] ) && is_array( $style['boxShadowActive'] ) && isset( $style['boxShadowActive'][0] ) && true === $style['boxShadowActive'][0] ) {
					$css->add_property( 'box-shadow', ( isset( $style['boxShadowActive'][7] ) && true === $style['boxShadowActive'][7] ? 'inset ' : '' ) . ( isset( $style['boxShadowActive'][3] ) && is_numeric( $style['boxShadowActive'][3] ) ? $style['boxShadowActive'][3] : '2' ) . 'px ' . ( isset( $style['boxShadowActive'][4] ) && is_numeric( $style['boxShadowActive'][4] ) ? $style['boxShadowActive'][4] : '2' ) . 'px ' . ( isset( $style['boxShadowActive'][5] ) && is_numeric( $style['boxShadowActive'][5] ) ? $style['boxShadowActive'][5] : '3' ) . 'px ' . ( isset( $style['boxShadowActive'][6] ) && is_numeric( $style['boxShadowActive'][6] ) ? $style['boxShadowActive'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $style['boxShadowActive'][1] ) && ! empty( $style['boxShadowActive'][1] ) ? $style['boxShadowActive'][1] : '#000000' ), ( isset( $style['boxShadowActive'][2] ) && is_numeric( $style['boxShadowActive'][2] ) ? $style['boxShadowActive'][2] : 0.4 ) ) );
				}
				if ( isset( $style['backgroundActiveType'] ) && 'gradient' === $style['backgroundActiveType'] ) {
					$bg1 = ( ! isset( $style['backgroundActive'] ) ? $css->render_color( '#444444', ( isset( $style['backgroundActiveOpacity'] ) && is_numeric( $style['backgroundActiveOpacity'] ) ? $style['backgroundActiveOpacity'] : 1 ) ) : $css->render_color( $style['backgroundActive'], ( isset( $style['backgroundActiveOpacity'] ) && is_numeric( $style['backgroundActiveOpacity'] ) ? $style['backgroundActiveOpacity'] : 1 ) ) );
					$bg2 = ( isset( $style['gradientActive'][0] ) && ! empty( $style['gradientActive'][0] ) ? $css->render_color( $style['gradientActive'][0], ( isset( $style['gradientActive'][1] ) && is_numeric( $style['gradientActive'][1] ) ? $style['gradientActive'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $style['gradientActive'][1] ) && is_numeric( $style['gradientActive'][1] ) ? $style['gradientActive'][1] : 1 ) ) );
					if ( isset( $style['gradientActive'][4] ) && 'radial' === $style['gradientActive'][4] ) {
						$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $style['gradientActive'][6] ) && ! empty( $style['gradientActive'][6] ) ? $style['gradientActive'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $style['gradientActive'][2] ) && is_numeric( $style['gradientActive'][2] ) ? $style['gradientActive'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradientActive'][3] ) && is_numeric( $style['gradientActive'][3] ) ? $style['gradientActive'][3] : '100' ) . '%)' );
					} else if ( ! isset( $style['gradientActive'][4] ) || 'radial' !== $style['gradientActive'][4] ) {
						$css->add_property( 'background', 'linear-gradient(' . ( isset( $style['gradientActive'][5] ) && ! empty( $style['gradientActive'][5] ) ? $style['gradientActive'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $style['gradientActive'][2] ) && is_numeric( $style['gradientActive'][2] ) ? $style['gradientActive'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradientActive'][3] ) && is_numeric( $style['gradientActive'][3] ) ? $style['gradientActive'][3] : '100' ) . '%)' );
					}
				} else if ( isset( $style['backgroundActive'] ) && ! empty( $style['backgroundActive'] ) ) {
					$alpha = ( isset( $style['backgroundActiveOpacity'] ) && is_numeric( $style['backgroundActiveOpacity'] ) ? $style['backgroundActiveOpacity'] : 1 );
					$css->add_property( 'background', $css->render_color( $style['backgroundActive'], $alpha ) );
				}

			}
			if ( ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][1] ) ) || ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][1] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field' );
				if ( !empty( $style['fontSize'][1] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $style['fontSize'][1], ( isset( $style['fontSizeType'] ) && ! empty( $style['fontSizeType'] ) ? $style['fontSizeType'] : 'px' ) ) );
				}
				if ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][1] ) ) {
					$css->add_property( 'line-height', $style['lineHeight'][1] . ( isset( $style['lineType'] ) && ! empty( $style['lineType'] ) ? $style['lineType'] : 'px' ) );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][2] ) ) || ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][2] ) ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field' );
				if ( !empty( $style['fontSize'][2] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $style['fontSize'][2], ( isset( $style['fontSizeType'] ) && ! empty( $style['fontSizeType'] ) ? $style['fontSizeType'] : 'px' ) ) );
				}
				if ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][2] ) ) {
					$css->add_property( 'line-height', $style['lineHeight'][2] . ( isset( $style['lineType'] ) && ! empty( $style['lineType'] ) ? $style['lineType'] : 'px' ) );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $style['size'] ) && 'custom' && $style['size'] && isset( $style['deskPadding'] ) && is_array( $style['deskPadding'] ) && isset( $style['deskPadding'][0] ) && is_numeric( $style['deskPadding'][0] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field' );
				if ( isset( $style['deskPadding'][0] ) && is_numeric( $style['deskPadding'][0] ) ) {
					$css->add_property( 'padding-top', $style['deskPadding'][0] . 'px' );
				}
				if ( isset( $style['deskPadding'][1] ) && is_numeric( $style['deskPadding'][1] ) ) {
					$css->add_property( 'padding-right', $style['deskPadding'][1] . 'px' );
				}
				if ( isset( $style['deskPadding'][2] ) && is_numeric( $style['deskPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $style['deskPadding'][2] . 'px' );
				}
				if ( isset( $style['deskPadding'][3] ) && is_numeric( $style['deskPadding'][3] ) ) {
					$css->add_property( 'padding-left', $style['deskPadding'][3] . 'px' );
				}

			}
			if ( isset( $style['size'] ) && 'custom' && $style['size'] && isset( $style['tabletPadding'] ) && is_array( $style['tabletPadding'] ) && isset( $style['tabletPadding'][0] ) && is_numeric( $style['tabletPadding'][0] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field' );
				if ( isset( $style['tabletPadding'][0] ) && is_numeric( $style['tabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $style['tabletPadding'][0] . 'px' );
				}
				if ( isset( $style['tabletPadding'][1] ) && is_numeric( $style['tabletPadding'][1] ) ) {
					$css->add_property( 'padding-right', $style['tabletPadding'][1] . 'px' );
				}
				if ( isset( $style['tabletPadding'][2] ) && is_numeric( $style['tabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $style['tabletPadding'][2] . 'px' );
				}
				if ( isset( $style['tabletPadding'][3] ) && is_numeric( $style['tabletPadding'][3] ) ) {
					$css->add_property( 'padding-left', $style['tabletPadding'][3] . 'px' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $style['size'] ) && 'custom' && $style['size'] && isset( $style['mobilePadding'] ) && is_array( $style['mobilePadding'] ) && isset( $style['mobilePadding'][0] ) && is_numeric( $style['mobilePadding'][0] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field' );
				if ( isset( $style['mobilePadding'][0] ) && is_numeric( $style['mobilePadding'][0] ) ) {
					$css->add_property( 'padding-top', $style['mobilePadding'][0] . 'px' );
				}
				if ( isset( $style['mobilePadding'][1] ) && is_numeric( $style['mobilePadding'][1] ) ) {
					$css->add_property( 'padding-right', $style['mobilePadding'][1] . 'px' );
				}
				if ( isset( $style['mobilePadding'][2] ) && is_numeric( $style['mobilePadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $style['mobilePadding'][2] . 'px' );
				}
				if ( isset( $style['mobilePadding'][3] ) && is_numeric( $style['mobilePadding'][3] ) ) {
					$css->add_property( 'padding-left', $style['mobilePadding'][3] . 'px' );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['labelFont'] ) && is_array( $attributes['labelFont'] ) && isset( $attributes['labelFont'][0] ) && is_array( $attributes['labelFont'][0] ) ) {
			$label_font = $attributes['labelFont'][0];
			$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field > label' );
			if ( isset( $label_font['color'] ) && ! empty( $label_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $label_font['color'] ) );
			}
			if ( !empty( $label_font['size'][0] ) ) {
				$css->add_property( 'font-size', $css->get_font_size( $label_font['size'][0], ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) ) );
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $label_font['lineHeight'][0] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) );
			}
			if ( isset( $label_font['letterSpacing'] ) && is_numeric( $label_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $label_font['letterSpacing'] . 'px' );
			}
			if ( isset( $label_font['textTransform'] ) && ! empty( $label_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $label_font['textTransform'] );
			}
			if ( isset( $label_font['family'] ) && ! empty( $label_font['family'] ) ) {
				$css->add_property( 'font-family', $label_font['family'] );
			}
			if ( isset( $label_font['style'] ) && ! empty( $label_font['style'] ) ) {
				$css->add_property( 'font-style', $label_font['style'] );
			}
			if ( isset( $label_font['weight'] ) && ! empty( $label_font['weight'] ) ) {
				$css->add_property( 'font-weight', $label_font['weight'] );
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][0] ) ) {
				$css->add_property( 'padding-top', $label_font['padding'][0] . 'px' );
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][1] ) ) {
				$css->add_property( 'padding-right', $label_font['padding'][1] . 'px' );
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][2] ) ) {
				$css->add_property( 'padding-bottom', $label_font['padding'][2] . 'px' );
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][3] ) ) {
				$css->add_property( 'padding-left', $label_font['padding'][3] . 'px' );
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][0] ) ) {
				$css->add_property( 'margin-top', $label_font['margin'][0] . 'px' );
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][1] ) ) {
				$css->add_property( 'margin-right', $label_font['margin'][1] . 'px' );
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][2] ) ) {
				$css->add_property( 'margin-bottom', $label_font['margin'][2] . 'px' );
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][3] ) ) {
				$css->add_property( 'margin-left', $label_font['margin'][3] . 'px' );
			}

			if ( !empty( $label_font['lineHeight'][0] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-accept-form-field .kb-checkbox-style' );
				$css->add_property( 'font-size', $css->get_font_size( $label_font['lineHeight'][0], ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) ) );
				$css->add_property( 'height', '1em' );
				$css->add_property( 'margin-top', '0' );

			}
			if ( ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][1] ) ) || ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][1] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field > label' );
				if ( !empty( $label_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $label_font['size'][1], ( isset( $label_font['sizeType'] ) && ! empty( $label_font['sizeType'] ) ? $label_font['sizeType'] : 'px' ) ) );
				}
				if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][1] ) ) {
					$css->add_property( 'line-height', $label_font['lineHeight'][1] . ( isset( $label_font['lineType'] ) && ! empty( $label_font['lineType'] ) ? $label_font['lineType'] : 'px' ) );
				}

				if ( !empty( $label_font['lineHeight'][1] ) ) {
					$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-accept-form-field .kb-checkbox-style' );
					$css->add_property( 'font-size', $css->get_font_size( $label_font['lineHeight'][1], ( isset( $label_font['lineType'] ) && ! empty( $label_font['lineType'] ) ? $label_font['lineType'] : 'px' ) ) );
					$css->add_property( 'height', '1em' );
					$css->add_property( 'margin-top', '0' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][2] ) ) || ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][2] ) ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field > label' );
				if ( !empty( $label_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $label_font['size'][2], ( isset( $label_font['sizeType'] ) && ! empty( $label_font['sizeType'] ) ? $label_font['sizeType'] : 'px' ) ) );
				}
				if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][2] ) ) {
					$css->add_property( 'line-height', $label_font['lineHeight'][2] . ( isset( $label_font['lineType'] ) && ! empty( $label_font['lineType'] ) ? $label_font['lineType'] : 'px' ) );
				}

				if ( !empty( $label_font['lineHeight'][2] ) ) {
					$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-accept-form-field .kb-checkbox-style' );
					$css->add_property( 'font-size', $css->get_font_size( $label_font['lineHeight'][2], ( isset( $label_font['lineType'] ) && ! empty( $label_font['lineType'] ) ? $label_font['lineType'] : 'px' ) ) );
					$css->add_property( 'height', '1em' );
					$css->add_property( 'margin-top', '0' );

				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['submit'] ) && is_array( $attributes['submit'] ) && isset( $attributes['submit'][0] ) && is_array( $attributes['submit'][0] ) ) {
			$submit = $attributes['submit'][0];
			$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
			if ( isset( $submit['widthType'] ) && 'fixed' === $submit['widthType'] && isset( $submit['fixedWidth'] ) && is_array( $submit['fixedWidth'] ) && isset( $submit['fixedWidth'][0] ) && ! empty( $submit['fixedWidth'][0] ) ) {
				$css->add_property( 'width', $submit['fixedWidth'][0] . 'px' );
			}
			if ( isset( $submit['color'] ) && ! empty( $submit['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $submit['color'] ) );
			}
			if ( isset( $submit['borderRadius'] ) && is_numeric( $submit['borderRadius'] ) ) {
				$css->add_property( 'border-radius', $submit['borderRadius'] . 'px' );
			}
			if ( isset( $submit['borderWidth'] ) && is_array( $submit['borderWidth'] ) && is_numeric( $submit['borderWidth'][0] ) ) {
				$css->add_property( 'border-width', $submit['borderWidth'][0] . 'px ' . $submit['borderWidth'][1] . 'px ' . $submit['borderWidth'][2] . 'px ' . $submit['borderWidth'][3] . 'px' );
			}
			if ( isset( $submit['backgroundType'] ) && 'gradient' === $submit['backgroundType'] || isset( $submit['backgroundHoverType'] ) && 'gradient' === $submit['backgroundHoverType'] ) {
				$bgtype = 'gradient';
			} else {
				$bgtype = 'solid';
			}
			if ( isset( $submit['backgroundType'] ) && 'gradient' === $submit['backgroundType'] ) {
				$bg1 = ( ! isset( $submit['background'] ) || 'transparent' === $submit['background'] ? 'rgba(255,255,255,0)' : $css->render_color( $submit['background'], ( isset( $submit['backgroundOpacity'] ) && is_numeric( $submit['backgroundOpacity'] ) ? $submit['backgroundOpacity'] : 1 ) ) );
				$bg2 = ( isset( $submit['gradient'][0] ) && ! empty( $submit['gradient'][0] ) ? $css->render_color( $submit['gradient'][0], ( isset( $submit['gradient'][1] ) && is_numeric( $submit['gradient'][1] ) ? $submit['gradient'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $submit['gradient'][1] ) && is_numeric( $submit['gradient'][1] ) ? $submit['gradient'][1] : 1 ) ) );
				if ( isset( $submit['gradient'][4] ) && 'radial' === $submit['gradient'][4] ) {
					$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $submit['gradient'][6] ) && ! empty( $submit['gradient'][6] ) ? $submit['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $submit['gradient'][2] ) && is_numeric( $submit['gradient'][2] ) ? $submit['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradient'][3] ) && is_numeric( $submit['gradient'][3] ) ? $submit['gradient'][3] : '100' ) . '%)' );
				} else if ( ! isset( $submit['gradient'][4] ) || 'radial' !== $submit['gradient'][4] ) {
					$css->add_property( 'background', 'linear-gradient(' . ( isset( $submit['gradient'][5] ) && ! empty( $submit['gradient'][5] ) ? $submit['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $submit['gradient'][2] ) && is_numeric( $submit['gradient'][2] ) ? $submit['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradient'][3] ) && is_numeric( $submit['gradient'][3] ) ? $submit['gradient'][3] : '100' ) . '%)' );
				}
			} else if ( isset( $submit['background'] ) && ! empty( $submit['background'] ) ) {
				$alpha = ( isset( $submit['backgroundOpacity'] ) && is_numeric( $submit['backgroundOpacity'] ) ? $submit['backgroundOpacity'] : 1 );
				$css->add_property( 'background', $css->render_color( $submit['background'], $alpha ) );
			}
			if ( isset( $submit['border'] ) && ! empty( $submit['border'] ) ) {
				$alpha = ( isset( $submit['borderOpacity'] ) && is_numeric( $submit['borderOpacity'] ) ? $submit['borderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $submit['border'], $alpha ) );
			}
			if ( isset( $submit['boxShadow'] ) && is_array( $submit['boxShadow'] ) && isset( $submit['boxShadow'][0] ) && true === $submit['boxShadow'][0] ) {
				$css->add_property( 'box-shadow', ( isset( $submit['boxShadow'][7] ) && true === $submit['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadow'][3] ) && is_numeric( $submit['boxShadow'][3] ) ? $submit['boxShadow'][3] : '1' ) . 'px ' . ( isset( $submit['boxShadow'][4] ) && is_numeric( $submit['boxShadow'][4] ) ? $submit['boxShadow'][4] : '1' ) . 'px ' . ( isset( $submit['boxShadow'][5] ) && is_numeric( $submit['boxShadow'][5] ) ? $submit['boxShadow'][5] : '2' ) . 'px ' . ( isset( $submit['boxShadow'][6] ) && is_numeric( $submit['boxShadow'][6] ) ? $submit['boxShadow'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $submit['boxShadow'][1] ) && ! empty( $submit['boxShadow'][1] ) ? $submit['boxShadow'][1] : '#000000' ), ( isset( $submit['boxShadow'][2] ) && is_numeric( $submit['boxShadow'][2] ) ? $submit['boxShadow'][2] : 0.2 ) ) );
			}

			$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit:hover, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit:focus ' );
			if ( isset( $submit['colorHover'] ) && ! empty( $submit['colorHover'] ) ) {
				$css->add_property( 'color', $css->render_color( $submit['colorHover'] ) );
			}
			if ( isset( $submit['borderHover'] ) && ! empty( $submit['borderHover'] ) ) {
				$alpha = ( isset( $submit['borderHoverOpacity'] ) && is_numeric( $submit['borderHoverOpacity'] ) ? $submit['borderHoverOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $submit['borderHover'], $alpha ) );
			}
			if ( isset( $submit['boxShadowHover'] ) && is_array( $submit['boxShadowHover'] ) && isset( $submit['boxShadowHover'][0] ) && true === $submit['boxShadowHover'][0] && isset( $submit['boxShadowHover'][7] ) && true !== $submit['boxShadowHover'][7] ) {
				$css->add_property( 'box-shadow', ( isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadowHover'][3] ) && is_numeric( $submit['boxShadowHover'][3] ) ? $submit['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][4] ) && is_numeric( $submit['boxShadowHover'][4] ) ? $submit['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][5] ) && is_numeric( $submit['boxShadowHover'][5] ) ? $submit['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $submit['boxShadowHover'][6] ) && is_numeric( $submit['boxShadowHover'][6] ) ? $submit['boxShadowHover'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $submit['boxShadowHover'][1] ) && ! empty( $submit['boxShadowHover'][1] ) ? $submit['boxShadowHover'][1] : '#000000' ), ( isset( $submit['boxShadowHover'][2] ) && is_numeric( $submit['boxShadowHover'][2] ) ? $submit['boxShadowHover'][2] : 0.4 ) ) );
			}
			if ( 'gradient' !== $bgtype ) {
				if ( isset( $submit['backgroundHover'] ) && ! empty( $submit['backgroundHover'] ) ) {
					$alpha = ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 );
					$css->add_property( 'background', $css->render_color( $submit['backgroundHover'], $alpha ) );
				}
				if ( isset( $submit['boxShadowHover'] ) && is_array( $submit['boxShadowHover'] ) && isset( $submit['boxShadowHover'][0] ) && true === $submit['boxShadowHover'][0] && isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ) {
					$css->add_property( 'box-shadow', ( isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadowHover'][3] ) && is_numeric( $submit['boxShadowHover'][3] ) ? $submit['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][4] ) && is_numeric( $submit['boxShadowHover'][4] ) ? $submit['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][5] ) && is_numeric( $submit['boxShadowHover'][5] ) ? $submit['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $submit['boxShadowHover'][6] ) && is_numeric( $submit['boxShadowHover'][6] ) ? $submit['boxShadowHover'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $submit['boxShadowHover'][1] ) && ! empty( $submit['boxShadowHover'][1] ) ? $submit['boxShadowHover'][1] : '#000000' ), ( isset( $submit['boxShadowHover'][2] ) && is_numeric( $submit['boxShadowHover'][2] ) ? $submit['boxShadowHover'][2] : 0.4 ) ) );
				}
			}

			if ( 'gradient' === $bgtype ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit::before' );
				if ( isset( $submit['backgroundHoverType'] ) && 'gradient' === $submit['backgroundHoverType'] ) {
					$bg1 = ( ! isset( $submit['backgroundHover'] ) ? $css->render_color( '#444444', ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 ) ) : $css->render_color( $submit['backgroundHover'], ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 ) ) );
					$bg2 = ( isset( $submit['gradientHover'][0] ) && ! empty( $submit['gradientHover'][0] ) ? $css->render_color( $submit['gradientHover'][0], ( isset( $submit['gradientHover'][1] ) && is_numeric( $submit['gradientHover'][1] ) ? $submit['gradientHover'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $submit['gradientHover'][1] ) && is_numeric( $submit['gradientHover'][1] ) ? $submit['gradientHover'][1] : 1 ) ) );
					if ( isset( $submit['gradientHover'][4] ) && 'radial' === $submit['gradientHover'][4] ) {
						$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $submit['gradientHover'][6] ) && ! empty( $submit['gradientHover'][6] ) ? $submit['gradientHover'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $submit['gradientHover'][2] ) && is_numeric( $submit['gradientHover'][2] ) ? $submit['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradientHover'][3] ) && is_numeric( $submit['gradientHover'][3] ) ? $submit['gradientHover'][3] : '100' ) . '%)' );
					} else if ( ! isset( $submit['gradientHover'][4] ) || 'radial' !== $submit['gradientHover'][4] ) {
						$css->add_property( 'background', 'linear-gradient(' . ( isset( $submit['gradientHover'][5] ) && ! empty( $submit['gradientHover'][5] ) ? $submit['gradientHover'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $submit['gradientHover'][2] ) && is_numeric( $submit['gradientHover'][2] ) ? $submit['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradientHover'][3] ) && is_numeric( $submit['gradientHover'][3] ) ? $submit['gradientHover'][3] : '100' ) . '%)' );
					}
				} else if ( isset( $submit['backgroundHover'] ) && ! empty( $submit['backgroundHover'] ) ) {
					$alpha = ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 );
					$css->add_property( 'background', $css->render_color( $submit['backgroundHover'], $alpha ) );
				}
				if ( isset( $submit['boxShadowHover'] ) && is_array( $submit['boxShadowHover'] ) && isset( $submit['boxShadowHover'][0] ) && true === $submit['boxShadowHover'][0] && isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ) {
					$css->add_property( 'box-shadow', ( isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadowHover'][3] ) && is_numeric( $submit['boxShadowHover'][3] ) ? $submit['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][4] ) && is_numeric( $submit['boxShadowHover'][4] ) ? $submit['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][5] ) && is_numeric( $submit['boxShadowHover'][5] ) ? $submit['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $submit['boxShadowHover'][6] ) && is_numeric( $submit['boxShadowHover'][6] ) ? $submit['boxShadowHover'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $submit['boxShadowHover'][1] ) && ! empty( $submit['boxShadowHover'][1] ) ? $submit['boxShadowHover'][1] : '#000000' ), ( isset( $submit['boxShadowHover'][2] ) && is_numeric( $submit['boxShadowHover'][2] ) ? $submit['boxShadowHover'][2] : 0.4 ) ) );
					if ( isset( $submit['borderRadius'] ) && is_numeric( $submit['borderRadius'] ) ) {
						$css->add_property( 'border-radius', $submit['borderRadius'] . 'px' );
					}
				}

			}
			if ( isset( $submit['size'] ) && 'custom' && $submit['size'] && isset( $submit['deskPadding'] ) && is_array( $submit['deskPadding'] ) && isset( $submit['deskPadding'][0] ) && is_numeric( $submit['deskPadding'][0] ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( isset( $submit['deskPadding'][0] ) && is_numeric( $submit['deskPadding'][0] ) ) {
					$css->add_property( 'padding-top', $submit['deskPadding'][0] . 'px' );
				}
				if ( isset( $submit['deskPadding'][1] ) && is_numeric( $submit['deskPadding'][1] ) ) {
					$css->add_property( 'padding-right', $submit['deskPadding'][1] . 'px' );
				}
				if ( isset( $submit['deskPadding'][2] ) && is_numeric( $submit['deskPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $submit['deskPadding'][2] . 'px' );
				}
				if ( isset( $submit['deskPadding'][3] ) && is_numeric( $submit['deskPadding'][3] ) ) {
					$css->add_property( 'padding-left', $submit['deskPadding'][3] . 'px' );
				}

			}
			if ( isset( $submit['size'] ) && 'custom' && $submit['size'] && isset( $submit['tabletPadding'] ) && is_array( $submit['tabletPadding'] ) && isset( $submit['tabletPadding'][0] ) && is_numeric( $submit['tabletPadding'][0] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( isset( $submit['tabletPadding'][0] ) && is_numeric( $submit['tabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $submit['tabletPadding'][0] . 'px' );
				}
				if ( isset( $submit['tabletPadding'][1] ) && is_numeric( $submit['tabletPadding'][1] ) ) {
					$css->add_property( 'padding-right', $submit['tabletPadding'][1] . 'px' );
				}
				if ( isset( $submit['tabletPadding'][2] ) && is_numeric( $submit['tabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $submit['tabletPadding'][2] . 'px' );
				}
				if ( isset( $submit['tabletPadding'][3] ) && is_numeric( $submit['tabletPadding'][3] ) ) {
					$css->add_property( 'padding-left', $submit['tabletPadding'][3] . 'px' );
				}

				$css->set_media_state( 'desktop' );
			}
			if ( isset( $submit['size'] ) && 'custom' && $submit['size'] && isset( $submit['mobilePadding'] ) && is_array( $submit['mobilePadding'] ) && isset( $submit['mobilePadding'][0] ) && is_numeric( $submit['mobilePadding'][0] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( isset( $submit['mobilePadding'][0] ) && is_numeric( $submit['mobilePadding'][0] ) ) {
					$css->add_property( 'padding-top', $submit['mobilePadding'][0] . 'px' );
				}
				if ( isset( $submit['mobilePadding'][1] ) && is_numeric( $submit['mobilePadding'][1] ) ) {
					$css->add_property( 'padding-right', $submit['mobilePadding'][1] . 'px' );
				}
				if ( isset( $submit['mobilePadding'][2] ) && is_numeric( $submit['mobilePadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $submit['mobilePadding'][2] . 'px' );
				}
				if ( isset( $submit['mobilePadding'][3] ) && is_numeric( $submit['mobilePadding'][3] ) ) {
					$css->add_property( 'padding-left', $submit['mobilePadding'][3] . 'px' );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['submitMargin'] ) && is_array( $attributes['submitMargin'] ) && isset( $attributes['submitMargin'][0] ) && is_array( $attributes['submitMargin'][0] ) ) {
			$submit_margin = $attributes['submitMargin'][0];
			$margin_unit   = ( isset( $submit_margin['unit'] ) && ! empty( $submit_margin['unit'] ) ? $submit_margin['unit'] : 'px' );
			if ( ( isset( $submit_margin['desk'][0] ) && is_numeric( $submit_margin['desk'][0] ) ) || ( isset( $submit_margin['desk'][1] ) && is_numeric( $submit_margin['desk'][1] ) ) || ( isset( $submit_margin['desk'][2] ) && is_numeric( $submit_margin['desk'][2] ) ) || ( isset( $submit_margin['desk'][3] ) && is_numeric( $submit_margin['desk'][3] ) ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( isset( $submit_margin['desk'][0] ) && is_numeric( $submit_margin['desk'][0] ) ) {
					$css->add_property( 'margin-top', $submit_margin['desk'][0] . $margin_unit );
				}
				if ( isset( $submit_margin['desk'][1] ) && is_numeric( $submit_margin['desk'][1] ) ) {
					$css->add_property( 'margin-right', $submit_margin['desk'][1] . $margin_unit );
				}
				if ( isset( $submit_margin['desk'][2] ) && is_numeric( $submit_margin['desk'][2] ) ) {
					$css->add_property( 'margin-bottom', $submit_margin['desk'][2] . $margin_unit );
				}
				if ( isset( $submit_margin['desk'][3] ) && is_numeric( $submit_margin['desk'][3] ) ) {
					$css->add_property( 'margin-left', $submit_margin['desk'][3] . $margin_unit );
				}

			}
			if ( ( isset( $submit_margin['tablet'][0] ) && is_numeric( $submit_margin['tablet'][0] ) ) || ( isset( $submit_margin['tablet'][1] ) && is_numeric( $submit_margin['tablet'][1] ) ) || ( isset( $submit_margin['tablet'][2] ) && is_numeric( $submit_margin['tablet'][2] ) ) || ( isset( $submit_margin['tablet'][3] ) && is_numeric( $submit_margin['tablet'][3] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( isset( $submit_margin['tablet'][0] ) && is_numeric( $submit_margin['tablet'][0] ) ) {
					$css->add_property( 'margin-top', $submit_margin['tablet'][0] . $margin_unit );
				}
				if ( isset( $submit_margin['tablet'][1] ) && is_numeric( $submit_margin['tablet'][1] ) ) {
					$css->add_property( 'margin-right', $submit_margin['tablet'][1] . $margin_unit );
				}
				if ( isset( $submit_margin['tablet'][2] ) && is_numeric( $submit_margin['tablet'][2] ) ) {
					$css->add_property( 'margin-bottom', $submit_margin['tablet'][2] . $margin_unit );
				}
				if ( isset( $submit_margin['tablet'][3] ) && is_numeric( $submit_margin['tablet'][3] ) ) {
					$css->add_property( 'margin-left', $submit_margin['tablet'][3] . $margin_unit );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ( isset( $submit_margin['mobile'][0] ) && is_numeric( $submit_margin['mobile'][0] ) ) || ( isset( $submit_margin['mobile'][1] ) && is_numeric( $submit_margin['mobile'][1] ) ) || ( isset( $submit_margin['mobile'][2] ) && is_numeric( $submit_margin['mobile'][2] ) ) || ( isset( $submit_margin['mobile'][3] ) && is_numeric( $submit_margin['mobile'][3] ) ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( isset( $submit_margin['mobile'][0] ) && is_numeric( $submit_margin['mobile'][0] ) ) {
					$css->add_property( 'margin-top', $submit_margin['mobile'][0] . $margin_unit );
				}
				if ( isset( $submit_margin['mobile'][1] ) && is_numeric( $submit_margin['mobile'][1] ) ) {
					$css->add_property( 'margin-right', $submit_margin['mobile'][1] . $margin_unit );
				}
				if ( isset( $submit_margin['mobile'][2] ) && is_numeric( $submit_margin['mobile'][2] ) ) {
					$css->add_property( 'margin-bottom', $submit_margin['mobile'][2] . $margin_unit );
				}
				if ( isset( $submit_margin['mobile'][3] ) && is_numeric( $submit_margin['mobile'][3] ) ) {
					$css->add_property( 'margin-left', $submit_margin['mobile'][3] . $margin_unit );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['submitFont'] ) && is_array( $attributes['submitFont'] ) && isset( $attributes['submitFont'][0] ) && is_array( $attributes['submitFont'][0] ) ) {
			$submit_font = $attributes['submitFont'][0];
			$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
			if ( !empty( $submit_font['size'][0] ) ) {
				$css->add_property( 'font-size', $css->get_font_size( $submit_font['size'][0], ( ! isset( $submit_font['sizeType'] ) ? 'px' : $submit_font['sizeType'] ) ) );
			}
			if ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $submit_font['lineHeight'][0] . ( ! isset( $submit_font['lineType'] ) ? 'px' : $submit_font['lineType'] ) );
			}
			if ( isset( $submit_font['letterSpacing'] ) && is_numeric( $submit_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $submit_font['letterSpacing'] . 'px' );
			}
			if ( isset( $submit_font['textTransform'] ) && ! empty( $submit_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $submit_font['textTransform'] );
			}
			if ( isset( $submit_font['family'] ) && ! empty( $submit_font['family'] ) ) {
				$css->add_property( 'font-family', $submit_font['family'] );
			}
			if ( isset( $submit_font['style'] ) && ! empty( $submit_font['style'] ) ) {
				$css->add_property( 'font-style', $submit_font['style'] );
			}
			if ( isset( $submit_font['weight'] ) && ! empty( $submit_font['weight'] ) ) {
				$css->add_property( 'font-weight', $submit_font['weight'] );
			}

			if ( ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][1] ) ) || ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][1] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( !empty( $submit_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $submit_font['size'][1], ( isset( $submit_font['sizeType'] ) && ! empty( $submit_font['sizeType'] ) ? $submit_font['sizeType'] : 'px' ) ) );
				}
				if ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][1] ) ) {
					$css->add_property( 'line-height', $submit_font['lineHeight'][1] . ( isset( $submit_font['lineType'] ) && ! empty( $submit_font['lineType'] ) ? $submit_font['lineType'] : 'px' ) );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][2] ) ) || ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][2] ) ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit' );
				if ( !empty( $submit_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $submit_font['size'][2], ( isset( $submit_font['sizeType'] ) && ! empty( $submit_font['sizeType'] ) ? $submit_font['sizeType'] : 'px' ) ) );
				}
				if ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][2] ) ) {
					$css->add_property( 'line-height', $submit_font['lineHeight'][2] . ( isset( $submit_font['lineType'] ) && ! empty( $submit_font['lineType'] ) ? $submit_font['lineType'] : 'px' ) );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['messageFont'] ) && is_array( $attributes['messageFont'] ) && isset( $attributes['messageFont'][0] ) && is_array( $attributes['messageFont'][0] ) ) {
			$message_font = $attributes['messageFont'][0];
			if ( ( isset( $message_font['colorSuccess'] ) && ! empty( $message_font['colorSuccess'] ) ) || ( isset( $message_font['backgroundSuccess'] ) && ! empty( $message_font['backgroundSuccess'] ) ) || ( isset( $message_font['backgroundSuccess'] ) && ! empty( $message_font['backgroundSuccess'] ) ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kadence-blocks-form-success' );
				if ( isset( $message_font['colorSuccess'] ) && ! empty( $message_font['colorSuccess'] ) ) {
					$css->add_property( 'color', $css->render_color( $message_font['colorSuccess'] ) );
				}
				if ( isset( $message_font['borderSuccess'] ) && ! empty( $message_font['borderSuccess'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $message_font['borderSuccess'] ) );
				}
				if ( isset( $message_font['backgroundSuccess'] ) && ! empty( $message_font['backgroundSuccess'] ) ) {
					$alpha = ( isset( $message_font['backgroundSuccessOpacity'] ) && is_numeric( $message_font['backgroundSuccessOpacity'] ) ? $message_font['backgroundSuccessOpacity'] : 1 );
					$css->add_property( 'background', $css->render_color( $message_font['backgroundSuccess'], $alpha ) );
				}

			}
			if ( ( isset( $message_font['colorError'] ) && ! empty( $message_font['colorError'] ) ) || ( isset( $message_font['backgroundError'] ) && ! empty( $message_font['backgroundError'] ) ) || ( isset( $message_font['backgroundError'] ) && ! empty( $message_font['backgroundError'] ) ) ) {
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kadence-blocks-form-warning' );
				if ( isset( $message_font['colorError'] ) && ! empty( $message_font['colorError'] ) ) {
					$css->add_property( 'color', $css->render_color( $message_font['colorError'] ) );
				}
				if ( isset( $message_font['borderError'] ) && ! empty( $message_font['borderError'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $message_font['borderError'] ) );
				}
				if ( isset( $message_font['backgroundError'] ) && ! empty( $message_font['backgroundError'] ) ) {
					$alpha = ( isset( $message_font['backgroundErrorOpacity'] ) && is_numeric( $message_font['backgroundErrorOpacity'] ) ? $message_font['backgroundErrorOpacity'] : 1 );
					$css->add_property( 'background', $css->render_color( $message_font['backgroundError'], $alpha ) );
				}

			}
			$css->set_selector( '.kadence-form-' . $unique_id . ' .kadence-blocks-form-message, .kadence-form-' . $unique_id . ' .kb-form-error-msg' );
			if ( isset( $message_font['borderRadius'] ) && ! empty( $message_font['borderRadius'] ) ) {
				$css->add_property( 'border-radius', $message_font['borderRadius'] . 'px' );
			}
			if ( isset( $message_font['borderWidth'] ) && is_array( $message_font['borderWidth'] ) && is_numeric( $message_font['borderWidth'][0] ) ) {
				$css->add_property( 'border-width', $message_font['borderWidth'][0] . 'px ' . $message_font['borderWidth'][1] . 'px ' . $message_font['borderWidth'][2] . 'px ' . $message_font['borderWidth'][3] . 'px' );
			}
			if ( !empty( $message_font['size'][0] ) ) {
				$css->add_property( 'font-size', $css->get_font_size( $message_font['size'][0], ( ! isset( $message_font['sizeType'] ) ? 'px' : $message_font['sizeType'] ) ) );
			}
			if ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $message_font['lineHeight'][0] . ( ! isset( $message_font['lineType'] ) ? 'px' : $message_font['lineType'] ) );
			}
			if ( isset( $message_font['letterSpacing'] ) && is_numeric( $message_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $message_font['letterSpacing'] . 'px' );
			}
			if ( isset( $message_font['textTransform'] ) && ! empty( $message_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $message_font['textTransform'] );
			}
			if ( isset( $message_font['family'] ) && ! empty( $message_font['family'] ) ) {
				$css->add_property( 'font-family', $message_font['family'] );
			}
			if ( isset( $message_font['style'] ) && ! empty( $message_font['style'] ) ) {
				$css->add_property( 'font-style', $message_font['style'] );
			}
			if ( isset( $message_font['weight'] ) && ! empty( $message_font['weight'] ) ) {
				$css->add_property( 'font-weight', $message_font['weight'] );
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][0] ) ) {
				$css->add_property( 'padding-top', $message_font['padding'][0] . 'px' );
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][1] ) ) {
				$css->add_property( 'padding-right', $message_font['padding'][1] . 'px' );
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][2] ) ) {
				$css->add_property( 'padding-bottom', $message_font['padding'][2] . 'px' );
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][3] ) ) {
				$css->add_property( 'padding-left', $message_font['padding'][3] . 'px' );
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][0] ) ) {
				$css->add_property( 'margin-top', $message_font['margin'][0] . 'px' );
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][1] ) ) {
				$css->add_property( 'margin-right', $message_font['margin'][1] . 'px' );
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][2] ) ) {
				$css->add_property( 'margin-bottom', $message_font['margin'][2] . 'px' );
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][3] ) ) {
				$css->add_property( 'margin-left', $message_font['margin'][3] . 'px' );
			}

			if ( ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][1] ) ) || ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][1] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kadence-blocks-form-message' );
				if ( !empty( $message_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $message_font['size'][1], ( isset( $message_font['fontSizeType'] ) && ! empty( $message_font['fontSizeType'] ) ? $message_font['fontSizeType'] : 'px' ) ) );
				}
				if ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][1] ) ) {
					$css->add_property( 'line-height', $message_font['lineHeight'][1] . ( isset( $message_font['lineType'] ) && ! empty( $message_font['lineType'] ) ? $message_font['lineType'] : 'px' ) );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][2] ) ) || ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][2] ) ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kadence-form-' . $unique_id . ' .kadence-blocks-form-message' );
				if ( !empty( $message_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $message_font['size'][2], ( isset( $message_font['fontSizeType'] ) && ! empty( $message_font['fontSizeType'] ) ? $message_font['fontSizeType'] : 'px' ) ) );
				}
				if ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][2] ) ) {
					$css->add_property( 'line-height', $message_font['lineHeight'][2] . ( isset( $message_font['lineType'] ) && ! empty( $message_font['lineType'] ) ? $message_font['lineType'] : 'px' ) );
				}
				$css->set_media_state( 'desktop' );
			}
		}

		if( ( !isset( $attributes['honeyPot']) || isset( $attributes['honeyPot'] ) && $attributes['honeyPot'] ) ) {
			$css->set_selector( '.kb-form input.kadence-blocks-field.verify' );
			$css->add_property( 'opacity', '0.0' );
			$css->add_property( 'position', 'absolute' );
			$css->add_property( 'top', '0.0' );
			$css->add_property( 'left', '0.0' );
			$css->add_property( 'width', '0.0' );
			$css->add_property( 'height', '0.0' );
			$css->add_property( 'z-index', '-1' );
		}

		return $css->css_output();
	}
	/**
	 * Add a noscript to the content.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$content .= '<noscript><div class="kadence-blocks-form-message kadence-blocks-form-warning">' . __( 'Please enable JavaScript in your browser to submit the form', 'kadence-blocks' ) . '</div><style>.kadence-form-' . $unique_id . ' .kadence-blocks-form-field.kb-submit-field { display: none; }</style></noscript>';

		// Update honeypot autocomplete value.
		if( ( !isset( $attributes['honeyPot']) || isset( $attributes['honeyPot'] ) && $attributes['honeyPot'] ) ) {
			$default = '<input class="kadence-blocks-field verify" type="text" name="_kb_verify_email" autocomplete="off" aria-hidden="true" placeholder="Email" tabindex="-1"/>';
			$new     = '<label class="kadence-verify-label">Email<input class="kadence-blocks-field verify" type="text" name="_kb_verify_email" autocomplete="new-password" aria-hidden="true" placeholder="Email" tabindex="-1" data-1p-ignore="true" data-lpignore="true" /></label>';
			$content = str_replace( $default, $new, $content );
		}

		return $content;
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

		wp_register_script( 'kadence-blocks-form', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-form-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		$recaptcha_site_key = get_option( 'kadence_blocks_recaptcha_site_key' );
		if ( ! $recaptcha_site_key ) {
			$recaptcha_site_key = 'missingkey';
		}

		$recaptcha_lang = ! empty( get_option('kadence_blocks_recaptcha_language') ) ? '&hl=' . get_option('kadence_blocks_recaptcha_language') : '';

		wp_register_script( 'kadence-blocks-google-recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr( $recaptcha_site_key ) . $recaptcha_lang, array(), KADENCE_BLOCKS_VERSION, true );
		$recaptcha_script = "grecaptcha.ready(function () { var recaptchaResponse = document.getElementById('kb_recaptcha_response'); if ( recaptchaResponse ) { grecaptcha.execute('" . esc_attr( $recaptcha_site_key ) . "', { action: 'kb_form' }).then(function (token) { recaptchaResponse.value = token; }); } var kb_recaptcha_inputs = document.getElementsByClassName('kb_recaptcha_response'); if ( ! kb_recaptcha_inputs.length ) { return; } for (var i = 0; i < kb_recaptcha_inputs.length; i++) { const e = i; grecaptcha.execute('" . esc_attr( $recaptcha_site_key ) . "', { action: 'kb_form' }).then(function (token) { kb_recaptcha_inputs[e].setAttribute('value', token); }); } });";
		wp_add_inline_script( 'kadence-blocks-google-recaptcha-v3', $recaptcha_script, 'after' );
		wp_register_script( 'kadence-blocks-google-recaptcha-v2', 'https://www.google.com/recaptcha/api.js?render=explicit&onload=kbOnloadV2Callback' . $recaptcha_lang, array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		$recaptcha_v2_script = "var kbOnloadV2Callback = function(){jQuery( '.wp-block-kadence-form' ).find( '.kadence-blocks-g-recaptcha-v2' ).each( function() {grecaptcha.render( jQuery( this ).attr( 'id' ), {'sitekey' : '" . esc_attr( $recaptcha_site_key ) . "'});});}";
		wp_add_inline_script( 'kadence-blocks-google-recaptcha-v2', $recaptcha_v2_script, 'before' );

		wp_localize_script(
			'kadence-blocks-form',
			'kadence_blocks_form_params',
			array(
				'ajaxurl'       => admin_url( 'admin-ajax.php' ),
				'error_message' => __( 'Please fix the errors to proceed', 'kadence-blocks' ),
				'nonce'         => wp_create_nonce( 'kb_form_nonce' ),
				'required'      => __( 'is required', 'kadence-blocks' ),
				'mismatch'      => __( 'does not match', 'kadence-blocks' ),
				'validation'    => __( 'is not valid', 'kadence-blocks' ),
				'duplicate'     => __( 'requires a unique entry and this value has already been used', 'kadence-blocks' ),
				'item'          => __( 'Item', 'kadence-blocks' ),
			)
		);

	}
}

Kadence_Blocks_Form_Block::get_instance();
