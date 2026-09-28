<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use Kadence_Blocks_Singlebtn_Block;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Site-level block styles in the Kadence theme's FSE mode: Global Styles values
 * that every instance of a supported block follows unless it sets its own.
 *
 * @since TBD
 */
final class Site_Styles_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$this->container->singleton(
			Supported_Blocks::class,
			static function (): Supported_Blocks {
				return new Supported_Blocks( [ Kadence_Blocks_Singlebtn_Block::get_instance() ] );
			}
		);
		$this->container->singleton( Store::class, Store::class );
		$this->container->singleton( Overlay::class, Overlay::class );

		// On init: the provider registers before kadence_blocks_init() loads the block classes the registry holds.
		add_action(
			'init',
			function (): void {
				/** @var Overlay $overlay */
				$overlay = $this->container->get( Overlay::class );
				foreach ( array_keys( $overlay->hooks() ) as $hook ) {
					add_filter( $hook, $this->container->callback( Overlay::class, 'filter_render_attributes' ) );
				}
			},
			1
		);
	}
}
