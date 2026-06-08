<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projectors;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the projection layer that feeds resolved tokens into Kadence Blocks' render path.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * @since TBD
	 *
	 * @return void
	 */
	public function register(): void {
		$this->container->singleton( Block_Preset_Projector::class, Block_Preset_Projector::class );

		// KB's abstract block emits this filter while assembling a block's default attributes (see
		// get_attributes_with_defaults()). The projector overlays the block's $default variant so the block
		// renders on-brand out of the box. Resolved lazily: the resolver graph need not boot before render.
		add_filter(
			'kadence_blocks_block_default_attributes',
			function ( $defaults, $block ) {
				if ( ! is_array( $defaults ) || ! is_string( $block ) ) {
					return $defaults;
				}

				/** @var Block_Preset_Projector $projector */
				$projector = $this->container->get( Block_Preset_Projector::class );

				return $projector->add_preset_defaults( $defaults, $block );
			},
			10,
			2
		);
	}
}
