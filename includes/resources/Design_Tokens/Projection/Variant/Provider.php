<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the selectable-variant projector: binds the builder and projector as singletons, then wires
 * the projector's enqueue methods to the same hooks the CSS-variable projector uses, so the variant
 * overrides ship alongside the token vars on the front end and in the editor.
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
		$this->container->singleton( Projector::class );

		// Front end: append after the token vars (KB enqueues the handle at 90; the Css_Var projector at 100).
		add_action( 'wp_enqueue_scripts', $this->container->callback( Projector::class, 'enqueue_front_end' ), 100 );

		// Editor: append at admin_init priority 5, after the editor-styles handle is registered.
		add_action( 'admin_init', $this->container->callback( Projector::class, 'enqueue_editor' ), 5 );
	}
}
