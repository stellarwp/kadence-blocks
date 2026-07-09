<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Reference\Listener;
use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Reference\Restorer;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the Global Styles two-way sync sub-module.
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
		$this->container->singleton( Site_Editor_Preset_Locator::class );
		$this->container->singleton( Value_Translator::class, Default_Value_Translator::class );
		$this->container->singleton( Sync_Listener::class );
		$this->container->singleton( Restorer::class );
		$this->container->singleton( Listener::class );

		// wp_after_insert_post is the only hook a Global Styles CPT write fires — there is no
		// rest_after_insert_wp_global_styles (WP_REST_Global_Styles_Controller does not extend
		// WP_REST_Posts_Controller).
		add_action(
			'wp_after_insert_post',
			$this->container->callback( Sync_Listener::class, 'on_after_insert_post' ),
			10,
			4
		);

		add_action(
			Sync_Listener::synced_action(),
			$this->container->callback( Listener::class, 'on_synced' ),
			10,
			2
		);
	}
}
