<?php
/**
 * Class to Build the Advanced Gallery Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Gallery Block.
 *
 * @category class
 */
class Kadence_Blocks_Advancedgallery_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'advancedgallery';

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
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		if ( isset( $attributes['type'] ) && ( 'carousel' === $attributes['type'] || 'fluidcarousel' === $attributes['type'] || 'slider' === $attributes['type'] || 'thumbslider' === $attributes['type'] ) ) {
			$this->enqueue_style( 'kadence-blocks-pro-slick' );

			if ( ! doing_filter( 'the_content' ) ) {
				if ( ! wp_style_is( 'kadence-blocks-pro-slick', 'done' ) ) {
					wp_print_styles( 'kadence-blocks-pro-slick' );
				}
			}

			$this->enqueue_script( 'kadence-blocks-slick-init' );

		} elseif ( ! isset( $attributes['type'] ) || ( isset( $attributes['type'] ) && 'masonry' === $attributes['type'] ) ) {
			$this->enqueue_script( 'kadence-blocks-masonry-init' );
		}
		if ( isset( $attributes['linkTo'] ) && 'media' == isset( $attributes['linkTo'] ) && isset( $attributes['lightbox'] ) && 'magnific' === $attributes['lightbox'] ) {
			$this->enqueue_style( 'kadence-simplelightbox-css' );

			if ( ! doing_filter( 'the_content' ) ) {
				if ( ! wp_style_is( 'kadence-simplelightbox-css', 'done' ) ) {
					wp_print_styles( 'kadence-simplelightbox-css' );
				}
			}

			$this->enqueue_script( 'kadence-blocks-simplelightbox-init' );
		}

		if ( ! doing_filter( 'the_content' ) ) {
			if ( ! wp_style_is( 'kadence-blocks-gallery', 'done' ) ) {
				wp_print_styles( 'kadence-blocks-gallery' );
			}
		}


		return $css->css_output();
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

		wp_register_style( 'kadence-blocks-pro-slick', KADENCE_BLOCKS_URL . 'includes/assets/css/kt-blocks-slick.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-simplelightbox-css', KADENCE_BLOCKS_URL . 'includes/assets/css/simplelightbox.min.css', array(), KADENCE_BLOCKS_VERSION );

		wp_register_script( 'kadence-blocks-slick-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kt-slick-init.min.js', array(
			'jquery',
			'kadence-slick'
		), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-masonry-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-masonry-init.min.js', array( 'masonry' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-simplelightbox-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-gallery-simple-init.min.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );

	}
}

Kadence_Blocks_Advancedgallery_Block::get_instance();
