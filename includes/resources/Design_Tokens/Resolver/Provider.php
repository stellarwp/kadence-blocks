<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the Token Resolver and its collaborators into the container.
 *
 * @since 3.8.0
 */
final class Provider extends Provider_Contract {

	/**
	 * @inheritDoc
	 *
	 * @since 3.8.0
	 */
	public function register(): void {
		$this->container->singleton( Effective_Document::class );
		$this->container->singleton( Effective_Version::class );
		$this->container->singleton( Css_Renderer::class );
		$this->container->singleton( Token_Resolver::class );
		$this->container->singleton( Preset_Resolver::class );
		$this->container->singleton( Preset_Fallback::class );
		$this->container->singleton( Preset_Value_Normalizer::class );
		$this->container->singleton( Effective_Presets::class );
		$this->container->singleton( Effective_Palettes::class );
	}
}
