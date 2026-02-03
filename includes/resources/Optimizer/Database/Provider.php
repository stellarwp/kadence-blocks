<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Database;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->register_optimizer_query();
		$this->register_viewport_query();
	}

	private function register_optimizer_query(): void {
		$this->container->singleton( Optimizer_Query::class, Optimizer_Query::class );

		$this->container->when( Optimizer_Query::class )
						->needs( '$table' )
						->give( static fn(): string => Optimizer_Table::table_name( false ) );
	}

	private function register_viewport_query(): void {
		$this->container->singleton( Viewport_Query::class, Viewport_Query::class );

		$this->container->when( Viewport_Query::class )
						->needs( '$table' )
						->give( static fn(): string => Viewport_Hash_Table::table_name( false ) );
	}
}
