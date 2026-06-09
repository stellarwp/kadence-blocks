<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the theme.json projector: binds the builder and projector as singletons, then wires the
 * projector's inject() to both theme.json data filters.
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
		$this->container->singleton( Theme_Json_Builder::class );
		$this->container->singleton( Projector::class );

		// Both layers: default (so user/theme can still override) and theme (so presets read as
		// theme-origin in the Site Editor). KB's existing palette injection runs at priority 999 on
		// wp_theme_json_data_theme; we run at 1000 so our merge_existing() sees and preserves it.
		$callback = $this->container->callback( Projector::class, 'inject' );
		add_filter( 'wp_theme_json_data_default', $callback, 1000 );
		add_filter( 'wp_theme_json_data_theme', $callback, 1000 );
	}
}
