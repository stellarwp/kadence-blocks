<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Shutdown;

use KadenceWP\KadenceBlocks\Cache\Ai_Cache;
use KadenceWP\KadenceBlocks\Cache\Block_Library_Cache;
use KadenceWP\KadenceBlocks\Image_Downloader\Cache_Primer;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

final class Shutdown_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$this->container->when( Shutdown_Collection::class )
		                ->needs( '$tasks' )
		                ->give( [
			                // Add any terminable tasks to the collection to run on shutdown.
			                // Important: these will run in the order provided.
			                $this->container->get( Cache_Primer::class ),
			                $this->container->get( Block_Library_Cache::class ),
			                $this->container->get( Ai_Cache::class ),
		                ] );

		add_action( 'shutdown', $this->container->callback( Shutdown_Handler::class, 'handle' ), 1 );
	}

}
