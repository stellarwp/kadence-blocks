<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Store\Cached_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Excluded_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Expired_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Status_Sync_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Table_Store;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		// Decorator chain (bottom-up execution, each wraps the one below):
		// When calling Store methods, execution flows TOP to BOTTOM through decorators.
		//
		// Reads (get): Expired → Cache → Excluded → Status_Sync → Table
		// Writes (set): Expired → Cache → Excluded (blocks excluded) → Status_Sync (pure) → Table
		//
		// Critical ordering:
		// 1. Expired MUST be outermost to filter stale data even from cache.
		// 2. Excluded MUST be before Status_Sync so sync logic stays pure.
		$this->container->bindDecorators(
			Store::class,
			[
				Expired_Store_Decorator::class,
				Cached_Store_Decorator::class,
				Excluded_Store_Decorator::class,
				Status_Sync_Store_Decorator::class,
				Table_Store::class,
			]
		);
	}
}
