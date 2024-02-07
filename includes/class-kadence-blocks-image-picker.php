<?php
/**
 * Add an external image picker (Pexels) to the media library.
 *
 * @package extensions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use KadenceWP\KadenceBlocks\Traits\Image_Size_Trait;

/**
 * Class to create a minified css output.
 */
class Kadence_Blocks_Image_Picker {

	use Image_Size_Trait;

	/**
	 * The singleton instance
	 *
	 * @var mixed $instance
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
		add_action( 'init', array( $this, 'register_assets' ) );
		add_action( 'wp_enqueue_media', array( $this, 'enqueue_media' ) );
		add_filter( 'attachment_fields_to_edit', array( $this, 'add_photographer_field' ), 10, 2 );
	}

	/**
	 * Register scripts.
	 */
	public function register_assets() {
		// If in the frontend, bail out.
		if ( ! is_admin() ) {
			return;
		}

		// Block CSS Scripts & Styles.
		$kadence_image_picker_meta = kadence_blocks_get_asset_file( 'dist/extension-image-picker' );
		wp_register_script( 'kadence-extension-image-picker', KADENCE_BLOCKS_URL . 'dist/extension-image-picker.js', array_merge( $kadence_image_picker_meta['dependencies'], array( 'wp-api', 'kadence-extension-stores' ) ), $kadence_image_picker_meta['version'], true );
		wp_register_style( 'kadence-extension-image-picker', KADENCE_BLOCKS_URL . 'dist/extension-image-picker.css', array(), $kadence_image_picker_meta['version'] );
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function enqueue_media() {
		// Check if the Kadence setting to enable this picker is on and we're on the right screen.
		$kadence_blocks_settings = get_option( 'kadence_blocks_settings', '' );
		if ( ! empty( $kadence_blocks_settings ) && ! is_array( $kadence_blocks_settings ) ) {
			$kadence_blocks_settings = json_decode( $kadence_blocks_settings, true );
		}
		$is_option_enabled = apply_filters( 'kadence_blocks_show_image_picker', true );
		if ( $is_option_enabled && defined( 'KADENCE_BLOCKS_DISABLE_IMAGE_SEARCH' ) && KADENCE_BLOCKS_DISABLE_IMAGE_SEARCH ) {
			$is_option_enabled = false;
		}
		if ( $is_option_enabled && isset( $kadence_blocks_settings['enable_image_picker'] ) && false === $kadence_blocks_settings['enable_image_picker'] ) {
			$is_option_enabled = false;
		}

		$current_screen = is_admin() && function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		$current_screen_base = is_object( $current_screen ) ? $current_screen->base : '';

		if ( $this->image_picker_has_access() && $is_option_enabled && 'upload' !== $current_screen_base ) {

			wp_enqueue_script( 'kadence-extension-image-picker' );
			wp_enqueue_style( 'kadence-extension-image-picker' );

			wp_localize_script(
				'kadence-extension-image-picker',
				'kadenceExtensionImagePicker',
				array(
					'image_sizes'      => $this->get_image_sizes(),
					'default_provider' => 'pexels',
				)
			);
		}
	}

	/**
	 * Confirm user has access to upload images.
	 *
	 * @return boolean
	 */
	public function image_picker_has_access() {
		$access = false;
		if ( is_user_logged_in() && current_user_can( apply_filters( 'kadence_blocks_image_picker_user_role', 'upload_files' ) ) ) {
			$access = true;
		}
		return $access;
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
				'html'  => "<a class='kb-pexels-photographer' href='" . esc_url( $photographer_url ) . "' target='_blank' style='color:inherit;text-decoration:none;font-size:13px;line-height: 20px;'>" . esc_html( $photographer ) . "</a><br /><small><a href='" . esc_url( ( ! empty( $photograph_url ) ? $photograph_url : $photographer_url ) ) . "' target='_blank' style='font-size:11px;line-height: 30px;'>" . esc_html__( 'View on Pexels', 'kadence-blocks' ) . "</a></small>",
			);
		}

		return $form_fields;
	}
}
Kadence_Blocks_Image_Picker::get_instance();
