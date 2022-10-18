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
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css        the css class for blocks.
	 * @param string             $unique_id  the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		wp_enqueue_script( 'kadence-blocks-' . $this->block_name );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		$css->set_selector( '.kb-progress-bar-container' . $unique_id  );
		$css->render_responsive_size($attributes, array('containerMaxWidth','tabletContainerMaxWidth','mobileContainerMaxWidth'), 'max-width', 'containerMaxWidthUnits');
		$css->add_property('height', '60px');
		$css->add_property('background-color', 'red');
		$css->add_property('width','100%');
		$margin_args= array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
		);
		$css->render_measure_output($attributes, 'marginDestop', 'margin', $margin_args);

		// Add title font
		// if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) && isset( $attributes['titleFont'][0]['google'] ) && $attributes['titleFont'][0]['google'] && ( ! isset( $attributes['titleFont'][0]['loadGoogle'] ) || true === $attributes['titleFont'][0]['loadGoogle'] ) && isset( $attributes['titleFont'][0]['family'] ) ) {
		// 	$title_font = $attributes['titleFont'][0];

		// 	$font_variant = ( ! empty( $title_font['variant'] ) ? array( $title_font['variant'] ) : '' );
		// 	$font_subset  = ( ! empty( $title_font['subset'] ) ? array( $title_font['subset'] ) : '' );

		// 	$css->maybe_add_google_font( $title_font['family'], $font_variant, $font_subset );
		// }


		return $css->css_output();
	}

	public function build_html( $attributes, $unique_id, $content ) {

		$content .= '<script src="/wp-content/plugins/kadence-blocks/includes/assets/js/progressBar.min.js"></script>';

	
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

		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/progressBar.min.js', array( '' ), KADENCE_BLOCKS_VERSION, false );

	}
}

Kadence_Blocks_Progress_Bar_Block::get_instance();
