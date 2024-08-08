<?php
/**
 * Class to Build the Off Canvas block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Off Canvas block.
 *
 * @category class
 */
class Kadence_Blocks_Off_Canvas_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'header-off-canvas';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;
	/**
	 * Block determines in scripts need to be loaded for block.
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
	 * On init startup register the block.
	 */
	public function on_init() {
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/header/children/off-canvas/block.json',
			array(
				'render_callback' => array( $this, 'render_css' ),
			)
		);
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
		$merged_attributes = $this->get_attributes_with_defaults( $unique_id, $attributes, 'kadence/' . $this->block_name );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $merged_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		// container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id );
		if( !empty( $attributes['widthType'] ) && $attributes['widthType'] === 'full') {
			$css->add_property( 'width', '100%' );
		}
		$css->render_border_styles( $merged_attributes, 'border', false, array(
			'desktop_key' => 'border',
			'tablet_key'  => 'borderTablet',
			'mobile_key'  => 'borderMobile',
		) );
		$css->render_measure_output( $merged_attributes, 'borderRadius', 'border-radius', array(
			'desktop_key' => 'borderRadius',
			'tablet_key'  => 'borderRadiusTablet',
			'mobile_key'  => 'borderRadiusMobile',
		) );

		// inner container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner');
		$css->render_measure_output( $merged_attributes, 'padding', 'padding', array(
			'desktop_key' => 'padding',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
		) );

		// For the close icon container styles, they need to get applied to the hover state too, due to resets on hover styles in the css
		//close icon container
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close' . ', .wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover' );
		$css->render_measure_output( $merged_attributes, 'closeIconPadding', 'padding', array(
			'desktop_key' => 'closeIconPadding',
			'tablet_key'  => 'closeIconPaddingTablet',
			'mobile_key'  => 'closeIconPaddingMobile',
		) );
		$css->render_measure_output( $merged_attributes, 'closeIconBorderRadius', 'border-radius', array(
			'desktop_key' => 'closeIconBorderRadius',
			'tablet_key'  => 'closeIconBorderRadiusTablet',
			'mobile_key'  => 'closeIconBorderRadiusMobile',
		) );
		$css->render_border_styles( $merged_attributes, 'closeIconBorder', false, array(
			'desktop_key' => 'closeIconBorder',
			'tablet_key'  => 'closeIconBorderTablet',
			'mobile_key'  => 'closeIconBorderMobile',
		) );

		//close icon container hover
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover' );
		$css->render_border_styles( $merged_attributes, 'closeIconBorderHover', false, array(
			'desktop_key' => 'closeIconBorderHover',
			'tablet_key'  => 'closeIconBorderHoverTablet',
			'mobile_key'  => 'closeIconBorderHoverMobile',
		) );

		//close icon
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close svg' );

		return $css->css_output();
	}

	/**
	 * Build up the dynamic styles for a size.
	 *
	 * @param string $size The size.
	 * @return array
	 */
	public function sized_dynamic_styles( $css, $attributes, $unique_id, $size = 'Desktop' ) {
		$sized_attributes = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );

		$css->set_media_state( strtolower( $size ) );

		//container
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id );
		if( empty( $attributes['widthType'] ) || $attributes['widthType'] !== 'full') {
			$max_width_unit = !empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px';
			if( !empty( $sized_attributes['maxWidth']) ) {
				$css->add_property( 'max-width', $sized_attributes['maxWidth'] . $max_width_unit );
			}
			$width_unit = !empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px';
			if( !empty( $sized_attributes['width']) ) {
				$css->add_property( 'width', $sized_attributes['width'] . $width_unit );
			}
		}
		if ( ! empty( $sized_attributes['backgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['backgroundColor'] ) );
		}

		//inner container
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner');
		$max_width_unit = !empty( $sized_attributes['containerMaxWidthUnit'] ) ? $sized_attributes['containerMaxWidthUnit'] : 'px';
		if( !empty( $sized_attributes['containerMaxWidth']) ) {
			$css->add_property( 'max-width', $sized_attributes['containerMaxWidth'] . $max_width_unit );
		}

		//content area inner alignment
		if ($sized_attributes['hAlign'] == 'center') {
			$css->add_property('align-items', 'center');
			$css->add_property('margin-left', 'auto');
			$css->add_property('margin-right', 'auto');
		} else if ($sized_attributes['hAlign'] == 'right') {
			$css->add_property('align-items', 'flex-end');
			$css->add_property('margin-left', 'auto');
		}
		if ($sized_attributes['vAlign'] == 'center') {
			$css->add_property('justify-content', 'center');
		} else if ($sized_attributes['vAlign'] == 'bottom') {
			$css->add_property('justify-content', 'flex-end');
		}

		// Overlay
		$css->set_selector( '.kb-off-canvas-overlay' . $unique_id );
		if ( ! empty( $sized_attributes['pageBackgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['pageBackgroundColor'] ) );
		}

		// For the close icon container styles, they need to get applied to the hover state too, due to resets on hover styles in the css
		//Close Icon container
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close' . ', .wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover' );
		if ( ! empty( $sized_attributes['closeIconBackgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['closeIconBackgroundColor'] ) );
		}

		//Close Icon container hover
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover' );
		if ( ! empty( $sized_attributes['closeIconBackgroundColorHover'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['closeIconBackgroundColorHover'] ) );
		}

		//Close Icon
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close svg' );
		if ( ! empty( $sized_attributes['closeIconColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $sized_attributes['closeIconColor'] ) );
		}
		if ( ! empty( $sized_attributes['closeIconSize'] ) ) {
			$css->add_property( 'width', $sized_attributes['closeIconSize'] . 'px' );
			$css->add_property( 'height', $sized_attributes['closeIconSize'] . 'px' );
		}

		//Close Icon hover
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover svg' );
		if ( ! empty( $sized_attributes['closeIconColorHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $sized_attributes['closeIconColorHover'] ) );
		}
	}

	/**
	 * The innerblocks are stored on the $content variable. We just wrap with our data, if needed
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$html = '';
		$icon = '';

		if ( ! empty( $attributes['closeIcon'] ) ) {
			$icon = '<button class="kb-off-canvas-close">' . Kadence_Blocks_Svg_Render::render( $attributes['closeIcon'], 'currentColor', false, '', false ) . '</button>';
		}

		$open_side = !empty( $attributes['slideFrom'] ) ? $attributes['slideFrom'] : 'left';
		$classes = array(
			'wp-block-kadence-off-canvas',
			'wp-block-kadence-off-canvas' . $unique_id,
			'open-' . $open_side,
		);

		$overlay_classes = array(
			'kb-off-canvas-overlay',
			'kb-off-canvas-overlay' . $unique_id,
		);


		$wrapper_args = array(
			'class'         => implode( ' ', $classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$html .= sprintf( '<div %1$s>%2$s<div class="kb-off-canvas-inner">%3$s</div></div>', $wrapper_attributes, $icon, $content );

		if ( empty( $attributes['widthType'] ) || $attributes['widthType'] === 'partial' ) {
			$html .= '<div data-unique-id="' . esc_attr( $unique_id ) . '" class="' . esc_attr( implode( ' ', $overlay_classes ) ) . '"></div>';
		}

		return $html;
	}
}

Kadence_Blocks_Off_Canvas_Block::get_instance();
