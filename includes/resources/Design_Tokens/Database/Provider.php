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
		$this->register_history_store();
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

	/**
	 * Bind Token_History_Store and subscribe it to the Token_Store saving action.
	 *
	 * The store archives the previous document each time a set is overwritten.
	 * Subscribing here (rather than calling the store from Token_Store) keeps
	 * Token_Store the sole writer of its own table — it only announces the prior
	 * state, and history is a separable consumer of that signal.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function register_history_store(): void {
		$this->container->singleton( Token_History_Store::class, Token_History_Store::class );

		$this->container->when( Token_History_Store::class )
						->needs( '$table' )
						->give( static fn(): string => Token_History_Table::table_name( false ) );

		add_action(
			Token_Store::saving_action(),
			$this->container->callback( Token_History_Store::class, 'record' ),
			10,
			3
		);
	}
}
