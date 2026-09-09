<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the Kadence option projection: binds the builder, projector and palette filter as
 * singletons, wires the reconcile to a once-per-request boot pass and to the token-changed action,
 * and hooks the theme's palette reads.
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
		$this->container->singleton( Palette_Filter::class );

		// Boot pass: run late on init (after the registry's declarations are registered on init, and
		// after the baseline/guard is in place) so the option reflects the current store on every load.
		// This is the always-on sync.
		add_action( 'init', $this->container->callback( Projector::class, 'reconcile' ), 20 );

		// Immediate re-sync on a token write, so the new values land within the same request.
		add_action(
			Token_Store::changed_action(),
			$this->container->callback( Projector::class, 'on_tokens_changed' ),
			10
		);

		// The Kadence theme's palette is projected at read time, never written: every palette_option()
		// read passes through this filter. Registered unconditionally — the theme applies the filter
		// only when it is active, so on other themes the callback never runs.
		add_filter( 'kadence_palette_option', $this->container->callback( Palette_Filter::class, 'filter' ), 10, 2 );

		// Ahead of the projector's own listener, so a palette read later in the write request cannot be
		// answered from a memo built before the write.
		add_action(
			Token_Store::changed_action(),
			$this->container->callback( Palette_Filter::class, 'on_tokens_changed' ),
			5
		);
	}
}
