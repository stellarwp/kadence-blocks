<?php
/**
 * Class to Build the Single Button Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Single Button.
 *
 * @category class
 */
class Kadence_Blocks_Singlebtn_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'singlebtn';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		if ( ! empty( $attributes['target'] ) && 'video' === $attributes['target'] ) {
			$this->enqueue_style( 'kadence-glightbox' );
			$this->enqueue_script( 'kadence-blocks-glight-video-init' );
			$gallery_translation_array = [
				'plyr_js'  => KADENCE_BLOCKS_URL . 'includes/assets/js/plyr.min.js',
				'plyr_css' => KADENCE_BLOCKS_URL . 'includes/assets/css/plyr.min.css',
			];
			wp_localize_script( 'kadence-blocks-glight-video-init', 'kadence_video_pop', $gallery_translation_array );
		}
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = [ 'Desktop', 'Tablet', 'Mobile' ];
		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		$width_type = ! empty( $attributes['widthType'] ) ? $attributes['widthType'] : 'auto';
		if ( 'fixed' === $width_type ) {
			$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button, ul.menu .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button' );
			$css->render_responsive_range( $attributes, 'width', 'width', 'widthUnit' );
		} else {
			$css->set_selector( 'ul.menu .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button' );
			$css->add_property( 'width', 'initial' );
		}
		// standard styles
		$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button' );
		$bg_type       = ! empty( $attributes['backgroundType'] ) ? $attributes['backgroundType'] : 'normal';
		$bg_hover_type = ! empty( $attributes['backgroundHoverType'] ) ? $attributes['backgroundHoverType'] : 'normal';

		if ( ! empty( $attributes['color'] ) && ( empty( $attributes['textBackgroundType'] ) || $attributes['textBackgroundType'] === 'normal' ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['color'] ) );
		} elseif ( ! empty( $attributes['textBackgroundType'] ) && $attributes['textBackgroundType'] === 'gradient' ) {
			$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button .kt-btn-inner-text' );
			$css->add_property( 'background', $attributes['textGradient'] );
			$css->add_property( '-webkit-background-clip', 'text' );
			$css->add_property( '-webkit-text-fill-color', 'transparent' );
			$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button' );
		}
		if ( 'normal' === $bg_type && ! empty( $attributes['background'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['background'] ) . ( 'gradient' === $bg_hover_type ? ' !important' : '' ) );
		}
		if ( 'gradient' === $bg_type && ! empty( $attributes['gradient'] ) ) {
			$css->add_property( 'background', $attributes['gradient'] . ' !important' );
		}
		$css->render_typography( $attributes, 'typography' );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', [ 'unit_key' => 'borderRadiusUnit' ] );
		$css->render_border_styles( $attributes, 'borderStyle', true );
		$css->render_measure_output( $attributes, 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] );
		$css->render_measure_output( $attributes, 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] );
		if ( isset( $attributes['displayShadow'] ) && true === $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && isset( $attributes['shadow'][0] ) && is_array( $attributes['shadow'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadow'][0]['inset'] ) && true === $attributes['shadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadow'][0]['hOffset'] ) && is_numeric( $attributes['shadow'][0]['hOffset'] ) ? $attributes['shadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['vOffset'] ) && is_numeric( $attributes['shadow'][0]['vOffset'] ) ? $attributes['shadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['blur'] ) && is_numeric( $attributes['shadow'][0]['blur'] ) ? $attributes['shadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadow'][0]['spread'] ) && is_numeric( $attributes['shadow'][0]['spread'] ) ? $attributes['shadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadow'][0]['color'] ) && ! empty( $attributes['shadow'][0]['color'] ) ? $attributes['shadow'][0]['color'] : '#000000' ), ( isset( $attributes['shadow'][0]['opacity'] ) && is_numeric( $attributes['shadow'][0]['opacity'] ) ? $attributes['shadow'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '1px 1px 2px 0px rgba(0, 0, 0, 0.2)' );
			}
		}
		if ( ! empty( $attributes['textUnderline'] ) ) {
			$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:not(.specificity):not(.extra-specificity)' );
			$css->add_property( 'text-decoration', $attributes['textUnderline'] );
		}
		// Icon styles.
		$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kb-svg-icon-wrap' );
		if ( ! empty( $attributes['iconColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['iconColor'] ) );
		}
		$css->render_measure_output( $attributes, 'iconPadding', 'padding', [ 'unit_key' => 'iconPaddingUnit' ] );
		$css->render_responsive_range( $attributes, 'iconSize', 'font-size', 'iconSizeUnit' );
		// Icon Hover-Focus.
		$css->set_selector( '.kb-btn' . $unique_id . '.kb-button:hover .kb-svg-icon-wrap, .kb-btn' . $unique_id . '.kb-button:focus .kb-svg-icon-wrap' );
		if ( ! empty( $attributes['iconColorHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['iconColorHover'] ) );
		}
		// Hover-Focus.
		$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:focus' );
		if ( ! empty( $attributes['colorHover'] ) && ( empty( $attributes['textBackgroundHoverType'] ) || $attributes['textBackgroundHoverType'] === 'normal' ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['colorHover'] ) );
		} elseif ( ! empty( $attributes['textBackgroundHoverType'] ) && $attributes['textBackgroundHoverType'] === 'gradient' ) {
			$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:hover .kt-btn-inner-text, .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:focus .kt-btn-inner-text' );
			$css->add_property( 'background', $attributes['textGradientHover'] );
			$css->add_property( '-webkit-background-clip', 'text' );
			$css->add_property( '-webkit-text-fill-color', 'transparent' );
			$css->set_selector( '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:focus' );
		}

		if ( 'gradient' !== $bg_type && 'normal' === $bg_hover_type && ! empty( $attributes['backgroundHover'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['backgroundHover'] ) );
		}
		$css->render_measure_output( $attributes, 'borderHoverRadius', 'border-radius' );
		$css->render_border_styles( $attributes, 'borderHoverStyle', true );
		if ( isset( $attributes['displayHoverShadow'] ) && true === $attributes['displayHoverShadow'] ) {
			if ( ( 'gradient' === $bg_type || 'gradient' === $bg_hover_type ) && isset( $attributes['shadowHover'][0]['inset'] ) && true === $attributes['shadowHover'][0]['inset'] ) {
				$css->add_property( 'box-shadow', '0px 0px 0px 0px rgba(0, 0, 0, 0)' );
				$css->set_selector( '.kb-btn' . $unique_id . '.kb-button:hover::before' );
			}
			if ( isset( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'] ) && isset( $attributes['shadowHover'][0] ) && is_array( $attributes['shadowHover'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowHover'][0]['inset'] ) && true === $attributes['shadowHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowHover'][0]['hOffset'] ) && is_numeric( $attributes['shadowHover'][0]['hOffset'] ) ? $attributes['shadowHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['vOffset'] ) && is_numeric( $attributes['shadowHover'][0]['vOffset'] ) ? $attributes['shadowHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['blur'] ) && is_numeric( $attributes['shadowHover'][0]['blur'] ) ? $attributes['shadowHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['spread'] ) && is_numeric( $attributes['shadowHover'][0]['spread'] ) ? $attributes['shadowHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowHover'][0]['color'] ) && ! empty( $attributes['shadowHover'][0]['color'] ) ? $attributes['shadowHover'][0]['color'] : '#000000' ), ( isset( $attributes['shadowHover'][0]['opacity'] ) && is_numeric( $attributes['shadowHover'][0]['opacity'] ) ? $attributes['shadowHover'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '2px 2px 3px 0px rgba(0, 0, 0, 0.4)' );
			}
		}
		// Hover before.
		if ( 'gradient' === $bg_type && 'normal' === $bg_hover_type && ! empty( $attributes['backgroundHover'] ) ) {
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button::before' );
			$css->add_property( 'background', $css->render_color( $attributes['backgroundHover'] ) );
			$css->add_property( 'transition', 'opacity .3s ease-in-out' );
		}
		if ( 'gradient' === $bg_hover_type && ! empty( $attributes['gradientHover'] ) ) {
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button::before' );
			$css->add_property( 'background', $attributes['gradientHover'] );
			$css->add_property( 'transition', 'opacity .3s ease-in-out' );
		}
		// Only Icon.
		if ( isset( $attributes['onlyIcon'][0] ) && '' !== $attributes['onlyIcon'][0] && true == $attributes['onlyIcon'][0] ) {
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kt-btn-inner-text' );
			$css->add_property( 'display', 'none' );
		}
		if ( isset( $attributes['onlyIcon'][1] ) && '' !== $attributes['onlyIcon'][1] ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kt-btn-inner-text' );
			if ( true == $attributes['onlyIcon'][1] ) {
				$css->add_property( 'display', 'none' );
			} elseif ( false == $attributes['onlyIcon'][1] ) {
				$css->add_property( 'display', 'block' );
			}
		}
		if ( isset( $attributes['onlyText'][0] ) && '' !== $attributes['onlyText'][0] ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kb-svg-icon-wrap' );
			if ( true == $attributes['onlyText'][0] ) {
				$css->add_property( 'display', 'none' );
			}
		}
		if ( isset( $attributes['onlyIcon'][2] ) && '' !== $attributes['onlyIcon'][2] ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kt-btn-inner-text' );
			if ( true == $attributes['onlyIcon'][2] ) {
				$css->add_property( 'display', 'none' );
			}
		}
		if ( isset( $attributes['onlyText'][1] ) && '' !== $attributes['onlyText'][1] ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kb-svg-icon-wrap' );
			if ( true == $attributes['onlyText'][1] ) {
				$css->add_property( 'display', 'none' );
			} elseif ( false == $attributes['onlyText'][1] ) {
				$css->add_property( 'display', 'block' );
			}
		}
		$css->set_media_state( 'desktop' );
		return $css->css_output();
	}


	/**
	 * Build up the dynamic styles for a size.
	 *
	 * @param string $size The size.
	 * @return array
	 */
	public function sized_dynamic_styles( $css, $attributes, $unique_id, $size = 'Desktop' ) {
		$sized_attributes         = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );

		$css->set_media_state( strtolower( $size ) );

		// standard transparent styles
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button' );
		$bg_type_transparent       = ! empty( $attributes['backgroundTransparentType'] ) ? $attributes['backgroundTransparentType'] : 'normal';
		$bg_hover_type_transparent = ! empty( $attributes['backgroundTransparentHoverType'] ) ? $attributes['backgroundTransparentHoverType'] : 'normal';
		if ( ! empty( $attributes['colorTransparent'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['colorTransparent'] ) );
		}
		if ( 'normal' === $bg_type_transparent && ! empty( $attributes['backgroundTransparent'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['backgroundTransparent'] ) . ( 'gradient' === $bg_hover_type_transparent ? ' !important' : '' ) );
		}
		if ( 'gradient' === $bg_type_transparent && ! empty( $attributes['gradientTransparent'] ) ) {
			$css->add_property( 'background', $attributes['gradientTransparent'] . ' !important' );
		}
		$css->render_measure_output( $attributes, 'borderTransparentRadius', 'border-radius', [ 'unit_key' => 'borderTransparentRadiusUnit' ] );
		$css->render_border_styles( $attributes, 'borderTransparentStyle', true );
		if ( isset( $attributes['displayShadowTransparent'] ) && true === $attributes['displayShadowTransparent'] ) {
			if ( isset( $attributes['shadowTransparent'] ) && is_array( $attributes['shadowTransparent'] ) && isset( $attributes['shadowTransparent'][0] ) && is_array( $attributes['shadowTransparent'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowTransparent'][0]['inset'] ) && true === $attributes['shadowTransparent'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowTransparent'][0]['hOffset'] ) && is_numeric( $attributes['shadowTransparent'][0]['hOffset'] ) ? $attributes['shadowTransparent'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowTransparent'][0]['vOffset'] ) && is_numeric( $attributes['shadowTransparent'][0]['vOffset'] ) ? $attributes['shadowTransparent'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowTransparent'][0]['blur'] ) && is_numeric( $attributes['shadowTransparent'][0]['blur'] ) ? $attributes['shadowTransparent'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowTransparent'][0]['spread'] ) && is_numeric( $attributes['shadowTransparent'][0]['spread'] ) ? $attributes['shadowTransparent'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowTransparent'][0]['color'] ) && ! empty( $attributes['shadowTransparent'][0]['color'] ) ? $attributes['shadowTransparent'][0]['color'] : '#000000' ), ( isset( $attributes['shadowTransparent'][0]['opacity'] ) && is_numeric( $attributes['shadowTransparent'][0]['opacity'] ) ? $attributes['shadowTransparent'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '1px 1px 2px 0px rgba(0, 0, 0, 0.2)' );
			}
		}

		// hover transparent styles
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:hover' );
		if ( ! empty( $attributes['colorTransparentHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['colorTransparentHover'] ) );
		}
		if ( 'gradient' !== $bg_type_transparent && 'normal' === $bg_hover_type_transparent && ! empty( $attributes['backgroundTransparentHover'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['backgroundTransparentHover'] ) );
		}
		$css->render_measure_output( $attributes, 'borderTransparentHoverRadius', 'border-radius' );
		$css->render_border_styles( $attributes, 'borderTransparentHoverStyle', true );
		if ( isset( $attributes['displayHoverShadowTransparent'] ) && true === $attributes['displayHoverShadowTransparent'] ) {
			if ( ( 'gradient' === $bg_type_transparent || 'gradient' === $bg_hover_type_transparent ) && isset( $attributes['shadowTransparentHover'][0]['inset'] ) && true === $attributes['shadowTransparentHover'][0]['inset'] ) {
				$css->add_property( 'box-shadow', '0px 0px 0px 0px rgba(0, 0, 0, 0)' );
				$css->set_selector( '.kb-btn' . $unique_id . '.kb-button:hover::before' );
			}
			if ( isset( $attributes['shadowTransparentHover'] ) && is_array( $attributes['shadowTransparentHover'] ) && isset( $attributes['shadowTransparentHover'][0] ) && is_array( $attributes['shadowTransparentHover'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowTransparentHover'][0]['inset'] ) && true === $attributes['shadowTransparentHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowTransparentHover'][0]['hOffset'] ) && is_numeric( $attributes['shadowTransparentHover'][0]['hOffset'] ) ? $attributes['shadowTransparentHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowTransparentHover'][0]['vOffset'] ) && is_numeric( $attributes['shadowTransparentHover'][0]['vOffset'] ) ? $attributes['shadowTransparentHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowTransparentHover'][0]['blur'] ) && is_numeric( $attributes['shadowTransparentHover'][0]['blur'] ) ? $attributes['shadowTransparentHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowTransparentHover'][0]['spread'] ) && is_numeric( $attributes['shadowTransparentHover'][0]['spread'] ) ? $attributes['shadowTransparentHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowTransparentHover'][0]['color'] ) && ! empty( $attributes['shadowTransparentHover'][0]['color'] ) ? $attributes['shadowTransparentHover'][0]['color'] : '#000000' ), ( isset( $attributes['shadowTransparentHover'][0]['opacity'] ) && is_numeric( $attributes['shadowTransparentHover'][0]['opacity'] ) ? $attributes['shadowTransparentHover'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '2px 2px 3px 0px rgba(0, 0, 0, 0.4)' );
			}
		}

		// standard sticky styles
		$css->set_selector( '.item-is-stuck .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button' );
		$bg_type_sticky       = ! empty( $attributes['backgroundStickyType'] ) ? $attributes['backgroundStickyType'] : 'normal';
		$bg_hover_type_sticky = ! empty( $attributes['backgroundStickyHoverType'] ) ? $attributes['backgroundStickyHoverType'] : 'normal';
		if ( ! empty( $attributes['colorSticky'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['colorSticky'] ) );
		}
		if ( 'normal' === $bg_type_sticky && ! empty( $attributes['backgroundSticky'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['backgroundSticky'] ) . ( 'gradient' === $bg_hover_type_sticky ? ' !important' : '' ) );
		}
		if ( 'gradient' === $bg_type_sticky && ! empty( $attributes['gradientSticky'] ) ) {
			$css->add_property( 'background', $attributes['gradientSticky'] . ' !important' );
		}
		$css->render_measure_output( $attributes, 'borderStickyRadius', 'border-radius', [ 'unit_key' => 'borderStickyRadiusUnit' ] );
		$css->render_border_styles( $attributes, 'borderStickyStyle', true );
		if ( isset( $attributes['displayShadowSticky'] ) && true === $attributes['displayShadowSticky'] ) {
			if ( isset( $attributes['shadowSticky'] ) && is_array( $attributes['shadowSticky'] ) && isset( $attributes['shadowSticky'][0] ) && is_array( $attributes['shadowSticky'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowSticky'][0]['inset'] ) && true === $attributes['shadowSticky'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowSticky'][0]['hOffset'] ) && is_numeric( $attributes['shadowSticky'][0]['hOffset'] ) ? $attributes['shadowSticky'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowSticky'][0]['vOffset'] ) && is_numeric( $attributes['shadowSticky'][0]['vOffset'] ) ? $attributes['shadowSticky'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowSticky'][0]['blur'] ) && is_numeric( $attributes['shadowSticky'][0]['blur'] ) ? $attributes['shadowSticky'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowSticky'][0]['spread'] ) && is_numeric( $attributes['shadowSticky'][0]['spread'] ) ? $attributes['shadowSticky'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowSticky'][0]['color'] ) && ! empty( $attributes['shadowSticky'][0]['color'] ) ? $attributes['shadowSticky'][0]['color'] : '#000000' ), ( isset( $attributes['shadowSticky'][0]['opacity'] ) && is_numeric( $attributes['shadowSticky'][0]['opacity'] ) ? $attributes['shadowSticky'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '1px 1px 2px 0px rgba(0, 0, 0, 0.2)' );
			}
		}

		// hover sticky styles
		$css->set_selector( '.item-is-stuck .wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button:hover' );
		if ( ! empty( $attributes['colorStickyHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['colorStickyHover'] ) );
		}
		if ( 'gradient' !== $bg_type_sticky && 'normal' === $bg_hover_type_sticky && ! empty( $attributes['backgroundStickyHover'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['backgroundStickyHover'] ) );
		}
		$css->render_measure_output( $attributes, 'borderStickyHoverRadius', 'border-radius' );
		$css->render_border_styles( $attributes, 'borderStickyHoverStyle', true );
		if ( isset( $attributes['displayHoverShadowSticky'] ) && true === $attributes['displayHoverShadowSticky'] ) {
			if ( ( 'gradient' === $bg_type_sticky || 'gradient' === $bg_hover_type_sticky ) && isset( $attributes['shadowStickyHover'][0]['inset'] ) && true === $attributes['shadowStickyHover'][0]['inset'] ) {
				$css->add_property( 'box-shadow', '0px 0px 0px 0px rgba(0, 0, 0, 0)' );
				$css->set_selector( '.kb-btn' . $unique_id . '.kb-button:hover::before' );
			}
			if ( isset( $attributes['shadowStickyHover'] ) && is_array( $attributes['shadowStickyHover'] ) && isset( $attributes['shadowStickyHover'][0] ) && is_array( $attributes['shadowStickyHover'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowStickyHover'][0]['inset'] ) && true === $attributes['shadowStickyHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowStickyHover'][0]['hOffset'] ) && is_numeric( $attributes['shadowStickyHover'][0]['hOffset'] ) ? $attributes['shadowStickyHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowStickyHover'][0]['vOffset'] ) && is_numeric( $attributes['shadowStickyHover'][0]['vOffset'] ) ? $attributes['shadowStickyHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowStickyHover'][0]['blur'] ) && is_numeric( $attributes['shadowStickyHover'][0]['blur'] ) ? $attributes['shadowStickyHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowStickyHover'][0]['spread'] ) && is_numeric( $attributes['shadowStickyHover'][0]['spread'] ) ? $attributes['shadowStickyHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowStickyHover'][0]['color'] ) && ! empty( $attributes['shadowStickyHover'][0]['color'] ) ? $attributes['shadowStickyHover'][0]['color'] : '#000000' ), ( isset( $attributes['shadowStickyHover'][0]['opacity'] ) && is_numeric( $attributes['shadowStickyHover'][0]['opacity'] ) ? $attributes['shadowStickyHover'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '2px 2px 3px 0px rgba(0, 0, 0, 0.4)' );
			}
		}
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block   $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		if ( ! empty( $attributes['tooltip'] ) ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}
		$classes   = [ 'kb-button', 'kt-button', 'button', 'kb-btn' . $unique_id ];
		$classes[] = ! empty( $attributes['sizePreset'] ) ? 'kt-btn-size-' . $attributes['sizePreset'] : 'kt-btn-size-standard';
		$classes[] = ! empty( $attributes['widthType'] ) ? 'kt-btn-width-type-' . $attributes['widthType'] : 'kt-btn-width-type-auto';
		$classes[] = ! empty( $attributes['inheritStyles'] ) ? 'kb-btn-global-' . $attributes['inheritStyles'] : 'kb-btn-global-fill';
		$classes[] = ! empty( $attributes['text'] ) ? 'kt-btn-has-text-true' : 'kt-btn-has-text-false';
		$classes[] = ! empty( $attributes['icon'] ) ? 'kt-btn-has-svg-true' : 'kt-btn-has-svg-false';
		if ( ! empty( $attributes['target'] ) && 'video' === $attributes['target'] ) {
			$classes[] = 'ktblocksvideopop';
		}
		if ( ! empty( $attributes['inheritStyles'] ) && 'inherit' === $attributes['inheritStyles'] ) {
			$classes[] = 'wp-block-button__link';
		}
		$wrapper_args = [
			'class' => implode( ' ', $classes ),
		];
		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}
		if ( ! empty( $attributes['label'] ) ) {
			$wrapper_args['aria-label'] = $attributes['label'];
		}
		if ( ! empty( $attributes['link'] ) ) {
			$wrapper_args['href'] = esc_url( do_shortcode( $attributes['link'] ) );
			$rel_add              = '';
			if ( isset( $attributes['download'] ) && $attributes['download'] ) {
				$wrapper_args['download'] = '';
			}
			if ( ! empty( $attributes['target'] ) && '_blank' === $attributes['target'] ) {
				$wrapper_args['target'] = '_blank';
				$rel_add                = 'noreferrer noopener';
			}
			if ( isset( $attributes['noFollow'] ) && $attributes['noFollow'] ) {
				$rel_add .= ' nofollow';
			}
			if ( isset( $attributes['sponsored'] ) && $attributes['sponsored'] ) {
				$rel_add .= ' sponsored';
			}
			if ( ! empty( $rel_add ) ) {
				$wrapper_args['rel'] = $rel_add;
			}
		}
		if ( ! empty( $attributes['isSubmit'] ) ) {
			$wrapper_args['type'] = 'submit';
		}
		if ( ! empty( $attributes['tooltip'] ) ) {
			$wrapper_args['data-kb-tooltip-content'] = esc_attr( $attributes['tooltip'] );
			if ( ! empty( $attributes['tooltipPlacement'] ) ) {
				$wrapper_args['data-tooltip-placement'] = esc_attr( $attributes['tooltipPlacement'] );
			}
		}
		if ( isset( $attributes['buttonRole'] ) && $attributes['buttonRole'] ) {
			$wrapper_args['role'] = 'button';
		}
		if ( ! empty( $attributes['link'] ) && apply_filters( 'kadence_blocks_button_auto_apply_role', true ) ) {
			// check if the link is a download link.
			if ( $attributes['link'] === '#' && empty( $wrapper_args['target'] ) ) {
				$wrapper_args['role'] = 'button';
			}
		}
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$text     = ! empty( $attributes['text'] ) ? '<span class="kt-btn-inner-text">' . $attributes['text'] . '</span>' : '';
		$svg_icon = '';
		if ( ! empty( $attributes['icon'] ) ) {
			$type         = substr( $attributes['icon'], 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = 2;
			}
			$title    = ( ! empty( $attributes['iconTitle'] ) ? $attributes['iconTitle'] : '' );
			$hidden   = ( empty( $title ) ? true : false );
			$svg_icon = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width, $title, $hidden );
		}
		$icon_left  = ! empty( $svg_icon ) && ! empty( $attributes['iconSide'] ) && 'left' === $attributes['iconSide'] ? '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kt-btn-icon-side-left">' . $svg_icon . '</span>' : '';
		$icon_right = ! empty( $svg_icon ) && ! empty( $attributes['iconSide'] ) && 'right' === $attributes['iconSide'] ? '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kt-btn-icon-side-right">' . $svg_icon . '</span>' : '';
		$html_tag   = ! empty( $attributes['link'] ) ? 'a' : 'span';

		// Try to Detect if this is a show more button and make it a button.
		if ( isset( $attributes['lock'] ) && $attributes['lock'] && isset( $attributes['lock']['remove'] ) && $attributes['lock']['remove'] && isset( $attributes['lock']['move'] ) && $attributes['lock']['move'] && empty( $attributes['link'] ) ) {
			$html_tag = 'button';
		}

		$content = sprintf( '<%1$s %2$s>%3$s%4$s%5$s</%1$s>', $html_tag, $wrapper_attributes, $icon_left, $text, $icon_right );

		/*  Wrap in div is AOS is enabled. AOS transitions will interfere with hover transitions. */
		$aos_args = [];
		$aos_args = kadence_apply_aos_wrapper_args( $attributes, $aos_args );
		if ( ! empty( $aos_args ) ) {
			$aos_classes           = [ 'kb-blocks-button-aos' ];
			$aos_classes[]         = ! empty( $attributes['widthType'] ) ? 'kb-btn-width-type-' . $attributes['widthType'] : 'kb-btn-width-type-auto';
			$aos_args['class']     = implode( ' ', $aos_classes );
			$normalized_attributes = [];
			foreach ( $aos_args as $key => $value ) {
				$normalized_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
			$content = sprintf( '<div %1$s>%2$s</div>', implode( ' ', $normalized_attributes ), $content );
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
		wp_register_style( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-glightbox.min.css', [], KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/glightbox.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-glight-video-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-glight-video-init.min.js', [ 'kadence-glightbox' ], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', [ 'kadence-blocks-popper' ], KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Singlebtn_Block::get_instance();
