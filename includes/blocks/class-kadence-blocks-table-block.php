<?php
/**
 * Class to Build the Table Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Table Block.
 *
 * @category class
 */
class Kadence_Blocks_Table_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'table';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = true;


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

		// Render pro styles
		if( class_exists( 'Kadence_Blocks_Pro' ) && class_exists( 'Kadence_Blocks_Pro_Table_Block' ) ) {
			$pro_table = new Kadence_Blocks_Pro_Table_Block();
			$pro_table->build_css( $attributes, $css, $unique_id, $unique_style_id );
		}

		$css->set_selector( '.kb-table-container' . esc_attr( $unique_id ) );
		$css->render_typography( $attributes, 'dataTypography' );
		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_measure_output( $attributes, 'margin', 'margin' );

		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width', 'maxWidthUnit' );
		$css->render_responsive_range( $attributes, 'maxHeight', 'max-height', 'maxHeighUnit' );

		if ( !empty( $attributes['maxHeighUnit'][0] ) ) {
			$css->add_property('overflow-y', 'auto');
		}

		if ( !empty( $attributes['maxWidthUnit'][0] ) ) {
			$css->add_property('overflow-x', 'auto');
		}

		if ( ! empty( $attributes['columnSettings'] ) && is_array( $attributes['columnSettings'] ) ) {
			$has_fixed_columns = false;

			foreach ( $attributes['columnSettings'] as $index => $settings ) {
				if ( ( empty( $settings['useAuto'] ) || !$settings['useAuto'] ) ) {
					$has_fixed_columns = true;
					$width_unit = ! empty( $settings['unit'] ) ? $settings['unit'] : '%';

					if( isset( $settings['width'] ) && '' !== $settings['width'] ) {
						$css->set_selector('.kb-table' . esc_attr($unique_id) . ' td:nth-of-type(' . ($index + 1) . '), ' .
							'.kb-table' . esc_attr($unique_id) . ' th:nth-of-type(' . ($index + 1) . ')');
						$css->add_property('width', $settings['width'] . $width_unit);
					}

					if( isset( $settings['widthTablet'] ) && '' !== $settings['widthTablet'] ) {
						if( ! empty( $settings['unitTablet'] ) ) {
							$width_unit = $settings['unitTablet'];
						}
						$css->set_media_state( 'tablet' );
						$css->add_property('width', $settings['widthTablet'] . $width_unit);
						$css->set_media_state( 'desktop' );
					}

					if( isset( $settings['widthMobile'] ) && '' !== $settings['widthMobile'] ) {
						if( ! empty( $settings['unitMobile'] ) ) {
							$width_unit = $settings['unitMobile'];
						}
						$css->set_media_state( 'mobile' );
						$css->add_property('width', $settings['widthMobile'] . $width_unit);
						$css->set_media_state( 'desktop' );
					}
				}
			}

			// Only set table-layout fixed if we have any fixed width columns.
			if ( $has_fixed_columns ) {
				$css->set_selector( '.kb-table' . esc_attr( $unique_id ) );
				$css->add_property( 'table-layout', 'fixed' );
				$css->add_property( 'width', '100%' );
			}
		}

		$css->set_selector( '.kb-table' . esc_attr( $unique_id ) . ' tr' );
		$css->render_responsive_size( $attributes, [ 'rowMinHeight', 'tabletRowMinHeight', 'mobileRowMinHeight' ], 'height' );

		if( !empty( $attributes['overflowXScroll'] ) ){
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ));
			$css->add_property( 'overflow-x', 'scroll');
		}

		$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' th' );
		$css->render_typography( $attributes, 'headerTypography' );
		$css->render_measure_output( $attributes, 'cellPadding', 'padding' );

		$text_align_args = array(
			'desktop_key' => 'headerAlign',
			'tablet_key'  => 'headerAlignTablet',
			'mobile_key'  => 'headerAlignMobile',
		);
		$css->render_text_align( $attributes, 'headerAlign', $text_align_args );
		

		$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' caption' );
		$css->render_typography( $attributes, 'captionTypography' );

		$text_align_args = array(
			'desktop_key' => 'captionAlign',
			'tablet_key'  => 'captionAlignTablet',
			'mobile_key'  => 'captionAlignMobile',
		);
		$css->render_text_align( $attributes, 'captionAlign', $text_align_args );

		$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td' );
		$css->render_measure_output( $attributes, 'cellPadding', 'padding' );

		$text_align_args = array(
			'desktop_key' => 'textAlign',
			'tablet_key'  => 'textAlignTablet',
			'mobile_key'  => 'textAlignMobile',
		);
		$css->render_text_align( $attributes, 'textAlign', $text_align_args );


		if ( !empty( $attributes['evenOddBackground'] ) ) {
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-of-type(even)' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorEven'] ?? 'undefined' ) );

			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-of-type(odd)' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorOdd'] ?? 'undefined' ) );

			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-of-type(odd):hover' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorOdd'] ?? 'undefined' ) );

			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-of-type(even):hover' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorEven'] ?? 'undefined' ) );
		} else {

			if( !empty( $attributes['backgroundColorEven'] ) ) {
				$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr' );
				$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorEven'] ) );
			}

			if( !empty( $attributes['backgroundHoverColorEven'] ) ) {
				$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:hover' );
				$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorEven'] ) );
			}
		}

		if( !empty( $attributes['columnBackgrounds'] ) ) {
			foreach( $attributes['columnBackgrounds'] as $index => $background ) {
				if ( $background ) {
					if (!empty($attributes['isFirstColumnHeader']) && $attributes['isFirstColumnHeader']) {
						$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:nth-of-type(' . ( $index ) . ')' );
					} else {
						$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:nth-of-type(' . ( $index + 1 ) . ')' );
					}
					$css->add_property( 'background-color', $css->render_color( $background ) );
					$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' th:nth-of-type(' . ( $index + 1 ) . ')' );
					$css->add_property( 'background-color', $css->render_color( $background ) );
				}
			}

		}

		if( !empty( $attributes['columnBackgroundsHover'] ) ) {
			foreach( $attributes['columnBackgroundsHover'] as $index => $background ) {
				if ( $background ) {
					if ( !empty( $attributes['isFirstColumnHeader'] ) && $attributes['isFirstColumnHeader'] ) {
						$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:nth-of-type(' . ( $index ) . '):hover' );
					} else {
						$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:nth-of-type(' . ( $index + 1 ) . '):hover' );
					}
					$css->add_property( 'background-color', $css->render_color( $background ) );
					$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' th:nth-of-type(' . ( $index + 1 ) . '):hover' );
					$css->add_property( 'background-color', $css->render_color( $background ) );
				}
			}
		}

		// Render borders for the table
		if( !empty( $attributes['borderOnRowOnly'])) {
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr' );
		} else {
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td, .kb-table' . esc_attr( $unique_id ) . ' th' );
		}
		$css->render_border_styles( $attributes, 'borderStyle' );

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


		$wrapper_classes = [
			'kb-table-container',
			'kb-table-container' . esc_attr( $unique_id ),
		];

		if(! empty( $attributes['className'] )) {
			$wrapper_classes[] = esc_attr( $attributes['className'] );
		}

		$wrapper_attributes = get_block_wrapper_attributes( [
			'class' => implode( ' ', $wrapper_classes ),
		] );

		$caption_html = '';
		$is_enabled = filter_var( $attributes['enableCaption'] ?? false, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
		if ( $is_enabled === true && isset( $attributes['caption'] ) && is_string( $attributes['caption'] ) && trim( $attributes['caption'] ) !== '' ) {
			$caption_html = '<caption>' . esc_html( $attributes['caption'] ) . '</caption>';
		}

		return sprintf(
			'<div %1$s><table class="kb-table kb-table%2$s">%3$s%4$s</table></div>',
			$wrapper_attributes,
			esc_attr( $unique_id ),
			$caption_html,
			$content
		);
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

//		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kt-tabs.min.js', array(), KADENCE_BLOCKS_VERSION, true );

	}

}

Kadence_Blocks_Table_Block::get_instance();
