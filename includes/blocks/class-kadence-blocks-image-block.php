<?php
/**
 * Class to Build the Image Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Image Block.
 *
 * @category class
 */
class Kadence_Blocks_Image_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'image';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Image_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$update_alt_globally = isset( $attributes['globalAlt'] ) && true === $attributes['globalAlt'] ? true : false;
		if ( apply_filters( 'kadence_blocks_update_alt_text_globally', $update_alt_globally, $attributes ) && ! empty( $attributes['id'] ) ) {
			// Check if we can get the alt text.
			$alt = get_post_meta( $attributes['id'], '_wp_attachment_image_alt', true );
			if ( ! empty( $alt ) ) {
				$content = str_replace( 'alt=""', 'alt="' . esc_attr( $alt ) . '"', $content );
			}
		}
		if ( strpos( $content, 'kb-tooltip-hidden-content') !== false ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}

		if( !empty( $attributes['urlSticky']) ) {
			$this->enqueue_script('kadence-blocks-header-sticky-image');
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
		wp_register_script( 'kadence-blocks-header-sticky-image', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-header-sticky-image.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', array( 'kadence-blocks-popper' ), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Image_Block::get_instance();
