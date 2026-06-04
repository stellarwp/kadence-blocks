<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Registers the Design Tokens system bindings and hooks.
 */
final class Design_Tokens_Provider extends Provider {

	/**
	 * Design Tokens sub-providers to register, in order.
	 *
	 * @var class-string<Provider>[]
	 */
	private const PROVIDERS = [
		Registry\Provider::class,
		Database\Provider::class,
		Schema\Provider::class,
		Resolver\Provider::class,
		Rest\Provider::class,
	];

	public function register(): void {
		foreach ( self::PROVIDERS as $provider ) {
			$this->container->register( $provider );
		}
	}
}
