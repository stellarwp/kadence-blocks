<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Nonce;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->container->singleton( Nonce::class, Nonce::class );

		add_filter(
			'nonce_user_logged_out',
			$this->container->callback( Nonce::class, 'customize_nonce_id' ),
			10,
			2
		);
	}
}
