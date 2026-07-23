<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Actions\Get_Known_Plugins;
use KadenceWP\KadenceBlocks\Harbor\Actions\Report_Legacy_Licenses;
use KadenceWP\KadenceBlocks\Harbor\Actions\Suppress_Legacy_Inactive_Notices;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Config as HarborConfig;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Harbor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\Harbor\Actions\Render_Harbor_License_Notice;
use ITSEC_Core;

/**
 * Wires the Harbor (LiquidWeb unified license) integration into Kadence Blocks.
 *
 * @since 3.7.0
 */
final class Harbor_Provider extends Provider {

	/**
	 * @return void
	 */
	public function register(): void {
		HarborConfig::set_plugin_basename( KADENCE_BLOCKS_PLUGIN_BASENAME );
		HarborConfig::set_container( $this->container );

		add_filter( 'lw_harbor/premium_plugin_exists', [ $this, 'register_premium_plugin_exists' ] );

		Harbor::init();

		lw_harbor_register_submenu( 'kadence-blocks' );

		add_filter( 'lw-harbor/legacy_licenses', new Report_Legacy_Licenses() );
		add_filter( 'kadence_blocks_ai_disabled', [ $this, 'is_ai_disabled' ] );
		add_filter( 'kadence_blocks_ai_disabled_message', [ $this, 'ai_disabled_message' ] );

		// Legacy Uplink license fields are replaced by the React license modal UI.
		add_filter( 'kadence_blocks_pro_should_display_uplink_license_field', '__return_false' );

		foreach ( ( new Get_Known_Plugins() )() as $slug => $plugin ) {
			// The harbor notice is added to Kadence Blocks license modal UI, so we don't need to add it here.
			if ( 'kadence-blocks' === $slug ) {
				continue;
			}

			add_action(
				"stellarwp/uplink/{$slug}/license_field_after_form",
				new Render_Harbor_License_Notice( $plugin['name'] )
			);

			add_filter( "stellarwp/uplink/{$slug}/plugin_notices", [ $this, 'suppress_inline_license_notices' ] );
		}

		add_action( 'admin_init', new Suppress_Legacy_Inactive_Notices() );
	}

	/**
	 * Disables Kadence AI for new Harbor customers who don't have legacy AI access.
	 *
	 * @param bool $disabled Whether AI is already disabled.
	 *
	 * @return bool
	 */
	public function is_ai_disabled( bool $disabled ): bool {
		if ( $disabled ) {
			return true;
		}

		return ! kadence_blocks_is_legacy_license_authorized() && lw_harbor_is_product_license_active( 'kadence' );
	}

	/**
	 * Overrides the AI disabled message for Harbor-licensed customers.
	 *
	 * @param string $message The default disabled message.
	 *
	 * @return string
	 */
	public function ai_disabled_message( string $message ): string {
		if ( kadence_blocks_is_legacy_license_authorized() ) {
			return $message;
		}

		if ( lw_harbor_is_product_license_active( 'kadence' ) ) {
			return __( 'We\'re building something new. Kadence AI as you know it is no longer available for new activations — but great things are on the way. Stay tuned for what\'s next.', 'kadence-blocks' );
		}

		return $message;
	}

	/**
	 * Suppresses the StellarWP Uplink inline license notice on the WP plugins
	 * page for LiquidWeb customers, who manage licensing through the unified key.
	 *
	 * This was intentionally kept simple for any unified key instead of Kadence specific so that plugins can continue offloading notices to the Harbor library.
	 *
	 * @param array<string, array{slug: string, message_row_html: string}> $notices
	 *
	 * @return array<string, array{slug: string, message_row_html: string}>
	 */
	public function suppress_inline_license_notices( array $notices ): array {
		return lw_harbor_has_unified_license_key() ? [] : $notices;
	}

	/**
	 * Whether Harbor should boot its REST/admin providers.
	 *
	 * Harbor's gate is all-or-nothing for a request (license, features, admin UI,
	 * cron, etc.). We cannot register only one route, but we can boot Harbor for
	 * Harbor REST requests so license save + Pro install/activate work before any
	 * premium add-on is installed, without enabling the Software Manager UI on
	 * every normal admin page load.
	 *
	 * @since 3.7.2
	 *
	 * @param bool $exists Whether a premium plugin already signaled Harbor should boot.
	 *
	 * @return bool
	 */
	public function register_premium_plugin_exists( bool $exists ): bool {
		if ( $exists ) {
			// It already exists.
			return true;
		}

		foreach ( ( new Get_Known_Plugins() )->premium_constants() as $constant ) {
			if ( defined( $constant ) ) {
				return true;
			}
		}

		// Kadence Security Pro does not have a constant.
		if (
			class_exists( ITSEC_Core::class ) &&
			ITSEC_Core::get_install_type() === 'pro'
		) {
			return true;
		}

		// Boot Harbor for our license/feature REST calls only.
		return $this->is_harbor_rest_request();
	}

	/**
	 * Whether the current request targets Harbor REST routes used by Kadence Blocks.
	 *
	 * Checked during plugins_loaded (before REST_REQUEST is defined), so URI is used.
	 * Covers both pretty-permalink REST URLs (/wp-json/liquidweb/harbor/..., including a
	 * filtered `rest_url_prefix`) and the plain-permalink `?rest_route=` query form.
	 *
	 * Allowed:
	 * - /liquidweb/harbor/v1/license[/*] (license modal get/store/refresh)
	 * - /liquidweb/harbor/v1/features/kadence-blocks[/*]
	 * - /liquidweb/harbor/v1/features/kadence-blocks-pro[/*]
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_harbor_rest_request(): bool {
		$path = $this->get_harbor_rest_path();
		if ( '' === $path ) {
			return false;
		}

		// License endpoints used by the Kadence Blocks license modal.
		if ( 1 === preg_match( '#^liquidweb/harbor/v1/license(?:/|$)#', $path ) ) {
			return true;
		}

		// Feature endpoints for Kadence Blocks free/pro only (not other Harbor features).
		return 1 === preg_match(
			'#^liquidweb/harbor/v1/features/(?:kadence-blocks-pro|kadence-blocks)(?:/|$)#',
			$path
		);
	}

	/**
	 * Extract a normalized Harbor REST path from the current request, if any.
	 *
	 * @since TBD
	 *
	 * @return string Path like "liquidweb/harbor/v1/features/kadence-blocks-pro", or empty.
	 */
	private function get_harbor_rest_path(): string {
		$namespace = 'liquidweb/harbor/';

		$route = $_GET['rest_route'] ?? null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- path check only.
		if ( is_string( $route ) && '' !== $route ) {
			$path = ltrim( $route, '/' );
			return false !== strpos( $path, $namespace ) ? strtok( $path, '?' ) : '';
		}

		$uri = $_SERVER['REQUEST_URI'] ?? ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- path check only.
		if ( ! is_string( $uri ) || '' === $uri ) {
			return '';
		}

		$prefix = function_exists( 'rest_get_url_prefix' ) ? rest_get_url_prefix() : 'wp-json';
		$needle = '/' . $prefix . '/' . $namespace;
		$pos    = strpos( $uri, $needle );
		if ( false === $pos ) {
			return '';
		}

		$path = substr( $uri, $pos + strlen( '/' . $prefix . '/' ) );
		$path = strtok( $path, '?' );

		return is_string( $path ) ? $path : '';
	}
}
