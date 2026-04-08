<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Actions\Get_Known_Plugins;
use KadenceWP\KadenceBlocks\Harbor\Actions\Render_Harbor_License_Notice;
use KadenceWP\KadenceBlocks\Harbor\Actions\Report_Legacy_Licenses;
use KadenceWP\KadenceBlocks\Harbor\Actions\Suppress_Legacy_Inactive_Notices;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Config as HarborConfig;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Harbor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

final class Harbor_Provider extends Provider {

	/**
	 * @return void
	 */
	public function register(): void {
		HarborConfig::set_container( $this->container );
		Harbor::init();

		lw_harbor_register_submenu( 'kadence-blocks' );

		add_filter( 'lw-harbor/legacy_licenses', new Report_Legacy_Licenses() );
		add_filter( 'kadence_blocks_ai_disabled', [ $this, 'is_ai_disabled' ] );
		add_filter( 'kadence_blocks_ai_disabled_message', [ $this, 'ai_disabled_message' ] );
		add_filter( 'kadence_blocks_ai_hidden', [ $this, 'is_ai_hidden' ] );

		foreach ( ( new Get_Known_Plugins() )() as $slug => $plugin ) {
			add_action(
				"stellarwp/uplink/{$slug}/license_field_after_form",
				new Render_Harbor_License_Notice( $plugin['name'] )
			);
		}

		add_action( 'admin_init', new Suppress_Legacy_Inactive_Notices() );
	}

	/**
	 * Disables Kadence AI for Harbor-licensed customers.
	 * AI features are not yet supported under Harbor licensing.
	 *
	 * @param bool $disabled Whether AI is disabled.
	 *
	 * @return bool
	 */
	public function is_ai_disabled( bool $disabled ): bool {
		if ( $disabled ) {
			return true;
		}

		if ( kadence_blocks_is_legacy_license_authorized() ) {
			return false;
		}

		return true;
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
			return __( 'Kadence AI is not yet available with your plan.', 'kadence-blocks' );
		}

		return $message;
	}

	/**
	 * Filters the AI hidden state for Harbor-licensed customers.
	 *
	 * @param bool $hidden Whether AI is hidden.
	 *
	 * @return bool
	 */
	public function is_ai_hidden( bool $hidden ): bool {
		if ( kadence_blocks_is_legacy_license_authorized() ) {
			return false;
		}

		return true;
	}
}
