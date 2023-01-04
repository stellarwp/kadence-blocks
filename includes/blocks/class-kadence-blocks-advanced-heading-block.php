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
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
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
		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_measure_output( $attributes, 'margin', 'margin' );
		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width' );

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
			$css->add_property( 'font-family', $css->render_font_family( $attributes['typography'], $google, $attributes['fontVariant'] ) );
		}
		if ( ! empty( $attributes['textTransform'] ) ) {
			$css->add_property( 'text-transform', $attributes['textTransform'] );
		}
		if ( isset( $attributes['letterSpacing'] ) && is_numeric( $attributes['letterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $attributes['letterSpacing'] . ( ! isset( $attributes['letterType'] ) ? 'px' : $attributes['letterType'] ) );
		}
		if ( isset( $attributes['color'] ) && ! empty( $attributes['color'] ) ) {
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
		if ( isset( $attributes['background'] ) && ! empty( $attributes['background'] ) ) {
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
		if ( isset( $attributes['textShadow'] ) && is_array( $attributes['textShadow'] ) && isset( $attributes['textShadow'][0] ) && is_array( $attributes['textShadow'][0] ) && isset( $attributes['textShadow'][0]['enable'] ) && $attributes['textShadow'][0]['enable'] ) {
			$css->add_property( 'text-shadow', ( isset( $attributes['textShadow'][0]['hOffset'] ) ? $attributes['textShadow'][0]['hOffset'] : 1 ) . 'px ' . ( isset( $attributes['textShadow'][0]['vOffset'] ) ? $attributes['textShadow'][0]['vOffset'] : 1 ) . 'px ' . ( isset( $attributes['textShadow'][0]['blur'] ) ? $attributes['textShadow'][0]['blur'] : 1 ) . 'px ' . ( isset( $attributes['textShadow'][0]['color'] ) ? $css->render_color( $attributes['textShadow'][0]['color'] ) : 'rgba(0,0,0,0.2)' ) );
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
		} else if ( ! empty( $attributes['fontSize'][1] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['fontSize'][1], ( ! isset( $attributes['sizeType'] ) ? 'px' : $attributes['sizeType'] ) ) );
		}
		// Old line height first.
		if ( ! empty( $attributes['mobileLineHeight'] ) ) {
			$css->add_property( 'line-height', $attributes['mobileLineHeight'] . ( empty( $attributes['lineType'] ) ? 'px' : $attributes['lineType'] ) );
		} else if ( ! empty( $attributes['fontHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['fontHeight'][1] . ( empty( $attributes['fontHeightType'] ) ? '' : $attributes['fontHeightType'] ) );
		}
		if ( ! empty( $attributes['mobileAlign'] ) ) {
			$css->add_property( 'text-align', $attributes['mobileAlign'] . '!important' );
		}
		$css->set_media_state( 'desktop' );


		// Highlight.
		$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark' );
		if ( isset( $attributes['markLetterSpacing'] ) && ! empty( $attributes['markLetterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $attributes['markLetterSpacing'] . ( ! isset( $attributes['markLetterType'] ) ? 'px' : $attributes['markLetterType'] ) );
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
			$css->add_property( 'font-family', $css->render_font_family( $attributes['markTypography'], $google, $attributes['markFontVariant'] ) );
		}
		if ( ! empty( $attributes['markFontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_font_weight( $attributes['markFontWeight'] ) );
		}
		if ( ! empty( $attributes['markFontStyle'] ) ) {
			$css->add_property( 'font-style', $attributes['markFontStyle'] );
		}
		if ( ! empty( $attributes['markColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['markColor'] ) );
		}
		if ( ! empty( $attributes['markTextTransform'] ) ) {
			$css->add_property( 'text-transform', $attributes['markTextTransform'] );
		}
		if ( ! empty( $attributes['markBG'] ) ) {
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
		$css->set_selector( '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark' );
		// Tablet.
		$css->set_media_state( 'tablet' );
		$css->set_selector( '#kt-adv-heading' . $unique_id . ' mark, #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading mark, .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark' );
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

}

Kadence_Blocks_Advancedheading_Block::get_instance();
