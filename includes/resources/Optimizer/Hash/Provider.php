<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->register_hash_store();
		$this->register_hash_handling();
	}

	private function register_hash_store(): void {
		$this->container->singleton( Hash_Store::class, Hash_Store::class );
	}

	private function register_hash_handling(): void {
		$this->container->singleton( Hash_Builder::class, Hash_Builder::class );
		$this->container->singleton( Hash_Handler::class, Hash_Handler::class );

		// Don't hook in the optimizer under these scenarios for optimal performance.
		if (
			! defined( 'WP_UNINSTALL_PLUGIN' ) &&
			! wp_installing() &&
			! wp_doing_ajax() &&
			! wp_is_json_request() &&
			! wp_doing_cron()
		) {
			add_action(
				'template_redirect',
				$this->container->callback( Hash_Handler::class, 'start_buffering' ),
				1,
				0
			);

			add_action(
				'shutdown',
				$this->container->callback( Hash_Handler::class, 'check_hash' ),
				PHP_INT_MAX - 1,
				0
			);
		}
	}
}
