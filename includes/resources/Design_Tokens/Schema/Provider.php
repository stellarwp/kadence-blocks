<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the DTCG schema layer: binds the validator as a singleton so the REST write endpoints and the
 * Resolver dry-run resolve the same instance. The validator is stateless and has no dependencies, so
 * this is a plain singleton with no hooks.
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
		$this->container->singleton( Dtcg_Validator::class );
	}
}
