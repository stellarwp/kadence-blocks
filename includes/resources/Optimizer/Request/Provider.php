<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Request;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->register_request();
		$this->register_request_anonymizer();
	}

	private function register_request(): void {
		$this->container->singleton( Request::class, Request::class );
	}

	private function register_request_anonymizer(): void {
		$this->container->singleton( Request_Anonymizer::class, Request_Anonymizer::class );

		add_action(
			'plugins_loaded',
			function () {
				$this->container->get( Request_Anonymizer::class )->force_anonymous_request();
			},
			2
		);
	}
}
