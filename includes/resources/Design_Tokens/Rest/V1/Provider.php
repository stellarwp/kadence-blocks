<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the v1 Design Tokens REST controllers onto rest_api_init.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * Concrete v1 REST controllers registered on rest_api_init.
	 *
	 * Each entry is resolved from the container and has its routes registered.
	 * Endpoint controllers are added here as the read, write, variant, and
	 * Design MD surfaces land.
	 *
	 * @since TBD
	 *
	 * @var class-string<Controller>[]
	 */
	private const CONTROLLERS = [
		Documents_Controller::class,
	];

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		foreach ( self::CONTROLLERS as $controller ) {
			add_action( 'rest_api_init', $this->container->callback( $controller, 'register_routes' ) );
		}
	}
}
