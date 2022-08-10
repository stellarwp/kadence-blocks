<?php
/**
 * Class to Build the Accordion Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Accordion Block.
 *
 * @category class
 */
class Kadence_Blocks_Accordion_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'accordion';

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
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );
		$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner' );
		$css->render_color_output( $attributes, 'contentBorderColor', 'border-color' );
		$css->render_border_radius( $attributes, 'contentBorderRadius', 'px' );
		$css->render_color_output( $attributes, 'contentBgColor', 'background' );
		$css->render_measure_range( $attributes, 'contentBorder', 'border-width' );
		$content_padding_args = array(
			'desktop_key' => 'contentPadding',
			'tablet_key'  => 'contentTabletPadding',
			'mobile_key'  => 'contentMobilePadding',
		);
		$css->render_measure_output( $attributes, 'contentPadding', 'padding', $content_padding_args );
		// Title Styles
		if ( isset( $attributes['titleStyles'] ) && is_array( $attributes['titleStyles'] ) && is_array( $attributes['titleStyles'][ 0 ] ) ) {
			$title_styles = $attributes['titleStyles'][ 0 ];
			$css->set_selector( '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header' );
			$css->render_color_output( $title_styles, 'color', 'color' );
			$css->render_color_output( $title_styles, 'background', 'background' );
			$css->render_border_color( $title_styles, 'border' );
			$css->render_typography( $title_styles, '' );
		}

		// 	if ( isset( $title_styles['size'] ) && is_array( $title_styles['size'] ) && ! empty( $title_styles['size'][0] ) ) {
		// 		$css .= 'font-size:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
		// 	}
		// 	if ( isset( $title_styles['lineHeight'] ) && is_array( $title_styles['lineHeight'] ) && ! empty( $title_styles['lineHeight'][0] ) ) {
		// 		$css .= 'line-height:' . $title_styles['lineHeight'][0] . ( ! isset( $title_styles['lineType'] ) ? 'px' : $title_styles['lineType'] ) . ';';
		// 	}
		// 	if ( isset( $title_styles['letterSpacing'] ) && ! empty( $title_styles['letterSpacing'] ) ) {
		// 		$css .= 'letter-spacing:' . $title_styles['letterSpacing'] .  'px;';
		// 	}
		// 	if ( isset( $title_styles['textTransform'] ) && ! empty( $title_styles['textTransform'] ) ) {
		// 		$css .= 'text-transform:' . $title_styles['textTransform'] .  ';';
		// 	}
		// 	if ( isset( $title_styles['family'] ) && ! empty( $title_styles['family'] ) ) {
		// 		$css .= 'font-family:' . $title_styles['family'] .  ';';
		// 	}
		// 	if ( isset( $title_styles['style'] ) && ! empty( $title_styles['style'] ) ) {
		// 		$css .= 'font-style:' . $title_styles['style'] .  ';';
		// 	}
		// 	if ( isset( $title_styles['weight'] ) && ! empty( $title_styles['weight'] ) ) {
		// 		$css .= 'font-weight:' . $title_styles['weight'] .  ';';
		// 	}
		// 	if ( isset( $title_styles['borderRadius'] ) && is_array( $title_styles['borderRadius'] ) ) {
		// 		$css .= 'border-radius:' . $title_styles['borderRadius'][0] . 'px ' . $title_styles['borderRadius'][1] . 'px ' . $title_styles['borderRadius'][2] . 'px ' . $title_styles['borderRadius'][3] . 'px;';
		// 	}
		// 	if ( isset( $title_styles['borderWidth'] ) && is_array( $title_styles['borderWidth'] ) ) {
		// 		$css .= 'border-width:' . $title_styles['borderWidth'][0] . 'px ' . $title_styles['borderWidth'][1] . 'px ' . $title_styles['borderWidth'][2] . 'px ' . $title_styles['borderWidth'][3] . 'px;';
		// 	}
		// 	if ( isset( $title_styles['padding'] ) && is_array( $title_styles['padding'] ) ) {
		// 		if ( isset( $title_styles['padding'][0] ) && is_numeric($title_styles['padding'][0] ) ) {
		// 			$css .= 'padding-top:' . $title_styles['padding'][0] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['padding'][1] ) && is_numeric($title_styles['padding'][1] ) ) {
		// 			$css .= 'padding-right:' . $title_styles['padding'][1] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['padding'][2] ) && is_numeric($title_styles['padding'][2] ) ) {
		// 			$css .= 'padding-bottom:' . $title_styles['padding'][2] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['padding'][3] ) && is_numeric($title_styles['padding'][3] ) ) {
		// 			$css .= 'padding-left:' . $title_styles['padding'][3] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 	}
		// 	if ( isset( $title_styles['marginTop'] ) && ! empty( $title_styles['marginTop'] ) ) {
		// 		$css .= 'margin-top:' . $title_styles['marginTop'] . 'px;';
		// 	}
		// 	$css .= '}';
		// 	if ( isset( $title_styles['paddingTablet'] ) && is_array( $title_styles['paddingTablet'] ) ) {
		// 		$css .= '@media (max-width: 1024px) {';
		// 		$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
		// 		if ( isset( $title_styles['paddingTablet'][0] ) && is_numeric($title_styles['paddingTablet'][0] ) ) {
		// 			$css .= 'padding-top:' . $title_styles['paddingTablet'][0] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['paddingTablet'][1] ) && is_numeric($title_styles['paddingTablet'][1] ) ) {
		// 			$css .= 'padding-right:' . $title_styles['paddingTablet'][1] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['paddingTablet'][2] ) && is_numeric($title_styles['paddingTablet'][2] ) ) {
		// 			$css .= 'padding-bottom:' . $title_styles['paddingTablet'][2] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['paddingTablet'][3] ) && is_numeric($title_styles['paddingTablet'][3] ) ) {
		// 			$css .= 'padding-left:' . $title_styles['paddingTablet'][3] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		$css .= '}';
		// 		$css .= '}';
		// 	}
		// 	if ( isset( $title_styles['paddingMobile'] ) && is_array( $title_styles['paddingMobile'] ) ) {
		// 		$css .= '@media (max-width: 767px) {';
		// 		$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
		// 		if ( isset( $title_styles['paddingMobile'][0] ) && is_numeric($title_styles['paddingMobile'][0] ) ) {
		// 			$css .= 'padding-top:' . $title_styles['paddingMobile'][0] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['paddingMobile'][1] ) && is_numeric($title_styles['paddingMobile'][1] ) ) {
		// 			$css .= 'padding-right:' . $title_styles['paddingMobile'][1] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['paddingMobile'][2] ) && is_numeric($title_styles['paddingMobile'][2] ) ) {
		// 			$css .= 'padding-bottom:' . $title_styles['paddingMobile'][2] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		if ( isset( $title_styles['paddingMobile'][3] ) && is_numeric($title_styles['paddingMobile'][3] ) ) {
		// 			$css .= 'padding-left:' . $title_styles['paddingMobile'][3] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
		// 		}
		// 		$css .= '}';
		// 		$css .= '}';
		// 	}
		// 	if ( isset( $title_styles['size'] ) && is_array( $title_styles['size'] ) && ! empty( $title_styles['size'][0] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
		// 			$css .= 'width:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
		// 			$css .= 'height:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
		// 		$css .= '}';
		// 	}
		// 	if ( ! empty( $attributes['iconColor']['standard'] ) || ! empty( $title_styles['color'] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:before {';
		// 		$css .= 'background:' . $this->kadence_color_output( ( !empty( $attributes['iconColor']['standard'] ) ? $attributes['iconColor']['standard'] : $title_styles['color'] ) ) .  ';';
		// 		$css .= '}';
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger {';
		// 			$css .= 'background:' . $this->kadence_color_output( ( !empty( $attributes['iconColor']['standard'] ) ? $attributes['iconColor']['standard'] : $title_styles['color'] ) ) .  ';';
		// 		$css .= '}';
		// 	}
		// 	if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:before {';
		// 			$css .= 'background:' . $this->kadence_color_output( $title_styles['background'] ) .  ';';
		// 		$css .= '}';
		// 	}
		// 	$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header:hover, .kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header:focus {';
		// 	if ( isset( $title_styles['colorHover'] ) && ! empty( $title_styles['colorHover'] ) ) {
		// 		$css .= 'color:' . $this->kadence_color_output( $title_styles['colorHover'] ) .  ';';
		// 	}
		// 	if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
		// 		$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundHover'] ) .  ';';
		// 	}
		// 	if ( isset( $title_styles['borderHover'] ) && is_array( $title_styles['borderHover'] ) && ! empty( $title_styles['borderHover'][0] ) ) {
		// 		$css .= 'border-color:' . $this->kadence_color_output( $title_styles['borderHover'][0] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][1] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][2] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][3] ) . ';';
		// 	}
		// 	$css .= '}';

		// 	if ( ! empty( $attributes['iconColor']['hover'] ) || ! empty( $title_styles['colorHover'] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:before {';
		// 		$css .= 'background:' . $this->kadence_color_output( ( !empty( $attributes['iconColor']['hover'] ) ? $attributes['iconColor']['hover'] : $title_styles['colorHover'] ) ) .  ';';
		// 		$css .= '}';
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger {';
		// 			$css .= 'background:' . $this->kadence_color_output( ( !empty( $attributes['iconColor']['hover'] ) ? $attributes['iconColor']['hover'] : $title_styles['colorHover'] ) ) .  ';';
		// 		$css .= '}';
		// 	}
		// 	if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:before {';
		// 			$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundHover'] ) .  ';';
		// 		$css .= '}';
		// 	}
		// 	$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header.kt-accordion-panel-active {';
		// 	if ( isset( $title_styles['colorActive'] ) && ! empty( $title_styles['colorActive'] ) ) {
		// 		$css .= 'color:' . $this->kadence_color_output( $title_styles['colorActive'] ) .  ';';
		// 	}
		// 	if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
		// 		$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundActive'] ) .  ';';
		// 	}
		// 	if ( isset( $title_styles['borderActive'] ) && is_array( $title_styles['borderActive'] ) && ! empty( $title_styles['borderActive'][0] ) ) {
		// 		$css .= 'border-color:' . $this->kadence_color_output( $title_styles['borderActive'][0] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][1] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][2] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][3] ) . ';';
		// 	}
		// 	$css .= '}';
		// 	if ( ! empty( $attributes['iconColor']['active'] ) || ! empty( $title_styles['colorActive'] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
		// 		$css .= 'background:' . $this->kadence_color_output( ( !empty( $attributes['iconColor']['active'] ) ? $attributes['iconColor']['hover'] : $title_styles['colorActive'] ) ) .  ';';
		// 		$css .= '}';
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger {';
		// 			$css .= 'background:' . $this->kadence_color_output( ( !empty( $attributes['iconColor']['active'] ) ? $attributes['iconColor']['hover'] : $title_styles['colorActive'] ) ) .  ';';
		// 		$css .= '}';
		// 	}
		// 	if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
		// 		$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
		// 			$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundActive'] ) .  ';';
		// 		$css .= '}';
		// 	}
		// }
		// if ( isset( $attributes['titleStyles'] ) && is_array( $attributes['titleStyles'] ) && isset( $attributes['titleStyles'][0] ) && is_array( $attributes['titleStyles'][0] ) && ( ( isset( $attributes['titleStyles'][0]['size'] ) && is_array( $attributes['titleStyles'][0]['size'] ) && isset( $attributes['titleStyles'][0]['size'][1] ) && ! empty( $attributes['titleStyles'][0]['size'][1] ) ) || ( isset( $attributes['titleStyles'][0]['lineHeight'] ) && is_array( $attributes['titleStyles'][0]['lineHeight'] ) && isset( $attributes['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['titleStyles'][0]['lineHeight'][1] ) ) ) ) {
		// 	$css .= '@media (max-width: 1024px) {';
		// 	$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
		// 	if ( isset( $attributes['titleStyles'][0]['size'][1] ) && ! empty( $attributes['titleStyles'][0]['size'][1] ) ) {
		// 		$css .= 'font-size:' . $attributes['titleStyles'][0]['size'][1] . ( ! isset( $attributes['titleStyles'][0]['sizeType'] ) ? 'px' : $attributes['titleStyles'][0]['sizeType'] ) . ';';
		// 	}
		// 	if ( isset( $attributes['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['titleStyles'][0]['lineHeight'][1] ) ) {
		// 		$css .= 'line-height:' . $attributes['titleStyles'][0]['lineHeight'][1] . ( ! isset( $attributes['titleStyles'][0]['lineType'] ) ? 'px' : $attributes['titleStyles'][0]['lineType'] ) . ';';
		// 	}
		// 	$css .= '}';
		// 	$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
		// 		$css .= 'width:' . $attributes['titleStyles'][0]['size'][1] . ( ! isset( $attributes['titleStyles'][0]['sizeType'] ) ? 'px' : $attributes['titleStyles'][0]['sizeType'] ) . ';';
		// 		$css .= 'height:' . $attributes['titleStyles'][0]['size'][1] . ( ! isset( $attributes['titleStyles'][0]['sizeType'] ) ? 'px' : $attributes['titleStyles'][0]['sizeType'] ) . ';';
		// 	$css .= '}';
		// 	$css .= '}';
		// }
		// if ( isset( $attributes['titleStyles'] ) && is_array( $attributes['titleStyles'] ) && isset( $attributes['titleStyles'][0] ) && is_array( $attributes['titleStyles'][0] ) && ( ( isset( $attributes['titleStyles'][0]['size'] ) && is_array( $attributes['titleStyles'][0]['size'] ) && isset( $attributes['titleStyles'][0]['size'][2] ) && ! empty( $attributes['titleStyles'][0]['size'][2] ) ) || ( isset( $attributes['titleStyles'][0]['lineHeight'] ) && is_array( $attributes['titleStyles'][0]['lineHeight'] ) && isset( $attributes['titleStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['titleStyles'][0]['lineHeight'][2] ) ) ) ) {
		// 	$css .= '@media (max-width: 767px) {';
		// 	$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
		// 		if ( isset( $attributes['titleStyles'][0]['size'][2] ) && ! empty( $attributes['titleStyles'][0]['size'][2] ) ) {
		// 			$css .= 'font-size:' . $attributes['titleStyles'][0]['size'][2] . ( ! isset( $attributes['titleStyles'][0]['sizeType'] ) ? 'px' : $attributes['titleStyles'][0]['sizeType'] ) . ';';
		// 		}
		// 		if ( isset( $attributes['titleStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['titleStyles'][0]['lineHeight'][2] ) ) {
		// 			$css .= 'line-height:' . $attributes['titleStyles'][0]['lineHeight'][2] . ( ! isset( $attributes['titleStyles'][0]['lineType'] ) ? 'px' : $attributes['titleStyles'][0]['lineType'] ) . ';';
		// 		}
		// 	$css .= '}';
		// 	$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
		// 		$css .= 'width:' . $attributes['titleStyles'][0]['size'][2] . ( ! isset( $attributes['titleStyles'][0]['sizeType'] ) ? 'px' : $attributes['titleStyles'][0]['sizeType'] ) . ';';
		// 		$css .= 'height:' . $attributes['titleStyles'][0]['size'][2] . ( ! isset( $attributes['titleStyles'][0]['sizeType'] ) ? 'px' : $attributes['titleStyles'][0]['sizeType'] ) . ';';
		// 	$css .= '}';
		// 	$css .= '}';
		// }
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
		if ( $this->has_script ) {
			wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kt-accordion.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		}
	}
	/**
	 * Render Block CSS in Page Head.
	 *
	 * @param array $block the block data.
	 */
	public function output_head_data( $block ) {
		parent::output_head_data( $block );
		if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
			$attributes = $block['attrs'];
			if ( isset( $attributes['uniqueID'] ) ) {
				$unique_id = $attributes['uniqueID'];
				if ( isset( $attributes['faqSchema'] ) && $attributes['faqSchema'] ) {
					$faq_script_id  = 'kb-faq' . esc_attr( $unique_id );
					$frontend_class = Kadence_Blocks_Frontend::get_instance();
					if ( is_null( $frontend_class::$faq_schema ) ) {
						$frontend_class::$faq_schema = '<script type="application/ld+json" class="kadence-faq-schema-graph kadence-faq-schema-graph--' . $faq_script_id . '">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}</script>';
					}
				}
			}
		}
	}
}
Kadence_Blocks_Accordion_Block::get_instance();
