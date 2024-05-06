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
	protected $block_name = 'row';

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
			KADENCE_BLOCKS_PATH . 'dist/blocks/header/children/' . $this->block_name . '/block.json',
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

		$header_row_attributes = $this->get_attributes_with_defaults( $unique_id, $attributes, 'kadence/' . $this->block_name );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $header_row_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		//container
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id );
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
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array(
			'desktop_key' => 'borderRadius',
			'tablet_key'  => 'borderRadiusTablet',
			'mobile_key'  => 'borderRadiusMobile',
		) );
		$css->render_border_styles( $attributes, 'border' );

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

		$bg = $sized_attributes['background'];
		$bg_transparent = $sized_attributes['backgroundTransparent'];

		$css->set_media_state( strtolower( $size ) );
		
		//container
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id );
		$css->add_property( 'min-height', $sized_attributes['minHeight'] . $sized_attributes['minHeightUnit'] );
		if($sized_attributes['maxWidth'] != 0) {
			$css->add_property( 'max-width', $sized_attributes['maxWidth'] . $sized_attributes['maxWidthUnit'] );
		}

		$css->render_background( $bg, $css );
		if ( '' !== $bg && ! empty( $bg['type'] ) && 'normal' === $bg['type'] && ! empty( $bg['image'] ) ) {
			$img_bg = array(
				'type' => 'image',
				'image' => array(
					'url' => ! empty($bg['image']) ? 'url("' . $bg['image'] . '")' : '',
					'imageID' => ! empty($bg['imageID']) ? $bg['imageID'] : '',
					'position' => ! empty($bg['position']) ? $bg['position'] : '',
					'attachment' => ! empty($bg['attachment']) ? $bg['attachment'] : '',
					'size' => ! empty($bg['size']) ? $bg['size'] : '',
					'repeat' => ! empty($bg['repeat']) ? $bg['repeat'] : '',
				)
			);
			$css->render_background( $img_bg, $css );
		}

		//transparent overrides
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-header-row' . $unique_id );
		$css->render_background( $bg_transparent, $css );
		if ( '' !== $bg_transparent && ! empty( $bg_transparent['type'] ) && 'normal' === $bg_transparent['type'] && ! empty( $bg_transparent['image'] ) ) {
			$img_bg = array(
				'type' => 'image',
				'image' => array(
					'url' => ! empty($bg_transparent['image']) ? 'url("' . $bg_transparent['image'] . '")' : '',
					'imageID' => ! empty($bg_transparent['imageID']) ? $bg_transparent['imageID'] : '',
					'position' => ! empty($bg_transparent['position']) ? $bg_transparent['position'] : '',
					'attachment' => ! empty($bg_transparent['attachment']) ? $bg_transparent['attachment'] : '',
					'size' => ! empty($bg_transparent['size']) ? $bg_transparent['size'] : '',
					'repeat' => ! empty($bg_transparent['repeat']) ? $bg_transparent['repeat'] : '',
				)
			);
			$css->render_background( $img_bg, $css );
		}

		//pass down to sections
		$css->set_selector( '.wp-block-kadence-header-row' . $unique_id . ' .wp-block-kadence-header-column, .wp-block-kadence-header-row' . $unique_id . ' .wp-block-kadence-header-section' );
		$css->add_property( 'gap', $sized_attributes['itemGap'] . $sized_attributes['itemGapUnit'] );
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
		if ( ! empty( $attributes['layout'] ) ) {
			$classes[] = 'wp-block-kadence-header-row-layout-' . esc_attr( $attributes['layout'] );
		}

		$html .= '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
		$html .= $content;
		$html .= '</div>';

		return $html;
	}

	/**
	 * Check if the innerblocks are empty. We won't render the row if all the innerblocks are empty
	 *
	 * @return bool
	 */
	public function are_innerblocks_empty ( $block_instance ) {
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
