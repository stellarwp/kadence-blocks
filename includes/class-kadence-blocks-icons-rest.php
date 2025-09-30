<?php
/**
 * REST API for Kadence icon data.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers an endpoint that returns the icon collections used in Kadence Blocks.
 */
class Kadence_Blocks_Icons_REST_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-icons/v1';
		$this->rest_base = 'icons';
	}

	/**
	 * Registers the REST API routes.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_icons' ),
					'permission_callback' => '__return_true',
				),
			)
		);
	}

	/**
	 * Returns the icon data collections.
	 *
	 * @param WP_REST_Request $request The current request (unused).
	 *
	 * @return WP_REST_Response
	 */
	public function get_icons( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$icons = array(
			'solidIcons' => $this->get_solid_icons(),
			'lineIcons'  => $this->get_line_icons(),
			'custom'     => $this->get_custom_icons(),
		);

		$icons['cache_key'] = md5( wp_json_encode( $icons ) );

		return rest_ensure_response( $icons );
	}

	/**
	 * Retrieves the solid icon collection (Font Awesome based).
	 *
	 * @return array
	 */
    private function get_solid_icons() {
        $icons = [];
        $icons_file = KADENCE_BLOCKS_PATH . 'includes/icons-array.php';
        if ( file_exists( $icons_file ) ) {
            include $icons_file;
            $icons = isset( $faico ) && is_array( $faico ) ? $faico : [];
        }

        // Import bundled social icons by slug naming (non -outline => solid).
        $social_file = KADENCE_BLOCKS_PATH . 'includes/icons-social-array.php';
        if ( file_exists( $social_file ) ) {
            $social_icons = include $social_file;
            if ( is_array( $social_icons ) ) {
                foreach ( $social_icons as $slug => $data ) {
                    if ( substr( $slug, -8 ) !== '-outline' ) {
                        $icons[ $slug ] = $data;
                    }
                }
            }
        }

        return $icons;
    }

	/**
	 * Retrieves the line icon collection (Feather icons).
	 *
	 * @return array
	 */
    private function get_line_icons() {
        $icons = [];
        $icons_file = KADENCE_BLOCKS_PATH . 'includes/icons-ico-array.php';
        if ( file_exists( $icons_file ) ) {
            include $icons_file;
            $icons = isset( $ico ) && is_array( $ico ) ? $ico : [];
        }

        // Import bundled social icons by slug naming (-outline => line).
        $social_file = KADENCE_BLOCKS_PATH . 'includes/icons-social-array.php';
        if ( file_exists( $social_file ) ) {
            $social_icons = include $social_file;
            if ( is_array( $social_icons ) ) {
                foreach ( $social_icons as $slug => $data ) {
                    if ( substr( $slug, -8 ) === '-outline' ) {
                        $icons[ $slug ] = $data;
                    }
                }
            }
        }

        return $icons;
    }

	/**
	 * Retrieves bundled custom icons and user uploaded icons (Pro).
	 *
	 * @return array
	 */
    private function get_custom_icons() {
        // Only return user custom icons (Pro). Bundled social icons are included in solid/line files.
        $custom_icons = [];

        if ( ! $this->has_pro_support() ) {
            return $custom_icons;
        }

		$custom_posts = get_posts(
			array(
				'post_type'      => 'kadence_custom_svg',
				'post_status'    => 'publish',
				'posts_per_page' => 250,
				'fields'         => 'ids',
			)
		);
		

		if ( empty( $custom_posts ) ) {
        return $custom_icons;
    }

		foreach ( $custom_posts as $svg_id ) {
			$post = get_post( $svg_id );
			if ( empty( $post ) || is_wp_error( $post ) ) {
				continue;
			}

			$raw_content = $post->post_content;
			if ( empty( $raw_content ) ) {
				continue;
			}

			$svg_content = str_replace( array( '<p>', '</p>' ), '', $raw_content );
			$svg_content = str_replace( array( '&#8220;', '&#8221;', '&#8222;', '&#8243;' ), '"', $svg_content );

			$svg_data = json_decode( $svg_content, true );
			if ( empty( $svg_data ) || ! is_array( $svg_data ) ) {
				continue;
			}

			$custom_icons[ 'kb-custom-' . $svg_id ] = $svg_data;
		}

		return $custom_icons;
	}

	/**
	 * Determines if the environment supports user uploaded custom icons.
	 *
	 * @return bool
	 */
    private function has_pro_support() {
        // Backward compatibility: older Pro defined KADENCE_BLOCKS_PRO.
        if ( defined( 'KADENCE_BLOCKS_PRO' ) && KADENCE_BLOCKS_PRO ) {
            return true;
        }
        // Current Pro defines KBP_VERSION and main class Kadence_Blocks_Pro.
        if ( defined( 'KBP_VERSION' ) || class_exists( 'Kadence_Blocks_Pro' ) ) {
            return true;
        }
        return false;
    }
}
