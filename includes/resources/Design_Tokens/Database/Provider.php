<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the Design Tokens persistence layer into the container.
 *
 * Note: the table itself is registered centrally in Database_Provider's
 * Register::tables([...]) list, not here.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->register_token_store();
	}

	/**
	 * Bind Token_Store as a singleton and inject its table name.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function register_token_store(): void {
		$this->container->singleton( Token_Store::class, Token_Store::class );

		$this->container->when( Token_Store::class )
						->needs( '$table' )
						->give( static fn(): string => Token_Table::table_name( false ) );
	}
}
