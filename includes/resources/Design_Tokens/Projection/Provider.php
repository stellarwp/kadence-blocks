<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the Design Tokens projection providers.
 *
 * Each projector lives in its own sub-namespace (Css_Var, Theme_Json, …) with its own Provider,
 * keeping bindings and hook registrations isolated per target format. This provider boots them.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * Projector-specific providers to register, in order.
	 *
	 * @since TBD
	 *
	 * @var class-string<Provider_Contract>[]
	 */
	private const PROVIDERS = [
		Css_Var\Provider::class,
		Theme_Json\Provider::class,
		Block_Preset\Provider::class,
	];

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		foreach ( self::PROVIDERS as $provider ) {
			$this->container->register( $provider );
		}
	}
}
