<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Status;

use KadenceWP\KadenceBlocks\Optimizer\Status\Meta;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->container->singleton( Meta::class, Meta::class );

		add_action(
			'init',
			$this->container->callback( Meta::class, 'register_meta' )
		);

		add_action(
			'updated_post_meta',
			function ( $meta_id, $post_id, $meta_key, $value ) {
				$this->container->get( Meta::class )->maybe_clear_optimizer_data( $post_id, $meta_key, $value );
			},
			10,
			4
		);
	}
}
