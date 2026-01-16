<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals;

final class Optimizer_Provider extends Provider {

	/**
	 * List of Optimizer providers to register, in order.
	 *
	 * @var class-string<Provider>[]
	 */
	private const PROVIDERS = [
		Database\Provider::class,
		Translation\Provider::class,
		Skip_Rules\Provider::class,
		Hash\Provider::class,
		Nonce\Provider::class,
		Request\Provider::class,
		Store\Provider::class,
		Status\Provider::class,
		Asset\Provider::class,
		Post_List_Table\Provider::class,
		Rest\Provider::class,
		Lazy_Load\Provider::class,
		Image\Provider::class,
		Resource_Hints\Provider::class,
	];

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

		$this->register_mobile_override();

		foreach ( self::PROVIDERS as $provider ) {
			$this->container->register( $provider );
		}
	}

	/**
	 * Allow force overriding wp_is_mobile with a query string variable.
	 *
	 * @return void
	 */
	private function register_mobile_override(): void {
		add_filter(
			'wp_is_mobile',
			static function ( bool $is_mobile ): bool {
				if ( SuperGlobals::get_get_var( 'kadence_is_mobile' ) ) {
					return true;
				}

				return $is_mobile;
			},
			10,
			1
		);
	}
}
