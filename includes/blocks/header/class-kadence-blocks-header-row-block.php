<?php
/**
 * Class to Build the Header block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Headers container Block for desktop.
 *
 * @category class
 */
class Kadence_Blocks_Header_Row_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'header-row';

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
			KADENCE_BLOCKS_PATH . 'dist/blocks/header/children/row/block.json',
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

		$layout         = ( ! empty( $attributes['layout'] ) ? $attributes['layout'] : 'standard' );
		$bg             = $attributes['background'];
		$bg_transparent = $attributes['backgroundTransparent'];
		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		// Min Height.
		$css->set_selector( '.wp-block-kadence-header-row.wp-block-kadence-header-row' . $unique_id . ' .kadence-header-row-inner' );
		if ( ! empty( $attributes['minHeight'] ) ) {
			$css->add_property( 'min-height', $attributes['minHeight'] . ( ! empty( $attributes['minHeightUnit'] ) ? $attributes['minHeightUnit'] : 'px' ) );
		}
		if ( $css->is_number( $attributes['minHeightTablet'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->add_property( 'min-height', $attributes['minHeightTablet'] . ( ! empty( $attributes['minHeightUnit'] ) ? $attributes['minHeightUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( $css->is_number( $attributes['minHeightMobile'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->add_property( 'min-height', $attributes['minHeightMobile'] . ( ! empty( $attributes['minHeightUnit'] ) ? $attributes['minHeightUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['maxWidth'] ) ) {
			$css->add_property( 'max-width', $attributes['maxWidth'] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
		}
		if ( $css->is_number( $attributes['maxWidthTablet'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->add_property( 'max-width', $attributes['maxWidthTablet'] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( $css->is_number( $attributes['maxWidthMobile'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->add_property( 'max-width', $attributes['maxWidthMobile'] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		// Background Variables.
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id );
		$css->render_background( $bg, $css, '--kb-header-row-bg' );
		$css->render_background( $bg, $css, '--kb-stuck-header-bg' );
		$css->render_background( $bg_transparent, $css, '--kb-transparent-header-row-bg' );
		if ( 'contained' !== $layout ) {
			$css->set_selector( '.wp-block-kadence-header-row' . $unique_id .  ', .wp-block-kadence-header-row' . $unique_id . '.item-is-stuck.item-is-stuck');
			$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array(
				'desktop_key' => 'borderRadius',
				'tablet_key'  => 'borderRadiusTablet',
				'mobile_key'  => 'borderRadiusMobile',
			) );
			$css->render_border_styles( $attributes, 'border', false, array(
				'desktop_key' => 'border',
				'tablet_key'  => 'borderTablet',
				'mobile_key'  => 'borderMobile',
			) );
		}
		// Container.
		if ( 'contained' === $layout ) {
			$css->set_selector( '.wp-block-kadence-header-row' . $unique_id . ' .kadence-header-row-inner' );
			$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array(
				'desktop_key' => 'borderRadius',
				'tablet_key'  => 'borderRadiusTablet',
				'mobile_key'  => 'borderRadiusMobile',
			) );
			$css->render_border_styles( $attributes, 'border', false, array(
				'desktop_key' => 'border',
				'tablet_key'  => 'borderTablet',
				'mobile_key'  => 'borderMobile',
			) );
		}
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id . ' .kadence-header-row-inner' );
		$css->render_measure_output( $attributes, 'padding', 'padding', array(
			'desktop_key' => 'padding',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
		) );
		$css->render_measure_output( $attributes, 'margin', 'margin', array(
			'desktop_key' => 'margin',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
		) );

		// Pass down to sections.
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id . ' .wp-block-kadence-header-column, .wp-block-kadence-header-row' . $unique_id . ' .wp-block-kadence-header-section' );
		// $css->render_row_gap( $attributes, array( 'itemGap', 'itemGapTablet', 'itemGapMobile' ), 'gap', '', 'itemGapUnit' );
		$css->render_gap( $attributes, 'itemGap', 'gap', 'itemGapUnit', array(
			'desktop_key' => 'itemGap',
			'tablet_key'  => 'itemGapTablet',
			'mobile_key'  => 'itemGapMobile',
		) );

		$css->set_media_state( 'desktop' );
		if ( isset( $attributes['kadenceBlockCSS'] ) && ! empty( $attributes['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', '.wp-block-kadence-header-row' . $unique_id, $attributes['kadenceBlockCSS'] ) );
		}

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

		// Pass down to sections.
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id . ' .wp-block-kadence-header-column, .wp-block-kadence-header-row' . $unique_id . ' .wp-block-kadence-header-section' );
		if ( isset( $sized_attributes['vAlign'] ) && $sized_attributes['vAlign'] === 'top' ) {
			$css->add_property( 'align-items', 'flex-start' );
		} elseif ( isset( $sized_attributes['vAlign'] ) && $sized_attributes['vAlign'] === 'center' ) {
			$css->add_property( 'align-items', 'center' );
		} elseif ( isset( $sized_attributes['vAlign'] ) && $sized_attributes['vAlign'] === 'bottom' ) {
			$css->add_property( 'align-items', 'flex-end' );
		}

		$css->set_selector('.wp-block-kadence-header-row' . $unique_id . ' .kadence-header-row-inner');
		if ($sized_attributes['layoutConfig'] !== 'single') {
			if ($sized_attributes['sectionPriority'] == 'center') {
				$css->add_property('grid-template-columns', 'auto minmax(0, 1fr) auto');
			} else if ($sized_attributes['sectionPriority'] == 'left') {
				$css->add_property('grid-template-columns', '1fr minmax(0, auto) auto');
			} else if ($sized_attributes['sectionPriority'] == 'right') {
				$css->add_property('grid-template-columns', 'auto minmax(0, auto) 1fr');
			}
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

		// If this row is empty, don't render it
		if( $this->are_innerblocks_empty( $block_instance ) ) {
			return $html;
		}

		$classes = array(
			'wp-block-kadence-header-row',
			'wp-block-kadence-header-row' . esc_attr( $unique_id ),
		);

		if ( ! empty( $attributes['location'] ) ) {
			$classes[] = 'wp-block-kadence-header-row-' . esc_attr( $attributes['location'] );
		}
		if ( ! empty( $attributes['className'] ) ) {
			$classes[] = $attributes['className'];
		}
		$layout = ! empty( $attributes['layout'] ) ? $attributes['layout'] : 'standard';
		$classes[] = 'kb-header-row-layout-' . esc_attr( $layout );
		if ( ! empty( $attributes['layoutConfig'] ) ) {
			$classes[] = 'kb-header-row-layout-config-' . esc_attr( $attributes['layoutConfig'] );
		}

		$html .= '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
		$html .= '<div class="kadence-header-row-inner">';
		$html .= $content;
		$html .= '</div>';
		$html .= '</div>';

		return $html;
	}

	/**
	 * Check if the innerblocks are empty. We won't render the row if all the innerblocks are empty
	 *
	 * @return bool
	 */
	public function are_innerblocks_empty( $block_instance ) {
		$is_empty = true;

		$inner_blocks = $block_instance->parsed_block['innerBlocks'] ?? [];

		foreach( $inner_blocks as $top_level_inner_blocks ) {
			if ($top_level_inner_blocks['blockName'] === 'kadence/header-column' && !empty($top_level_inner_blocks['innerBlocks'])) {
				$is_empty = false;
				break;
			}

			if (!empty($top_level_inner_blocks['innerBlocks'])) {
				foreach ($top_level_inner_blocks['innerBlocks'] as $section_inner_block) {
					// Check if any 'kadence/header-column' inner block is not empty
					if ($section_inner_block['blockName'] === 'kadence/header-column' && !empty($section_inner_block['innerBlocks'])) {
						$is_empty = false;
						break 2; // Break both loops
					}
				}
			}
		}

		return $is_empty;
	}

}

Kadence_Blocks_Header_Row_Block::get_instance();
