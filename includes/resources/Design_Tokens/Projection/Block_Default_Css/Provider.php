<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Projectors;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the block-default dimension-CSS projector: binds the builder and projector as singletons,
 * then appends the low-specificity token-default rules to KB's inline style handles, front end and
 * editor alike.
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

		// Front end: append after the token vars (100) and preset overrides (110). These are low-specificity
		// defaults, so a per-instance value KB renders later still wins regardless of order.
		add_action( 'wp_enqueue_scripts', $this->container->callback( Projector::class, 'enqueue_front_end' ), 120 );

		// Editor: append at admin_init priority 20, after the editor-styles handle is registered (1) and the
		// Css_Var (5) and preset (10) projectors, so the default CSS follows the token vars on the same handle.
		add_action( 'admin_init', $this->container->callback( Projector::class, 'enqueue_editor' ), 20 );
	}
}
