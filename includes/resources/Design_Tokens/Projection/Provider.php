<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the CSS-variable backbone: injects --kb-token--* / --wp--preset--* into KB's existing
 * inline styles and feeds the legacy color/font-size filters — all gated on
 * Token_Registry::is_active() so a deactivated registry leaves KB's behavior untouched.
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
		$this->container->singleton( Css_Var_Projector::class, Css_Var_Projector::class );
		$this->container->singleton( Legacy_Filter_Bridge::class, Legacy_Filter_Bridge::class );

		// Front end: append our declarations to the global-variables handle (KB enqueues at 90).
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_front_end' ], 91 );

		// Editor: the editor-styles handle is registered at admin_init priority 1 and wired as a
		// wp-block-library dependency at priority 2. Appending at priority 5 ensures the handle
		// exists and keeps that dependency, which is what gives editor-iframe coverage for free.
		add_action( 'admin_init', [ $this, 'enqueue_editor' ], 5 );

		// Legacy variable families (init.php applies these in both editor and front-end functions).
		// Merge semantics: the bridge overrides only token-claimed slots; everything else passes through.
		add_filter( 'kadence_blocks_pattern_global_colors', [ $this, 'filter_global_colors' ] );
		add_filter( 'kadence_blocks_variable_font_sizes', [ $this, 'filter_font_sizes' ] );
	}

	/**
	 * Append the projected CSS to the front-end global-variables handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_front_end(): void {
		if ( ! $this->is_active() ) {
			return;
		}

		$css = $this->build_css();
		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-variables', $css );
		}
	}

	/**
	 * Append the projected CSS to the editor global-styles handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_editor(): void {
		if ( ! $this->is_active() ) {
			return;
		}

		$css = $this->build_css();
		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-editor-styles', $css );
		}
	}

	/**
	 * @since TBD
	 *
	 * @param array<string,string> $colors
	 *
	 * @return array<string,string>
	 */
	public function filter_global_colors( array $colors ): array {
		if ( ! $this->is_active() ) {
			return $colors;
		}

		return $this->container->get( Legacy_Filter_Bridge::class )->global_colors( $colors );
	}

	/**
	 * @since TBD
	 *
	 * @param array<string,string> $sizes
	 *
	 * @return array<string,string>
	 */
	public function filter_font_sizes( array $sizes ): array {
		if ( ! $this->is_active() ) {
			return $sizes;
		}

		return $this->container->get( Legacy_Filter_Bridge::class )->font_sizes( $sizes );
	}

	/**
	 * Build the projected CSS from the current resolved token set, using the per-request memo
	 * and object cache so repeated calls (front end + editor) within the same request are free.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function build_css(): string {
		$store     = $this->container->get( Token_Store::class );
		$version   = $store->get_version();
		$resolved  = $this->container->get( Token_Resolver::class )->resolve();
		$projector = $this->container->get( Css_Var_Projector::class );

		return $projector->css_for_version( $resolved, $version );
	}

	/**
	 * Whether token projection is active. Fail-closed: any error reading the registry means "off".
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_active(): bool {
		return $this->container->get( Token_Registry::class )->is_active();
	}
}
