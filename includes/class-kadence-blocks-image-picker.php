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
class Kadence_Blocks_Image_Picker {
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
		wp_register_script( 'kadence-extension-image-picker', KADENCE_BLOCKS_URL . 'dist/extension-image-picker.js', array_merge( $kadence_image_picker_meta['dependencies'], array( 'react', 'wp-blocks', 'wp-data', 'wp-edit-post', 'wp-element', 'wp-i18n', 'wp-plugins' ) ), $kadence_image_picker_meta['version'], true );
		wp_register_style( 'kadence-extension-image-picker', KADENCE_BLOCKS_URL . 'dist/extension-image-picker.css', array(), $kadence_block_css_meta['version'] );
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function enqueue_media() {
		// Check if the Kadence setting to enable this picker is on.
		$is_option_enabled = true;
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

		if ( $image_sizes && $image_sizes['thumbnail'] ) {
			return array( array_merge( array( 'id' => 'thumbnail' ), $image_sizes['thumbnail'] ) );
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
