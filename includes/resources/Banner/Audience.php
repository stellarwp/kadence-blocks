<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Banner;

use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Admin\Feature_Manager_Page;
use WP_Screen;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\allows_multisite_license;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_resource;

/**
 * Decides whether the Nexcess software packages banner shows on the current screen.
 *
 * @since TBD
 */
final class Audience {

	/**
	 * Paid Kadence plugins that store their kadencewp.com license status through Kadence Blocks.
	 */
	private const LEGACY_SLUGS = [ 'kadence-blocks-pro', 'kadence-creative-kit' ];

	/**
	 * Kadence Blocks admin pages, by their `page` query argument.
	 */
	private const PAGES = [ 'kadence-blocks', 'kadence-blocks-home' ];

	/**
	 * Kadence Blocks post types listed under the Kadence menu.
	 */
	private const POST_TYPES = [ 'kadence_form', 'kadence_header', 'kadence_navigation' ];

	/**
	 * Whether the banner shows on the current screen.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function should_display(): bool {
		return $this->has_active_plan() && ( $this->is_kadence_page() || $this->is_license_manager_page() );
	}

	/**
	 * Whether a Nexcess license for Kadence, or a kadencewp.com license for a paid Kadence plugin,
	 * is active, from stored state only.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function has_active_plan(): bool {
		if ( lw_harbor_is_product_license_active( 'kadence' ) ) {
			return true;
		}

		foreach ( self::LEGACY_SLUGS as $slug ) {
			$resource = get_resource( $slug );

			if ( ! $resource ) {
				continue;
			}

			// Read the stored status directly, since Uplink validates remotely when it's missing.
			$option = $resource->get_license_object()->get_key_status_option_name();
			$status = allows_multisite_license( $resource ) ? get_site_option( $option ) : get_option( $option );

			if ( 'valid' === $status ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether this is a Kadence Blocks admin page, or a list of its post types.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_kadence_page(): bool {
		global $plugin_page;

		if ( in_array( $plugin_page, self::PAGES, true ) ) {
			return true;
		}

		$screen = get_current_screen();

		return $screen instanceof WP_Screen && 'edit' === $screen->base && in_array( $screen->post_type, self::POST_TYPES, true );
	}

	/**
	 * Whether this is the Nexcess licensing page.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_license_manager_page(): bool {
		$screen = get_current_screen();

		return $screen instanceof WP_Screen && 'settings_page_' . Feature_Manager_Page::PAGE_SLUG === $screen->id;
	}
}
