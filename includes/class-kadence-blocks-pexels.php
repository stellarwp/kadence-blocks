<?php
/**
 * Outputs google fonts.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class to create a minified css output.
 */
class Kadence_Blocks_Pexels {
	/**
	 * The singleton instance
	 */
	private static $instance = null;

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
	 * Class Constructor.
	 */
	public function __construct() {
		add_filter( 'attachment_fields_to_edit', array( $this, 'add_photographer_field' ), 10, 2 );
	}
	/**
	 * Add photographer field to media library.
	 *
	 * @param $form_fields
	 * @param $post
	 */
	public function add_photographer_field( $form_fields, $post ) {
		$photographer = get_post_meta( $post->ID, '_pexels_photographer', true );
		if ( ! empty( $photographer ) ) {
			$photographer_url = get_post_meta( $post->ID, '_pexels_photographer_url', true );
			$photograph_url = get_post_meta( $post->ID, '_pexels_photograph_url', true );
			$form_fields['pexels_photographer'] = array(
				'label' => __( 'Photo by:', 'kadence-blocks' ),
				'value' => $photographer,
				'input' => 'html',
				'html'  => "<a class='kb-pexels-photographer' href='" . esc_url( $photographer_url ) . "' target='_blank' style='color:inherit;text-decoration:none;font-size:13px;line-height: 20px;'>" . esc_html( $photographer ) . "</a><br /><small><a href='" . esc_url( ( $photograph_url ? $photograph_url : $photographer_url ) ) . "' target='_blank' style='font-size:11px;line-height: 30px;'>" . esc_html__( 'View on Pexels', 'kadence-blocks' ) . "</a></small>",
			);
		}

		return $form_fields;
	}
}
Kadence_Blocks_Pexels::get_instance();
