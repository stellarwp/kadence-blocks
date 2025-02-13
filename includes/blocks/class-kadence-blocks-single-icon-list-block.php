<?php
/**
 * Class to Build the Icon List Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Icon List Block.
 *
 * @category class
 */
class Kadence_Blocks_Listitem_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'listitem';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Block determines if styles need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
		$css->set_selector( '.kt-svg-icon-list-item-' . $unique_id . ' .kt-svg-icon-list-single' );

		if ( isset( $attributes['size'] ) && is_numeric($attributes['size'])) {
			$css->add_property( 'font-size', $attributes['size'] . 'px !important' );
		}
		if ( ! empty( $attributes['color'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['color'] ) . ' !important' );
		}
		if ( ! empty( $attributes['background'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['background'] ) . '!important' );
		}
		if ( ! empty( $attributes['padding'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'padding', $attributes['padding'] . 'px !important' );
		}
		if ( ! empty( $attributes['border'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['border'] ) . ' !important' );
		}
		if ( ! empty( $attributes['borderWidth'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-width', $attributes['borderWidth'] . 'px !important'  );
		}
		if ( ! empty( $attributes['borderRadius'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-radius', $attributes['borderRadius'] . '% !important'  );
		}

		// Highlight.
		$css->set_selector( '.kt-svg-icon-list-item-' . $unique_id . ' .kt-svg-icon-list-text mark.kt-highlight' );
		// Defaults.
		$css->add_property( 'background-color', 'unset' );

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
		if ( empty( $attributes['enableMarkGradient'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['markColor'] ?? '#f76a0c' ) );
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

		// Tablet.
		$css->set_media_state( 'tablet' );
		$css->set_selector( '.kt-svg-icon-list-item-' . $unique_id . ' .kt-svg-icon-list-text mark.kt-highlight' );
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
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		if ( strpos( $content, 'kb-tooltip-hidden-content') !== false ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}
		if ( isset( $block_instance ) && is_object( $block_instance ) && isset( $block_instance->context['kadence/listIcon'] ) ) {
			$parent_default = $block_instance->context['kadence/listIcon'];

			$content = str_replace( 'USE_PARENT_DEFAULT_ICON', $parent_default, $content );
		}
		if ( isset( $block_instance ) && is_object( $block_instance ) && isset( $block_instance->context['kadence/listIconWidth'] ) ) {
			$parent_default_width = $block_instance->context['kadence/listIconWidth'];
			if ( empty( $parent_default_width ) ) {
				$parent_default_width = 2;
			}

			$content = str_replace( 'USE_PARENT_DEFAULT_WIDTH', $parent_default_width, $content );
		}
		return $content;
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS or JS file.

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', array( 'kadence-blocks-popper' ), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Listitem_Block::get_instance();
