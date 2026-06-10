<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Adapter_Interface;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the per-block adapter projector and wires it into KB's render path.
 *
 * KB emits `kadence_blocks_block_default_attributes` while assembling a block's attributes (passing the
 * block name), the same seam the block-preset projector uses. Running the adapter there — after the
 * preset overlay (priority 20 vs 10) — lets it rewrite the values a block's attributes cannot express
 * as a clean token/variable reference. The projector looks the adapter up by block at render time, so a
 * block with no adapter is a no-op.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * The adapter classes registered against the Token Registry, resolved from the container so an adapter
	 * can take the Registry or Resolver as a dependency. A Kadence Blocks block whose attributes cannot be
	 * expressed as a clean token/variable reference lists its adapter here.
	 *
	 * @since TBD
	 *
	 * @var class-string<Adapter_Interface>[]
	 */
	private const ADAPTERS = [];

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->container->singleton( Projector::class );

		// Register the adapters on init, the same hook the token declarations use, so the registry is fully
		// populated before render. The filter below then looks each adapter up by block.
		add_action( 'init', [ $this, 'register_adapters' ], 0 );

		add_filter(
			'kadence_blocks_block_default_attributes',
			$this->container->callback( Projector::class, 'apply' ),
			20,
			2
		);
	}

	/**
	 * Register the declared adapters against the Token Registry.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_adapters(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		foreach ( self::ADAPTERS as $adapter ) { // @phpstan-ignore foreach.emptyArray (Remove once ADAPTERS lists an adapter.)
			/** @var Adapter_Interface $instance */
			$instance = $this->container->get( $adapter );
			$registry->register_adapter( $instance );
		}
	}
}
