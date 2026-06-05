<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the foundation-preset catalogue reader and its applier into the container.
 *
 * Both depend on already-registered services (the baseline document and the token store), so this
 * provider only binds the two singletons; no hooks of its own.
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
		$this->container->singleton( Catalog::class, Catalog::class );
		$this->container->singleton( Preset_Selector::class, Preset_Selector::class );
	}
}
