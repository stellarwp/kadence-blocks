<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Rest;

use KadenceWP\KadenceBlocks\Optimizer\Rest\Optimize_Rest_Controller;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		add_action(
			'rest_api_init',
			function (): void {
				$this->container->get( Optimize_Rest_Controller::class )->register_routes();
			}
		);
	}
}
