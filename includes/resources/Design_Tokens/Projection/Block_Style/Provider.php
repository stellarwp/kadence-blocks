<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the native block-style projector: binds the registrar, builders and projector as singletons,
 * then wires registration (init), the scoped CSS (front end + editor) and the $default baseline
 * (theme.json) so native blocks ship variants alongside the token system.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->container->singleton( Css_Builder::class );
		$this->container->singleton( Default_Styles::class );
		$this->container->singleton( Registrar::class );
		$this->container->singleton( Projector::class );

		// Register the block styles once block types are available.
		add_action( 'init', $this->container->callback( Registrar::class, 'register' ), 20 );

		// Scoped variant CSS, appended after the token vars (Css_Var enqueues at 100).
		add_action( 'wp_enqueue_scripts', $this->container->callback( Projector::class, 'enqueue_front_end' ), 100 );
		add_action( 'admin_init', $this->container->callback( Projector::class, 'enqueue_editor' ), 5 );

		// $default baseline into theme.json. Same hooks and priority as the Theme_Json projector, so the
		// styles merge alongside its preset settings.
		$inject = $this->container->callback( Projector::class, 'inject' );
		add_filter( 'wp_theme_json_data_default', $inject, 1010 );
		add_filter( 'wp_theme_json_data_theme', $inject, 1010 );
	}
}
