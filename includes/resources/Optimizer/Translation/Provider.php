<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Translation;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	/**
	 * If you update the text repository translations, ensure to match to the
	 * assets/js/optimizer/constant.js file.
	 */
	public function register(): void {
		$this->container->singleton( Text_Repository::class, Text_Repository::class );

		$this->container->when( Text_Repository::class )
						->needs( '$labels' )
						->give(
							static fn(): array => [
								Text_Repository::RUN_OPTIMIZER => __( 'Run Optimizer', 'kadence-blocks' ),
								Text_Repository::REMOVE_OPTIMIZATION => __( 'Remove Optimization', 'kadence-blocks' ),
								Text_Repository::OPTIMIZED => __( 'Optimized', 'kadence-blocks' ),
								Text_Repository::OPTIMIZING => __( 'Optimizing', 'kadence-blocks' ),
								Text_Repository::NOT_OPTIMIZED => __( 'Not Optimized', 'kadence-blocks' ),
								Text_Repository::NOT_OPTIMIZABLE => __( 'Not Optimizable', 'kadence-blocks' ),
								Text_Repository::EXCLUDED  => __( 'Excluded', 'kadence-blocks' ),
								Text_Repository::OPTIMIZATION_OUTDATED => __( 'Optimization Outdated', 'kadence-blocks' ),
								Text_Repository::OPTIMIZATION_OUTDATED_RUN => __( 'Optimization Outdated. Run again?', 'kadence-blocks' ),
							]
						);
	}
}
