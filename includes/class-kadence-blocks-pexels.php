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
		add_filter( 'media_view_strings', array( $this, 'pexels_media_view_strings' ), 10, 2 );
		add_filter( 'media_view_settings', array( $this, 'pexels_media_view_settings' ), 10, 2 );
	}
	// Add the Source URL field to the media uploader
	public function add_photographer_field( $form_fields, $post ) {
		$photographer = get_post_meta( $post->ID, '_pexels_photographer', true );
		if ( ! empty( $photographer ) ) {
			$photographer_url = get_post_meta( $post->ID, '_pexels_photographer_url', true );
			$photograph_url = get_post_meta( $post->ID, '_pexels_photograph_url', true );
			$form_fields['pexels_photographer'] = array(
				'label' => __( 'Photo by:', 'kadence-blocks' ),
				'value' => $source_url,
				'input' => 'html',
				'html'  => "<a class='kb-pexels-photographer' href='" . esc_url( $photographer_url ) . "' target='_blank' style='color:inherit;text-decoration:none;font-size:13px;line-height: 20px;'>" . esc_html( $photographer ) . "</a><br /><small><a href='" . esc_url( ( $photograph_url ? $photograph_url : $photographer_url ) ) . "' target='_blank' style='font-size:11px;line-height: 30px;'>" . esc_html__( 'View on Pexels', 'kadence-blocks' ) . "</a></small>",
			);
		}

		return $form_fields;
	}
	/**
	 * @param $strings
	 * @param $post
	 *
	 * @return array
	 */
	public function pexels_media_view_strings( $strings, $post ) {
		// $strings['kadence-pexels'] = array(
		// 	'title'           => __( 'Pexels', 'kadence-blocks' ),
		// 	'button'          => __( 'Insert', 'kadence-blocks' ),
		// 	'retry'           => __( 'Retry', 'kadence-blocks' ),
		// 	'noMedia'         => __( 'No images have been found', 'kadence-blocks' ),
		// 	'noSearch'        => __( 'Start searching for images', 'kadence-blocks' ),
		// 	'error'           => [
		// 		'default'                 => __( 'There has been an error', 'kadence-blocks' ),
		// 	],
		// 	'link'            => __( 'Set token', 'kadence-blocks' ),
		// 	'search'          => __( 'Search images', 'kadence-blocks' ),
		// 	'close'           => __( 'Close', 'kadence-blocks' ),
		// 	'download'        => __( 'Download', 'kadence-blocks' ),
		// 	'licenseAction'   => __( 'License', 'kadence-blocks' ),
		// 	'alreadyLicensed' => __( 'Licensed', 'kadence-blocks' ),
		// 	'license'         => __( 'Your token is not valid', 'kadence-blocks' ),
		// 	'advanced'        => __( 'Advanced search', 'kadence-blocks' ),
		// );
		$strings['kadence-pexels'] = __( 'Pexels', 'kadence-blocks' );

		return $strings;
	}
	/**
	 * @param $strings
	 * @param $post
	 *
	 * @return array
	 */
	public function pexels_media_view_settings( $strings, $post ) {
		$strings['kadence-pexels'] = array(
			'nonce'              => wp_create_nonce( 'kadence_pexels' ),
		);

		return $strings;
	}
}
Kadence_Blocks_Pexels::get_instance();
