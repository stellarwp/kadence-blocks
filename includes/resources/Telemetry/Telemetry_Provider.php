<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Telemetry;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Usage data sharing consent management in wp-admin.
 */
final class Telemetry_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		add_action(
			'admin_post_' . Consent::get_action(),
			$this->container->callback( Consent::class, 'handle_request' )
		);

		add_action(
			'kadence_blocks_settings_after_admin_bar',
			$this->container->callback( Consent::class, 'render' )
		);
	}
}
