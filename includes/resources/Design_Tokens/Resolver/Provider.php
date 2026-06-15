<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the Token Resolver and its collaborators into the container.
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
		$this->container->singleton( Effective_Document::class );
		$this->container->singleton( Css_Renderer::class );
		$this->container->singleton( Token_Resolver::class );
		$this->container->singleton( Variant_Resolver::class );
		$this->container->singleton( Effective_Variants::class );
	}
}
