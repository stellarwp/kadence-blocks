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
	protected $block_name = 'off-canvas';

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
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		// container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner-wrap' );
		$css->render_border_styles( $attributes, 'border', false, array(
			'desktop_key' => 'border',
			'tablet_key'  => 'borderTablet',
			'mobile_key'  => 'borderMobile',
		) );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array(
			'desktop_key' => 'borderRadius',
			'tablet_key'  => 'borderRadiusTablet',
			'mobile_key'  => 'borderRadiusMobile',
		) );

		// inner container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner');
		$css->render_measure_output( $attributes, 'padding', 'padding', array(
			'desktop_key' => 'padding',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
		) );

		// For the close icon container styles.
		// close icon container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close' );
		$css->render_measure_output(
			$attributes,
			'closeIconPadding',
			'padding',
			[
				'desktop_key' => 'closeIconPadding',
				'tablet_key'  => 'closeIconPaddingTablet',
				'mobile_key'  => 'closeIconPaddingMobile',
				'unit_key'    => 'closeIconPaddingUnit',
			]
		);
		$css->render_measure_output( $attributes, 'closeIconMargin', 'margin', array(
			'desktop_key' => 'closeIconMargin',
			'tablet_key'  => 'closeIconMarginTablet',
			'mobile_key'  => 'closeIconMarginMobile',
			'unit_key'    => 'closeIconMarginUnit',
		) );
		$css->render_measure_output( $attributes, 'closeIconBorderRadius', 'border-radius', array(
			'desktop_key' => 'closeIconBorderRadius',
			'tablet_key'  => 'closeIconBorderRadiusTablet',
			'mobile_key'  => 'closeIconBorderRadiusMobile',
		) );
		$css->render_border_styles( $attributes, 'closeIconBorder', false, array(
			'desktop_key' => 'closeIconBorder',
			'tablet_key'  => 'closeIconBorderTablet',
			'mobile_key'  => 'closeIconBorderMobile',
		) );

		// Close icon container hover.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover, .wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:focus-visible' );
		$css->render_border_styles(
			$attributes,
			'closeIconBorderHover',
			false,
			[
				'desktop_key' => 'closeIconBorderHover',
				'tablet_key'  => 'closeIconBorderHoverTablet',
				'mobile_key'  => 'closeIconBorderHoverMobile',
			]
		);

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

		// Container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner-wrap' );
		if ( empty( $sized_attributes_inherit['widthType'] ) || $sized_attributes_inherit['widthType'] !== 'full' ) {
			$max_width_unit = ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px';
			if ( ! empty( $sized_attributes['maxWidth']) ) {
				$css->add_property( 'max-width', $sized_attributes['maxWidth'] . $max_width_unit );
			}
		} else {
			$css->add_property( 'max-width', 'initial' );
			$css->add_property( 'width', '100%' );
		}

		if ( ! empty( $sized_attributes['backgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['backgroundColor'] ) );
		}

		// Inner container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner' );

		if ( ! empty( $sized_attributes['containerMaxWidth'] ) ) {
			$max_width_unit = ! empty( $sized_attributes['containerMaxWidthUnit'] ) ? $sized_attributes['containerMaxWidthUnit'] : 'px';
			$css->add_property( 'max-width', $sized_attributes['containerMaxWidth'] . $max_width_unit );
		}

		// Content area inner alignment.
		if ( $sized_attributes['hAlign'] == 'center') {
			$css->add_property( 'align-items', 'center' );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
		} elseif ( $sized_attributes['hAlign'] == 'right' ) {
			$css->add_property( 'align-items', 'flex-end' );
			$css->add_property( 'margin-left', 'auto' );
		}
		if ( $sized_attributes['vAlign'] == 'center' ) {
			$css->add_property( 'justify-content', 'center' );
		} elseif ( $sized_attributes['vAlign'] == 'bottom' ) {
			$css->add_property( 'justify-content', 'flex-end' );
		}

		// Overlay.
		$css->set_selector( '.wp-block-kadence-off-canvas .kb-off-canvas-overlay' . $unique_id );
		if ( ! empty( $sized_attributes['pageBackgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['pageBackgroundColor'] ) );
		}

		// For the close icon container styles, they need to get applied to the hover state too, due to resets on hover styles in the css
		// Close Icon container.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close' );
		if ( ! empty( $sized_attributes['closeIconBackgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['closeIconBackgroundColor'] ) );
		}
		if ( ! empty( $sized_attributes['closeIconColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $sized_attributes['closeIconColor'] ) );
		}

		// Close Icon container hover.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:hover, .wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close:focus-visible' );
		if ( ! empty( $sized_attributes['closeIconBackgroundColorHover'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $sized_attributes['closeIconBackgroundColorHover'] ) );
		}
		if ( ! empty( $sized_attributes['closeIconColorHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $sized_attributes['closeIconColorHover'] ) );
		}

		// Close Icon.
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-close svg' );
		if ( ! empty( $sized_attributes['closeIconSize'] ) ) {
			$css->add_property( 'width', $sized_attributes['closeIconSize'] . 'px' );
			$css->add_property( 'height', $sized_attributes['closeIconSize'] . 'px' );
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
		$html    = '';
		$overlay = '';
		$icon    = '';
		$css = Kadence_Blocks_CSS::get_instance();

		if ( ! empty( $attributes['closeIcon'] ) ) {
			$close_icon         = $attributes['closeIcon'];
			$type         = substr( $close_icon, 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;
			if ( $line_icon ) {
				$stroke_width = ( ! empty( $attributes['closeLineWidth'] ) ? $attributes['closeLineWidth'] : 2 );
			}
			$title   = '';
			$hidden  = true;
			$label   = ( ! empty( $attributes['closeLabel'] ) ? $attributes['closeLabel'] : esc_attr__( 'Close Menu', 'kadence-blocks' ) );
			$icon    = '<button aria-label="' . esc_attr( $label ) . '" aria-expanded="false" class="kb-off-canvas-close">' . Kadence_Blocks_Svg_Render::render( $close_icon, $fill, $stroke_width, $title, $hidden ) . '</button>';
		}

		$open_side = $css->get_inherited_value( $attributes['slideFrom'], $attributes['slideFromTablet'], $attributes['slideFromMobile'], 'Desktop' );
		$open_side_tablet = $css->get_inherited_value( $attributes['slideFrom'], $attributes['slideFromTablet'], $attributes['slideFromMobile'], 'Tablet' );
		$open_side_mobile = $css->get_inherited_value( $attributes['slideFrom'], $attributes['slideFromTablet'], $attributes['slideFromMobile'], 'Mobile' );
		$classes   = array(
			'wp-block-kadence-off-canvas',
			'wp-block-kadence-off-canvas' . $unique_id,
			'open-' . $open_side,
			'open-tablet-' . $open_side_tablet,
			'open-mobile-' . $open_side_mobile,
		);

		$overlay_classes = array(
			'kb-off-canvas-overlay',
			'kb-off-canvas-overlay' . $unique_id,
		);

		$width_type = $css->get_inherited_value( $attributes['widthType'], $attributes['widthTypeTablet'], $attributes['widthTypeMobile'], 'Desktop' );
		$width_type_tablet = $css->get_inherited_value( $attributes['widthType'], $attributes['widthTypeTablet'], $attributes['widthTypeMobile'], 'Tablet' );
		$width_type_mobile = $css->get_inherited_value( $attributes['widthType'], $attributes['widthTypeTablet'], $attributes['widthTypeMobile'], 'Mobile' );
		if ( ( ! $width_type || $width_type === 'partial' ) || ( ! $width_type_tablet || $width_type_tablet === 'partial' ) || ( ! $width_type_mobile || $width_type_mobile === 'partial' ) ) {
			$overlay = '<div data-unique-id="' . esc_attr( $unique_id ) . '" class="' . esc_attr( implode( ' ', $overlay_classes ) ) . '"></div>';
		}

		$wrapper_args = array(
			'class'         => implode( ' ', $classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$html .= sprintf( '<div %1$s>%2$s<div class="kb-off-canvas-inner-wrap">%3$s<div class="kb-off-canvas-inner">%4$s</div></div></div>', $wrapper_attributes, $overlay, $icon, $content );

		return $html;
	}
}

Kadence_Blocks_Off_Canvas_Block::get_instance();
