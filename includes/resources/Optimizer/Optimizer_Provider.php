<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\Rest\Optimize_Rest_Controller;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Meta_Store;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

final class Optimizer_Provider extends Provider {

	public function register(): void {
		$this->container->singleton( State::class, State::class );

		/**
		 * Filter the optimizer enabled state.
		 *
		 * @param bool $enabled Whether the optimizer is enabled or not.
		 */
		$enabled = (bool) apply_filters(
			'kadence_blocks_optimizer_enabled',
			$this->container->get( State::class )->enabled()
		);

		if ( ! $enabled ) {
			return;
		}

		$this->register_store();
		$this->register_optimizer();
		$this->register_asset_loader();
		$this->register_rest();
	}

	private function register_store(): void {
		$this->container->bind( Store::class, Meta_Store::class );
	}

	private function register_optimizer(): void {
		$this->container->singleton( Optimizer::class, Optimizer::class );

		add_action(
			'post_row_actions',
			$this->container->callback( Optimizer::class, 'add_optimize_row_action' ),
			10,
			2
		);

		add_action(
			'page_row_actions',
			$this->container->callback( Optimizer::class, 'add_optimize_row_action' ),
			10,
			2
		);
	}

	private function register_asset_loader(): void {
		add_action(
			'admin_print_styles-edit.php',
			$this->container->callback( Asset_Loader::class, 'enqueue' )
		);
	}

	private function register_rest(): void {
		add_action(
			'rest_api_init',
			function (): void {
				$this->container->get( Optimize_Rest_Controller::class )->register_routes();
			}
		);
	}
}
