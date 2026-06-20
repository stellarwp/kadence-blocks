<?php
/**
 * Outputs block CSS generated after the head style print.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Flushes dynamic block CSS that is generated after Kadence_Blocks_CSS prints in the head.
 *
 * Under block (FSE) themes, blocks rendered in the page body — query loops, template parts and
 * third-party loop renderers such as Shop Kit product loops — build their CSS after
 * Kadence_Blocks_CSS::frontend_block_css() has already printed in the head, so it would
 * otherwise never reach the page. This collects the post-head delta and prints it in the footer.
 */
class Kadence_Blocks_Footer_CSS {

	/**
	 * Instance of this class.
	 *
	 * @var null|Kadence_Blocks_Footer_CSS
	 */
	private static $instance = null;

	/**
	 * Custom CSS already output in the head, captured at head-print time.
	 *
	 * @var array<string, string>
	 */
	private $head_custom_styles = array();

	/**
	 * Instance control.
	 *
	 * @return Kadence_Blocks_Footer_CSS
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'capture_head_custom_styles' ), 181 );
		add_action( 'wp_footer', array( $this, 'render_footer_block_css' ) );
	}

	/**
	 * Capture the Custom CSS present at head-print time so the footer flush can exclude it.
	 *
	 * Runs just after Kadence_Blocks_CSS::frontend_block_css() (priority 180). Anything added to
	 * the Custom CSS array after this point comes from body-rendered blocks and is the delta the
	 * footer flushes.
	 *
	 * @return void
	 */
	public function capture_head_custom_styles() {
		$this->head_custom_styles = Kadence_Blocks_CSS::$custom_styles;
	}

	/**
	 * Print dynamic block CSS generated after the head style print.
	 *
	 * Classic themes inline this CSS in the block content during render, so they are gated out
	 * via the kadence_blocks_render_footer_css filter to avoid duplicate output.
	 *
	 * @return void
	 */
	public function render_footer_block_css() {
		if ( is_admin() || is_feed() || ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) ) {
			return;
		}
		if ( ! apply_filters( 'kadence_blocks_render_footer_css', wp_is_block_theme() ) ) {
			return;
		}
		$late_styles = array_diff_key( Kadence_Blocks_CSS::$styles, Kadence_Blocks_CSS::$head_styles );
		if ( ! empty( $late_styles ) ) {
			$output = '';
			foreach ( $late_styles as $value ) {
				$output .= $value;
			}
			if ( ! empty( $output ) ) {
				wp_register_style( 'kadence_blocks_footer_css', false );
				wp_enqueue_style( 'kadence_blocks_footer_css' );
				wp_add_inline_style( 'kadence_blocks_footer_css', $output );
				wp_print_styles( 'kadence_blocks_footer_css' );
			}
		}
		$late_custom_styles = array_diff_key( Kadence_Blocks_CSS::$custom_styles, $this->head_custom_styles );
		if ( ! empty( $late_custom_styles ) ) {
			$custom_output = '';
			foreach ( $late_custom_styles as $value ) {
				$custom_output .= $value;
			}
			if ( ! empty( $custom_output ) ) {
				wp_register_style( 'kadence_blocks_footer_custom_css', false );
				wp_enqueue_style( 'kadence_blocks_footer_custom_css' );
				wp_add_inline_style( 'kadence_blocks_footer_custom_css', $custom_output );
				wp_print_styles( 'kadence_blocks_footer_custom_css' );
			}
		}
	}
}

Kadence_Blocks_Footer_CSS::get_instance();
