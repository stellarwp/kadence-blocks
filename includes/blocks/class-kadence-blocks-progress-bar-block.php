<?php
/**
 * Class to Build the Progress Bar Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Progress Bar Block.
 *
 * @category class
 */
class Kadence_Blocks_Progress_Bar_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'progress-bar';

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
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css        the css class for blocks.
	 * @param string             $unique_id  the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		// Add title font
		if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) && isset( $attributes['titleFont'][0]['google'] ) && $attributes['titleFont'][0]['google'] && ( ! isset( $attributes['titleFont'][0]['loadGoogle'] ) || true === $attributes['titleFont'][0]['loadGoogle'] ) && isset( $attributes['titleFont'][0]['family'] ) ) {
			$title_font = $attributes['titleFont'][0];

			$font_variant = ( ! empty( $title_font['variant'] ) ? array( $title_font['variant'] ) : '' );
			$font_subset  = ( ! empty( $title_font['subset'] ) ? array( $title_font['subset'] ) : '' );

			$css->maybe_add_google_font( $title_font['family'], $font_variant, $font_subset );
		}

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		if ( isset( $title_font['weight'] ) && ! empty( $title_font['weight'] ) ) {
			$css->add_property( 'font-weight', $title_font['weight'] );
		}
		if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
			$css->add_property( 'text-transform', $title_font['textTransform'] );
		}

		$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
		$css->add_property( 'font-size', '50px' );


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

//		wp_register_script( 'kadence-countup', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-countup.min.js', array( 'countup' ), KADENCE_BLOCKS_VERSION, true );

	}
}

Kadence_Blocks_Progress_Bar_Block::get_instance();
