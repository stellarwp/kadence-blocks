<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Projectors;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the selectable-preset projector: binds the builder and projector as singletons, then wires
 * the projector's enqueue methods to the same hooks the CSS-variable projector uses, so the preset
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

		// Contribute this projector's editor CSS to the combined projected-CSS endpoint.
		/** @var Css_Projectors $projectors */
		$projectors = $this->container->get( Css_Projectors::class );
		/** @var Projector $projector */
		$projector = $this->container->get( Projector::class );
		$projectors->add( $projector );

		// Front end: append after the token vars (KB enqueues the handle at 90; the Css_Var projector at 100),
		// so a preset override always follows the base token vars in source order and wins by cascade.
		add_action( 'wp_enqueue_scripts', $this->container->callback( Projector::class, 'enqueue_front_end' ), 110 );

		// Editor: append at admin_init priority 10, after the editor-styles handle is registered and after the
		// Css_Var projector (priority 5), so the preset CSS follows the token vars on the same handle.
		add_action( 'admin_init', $this->container->callback( Projector::class, 'enqueue_editor' ), 10 );
	}
}
