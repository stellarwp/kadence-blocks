<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Resource_Hints;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		/**
		 * Allow resource hints to be disabled.
		 *
		 * @param bool $enabled Whether this feature is enabled.
		 */
		$enabled = (bool) apply_filters( 'kadence_blocks_enable_resource_hits', true );

		if ( ! $enabled ) {
			return;
		}

		$this->container->singleton( Google_Font_Preconnector::class, Google_Font_Preconnector::class );

		add_filter(
			'wp_resource_hints',
			$this->container->callback( Google_Font_Preconnector::class, 'preconnect' ),
			10,
			2
		);
	}
}
