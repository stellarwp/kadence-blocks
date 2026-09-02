<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Projectors;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the CSS-variable projector: binds the builder, bridge and projector as singletons
 * then wires their public methods to WordPress actions and filters.
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
		$this->container->singleton( Legacy_Filter_Bridge::class );
		$this->container->singleton( Slot_Target_Reader::class );
		$this->container->singleton( Projector::class );

		// Contribute this projector's editor CSS to the combined projected-CSS endpoint.
		/** @var Css_Projectors $projectors */
		$projectors = $this->container->get( Css_Projectors::class );
		/** @var Projector $projector */
		$projector = $this->container->get( Projector::class );
		$projectors->add( $projector );

		// Front end: append our declarations to the global-variables handle (KB enqueues at 90).
		add_action( 'wp_enqueue_scripts', $this->container->callback( Projector::class, 'enqueue_front_end' ), 100 );

		// Editor: the editor-styles handle is registered at admin_init priority 1 and wired as a
		// wp-block-library dependency at priority 2. Appending at priority 5 ensures the handle
		// exists and keeps that dependency, which is what gives editor-iframe coverage for free.
		add_action( 'admin_init', $this->container->callback( Projector::class, 'enqueue_editor' ), 5 );

		// Legacy color palette (init.php applies this filter in both editor and front-end functions).
		// Merge semantics: the bridge overrides only token-claimed slots; everything else passes through.
		// The font-size scale is delivered by the --global-kb-font-size-<slug> slot bridge in Css_Builder.
		add_filter( 'kadence_blocks_pattern_global_colors', $this->container->callback( Projector::class, 'filter_global_colors' ), 20 );
	}
}
