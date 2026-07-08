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
		$this->register_active_set_store();
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
	 * Bind Token_History_Store and subscribe it to the Token_Store change signals.
	 *
	 * The store archives the previous document each time a set is overwritten, and
	 * drops a set's whole trail when its row is deleted. Subscribing here (rather
	 * than calling the store from Token_Store) keeps Token_Store the sole writer of
	 * its own table — it only announces the prior state and the deletion, and
	 * history is a separable consumer of those signals.
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
			Token_Store::superseded_action(),
			$this->container->callback( Token_History_Store::class, 'record' ),
			10,
			3
		);

		add_action(
			Token_Store::deleted_action(),
			$this->container->callback( Token_History_Store::class, 'forget' ),
			10,
			1
		);
	}

	/**
	 * Bind Active_Set_Store and reset its pointer when the active set is deleted.
	 *
	 * The store owns the active-set pointer (an option), separate from the table Token_Store guards.
	 * Subscribing it to the delete signal here keeps Token_Store the sole writer of its own table — it
	 * only announces the deletion, and the pointer drops back to the default as a separable consumer of
	 * that signal, mirroring how history reacts.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function register_active_set_store(): void {
		$this->container->singleton( Active_Set_Store::class, Active_Set_Store::class );

		add_action(
			Token_Store::deleted_action(),
			$this->container->callback( Active_Set_Store::class, 'forget' ),
			10,
			1
		);
	}
}
