<?php
/**
 * Class to Build the Advanced Heading Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Heading Block.
 *
 * @category class
 */
class Kadence_Blocks_Advancedheading_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'advancedheading';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Allowed HTML tags for front end output.
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = array( 'heading', 'p', 'span', 'div' );

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

		$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . ', .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
		// Issue with span tag.
		if ( isset( $attributes['htmlTag'] ) && 'span' === $attributes['htmlTag'] ) {
			$css->add_property( 'display', 'block' );
		}
		// Support old margins.
		if ( isset( $attributes['topMargin'] ) && is_numeric( $attributes['topMargin'] ) ) {
			$css->add_property( 'margin-top', $attributes['topMargin'] . ( ! isset( $attributes['marginType'] ) ? 'px' : $attributes['marginType'] ) );
			// This fixes an issue where the background doesn't show over the top of the item that is above it.
			if ( $attributes['topMargin'] < 0 && isset( $attributes['background'] ) && ! empty( $attributes['background'] ) ) {
				$css->add_property( 'position', 'relative' );
			}
		}
		if ( isset( $attributes['rightMargin'] ) && is_numeric( $attributes['rightMargin'] ) ) {
			$css->add_property( 'margin-right', $attributes['rightMargin'] . ( ! isset( $attributes['marginType'] ) ? 'px' : $attributes['marginType'] ) );
		}
		if ( isset( $attributes['bottomMargin'] ) && is_numeric( $attributes['bottomMargin'] ) ) {
			$css->add_property( 'margin-bottom', $attributes['bottomMargin'] . ( ! isset( $attributes['marginType'] ) ? 'px' : $attributes['marginType'] ) );
		}
		if ( isset( $attributes['leftMargin'] ) && is_numeric( $attributes['leftMargin'] ) ) {
			$css->add_property( 'margin-left', $attributes['leftMargin'] . ( ! isset( $attributes['marginType'] ) ? 'px' : $attributes['marginType'] ) );
		}
		// Spacing.
		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width' );
		if ( ! empty( $attributes['maxWidth'][0] ) && ! empty( $attributes['align'] ) && 'center' === $attributes['align'] ) {
			$css->add_property( 'margin-right', 'auto' );
			$css->add_property( 'margin-left', 'auto' );
		}
		if ( ! empty( $attributes['maxWidth'][0] ) && ! empty( $attributes['align'] ) && 'right' === $attributes['align'] ) {
			$css->add_property( 'margin-right', '0px' );
			$css->add_property( 'margin-left', 'auto' );
		}
		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_measure_output( $attributes, 'margin', 'margin' );

		// Style.
		if ( isset( $attributes['align'] ) && ! empty( $attributes['align'] ) ) {
			$css->add_property( 'text-align', $attributes['align'] );
		}
		// Old size first.
		if ( ! empty( $attributes['size'] ) ) {
			$css->add_property( 'font-size', $attributes['size'] . ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) );
		} else if ( ! empty( $attributes['fontSize'][0] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['fontSize'][0], ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) ) );
		}
		// Old line height first.
		if ( isset( $attributes['lineHeight'] ) && ! empty( $attributes['lineHeight'] ) ) {
			$css->add_property( 'line-height', $attributes['lineHeight'] . ( empty( $attributes['lineType'] ) ? 'px' : $attributes['lineType'] ) );
		} else if ( ! empty( $attributes['fontHeight'][0] ) ) {
			$css->add_property( 'line-height', $attributes['fontHeight'][0] . ( empty( $attributes['fontHeightType'] ) ? '' : $attributes['fontHeightType'] ) );
		}
		if ( ! empty( $attributes['fontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_font_weight( $attributes['fontWeight'] ) );
		}
		if ( ! empty( $attributes['fontStyle'] ) ) {
			$css->add_property( 'font-style', $attributes['fontStyle'] );
		}
		if ( ! empty( $attributes['typography'] ) ) {
			$google = isset( $attributes['googleFont'] ) && $attributes['googleFont'] ? true : false;
			$google = $google && ( isset( $attributes['loadGoogleFont'] ) && $attributes['loadGoogleFont'] || ! isset( $attributes['loadGoogleFont'] ) ) ? true : false;
			$variant = ! empty( $attributes['fontVariant'] ) ? $attributes['fontVariant'] : null;
			$css->add_property( 'font-family', $css->render_font_family( $attributes['typography'], $google, $variant ) );
		}
		if ( ! empty( $attributes['textTransform'] ) ) {
			$css->add_property( 'text-transform', $attributes['textTransform'] );
		}
		if ( isset( $attributes['letterSpacing'] ) && is_numeric( $attributes['letterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $attributes['letterSpacing'] . ( ! isset( $attributes['letterSpacingType'] ) ? 'px' : $attributes['letterSpacingType'] ) );
		}
		if ( isset( $attributes['tabletLetterSpacing'] ) && is_numeric( $attributes['tabletLetterSpacing'] ) ) {
			$css->set_media_state('tablet');
			$css->add_property( 'letter-spacing', $attributes['tabletLetterSpacing'] . ( ! isset( $attributes['letterSpacingType'] ) ? 'px' : $attributes['letterSpacingType'] ) );
			$css->set_media_state('desktop');
		}
		if ( isset( $attributes['mobileLetterSpacing'] ) && is_numeric( $attributes['mobileLetterSpacing'] ) ) {
			$css->set_media_state('mobile');
			$css->add_property( 'letter-spacing', $attributes['mobileLetterSpacing'] . ( ! isset( $attributes['letterSpacingType'] ) ? 'px' : $attributes['letterSpacingType'] ) );
			$css->set_media_state('desktop');
		}
		if ( ! empty( $attributes['color'] ) && empty( $attributes['enableTextGradient'] ) ) {
			if ( class_exists( 'Kadence\Theme' ) ) {
				if ( isset( $attributes['colorClass'] ) && empty( $attributes['colorClass'] ) || ! isset( $attributes['colorClass'] ) ) {
					$css->add_property( 'color', $css->render_color( $attributes['color'] ) );
				}
			} else if ( strpos( $attributes['color'], 'palette' ) === 0 ) {
				$css->add_property( 'color', $css->render_color( $attributes['color'] ) );
			} else if ( isset( $attributes['colorClass'] ) && empty( $attributes['colorClass'] ) || ! isset( $attributes['colorClass'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['color'] ) );
			}
		}
		if( !empty( $attributes['textGradient'] ) && ! empty( $attributes['enableTextGradient'] ) ) {
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . ', .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] .kb-adv-text-inner' );
			$css->add_property( 'background-image', $attributes['textGradient'] );
			$css->add_property( 'background-clip', 'text' );
			$css->add_property( '-webkit-box-decoration-break', 'clone' );
			$css->add_property( 'box-decoration-break', 'clone' );
			$css->add_property( '-webkit-background-clip', 'text' );
			$css->add_property( '-webkit-text-fill-color', 'transparent' );
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . ', .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );

		}
		if ( ! empty( $attributes['background'] ) && empty( $attributes['enableTextGradient'] ) ) {
			if ( class_exists( 'Kadence\Theme' ) ) {
				if ( isset( $attributes['backgroundColorClass'] ) && empty( $attributes['backgroundColorClass'] ) || ! isset( $attributes['backgroundColorClass'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['background'] ) );
				}
			} else if ( strpos( $attributes['background'], 'palette' ) === 0 ) {
				$css->add_property( 'background-color', $css->render_color( $attributes['background'] ) );
			} else if ( isset( $attributes['backgroundColorClass'] ) && empty( $attributes['backgroundColorClass'] ) || ! isset( $attributes['backgroundColorClass'] ) ) {
				$css->add_property( 'background-color', $css->render_color( $attributes['background'] ) );
			}
		}
		if ((isset($attributes['enableTextShadow']) && !empty($attributes['enableTextShadow']))
			|| (isset($attributes['textShadow']) && !empty($attributes['textShadow'][0]['enable']))) {

			if (empty($attributes['textShadow'])) {
				$attributes['textShadow'] = [
					[
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 1,
						'color'   => '#000000',
						'opacity' => 0.2,
					],
				];
			}

			$this->render_text_shadow( $attributes, $css ); // This should be all that is required.
			$css->set_media_state('desktop');
		}

		if (isset($attributes['textOrientation'])) {
			$this->handle_text_orientation($css, $attributes['textOrientation']);
			$this->handle_max_height($css, $attributes, 0, 'textOrientation');
		}

		if (isset($attributes['tabletTextOrientation'])) {
			$css->set_media_state('tablet');
			$this->handle_text_orientation($css, $attributes['tabletTextOrientation']);
			$this->handle_max_height($css, $attributes, 1, 'tabletTextOrientation');
		}

		if (isset($attributes['mobileTextOrientation'])) {
			$css->set_media_state('mobile');
			$this->handle_text_orientation($css, $attributes['mobileTextOrientation']);
			$this->handle_max_height($css, $attributes, 2, 'mobileTextOrientation');
		}

		$css->set_media_state( 'tablet' );
		// Old size first.
		if ( ! empty( $attributes['tabSize'] ) ) {
			$css->add_property( 'font-size', $attributes['tabSize'] . ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) );
		} else if ( ! empty( $attributes['fontSize'][1] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['fontSize'][1], ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) ) );
		}
		// Old line height first.
		if ( ! empty( $attributes['tabLineHeight'] ) ) {
			$css->add_property( 'line-height', $attributes['tabLineHeight'] . ( empty( $attributes['lineType'] ) ? 'px' : $attributes['lineType'] ) );
		} else if ( ! empty( $attributes['fontHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['fontHeight'][1] . ( empty( $attributes['fontHeightType'] ) ? '' : $attributes['fontHeightType'] ) );
		}
		if ( ! empty( $attributes['tabletAlign'] ) ) {
			$css->add_property( 'text-align', $attributes['tabletAlign'] . '!important' );
		}
		$css->set_media_state( 'mobile' );
		// Old size first.
		if ( ! empty( $attributes['mobileSize'] ) ) {
			$css->add_property( 'font-size', $attributes['mobileSize'] . ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) );
		} else if ( ! empty( $attributes['fontSize'][2] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['fontSize'][2], ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) ) );
		}
		// Old line height first.
		if ( ! empty( $attributes['mobileLineHeight'] ) ) {
			$css->add_property( 'line-height', $attributes['mobileLineHeight'] . ( empty( $attributes['lineType'] ) ? 'px' : $attributes['lineType'] ) );
		} else if ( ! empty( $attributes['fontHeight'][2] ) ) {
			$css->add_property( 'line-height', $attributes['fontHeight'][2] . ( empty( $attributes['fontHeightType'] ) ? '' : $attributes['fontHeightType'] ) );
		}
		if ( ! empty( $attributes['mobileAlign'] ) ) {
			$css->add_property( 'text-align', $attributes['mobileAlign'] . '!important' );
		}
		$css->set_media_state( 'desktop' );


		$css->render_border_styles( $attributes, 'borderStyle');
		$css->render_border_radius( $attributes, 'borderRadius', ( !empty( $attributes['borderRadiusUnit']) ? $attributes['borderRadiusUnit'] : 'px' ) );

		$css->set_media_state('tablet');
		$css->render_border_radius( $attributes, 'tabletBorderRadius', ( !empty( $attributes['borderRadiusUnit']) ? $attributes['borderRadiusUnit'] : 'px' ) );
		$css->set_media_state('desktop');

		$css->set_media_state('mobile');
		$css->render_border_radius( $attributes, 'mobileBorderRadius', ( !empty( $attributes['borderRadiusUnit']) ? $attributes['borderRadiusUnit'] : 'px' ) );
		$css->set_media_state('desktop');

		// SVG.
		if ( ! empty( $attributes['icon'] ) ) {
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'gap', '0.25em' );
			if ( isset( $attributes['align'] ) ) {
				$css->add_property( 'justify-content', $attributes['align'] );
			}

			if ( ! empty( $attributes['tabletAlign'] ) ) {
				$css->set_media_state( 'tablet' );
				$css->add_property( 'justify-content', $attributes['tabletAlign'] );
				$css->set_media_state( 'desktop' );
			}

			if ( ! empty( $attributes['mobileAlign'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->add_property( 'justify-content', $attributes['mobileAlign'] );
				$css->set_media_state( 'desktop' );
			}

			if ( isset( $attributes['iconVerticalAlign'] ) ) {
				$css->add_property( 'align-items', $attributes['iconVerticalAlign'] );
			} else {
				$css->add_property( 'align-items', 'center' );
			}
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] .kb-adv-heading-icon svg' );
			$css->add_property( 'width', '1em');
			$css->add_property( 'height', '1em');
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] .kb-adv-heading-icon' );
			$css->render_color_output( $attributes, 'iconColor', 'color' );
			$css->render_responsive_range( $attributes, 'iconSize', 'font-size', 'iconSizeUnit' );
			$css->render_measure_output( $attributes, 'iconPadding', 'margin', array( 'unit_key' => 'iconPaddingUnit' ) );
			if ( isset( $attributes['lineHeight'] ) ) {
				$css->add_property( 'line-height', $attributes['lineHeight'] . ( empty( $attributes['lineType'] ) ? 'px' : $attributes['lineType'] ) );
			}

			if ( ! empty( $attributes['iconColorHover'] ) ) {
				$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]:hover .kb-adv-heading-icon' );
				$css->render_color_output( $attributes, 'iconColorHover', 'color' );
			}

		}

		// Highlight.
		$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . ' mark.kt-highlight, .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark.kt-highlight' );
		if ( isset( $attributes['markLetterSpacing'] ) && ! empty( $attributes['markLetterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $attributes['markLetterSpacing'] . ( ! isset( $attributes['markLetterSpacingType'] ) ? 'px' : $attributes['markLetterSpacingType'] ) );
		}
		if ( ! empty( $attributes['markSize'][0] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['markSize'][0], ( ! isset( $attributes['markSizeType'] ) ? 'px' : $attributes['markSizeType'] ) ) );
		}
		if ( ! empty( $attributes['markLineHeight'][0] ) ) {
			$css->add_property( 'line-height', $attributes['markLineHeight'][0] . ( ! isset( $attributes['markLineType'] ) ? 'px' : $attributes['markLineType'] ) );
		}
		if ( ! empty( $attributes['markTypography'] ) ) {
			$google = isset( $attributes['markGoogleFont'] ) && $attributes['markGoogleFont'] ? true : false;
			$google = $google && ( isset( $attributes['markLoadGoogleFont'] ) && $attributes['markLoadGoogleFont'] || ! isset( $attributes['markLoadGoogleFont'] ) ) ? true : false;
			$variant = ! empty( $attributes['markFontVariant'] ) ? $attributes['markFontVariant'] : null;
			$css->add_property( 'font-family', $css->render_font_family( $attributes['markTypography'], $google, $variant ) );
		}
		if ( ! empty( $attributes['markFontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_font_weight( $attributes['markFontWeight'] ) );
		}
		if ( ! empty( $attributes['markFontStyle'] ) ) {
			$css->add_property( 'font-style', $attributes['markFontStyle'] );
		}
		if( !empty( $attributes['textGradient'] ) && ! empty( $attributes['enableTextGradient'] ) ) {
			$css->add_property( '-webkit-text-fill-color', 'initial !important' );
			$css->add_property( '-webkit-background-clip', 'initial !important' );
			$css->add_property( 'background-clip', 'initial !important' );
		}
		if ( ! empty( $attributes['markColor'] ) && empty( $attributes['enableMarkGradient'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['markColor'] ) );
		} else if ( !empty( $attributes['markGradient'] ) && ! empty( $attributes['enableMarkGradient'] ) ) {
			$css->add_property( 'background-image', $attributes['markGradient'] );
			$css->add_property( '-webkit-background-clip', 'text' );
			$css->add_property( 'background-clip', 'text' );
			$css->add_property( '-webkit-text-fill-color', 'transparent' );
		}
		if ( ! empty($attributes['enableMarkBackgroundGradient']) && ! empty($attributes['markBackgroundGradient']) ) {
			$css->add_property( 'background-image', $attributes['markBackgroundGradient'] );
		}
		if ( ! empty( $attributes['markTextTransform'] ) ) {
			$css->add_property( 'text-transform', $attributes['markTextTransform'] );
		}
		if ( ! empty( $attributes['markBG'] ) && empty( $attributes['enableMarkGradient'] ) && empty( $attributes['enableMarkBackgroundGradient'] ) ) {
			$alpha = ( isset( $attributes['markBGOpacity'] ) && ! empty( $attributes['markBGOpacity'] ) ? $attributes['markBGOpacity'] : 1 );
			$css->add_property( 'background', $css->render_color( $attributes['markBG'], $alpha ) );
		}
		if ( ! empty( $attributes['markBorder'] ) ) {
			$alpha = ( isset( $attributes['markBorderOpacity'] ) && ! empty( $attributes['markBorderOpacity'] ) ? $attributes['markBorderOpacity'] : 1 );
			$css->add_property( 'border-color', $css->render_color( $attributes['markBorder'], $alpha ) );
		}
		if ( ! empty( $attributes['markBorderWidth'] ) ) {
			$css->add_property( 'border-width', $attributes['markBorderWidth'] . 'px' );
		}
		if ( ! empty( $attributes['markBorderStyle'] ) && 'solid' !== $attributes['markBorderStyle'] ) {
			$css->add_property( 'border-style', $attributes['markBorderStyle'] );
		}
		$css->render_border_styles( $attributes, 'markBorderStyles' );
		$css->render_border_radius( $attributes, 'markBorderRadius', ( ! empty( $attributes['markBorderRadiusUnit'] ) ? $attributes['markBorderRadiusUnit'] : 'px' ) );
		$css->add_property( '-webkit-box-decoration-break', 'clone' );
		$css->add_property( 'box-decoration-break', 'clone' );
		$css->set_media_state( 'tablet' );
		$css->render_border_radius( $attributes, 'tabletMarkBorderRadius', ( ! empty( $attributes['markBorderRadiusUnit'] ) ? $attributes['markBorderRadiusUnit'] : 'px' ) );
		$css->set_media_state( 'desktop' );

		$css->set_media_state( 'mobile' );
		$css->render_border_radius( $attributes, 'mobileMarkBorderRadius', ( ! empty( $attributes['markBorderRadiusUnit'] ) ? $attributes['markBorderRadiusUnit'] : 'px' ) );
		$css->set_media_state( 'desktop' );
		$mark_padding_args = array(
			'desktop_key' => 'markPadding',
			'tablet_key'  => 'markTabPadding',
			'mobile_key'  => 'markMobilePadding',
		);
		$css->render_measure_output( $attributes, 'markPadding', 'padding', $mark_padding_args );
		// Link.
		if ( ! empty( $attributes['linkColor'] ) ) {
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] a, .kt-adv-heading-link' . $unique_id . ', .kt-adv-heading-link' . $unique_id . ' .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
			if ( ! empty( $attributes['linkColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['linkColor'] ) );
			}
		}
		if ( ! empty( $attributes['linkHoverColor'] ) ) {
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] a:hover, .kt-adv-heading-link' . $unique_id . ':hover, .kt-adv-heading-link' . $unique_id . ':hover .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
			$css->add_property( 'color', $css->render_color( $attributes['linkHoverColor'] ) );
		}
		if ( ! empty( $attributes['linkStyle'] ) ) {
			$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] a, a.kb-advanced-heading-link.kt-adv-heading-link' . $unique_id );
			if ( 'none' === $attributes['linkStyle'] ) {
				$css->add_property( 'text-decoration', 'none' );
			} else if ( $attributes['linkStyle'] === 'underline' ) {
				$css->add_property( 'text-decoration', 'underline' );
				$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] a:hover, a.kb-advanced-heading-link.kt-adv-heading-link' . $unique_id . ':hover' );
				$css->add_property( 'text-decoration', 'underline' );
			} else if ( $attributes['linkStyle'] === 'hover_underline' ) {
				$css->add_property( 'text-decoration', 'none' );
				$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] a:hover, a.kb-advanced-heading-link.kt-adv-heading-link' . $unique_id . ':hover' );
				$css->add_property( 'text-decoration', 'underline' );
			}
		}
		// Tablet.
		$css->set_media_state( 'tablet' );
		$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . ' mark.kt-highlight, .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark.kt-highlight' );
		if ( ! empty( $attributes['markSize'][1] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['markSize'][1], ( ! isset( $attributes['markSizeType'] ) ? 'px' : $attributes['markSizeType'] ) ) );
		}
		if ( ! empty( $attributes['markLineHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['markLineHeight'][1] . ( ! isset( $attributes['markLineType'] ) ? 'px' : $attributes['markLineType'] ) );
		}
		$css->set_media_state( 'mobile' );
		if ( ! empty( $attributes['markSize'][2] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['markSize'][2], ( ! isset( $attributes['markSizeType'] ) ? 'px' : $attributes['markSizeType'] ) ) );
		}
		if ( ! empty( $attributes['markLineHeight'][2] ) ) {
			$css->add_property( 'line-height', $attributes['markLineHeight'][2] . ( ! isset( $attributes['markLineType'] ) ? 'px' : $attributes['markLineType'] ) );
		}
		$css->set_media_state( 'desktop' );

		return $css->css_output();
	}
	/**
	 * This block is conditionally dynamic. It's only rendered dynamically if the heading includes an icon.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		if ( strpos( $content, 'kt-typed-text') !== false ) {
			$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
		}
		if ( strpos( $content, 'kb-tooltips') !== false || ( ! empty( $attributes['icon'] ) && ! empty( $attributes['iconTooltip'] ) ) ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}

		$should_wrap_content = ! empty( $attributes['icon'] ) ||
		                       ( ! empty( $attributes['enableTextGradient'] ) && strpos( $content, 'kt-typed-text' ) === false );

		if ( $should_wrap_content ) {
			$tag_name     = $this->get_html_tag( $attributes, 'htmlTag', 'h2', $this->allowed_html_tags, 'level' );
			$text_content = $this->get_inner_content( $content, $tag_name );
			// Start empty.
			$content = '';
			$reveal_animation = ( ! empty( $attributes['kadenceAnimation'] ) && ( 'reveal-left' === $attributes['kadenceAnimation'] || 'reveal-right' === $attributes['kadenceAnimation'] || 'reveal-up' === $attributes['kadenceAnimation'] || 'reveal-down' === $attributes['kadenceAnimation'] ) ? true : false );
			$wrapper = $reveal_animation ? true : false;
			$icon_side = ! empty( $attributes['iconSide'] ) ? $attributes['iconSide'] : 'left';
			$classes = array( 'kt-adv-heading' . $unique_id, 'wp-block-kadence-advancedheading' );
			if ( ! empty( $attributes['icon'] ) ) {
				$classes[] = 'kt-adv-heading-has-icon';
			}
			if ( ! empty( $attributes['link'] ) && ! empty( $attributes['linkStyle'] ) ) {
				$classes[] = 'hls-' . $attributes['linkStyle'];
			}
			if ( ! empty( $attributes['className'] ) && ! $wrapper && empty( $attributes['link'] ) ) {
				$classes[] = $attributes['className'];
			}
			if ( ! empty( $attributes['colorClass'] ) ) {
				$classes[] = 'has-' . $attributes['colorClass'] . '-color';
				$classes[] = 'has-text-color';
			}
			if ( ! empty( $attributes['backgroundColorClass'] ) ) {
				$classes[] = 'has-' . $attributes['backgroundColorClass'] . '-background-color';
				$classes[] = 'has-background';
			}
			$content_args = array(
				'class' => implode( ' ', $classes ),
				'data-kb-block' => 'kb-adv-heading' . $unique_id,
			);
			if ( ! empty( $attributes['anchor'] ) ) {
				$content_args['id'] = $attributes['anchor'];
			}
			$content_args = kadence_apply_aos_wrapper_args( $attributes, $content_args );
			$inner_content_attributes = array();
			foreach ( $content_args as $key => $value ) {
				$inner_content_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
			$inner_content_attributes = implode( ' ', $inner_content_attributes );
			$icon_left = '';
			$icon_right = '';
			if ( ! empty( $attributes['icon'] ) ) {
				if ( 'left' === $icon_side ) {
					$icon_left = $this->get_icon( $attributes );
				}
				if ( 'right' === $icon_side ) {
					$icon_right = $this->get_icon( $attributes );
				}
			}
			$content = sprintf( '<%1$s %2$s>%3$s<span class="kb-adv-text-inner">%4$s</span>%5$s</%1$s>', $tag_name, $inner_content_attributes, $icon_left, $text_content, $icon_right );
			if ( ! empty( $attributes['link'] ) ) {
				$link_classes = array( 'kb-advanced-heading-link', 'kt-adv-heading-link' . $unique_id );
				if ( ! empty( $attributes['linkStyle'] ) ) {
					$link_classes[] = 'hls-' . $attributes['linkStyle'];
				}
				if( ! $wrapper && !empty( $attributes['className'] ) ){
					$link_classes[] = $attributes['className'];
				}
				if ( ! empty( $attributes['class'] ) && ! $wrapper ) {
					$link_classes[] = $attributes['class'];
				}
				$link_args = array(
					'class' => implode( ' ', $link_classes ),
				);
				$link_args['href'] = esc_url( do_shortcode( $attributes['link'] ) );
				$rel_add = '';
				if ( ! empty( $attributes['linkTarget'] ) && $attributes['linkTarget'] ) {
					$link_args['target'] = '_blank';
					$rel_add .= 'noreferrer noopener';
				}
				if ( isset( $attributes['linkNoFollow'] ) && $attributes['linkNoFollow'] ) {
					if ( ! empty( $rel_add ) ) {
						$rel_add .= ' nofollow';
					} else {
						$rel_add .= 'nofollow';
					}
				}
				if ( isset( $attributes['linkSponsored'] ) && $attributes['linkSponsored'] ) {
					if ( ! empty( $rel_add ) ) {
						$rel_add .= ' sponsored';
					} else {
						$rel_add .= 'sponsored';
					}
				}
				if ( ! empty( $rel_add ) ) {
					$link_args['rel'] = $rel_add;
				}
				$link_attributes = array();
				foreach ( $link_args as $key => $value ) {
					$link_attributes[] = $key . '="' . esc_attr( $value ) . '"';
				}
				$link_attributes = implode( ' ', $link_attributes );
				$content = sprintf( '<a %1$s>%2$s</a>', $link_attributes, $content );
			}
			if ( $wrapper ) {
				$wrapper_classes = array( 'kb-adv-heading-wrap' . $unique_id, 'kadence-advanced-heading-wrapper' );
				if ( $reveal_animation ) {
					$wrapper_classes[] = 'kadence-heading-clip-animation';
				}
				if ( ! empty( $attributes['class'] ) && $wrapper ) {
					$wrapper_classes[] = $attributes['class'];
				}
				$wrapper_args = array(
					'class' => implode( ' ', $wrapper_classes ),
				);
				$wrapper_attributes = array();
				foreach ( $wrapper_args as $key => $value ) {
					$wrapper_attributes[] = $key . '="' . esc_attr( $value ) . '"';
				}
				$wrapper_attributes = implode( ' ', $wrapper_attributes );
				$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
			}
		}

		return $content;
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS file.
		// parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_style( 'kadence-blocks-' . $this->block_name, false );
		$heading_css = '.wp-block-kadence-advancedheading mark{background:transparent;border-style:solid;border-width:0}.wp-block-kadence-advancedheading mark.kt-highlight{color:#f76a0c;}.kb-adv-heading-icon{display: inline-flex;justify-content: center;align-items: center;} .is-layout-constrained > .kb-advanced-heading-link {display: block;}';
		// Short term fix for an issue with heading wrapping.
		if ( class_exists( '\Kadence\Theme' ) ) {
			$heading_css .= '.single-content .kadence-advanced-heading-wrapper h1, .single-content .kadence-advanced-heading-wrapper h2, .single-content .kadence-advanced-heading-wrapper h3, .single-content .kadence-advanced-heading-wrapper h4, .single-content .kadence-advanced-heading-wrapper h5, .single-content .kadence-advanced-heading-wrapper h6 {margin: 1.5em 0 .5em;}.single-content .kadence-advanced-heading-wrapper+* { margin-top:0;}';
		}
		wp_add_inline_style( 'kadence-blocks-' . $this->block_name, $heading_css );
		wp_register_script( 'kadence-blocks-typed-js', KADENCE_BLOCKS_URL . 'includes/assets/js/typed.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-advanced-heading.min.js', array( 'kadence-blocks-typed-js' ), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', array( 'kadence-blocks-popper' ), KADENCE_BLOCKS_VERSION, true );
	}
	/**
	 * Get the text content.
	 *
	 * @param array $attributes the blocks attributes.
	 */
	private function get_inner_content( $string, $tagname ) {
		$pattern = "#<\s*?$tagname\b[^>]*>(.*?)</$tagname\b[^>]*>#s";
		preg_match( $pattern, $string, $matches );
		if ( isset( $matches[1] ) ) {
			return $matches[1];
		}
		return '';
	}

	/**
	 * Build the Icon.
	 *
	 * @param array $attributes the blocks attributes.
	 */
	private function get_icon( $attributes ) {
		$svg_icon   = '';
		$icon_side = ! empty( $attributes['iconSide'] ) ? $attributes['iconSide'] : 'left';
		if ( ! empty( $attributes['icon'] ) ) {
			$type         = substr( $attributes['icon'], 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = 2;
			}
			$title = ( ! empty ( $attributes['iconTitle'] ) ? $attributes['iconTitle'] : '' );
			$hidden = ( empty( $title ) ? true : false );
			$svg_icon = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width, $title, $hidden );
		}
		$tooltip_placement = '';
		if ( ! empty( $attributes['iconTooltip'] ) && ! empty( $attributes['iconTooltipPlacement'] ) ) {
			$tooltip_placement = ' data-tooltip-placement="' . esc_attr( $attributes['iconTooltipPlacement'] ) . '"';
		}
		if ( ! empty( $attributes['iconTooltip'] ) && isset( $attributes['iconTooltipDash'] ) && $attributes['iconTooltipDash'] ) {
			$tooltip_placement = ' data-kb-tooltip-dash="border"';
		}
		return '<span class="kb-svg-icon-wrap kb-adv-heading-icon kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kb-adv-heading-icon-side-' . esc_attr( $icon_side ) . '"' . ( ! empty( $attributes['iconTooltip'] ) ? ' data-kb-tooltip-content="' . esc_attr( $attributes['iconTooltip'] ) . '" tabindex="0"' . $tooltip_placement : '' ) . '>' . $svg_icon . '</span>';
	}

	/**
	 * Handles the text orientation by updating CSS properties based on the specified orientation.
	 *
	 * @param object $css The CSS processor object used to apply properties.
	 * @param string $textOrientation The specified text orientation. Possible values are 'horizontal', 'stacked', 'sideways-down', and 'sideways-up'.
	 * @return void
	 */
	private function handle_text_orientation($css, $textOrientation) {
		switch ($textOrientation) {
			case 'horizontal':
				$css->add_property('writing-mode', 'horizontal-tb');
				$css->add_property('text-orientation', 'mixed');
				break;
			case 'stacked':
				$css->add_property('writing-mode', 'vertical-lr');
				$css->add_property('text-orientation', 'upright');
				break;
			case 'sideways-down':
				$css->add_property('writing-mode', 'vertical-lr');
				$css->add_property('text-orientation', 'sideways');
				break;
			case 'sideways-up':
				$css->add_property('writing-mode', 'sideways-lr');
				$css->add_property('text-orientation', 'sideways');
				break;
		}
	}

	/**
	 * Handles the max-height property for CSS generation based on block attributes.
	 *
	 * @param object $css The CSS generator object.
	 * @param array $attributes The block attributes.
	 * @param int $deviceIndex The index representing the current device context.
	 * @param string $orientationKey The key that defines the orientation for the current context.
	 *
	 * @return void
	 */
	private function handle_max_height($css, $attributes, $deviceIndex, $orientationKey) {
		if (
			isset($attributes['maxHeight']) &&
			is_array($attributes['maxHeight']) &&
			!empty($attributes['maxHeight'][$deviceIndex]) &&
			$attributes[$orientationKey] !== 'horizontal'
		) {
			$css->add_property(
				'max-height',
				$attributes['maxHeight'][$deviceIndex] .
				( !isset($attributes['maxHeightType'][$deviceIndex]) ? 'px' : $attributes['maxHeightType'][$deviceIndex] )
			);
		}
	}

	/**
	 * Renders the text shadow styles across desktop, tablet, and mobile devices based on the provided attributes.
	 *
	 * @param array $attributes An array of attributes containing text shadow properties for different breakpoints (desktop, tablet, and mobile).
	 * @return void
	 */
	public function render_text_shadow( $attributes, $css ) {

		if (!empty($attributes['textShadow']) &&
			is_array($attributes['textShadow'][0]) &&
			(!empty($attributes['enableTextShadow']) || !empty($attributes['textShadow'][0]['enable']))
		) {
			$textShadow = $attributes['textShadow'][0] ?? [];
			$textShadow['hOffset'] = $textShadow['hOffset'] ?? 1;
			$textShadow['vOffset'] = $textShadow['vOffset'] ?? 1;
			$textShadow['blur']    = $textShadow['blur'] ?? 1;
			$textShadow['color']   = $textShadow['color'] ?? null;
			$textShadow['opacity'] = $textShadow['opacity'] ?? 1.0; // Default is 0.2, but if it's undefed they set it at a time when the block defaults it to 1.0
		}

		if (!empty($attributes['textShadowTablet']) && is_array($attributes['textShadowTablet'][0])) {
			$textShadowTablet = $attributes['textShadowTablet'][0] ?? [];
			$textShadowTablet['hOffset'] = $this->get_cascading_value(
				null, // No mobile value is considered here for tablet logic
				$textShadowTablet['hOffset'] ?? null,
				$attributes['textShadow'][0]['hOffset'] ?? null,
				1
			);
			$textShadowTablet['vOffset'] = $this->get_cascading_value(
				null,
				$textShadowTablet['vOffset'] ?? null,
				$attributes['textShadow'][0]['vOffset'] ?? null,
				1
			);
			$textShadowTablet['blur'] = $this->get_cascading_value(
				null,
				$textShadowTablet['blur'] ?? null,
				$attributes['textShadow'][0]['blur'] ?? null,
				1
			);
			$textShadowTablet['color'] = $this->get_cascading_value(
				null,
				$textShadowTablet['color'] ?? null,
				$attributes['textShadow'][0]['color'] ?? null,
				null // Default fallback value for color
			);
			$textShadowTablet['opacity'] = $this->get_cascading_value(
				null,
				$textShadowTablet['opacity'] ?? null,
				$attributes['textShadow'][0]['opacity'] ?? null,
				1
			);
		}
		if (!empty($attributes['textShadowMobile']) && is_array($attributes['textShadowMobile'][0])) {
			$textShadowMobile = $attributes['textShadowMobile'][0] ?? [];
			$textShadowMobile['hOffset'] = $this->get_cascading_value(
				$textShadowMobile['hOffset'] ?? null,
				$attributes['textShadowTablet'][0]['hOffset'] ?? null,
				$attributes['textShadow'][0]['hOffset'] ?? null,
				1
			);
			$textShadowMobile['vOffset'] = $this->get_cascading_value(
				$textShadowMobile['vOffset'] ?? null,
				$attributes['textShadowTablet'][0]['vOffset'] ?? null,
				$attributes['textShadow'][0]['vOffset'] ?? null,
				1
			);
			$textShadowMobile['blur'] = $this->get_cascading_value(
				$textShadowMobile['blur'] ?? null,
				$attributes['textShadowTablet'][0]['blur'] ?? null,
				$attributes['textShadow'][0]['blur'] ?? null,
				1
			);
			$textShadowMobile['color'] = $this->get_cascading_value(
				$textShadowMobile['color'] ?? null,
				$attributes['textShadowTablet'][0]['color'] ?? null,
				$attributes['textShadow'][0]['color'] ?? null,
				null
			);
			$textShadowMobile['opacity'] = $this->get_cascading_value(
				$textShadowMobile['opacity'] ?? null,
				$attributes['textShadowTablet'][0]['opacity'] ?? null,
				$attributes['textShadow'][0]['opacity'] ?? null,
				1
			);
		}

		$responsiveTextShadow = [$textShadow, $textShadowTablet ?? null, $textShadowMobile ?? null];

		foreach ($responsiveTextShadow as $key => $textShadow) {
			if (!empty($textShadow)) {
				if ( strpos($textShadow['color'], 'rgba') !== false ) {
					$shadow_string = ( ! empty( $textShadow['hOffset'] ) ? $textShadow['hOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['vOffset'] ) ? $textShadow['vOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['blur'] ) ? $textShadow['blur'] : '0' ) . 'px '
						. ( ! empty( $textShadow['color'] )
							? $css->render_color( $textShadow['color'] )
							: $css->render_color( '#000000', $textShadow['opacity'] )
						);
				} else {
					$shadow_string = ( ! empty( $textShadow['hOffset'] ) ? $textShadow['hOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['vOffset'] ) ? $textShadow['vOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['blur'] ) ? $textShadow['blur'] : '0' ) . 'px '
						. ( ! empty( $textShadow['color'] )
							? $css->render_color( $textShadow['color'], $textShadow['opacity'] )
							: $css->render_color( '#000000', $textShadow['opacity'] )
						);
				}

				switch ($key) {
					case 0: $css->set_media_state('desktop'); break;
					case 1: $css->set_media_state('tablet'); break;
					case 2: $css->set_media_state('mobile'); break;
				}

				$css->add_property('text-shadow', $shadow_string);
			}
		}
	}

	/**
	 * Retrieve the cascading value based on device-specific settings.
	 *
	 * @param mixed $mobile The value specifically set for mobile devices.
	 * @param mixed $tablet The value specifically set for tablet devices.
	 * @param mixed $default The default value if mobile and tablet values are not provided.
	 * @param mixed $fallback The fallback value if none of the other values are set.
	 */
	public function get_cascading_value($mobile, $tablet, $default, $fallback) {
		if (isset($mobile) && $mobile !== '') {
			return $mobile;
		} elseif (isset($tablet) && $tablet !== '') {
			return $tablet;
		} elseif (isset($default) && $default !== '') {
			return $default;
		}
		return $fallback;
	}
}

Kadence_Blocks_Advancedheading_Block::get_instance();
