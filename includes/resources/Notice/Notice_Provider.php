<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Admin notice container definitions and hooks.
 *
 * @since TBD
 */
final class Notice_Provider extends Provider {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		add_action(
			'admin_init',
			$this->container->callback( Core_Update_Notice::class, 'handle_dismissal' )
		);

		add_action(
			'admin_notices',
			$this->container->callback( Core_Update_Notice::class, 'render' )
		);
	}
}
