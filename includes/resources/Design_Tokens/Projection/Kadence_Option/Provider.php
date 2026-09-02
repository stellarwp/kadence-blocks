<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the Kadence option-sync projector: binds the builder and projector as singletons, then
 * wires the reconcile to a once-per-request boot pass and to the token-changed action.
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
		$this->container->singleton( Palette_Builder::class );
		$this->container->singleton( Projector::class );

		// Boot pass: run late on init (after the registry's declarations are registered on init, and
		// after the baseline/guard is in place) so the option reflects the current store on every load.
		// This is the "always" sync and the seam that catches a theme switch on the next request.
		add_action( 'init', $this->container->callback( Projector::class, 'reconcile' ), 20 );

		// Immediate re-sync on a token write, so the new values land within the same request.
		add_action(
			Token_Store::changed_action(),
			$this->container->callback( Projector::class, 'on_tokens_changed' ),
			10
		);
	}
}
