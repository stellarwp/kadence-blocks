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

		$css->set_selector( '.kb-table-container' . esc_attr( $unique_id ) );
		$css->render_typography( $attributes, 'dataTypography' );

		$max_width_unit = !empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px';
		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width', $max_width_unit );

		$max_height_unit = !empty( $attributes['maxHeighUnit'] ) ? $attributes['maxHeighUnit'] : 'px';
		$css->render_responsive_range( $attributes, 'maxHeight', 'max-height', $max_height_unit );

		if ( !empty( $attributes['maxHeighUnit'][0] ) ) {
			$css->add_property('overflow-y', 'auto');
		}

		if ( !empty( $attributes['maxWidthUnit'][0] ) ) {
			$css->add_property('overflow-x', 'auto');
		}

		if( !empty( $attributes['stickyFirstRow']) ) {
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:first-child');
			$css->add_property( 'position', 'sticky');
			$css->add_property( 'top', '0');
			$css->add_property( 'z-index', '1');
		}

		if( !empty( $attributes['stickyFirstColumn']) ) {
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:first-child, .kb-table' . esc_attr( $unique_id ) . ' th:first-child');
			$css->add_property( 'position', 'sticky');
			$css->add_property( 'left', '0');
		}


		$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' th' );
		$css->render_typography( $attributes, 'headerTypography' );
		$css->render_measure_output( $attributes, 'cellPadding', 'padding' );

		$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td' );
		$css->render_measure_output( $attributes, 'cellPadding', 'padding' );


		if ( !empty( $attributes['evenOddBackground'] ) ) {
			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-child(even)' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorEven'] ?? 'undefined' ) );

			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-child(odd)' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorOdd'] ?? 'undefined' ) );

			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-child(odd):hover' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorOdd'] ?? 'undefined' ) );

			$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' tr:nth-child(even):hover' );
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
					$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:nth-child(' . ( $index + 1 ) . ')' );
					$css->add_property( 'background-color', $css->render_color( $background ) );
				}
			}

		}

		if( !empty( $attributes['columnBackgroundsHover'] ) ) {
			foreach( $attributes['columnBackgroundsHover'] as $index => $background ) {
				if ( $background ) {
					$css->set_selector( '.kb-table-container .kb-table' . esc_attr( $unique_id ) . ' td:nth-child(' . ( $index + 1 ) . '):hover' );
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

		return sprintf(
			'<div %1$s><table class="kb-table kb-table%2$s">%3$s</table></div>',
			$wrapper_attributes,
			esc_attr( $unique_id ),
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
