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

		$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) );
		$css->render_typography( $attributes, 'dataTypography' );

		$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' th' );
		$css->render_typography( $attributes, 'headerTypography' );

		if ( !empty( $attributes['evenOddBackground'] ) ) {
			$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' tr:nth-child(even)' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorEven'] ) );

			$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' tr:nth-child(odd)' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorOdd'] ) );

			$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' tr:nth-child(odd):hover' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorOdd'] ) );

			$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' tr:nth-child(even):hover' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorEven'] ) );
		} else {
			$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' tr' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColorEven'] ) );

			$css->set_selector( '.wp-block-kadence-table' . esc_attr( $unique_id ) . ' tr:hover' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColorEven'] ) );
		}

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
		return sprintf(
			'<table class="wp-block-kadence-table wp-block-kadence-table%1$s">%2$s</table>',
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
