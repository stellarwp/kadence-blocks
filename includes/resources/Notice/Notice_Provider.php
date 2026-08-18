<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\CoreUpdateNotice;
use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\Register;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Admin notice container definitions and hooks.
 *
 * @since TBD
 */
final class Notice_Provider extends Provider {

	/**
	 * Screens owned by this plugin that are not post type screens.
	 *
	 * @since TBD
	 */
	private const ADMIN_SCREENS = [
		'toplevel_page_kadence-blocks',
		'kadence_page_kadence-blocks-home',
	];

	/**
	 * Post types this plugin shows under its own admin menu. Covers the list tables and the add and
	 * edit screens, whose screen IDs differ but whose post type does not. Excludes kadence_lottie
	 * and kadence_vector, which are registered with show_in_menu false.
	 *
	 * @since TBD
	 */
	private const MENU_POST_TYPES = [
		'kadence_form',
		'kadence_navigation',
		'kadence_header',
	];

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		// Before admin_init, which the package requires, and late enough for the copy to translate.
		add_action( 'init', [ $this, 'register_core_update_notice' ] );
	}

	/**
	 * Register the shared WordPress core update notice.
	 *
	 * The copy is passed in rather than left to the package's English defaults so it is extracted
	 * into this plugin's text domain.
	 *
	 * @since TBD
	 *
	 * @hook init
	 *
	 * @return void
	 */
	public function register_core_update_notice(): void {
		$notice = new CoreUpdateNotice(
			[
				'heading' => __( 'Keep your site protected. Update to the latest version of WordPress.', 'kadence-blocks' ),
				'body'    => __( 'Your site is running on an outdated version of WordPress, which can leave it vulnerable to security issues. To decrease your risk of exposure, please update your WordPress install to the latest version.', 'kadence-blocks' ),
				'dismiss' => __( 'Dismiss this notice.', 'kadence-blocks' ),
			]
		);

		// Bind the registered instance so the rest of the plugin resolves the same one.
		$this->container->singleton( CoreUpdateNotice::class, $notice );

		Register::notice( $notice, [ $this, 'is_plugin_admin_screen' ] );
	}

	/**
	 * Whether the current screen belongs to this plugin.
	 *
	 * Runs during admin_notices, when get_current_screen() is available.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_plugin_admin_screen(): bool {
		if ( ! function_exists( 'get_current_screen' ) ) {
			return false;
		}

		$screen = get_current_screen();

		if ( ! $screen instanceof \WP_Screen ) {
			return false;
		}

		if ( in_array( $screen->id, self::ADMIN_SCREENS, true ) ) {
			return true;
		}

		return in_array( $screen->post_type, self::MENU_POST_TYPES, true );
	}
}
