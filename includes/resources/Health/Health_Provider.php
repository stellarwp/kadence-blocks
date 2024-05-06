<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Health;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Check the Health aka the status of requirements, dependencies or anything that
 * could affect the running of the plugin.
 */
final class Health_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		/*
		 * An array indexed by PHP function names to check are enabled, where a true value is
		 * they are required and a false value is they are suggested.
		 *
		 * Adjust as needed.
		 */
		$this->container->when( Required_Function_Verifier::class )
		                ->needs( '$function_map' )
		                ->give( static function (): array {
			                return [
				                'error_log'       => true,
				                'curl_multi_exec' => true,
			                ];
		                } );

		add_action(
			'admin_notices',
			$this->container->callback( Required_Function_Verifier::class, 'verify_functions' )
		);
	}

}
