<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts\Abstract_Css_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use Throwable;

/**
 * Projects the resolved token library into the WordPress style pipeline.
 *
 * Reacts to WordPress hooks to inject the --kb-token--* custom properties into KB's existing inline
 * styles and feeds the legacy color/font-size filters — all gated on Token_Registry::is_active()
 * so a deactivated registry leaves KB's behavior untouched.
 *
 * This is the non-coercive surface: a custom property placed in :root styles nothing until something
 * references it. Only the single active library is emitted — its canonical --kb-token--<id> custom properties
 * at :root — so block content and the preset/slot bridges (which read the canonical names) resolve against
 * it. Multiple libraries may still be stored; the active-library pointer selects the one library that is
 * emitted, and switching the pointer re-emits with the new library's values. Only the active library's
 * tokens reach the coercive native-block and theme.json styling paths.
 *
 * @since TBD
 */
final class Projector extends Abstract_Css_Projector {

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Owns the active-library pointer, read at build time so the projection follows the active library.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @var Css_Builder
	 */
	private Css_Builder $css_builder;

	/**
	 * @var Legacy_Filter_Bridge
	 */
	private Legacy_Filter_Bridge $bridge;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry       $registry
	 * @param Token_Resolver       $resolver
	 * @param Token_Store          $store
	 * @param Active_Token_Library_Store     $active
	 * @param Css_Builder          $css_builder
	 * @param Legacy_Filter_Bridge $bridge
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Token_Store $store,
		Active_Token_Library_Store $active,
		Css_Builder $css_builder,
		Legacy_Filter_Bridge $bridge
	) {
		$this->registry    = $registry;
		$this->resolver    = $resolver;
		$this->store       = $store;
		$this->active      = $active;
		$this->css_builder = $css_builder;
		$this->bridge      = $bridge;
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

		$css = $this->css();
		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-variables', $css );
		}
	}

	/**
	 * Append the projected CSS to the editor global-styles handle.
	 *
	 * Only runs on requests where the block editor will load its scripts, determined
	 * by matching known editor page slugs. Can be overridden with the
	 * `kadence_blocks_load_editor_token_vars` filter.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_editor(): void {
		if ( ! $this->is_active() ) {
			return;
		}

		/**
		 * Whether to append the token CSS to the editor global-styles handle.
		 *
		 * @param bool $load True on known block-editor page slugs.
		 */
		if ( ! apply_filters( 'kadence_blocks_load_editor_token_vars', Location::is_block_editor() ) ) {
			return;
		}

		$css = $this->css();
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

		return $this->bridge->global_colors( $colors );
	}

	/**
	 * Build the projected CSS for the single active token library, using the per-request memo and object cache
	 * so repeated calls within the same request are free.
	 *
	 * The active library is resolved to its canonical `--kb-token--*` maps, then the builder emits the one `:root`
	 * block (canonical token layer, slot bridges, and responsive redeclarations). An active library whose stored
	 * document cannot be resolved (e.g. an alias cycle introduced by a direct DB write that bypassed the REST
	 * validation gate) yields an empty string rather than a fatal, so the page falls back to KB's existing
	 * variables without crashing.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string {
		try {
			$active   = $this->active->get();
			$resolved = $this->resolver->resolve( $active );
			$version  = $this->store->get_version( $active );
		} catch ( Throwable $e ) {
			return '';
		}

		return $this->css_builder->css_for_version( $resolved, $active, $version, $this->breakpoints() );
	}

	/**
	 * The breakpoint => media-query string map for the per-breakpoint responsive redeclaration, resolved at
	 * emit time so the filterable KB breakpoints are final. Keyed to match the resolver's breakpoint keys;
	 * defaults mirror Kadence_Blocks_CSS::get_media_queries(). Desktop is the base (:root), so only the
	 * tablet / mobile max-width overrides are needed here.
	 *
	 * @since TBD
	 *
	 * @return array<string,string>
	 */
	private function breakpoints(): array {
		return [
			/** This filter is documented in includes/class-kadence-blocks-css.php */
			Responsive::get_tablet_key() => (string) apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' ),
			/** This filter is documented in includes/class-kadence-blocks-css.php */
			Responsive::get_mobile_key() => (string) apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' ),
		];
	}

	/**
	 * Whether token projection is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_active(): bool {
		return $this->registry->is_active();
	}
}
