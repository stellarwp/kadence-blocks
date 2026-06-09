<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Preset;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the block-preset projector: binds it as a singleton, then overlays each block's `$default`
 * variant onto KB's per-block attribute defaults.
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
		$this->container->singleton( Projector::class );

		// KB's abstract block emits this filter while assembling a block's default attributes (see
		// get_attributes_with_defaults()). Overlaying the block's $default variant makes it render on-brand
		// out of the box. Resolved lazily through the container: the resolver graph need not boot before render.
		add_filter(
			'kadence_blocks_block_default_attributes',
			$this->container->callback( Projector::class, 'add_preset_defaults' ),
			10,
			2
		);
	}
}
