<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Button;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the native-block companion-styles projector: binds each native block's companion stylesheet
 * and the projector, then wires the projector onto the front-end and editor style handles.
 *
 * Native blocks reach their variants through the shared Kadence retarget (Variant\Css_Builder, the same
 * --global-* slots); this module only adds the companion CSS {@see Styles} that makes each native block's
 * markup consume those slots. A block's variant is an additive kb-variant--<slug> class (added by the
 * shared kbVariant editor filters), NOT a register_block_style() block style, so it composes with
 * WordPress's own single-select block styles (e.g. the built-in "Outline"). Support another native block by
 * implementing {@see Styles} and adding it to the projector's stylesheet list below.
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
		$this->container->singleton( Button::class );

		// The projector takes the list of native-block companion stylesheets; grow this list to support
		// another native block.
		$this->container->singleton(
			Projector::class,
			function (): Projector {
				/** @var Token_Registry $registry */
				$registry = $this->container->get( Token_Registry::class );

				/** @var Button $button */
				$button = $this->container->get( Button::class );

				return new Projector( $registry, [ $button ] );
			}
		);

		// Companion CSS, appended after the base token vars and the kbVariant retarget so it follows them in
		// source order (front end: Css_Var at 100, Variant at 110; editor: Css_Var at 5, Variant at 10).
		// Stepped by 10 to leave room for third parties to inject between the projectors.
		add_action( 'wp_enqueue_scripts', $this->container->callback( Projector::class, 'enqueue_front_end' ), 120 );
		add_action( 'admin_init', $this->container->callback( Projector::class, 'enqueue_editor' ), 20 );
	}
}
