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
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Listitem_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
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
