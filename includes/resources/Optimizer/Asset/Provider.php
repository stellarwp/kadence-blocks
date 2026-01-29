<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Asset;

use KadenceWP\KadenceBlocks\Optimizer\Asset_Loader;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->container->singleton( Asset_Loader::class, Asset_Loader::class );

		add_action(
			'enqueue_block_editor_assets',
			$this->container->callback( Asset_Loader::class, 'enqueue_block_editor_scripts' ),
			20,
			0
		);

		add_action(
			'admin_enqueue_scripts',
			$this->container->callback( Asset_Loader::class, 'enqueue_post_list_table' )
		);
	}
}
