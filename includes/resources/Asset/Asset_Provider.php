<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Asset;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

final class Asset_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$this->container->when( Asset::class )
						->needs( '$plugin_url' )
						->give( static fn(): string => KADENCE_BLOCKS_URL );
	}
}
