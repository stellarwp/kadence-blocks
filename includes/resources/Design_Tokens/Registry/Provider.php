<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Json_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the Token Registry: binds the singleton and the shipped baseline, defines the global helper,
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

		// Bind the baseline contract to the shipped, read-only DTCG document (baseline.json). Every
		// declared token must now have a matching baseline entry or the guard fails closed. The version
		// keys the decoded-document cache, so a baseline shipped with a new plugin build invalidates it.
		$this->container->singleton(
			Baseline_Document::class,
			new Json_Baseline_Document( __DIR__ . '/Baseline/baseline.json', KADENCE_BLOCKS_VERSION )
		);

		$this->load_helper();

		// Declarations carry __() labels/groups, so they must not be evaluated before init or WordPress
		// fires the _load_textdomain_just_in_time notice. register() runs on plugins_loaded, so defer the
		// declaration load (and the guard that runs once tokens are in) to init. Early priority keeps the
		// registry populated before any consumer (admin UI, projectors, resolver) reads it.
		//
		// The guard validates the registered tokens, so it must run after register_declarations. The
		// later priority makes that ordering explicit rather than relying on same-priority insertion order.
		//
		// The guard is one-shot at init:1 — v1 is central-declarations-only, so tokens declared by
		// third parties on a later hook (init:2+) skip baseline validation and is_active() is not
		// re-checked. Re-validating late registrations is out of scope until the real baseline lands.
		add_action( 'init', [ $this, 'register_declarations' ], 0 );
		add_action( 'init', [ $this, 'guard_baseline' ], 1 );
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
	 * Reads declarations.php as data and registers via the container. Hooked on init (priority 0) because
	 * declarations carry __() strings that must not resolve before the textdomain is available.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_declarations(): void {
		/** @var Token_Registry $registry */
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
	public function guard_baseline(): void {
		/** @var Baseline_Guard $guard */
		$guard = $this->container->get( Baseline_Guard::class );
		$guard->run();
	}
}
