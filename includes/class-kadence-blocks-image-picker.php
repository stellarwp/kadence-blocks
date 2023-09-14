<?php
/**
 * Add an external image picker (Pexels) to the media library.
 *
 * @package extensions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class to create a minified css output.
 */
class Kadence_Blocks_Image_Picker {
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
		wp_register_script( 'kadence-extension-image-picker', KADENCE_BLOCKS_URL . 'dist/extension-image-picker.js', $kadence_image_picker_meta['dependencies'], $kadence_image_picker_meta['version'], true );
		wp_register_style( 'kadence-extension-image-picker', KADENCE_BLOCKS_URL . 'dist/extension-image-picker.css', array(), $kadence_image_picker_meta['version'] );
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function enqueue_media() {
		// Check if the Kadence setting to enable this picker is on and we're on the right screen.
		$kadence_blocks_settings  = get_option( 'kadence_blocks_settings', array() );
		$is_option_enabled = apply_filters( 'kadence_blocks_show_image_picker', true );
		if ( $is_option_enabled && defined( 'KADENCE_BLOCKS_DISABLE_IMAGE_SEARCH' ) && KADENCE_BLOCKS_DISABLE_IMAGE_SEARCH ) {
			$is_option_enabled = false;
		}
		if ( $is_option_enabled && isset( $kadence_blocks_settings['enable_image_picker'] ) && false === $kadence_blocks_settings['enable_image_picker'] ) {
			$is_option_enabled = false;
		}
		$current_screen = is_admin() && function_exists( 'get_current_screen' ) ? get_current_screen()->base : '';

		if ( $this->image_picker_has_access() && $is_option_enabled && 'upload' !== $current_screen ) {

			wp_enqueue_script( 'kadence-extension-image-picker' );
			wp_enqueue_style( 'kadence-extension-image-picker' );

			wp_localize_script(
				'kadence-extension-image-picker',
				'kadenceExtensionImagePicker',
				array(
					'image_sizes' => $this->get_image_sizes(),
					'default_provider' => 'pexels',
				)
			);
		}
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function get_image_sizes() {
		$image_sizes = wp_get_registered_image_subsizes();

		if ( $image_sizes && $image_sizes['thumbnail'] && $image_sizes['medium'] ) {
			return array(
				array_merge( array( 'id' => 'thumbnail' ), $image_sizes['thumbnail'] ),
				array_merge( array( 'id' => 'medium_large' ), $image_sizes['medium_large'] ),
				array(
					'id' => 'download',
					'width' => 2048,
					'height' => 2048,
					'crop' => false,
				),
			);
		}

		return array();
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
}
Kadence_Blocks_Image_Picker::get_instance();
