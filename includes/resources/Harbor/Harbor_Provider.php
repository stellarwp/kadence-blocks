<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Actions\Get_Known_Plugins;
use KadenceWP\KadenceBlocks\Harbor\Actions\Render_Harbor_License_Notice;
use KadenceWP\KadenceBlocks\Harbor\Actions\Report_Legacy_Licenses;
use KadenceWP\KadenceBlocks\Harbor\Actions\Suppress_Legacy_Inactive_Notices;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Config as HarborConfig;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Harbor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

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
		Harbor::init();

		lw_harbor_register_submenu( 'kadence-blocks' );

		add_filter( 'lw-harbor/legacy_licenses', new Report_Legacy_Licenses() );
		add_filter( 'kadence_blocks_ai_disabled', [ $this, 'is_ai_disabled' ] );
		add_filter( 'kadence_blocks_ai_disabled_message', [ $this, 'ai_disabled_message' ] );

		foreach ( ( new Get_Known_Plugins() )() as $slug => $plugin ) {
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

}
