<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Adapter_Interface;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the per-block adapters and wires them into KB's render path, across two seams:
 *
 *   1. Registration-default adapters (self::ADAPTERS). KB emits `kadence_blocks_block_default_attributes`
 *      while assembling a block's *registration* defaults (passing the block name), the same seam the
 *      block-preset projector uses. Running an adapter there — after the preset overlay (priority 20 vs
 *      10) — lets it overlay a value a block's attributes cannot express as a clean token/variable
 *      reference, while a genuinely-customized instance still wins via merge_attributes_with_defaults.
 *      The Projector looks the adapter up by block at render time, so a block with no adapter is a no-op.
 *      This suits a scalar attribute with a concrete default (an icon's `size`): the default is what gets
 *      overlaid, so the seam must run before merge.
 *   2. Render-instance adapters (self::RENDER_ADAPTERS). KB emits
 *      `kadence_blocks_<block>_render_block_attributes` with a block's *already-merged instance*
 *      attributes at render time. An adapter there sees the concrete per-instance values, so it can fill
 *      a whole-object attribute (a button's `typography[0]` bundle) field by field, leaving any field the
 *      instance set untouched — "local wins" at field granularity, impossible on the registration seam
 *      because a stored object arrives whole. Each is hooked directly on its block's filter and gates /
 *      fails soft itself, so it never needs the Registry's by-block lookup.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * Adapters that overlay a block's *registration defaults*, registered against the Token Registry and
	 * dispatched by the Projector on `kadence_blocks_block_default_attributes` (before instance merge).
	 * Resolved from the container so an adapter can take the Registry or Resolver as a dependency.
	 *
	 * @since TBD
	 *
	 * @var class-string<Adapter_Interface>[]
	 */
	private const DEFAULT_ATTRIBUTE_ADAPTERS = [
		Icon_Size_Adapter::class,
	];

	/**
	 * Adapters that fill a block's *merged instance attributes* at render time. Each is hooked on its
	 * block's `kadence_blocks_<block>_render_block_attributes` filter (the block read from the adapter's
	 * own get_block()) so it can fill a whole-object attribute from a token with field-level "local wins".
	 * Resolved from the container so an adapter can take the Registry or Resolver as a dependency.
	 *
	 * @since TBD
	 *
	 * @var class-string<Adapter_Interface>[]
	 */
	private const RENDER_INSTANCE_ADAPTERS = [
		Singlebtn_Typography_Adapter::class,
	];

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->container->singleton( Projector::class );

		// Register the adapters on init at priority 10 — after the token declarations (priority 0) and the
		// baseline guard (priority 1) so an adapter that depends on declared tokens sees a populated
		// registry, and on a round increment that leaves room for other code to register adapters before
		// us. The filter below then looks each adapter up by block.
		add_action( 'init', [ $this, 'register_adapters' ], 10 );

		add_filter(
			'kadence_blocks_block_default_attributes',
			$this->container->callback( Projector::class, 'apply' ),
			20,
			2
		);

		// Hook the render-instance adapters on init at the same priority — see register_render_instance_adapters().
		add_action( 'init', [ $this, 'register_render_instance_adapters' ], 10 );
	}

	/**
	 * Register the declared registration-default adapters against the Token Registry.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_adapters(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		foreach ( self::DEFAULT_ATTRIBUTE_ADAPTERS as $adapter ) {
			/** @var Adapter_Interface $instance */
			$instance = $this->container->get( $adapter );
			$registry->register_adapter( $instance );
		}
	}

	/**
	 * Hook each render-instance adapter on its block's `kadence_blocks_<block>_render_block_attributes`
	 * filter, deriving the block from the adapter's get_block(). Runs on init so the container can resolve
	 * an adapter's Registry/Resolver dependencies, and before any block renders.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_render_instance_adapters(): void {
		foreach ( self::RENDER_INSTANCE_ADAPTERS as $adapter ) {
			/** @var Adapter_Interface $instance */
			$instance = $this->container->get( $adapter );
			$block    = str_replace( '-', '_', $this->block_slug( $instance->get_block() ) );

			add_filter( "kadence_blocks_{$block}_render_block_attributes", [ $instance, 'apply' ], 10, 1 );
		}
	}

	/**
	 * The Kadence Blocks block slug (the segment after the namespace) an adapter is keyed to, e.g.
	 * "kadence/singlebtn" => "singlebtn" — the infix KB builds its per-instance render filter name from.
	 *
	 * @since TBD
	 *
	 * @param string $block The fully-qualified block name.
	 *
	 * @return string
	 */
	private function block_slug( string $block ): string {
		$slash = strpos( $block, '/' );

		return $slash === false ? $block : substr( $block, $slash + 1 );
	}
}
