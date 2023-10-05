<?php
/**
 * REST API for Kadence Image Picker
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API prebuilt library.
 */
class Kadence_Blocks_Image_Picker_REST_Controller extends WP_REST_Controller {
	/**
	 * Handle image Type.
	 */
	const PROP_IMAGE_TYPE = 'image_type';
	/**
	 * Handle image sizes.
	 */
	const PROP_IMAGE_SIZES = 'image_sizes';



	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-image-picker/v1';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/process_images',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'process_images' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
	}
	/**
	 * Checks if a given request has access to search content.
	 *
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Imports a collection of images.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function process_images( $request ) {
		$parameters = $request->get_json_params();
		if ( empty( $parameters['images'] ) ) {
			return rest_ensure_response( 'failed' );
		}

		$images = $parameters['images'];
		$downloaded_images = array();

		// Process images.
		if ( ! empty( $images ) ) {
			foreach ( $images as $image_data ) {
				$image = array();
				$alt                        = ! empty( $image_data['alt'] ) ? $image_data['alt'] : '';
				$image['url']               = $this->get_src_from_image_data( $image_data );
				$image['id']                = ! empty( $image_data['id'] ) ? $image_data['id'] : '';
				$image['filename']          = ! empty( $image_data['filename'] ) ? $image_data['filename'] : $this->create_filename_from_alt( $alt );
				$image['photographer']      = ! empty( $image_data['photographer'] ) ? $image_data['photographer'] : '';
				$image['photographer_url']  = ! empty( $image_data['photographer_url'] ) ? $image_data['photographer_url'] : '';
				$image['photograph_url']    = ! empty( $image_data['url'] ) ? $image_data['url'] : '';
				$image['alt']               = $alt;
				$image['title']             = __( 'Photo by', 'kadence-blocks' ) . ' ' . $image['photographer'];

				// Download remote image.
				$downloaded_images[] = $this->import_image( $image );
			}
		}

		return $downloaded_images;
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params  = parent::get_collection_params();

		$query_params[ self::PROP_IMAGE_TYPE ] = array(
			'description'       => __( 'The Image type to return', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_IMAGE_SIZES ] = array(
			'description'       => __( 'The Image type to return', 'kadence-blocks' ),
			'type'              => 'array',
			'sanitize_callback' => array( $this, 'sanitize_image_sizes_array' ),
		);
		return $query_params;
	}
	/**
	 * Sanitizes an array of sizes.
	 *
	 * @param array    $sizes One or more size arrays.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_image_sizes_array( $sizes, $request ) {
		if ( ! empty( $sizes ) && is_array( $sizes ) ) {
			$new_sizes = array();
			foreach ( $sizes as $key => $value ) {
				$new_sizes[] = array(
					'id'     => sanitize_text_field( $value['id'] ),
					'width'  => absint( $value['width'] ),
					'height' => absint( $value['height'] ),
					'crop'   => (bool) $value['crop'],
				);
			}
			return $new_sizes;
		}
		return array();
	}
	/**
	 * Sanitizes a string for a filename.
	 *
	 * @param string $filename The filename.
	 * @return string a sanitized filename.
	 */
	public function sanitize_jpeg_filename( $filename ) {
		return sanitize_file_name( $filename ) . '.jpeg';
	}
	/**
	 * Import an image.
	 *
	 * @param array $image_data the image data to import.
	 */
	public function import_image( $image_data ) {
		$local_image = $this->check_for_local_image( $image_data );
		if ( $local_image['status'] ) {
			return $local_image['image'];
		}
		$file_content = wp_remote_retrieve_body(
			wp_safe_remote_get(
				$image_data['url'],
				array(
					'timeout'   => '60',
					'sslverify' => false,
				)
			)
		);
		// Empty file content?
		if ( empty( $file_content ) ) {
			return $image_data;
		}
		$filename = basename( $image_data['url'] );
		if ( strpos( $image_data['url'], 'images.pexels.com' ) !== false ) {
			$image_path = parse_url( $image_data['url'], PHP_URL_PATH );
			$filename = basename( $image_path );
		}
		// Custom filename if passed as data.
		$filename = ! empty( $image_data['filename'] ) ? $this->sanitize_jpeg_filename( $image_data['filename'] ) : $filename;

		$upload = wp_upload_bits( $filename, null, $file_content );
		$post = array(
			'post_title' => ( ! empty( $image_data['title'] ) ? $image_data['title'] : $filename ),
			'guid'       => $upload['url'],
		);
		$info = wp_check_filetype( $upload['file'] );
		if ( $info ) {
			$post['post_mime_type'] = $info['type'];
		} else {
			return $image_data;
		}
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include( ABSPATH . 'wp-admin/includes/image.php' );
		}
		$post_id = wp_insert_attachment( $post, $upload['file'] );
		wp_update_attachment_metadata(
			$post_id,
			wp_generate_attachment_metadata( $post_id, $upload['file'] )
		);
		if ( ! empty( $image_data['alt'] ) ) {
			update_post_meta( $post_id, '_wp_attachment_image_alt', $image_data['alt'] );
		}
		if ( ! empty( $image_data['photographer'] ) ) {
			update_post_meta( $post_id, '_pexels_photographer', $image_data['photographer'] );
		}
		if ( ! empty( $image_data['photographer_url'] ) ) {
			update_post_meta( $post_id, '_pexels_photographer_url', $image_data['photographer_url'] );
		}
		if ( ! empty( $image_data['photograph_url'] ) ) {
			update_post_meta( $post_id, '_pexels_photograph_url', $image_data['photograph_url'] );
		}
		update_post_meta( $post_id, '_kadence_blocks_image_hash', sha1( $image_data['url'] ) );

		return array(
			'id'  => $post_id,
			'url' => $upload['url'],
		);
	}
	/**
	 * Gets a src url from an array of image data for a certain size.
	 *
	 * @param array  $image_data An object passed from the fronted that contains image data and sizes.
	 * @param string $size_name The name of the size to return.
	 * @return string The download url or empty if no url found.
	 */
	public function get_src_from_image_data( $image_data, $size_name = 'download' ) {
		$download_url = '';
		if ( $image_data && isset( $image_data['sizes'] ) && ! empty( $image_data['sizes'] ) ) {
			foreach ( $image_data['sizes'] as $size ) {
				if ( $size['name'] == $size_name ) {
					$download_url = $size['src'] ? $size['src'] : '';
				}
			}
		}
		return $download_url;
	}
	/**
	 * Get information for our image.
	 *
	 * @param array $images the image url.
	 * @param string $target_src the image url.
	 */
	public function get_image_info( $images, $target_src ) {
		foreach ( $images['data'] as $image_group ) {
			foreach ( $image_group['images'] as $image ) {
				foreach ( $image['sizes'] as $size ) {
					if ( $size['src'] === $target_src ) {
						return array(
							'alt' => $image['alt'],
							'photographer' => $image['photographer'],
							'photographer_url' => $image['photographer_url'],
						);
						break;
					}
				}
			}
		}
		return false;
	}
	/**
	 * Get a name for our image.
	 *
	 * @param array $url the image url.
	 */
	public function get_name_from_url( $url ) {
		// Parse the URL and get the path.
		$parsed_url = parse_url( $url );
		$path = $parsed_url['path'];
		// Split the path on the '/' character.
		$parts = explode( '/', $path );
		// The second part is the key.
		if ( isset( $parts[1] ) ) {
			return $parts[1];
		} else {
			return wp_generate_password( 14, false );
		}
	}
	/**
	 * Create a filename from alt text.
	 */
	public function create_filename_from_alt( $alt ) {
		if ( empty( $alt ) ) {
			return '';
		}
		// Split the string into words.
		$words = explode( ' ', strtolower( $alt ) );
		// Limit to the first 7 words.
		$limited_words = array_slice( $words, 0, 7 );
		// Join the words with dashes.
		return implode( '-', $limited_words );
	}

	/**
	 * Check if image is already imported.
	 *
	 * @param array $image_data the image data to import.
	 */
	public function check_for_local_image( $image_data ) {
		global $wpdb;

		// Thanks BrainstormForce for this idea.
		// Check if image is already local based on meta key and custom hex value.
		$image_id = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT `post_id` FROM `' . $wpdb->postmeta . '`
					WHERE `meta_key` = \'_kadence_blocks_image_hash\'
						AND `meta_value` = %s
				;',
				sha1( $image_data['url'] )
			)
		);
		if ( $image_id ) {
			$local_image = array(
				'id'  => $image_id,
				'url' => wp_get_attachment_url( $image_id ),
			);
			return array(
				'status' => true,
				'image'  => $local_image,
			);
		}
		return array(
			'status' => false,
			'image'  => $image_data,
		);
	}
	/**
	 * Check if link is for an image.
	 *
	 * @param string $link url possibly to an image.
	 */
	public function check_for_image( $link = '' ) {
		if ( empty( $link ) ) {
			return false;
		}
		if ( strpos( $link, 'images.pexels.com' ) !== false ) {
			return true;
		}
		return preg_match( '/^((https?:\/\/)|(www\.))([a-z0-9-].?)+(:[0-9]+)?\/[\w\-]+\.(jpg|png|gif|webp|jpeg)\/?$/i', $link );
	}
	/**
	 * Get the filesystem.
	 *
	 * @access protected
	 * @return WP_Filesystem
	 */
	protected function get_filesystem() {
		global $wp_filesystem;

		// If the filesystem has not been instantiated yet, do it here.
		if ( ! $wp_filesystem ) {
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
			}
			WP_Filesystem();
		}
		return $wp_filesystem;
	}
}
