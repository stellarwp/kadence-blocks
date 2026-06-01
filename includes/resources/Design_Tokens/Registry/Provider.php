<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Always_Present_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the Token Registry: binds the singleton and the (stub) baseline, defines the global helper,
 * registers the token declarations, then runs the fail-closed baseline guard once all tokens are in.
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
		$this->container->singleton( Token_Registry::class, Token_Registry::class );

		// Bind the baseline contract to a permissive stub until SOFT-3377 supplies the real document.
		// The example declarations flow through registration and the guard end-to-end; SOFT-3377 swaps
		// this binding for the real document, at which point a token without a baseline entry fails closed.
		$this->container->singleton( Baseline_Document::class, Always_Present_Baseline_Document::class );

		$this->load_helper();
		$this->register_declarations();
		$this->guard_baseline();
	}

	/**
	 * Define the public global helper. Always safe — it only declares functions; third-party callers
	 * use it on their own hooks once the kadence_blocks() accessor exists.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function load_helper(): void {
		require_once __DIR__ . '/../functions.php';
	}

	/**
	 * The single declaration point — registers each declared token / variant set against the registry.
	 *
	 * Reads declarations.php as data and registers via the container so this runs during container
	 * boot, before the global kadence_blocks() accessor is defined (see includes/init.php).
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function register_declarations(): void {
		$registry     = $this->container->get( Token_Registry::class );
		$declarations = require __DIR__ . '/declarations.php';

		foreach ( $declarations['tokens'] as $token ) {
			$registry->register( $token );
		}

		foreach ( $declarations['variant_sets'] as $variant_set ) {
			$registry->register_variant_set( $variant_set );
		}
	}

	/**
	 * @since TBD
	 *
	 * @return void
	 */
	private function guard_baseline(): void {
		$this->container->get( Baseline_Guard::class )->run();
	}
}
