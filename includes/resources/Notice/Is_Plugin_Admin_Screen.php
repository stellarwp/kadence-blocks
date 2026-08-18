<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

use WP_Screen;

/**
 * Whether the current admin screen is one this plugin owns.
 *
 * @since TBD
 */
final class Is_Plugin_Admin_Screen {

	/**
	 * Screens owned by this plugin that are not post type screens.
	 *
	 * @since TBD
	 */
	private const SCREENS = [
		'toplevel_page_kadence-blocks',
		'kadence_page_kadence-blocks-home',
	];

	/**
	 * Post types this plugin shows under its own admin menu. Matching on post type rather than
	 * screen ID covers the list table and the add and edit screens in one entry. Excludes
	 * kadence_lottie and kadence_vector, which are registered with show_in_menu false.
	 *
	 * @since TBD
	 */
	private const MENU_POST_TYPES = [
		'kadence_form',
		'kadence_navigation',
		'kadence_header',
	];

	/**
	 * Runs during admin_notices, when get_current_screen() is available.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function __invoke(): bool {
		if ( ! function_exists( 'get_current_screen' ) ) {
			return false;
		}

		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return false;
		}

		if ( in_array( $screen->id, self::SCREENS, true ) ) {
			return true;
		}

		return in_array( $screen->post_type, self::MENU_POST_TYPES, true );
	}
}
