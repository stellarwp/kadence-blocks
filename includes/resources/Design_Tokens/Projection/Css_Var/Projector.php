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
 * Projects the resolved token set into the WordPress style pipeline.
 *
 * Reacts to WordPress hooks to inject the --kb-token--* custom properties into KB's existing inline
 * styles and feeds the legacy color/font-size filters — all gated on Token_Registry::is_active()
 * so a deactivated registry leaves KB's behavior untouched.
 *
 * This is the non-coercive surface: a custom property placed in :root styles nothing until something
 * references it. Every token set is emitted simultaneously — each as namespaced --kb-token--<set>--*
 * custom properties — plus an active-library alias layer (canonical --kb-token--<id> pointed at the active
 * set) and a per-set [data-kb-token-set="<set>"] switch selector. The complete palette switch is the
 * active-library pointer: it re-points the :root alias layer, so the whole cascade (including the preset/slot
 * bridges and host surfaces, which read the canonical names at :root) re-resolves with no re-render. The
 * client-side [data-kb-token-set] attribute re-points the canonical token layer for a subtree, so it
 * live-swaps content that reads --kb-token--* directly, but not the :root-resolved bridges (a fuller
 * client-side switcher is follow-up work). A non-active set never feeds the native-block or theme.json
 * styling paths and is reachable only through an explicit per-block set override; only the active set's
 * tokens reach those coercive surfaces.
 *
 * Payload note (per the no-silent-caps principle): simultaneous emission costs, on top of one copy of
 * the literals (each set's namespaced block), roughly (2N + 1) x M thin var() indirection lines for N
 * sets of M tokens — the alias layer plus one switch selector per set. At realistic sizes this is
 * single-digit kilobytes and highly gzip-compressible (it is near-identical repeated indirection).
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
	 * Owns the active-library pointer, read at build time so the projection follows the active set.
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
	 * Build the projected CSS for every token set at once, using the per-request memo and object cache
	 * so repeated calls within the same request are free.
	 *
	 * Each set is resolved with its css-var names namespaced to its own slug, then the builder emits the
	 * namespaced blocks, the active-library alias layer, and the per-set switch selectors. A set whose stored
	 * document cannot be resolved (e.g. an alias cycle introduced by a direct DB write that bypassed the
	 * REST validation gate) is skipped rather than fatal, so one broken set never suppresses the others.
	 * Returns an empty string only when the active set is the one that cannot be resolved — the builder's
	 * own guard yields '' when the active slug is absent — so the page falls back to KB's existing
	 * variables without crashing.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string {
		try {
			$active = $this->active->get();
		} catch ( Throwable $e ) {
			return '';
		}

		$resolved_by_slug = [];
		$versions         = [];

		foreach ( $this->set_slugs() as $slug ) {
			try {
				$resolved_by_slug[ $slug ] = $this->resolver->resolve_namespaced( $slug );
				$versions[ $slug ]         = $this->store->get_version( $slug );
			} catch ( Throwable $e ) {
				// A single set that cannot be resolved is omitted, not fatal: the remaining sets and the
				// active alias layer still render. If the active set is the one that failed it is absent
				// from $resolved_by_slug, and css_for_version() returns '' on its own.
				continue;
			}
		}

		return $this->css_builder->css_for_version( $resolved_by_slug, $versions, $active, $this->breakpoints() );
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
	 * Every token set slug to emit: the stored sets plus the always-addressable default, which renders
	 * from baseline even with no row. Mirrors the REST collection's default-inclusive listing, and always
	 * includes the active set (the active-library pointer only ever resolves to default or a stored set).
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function set_slugs(): array {
		$slugs = array_column( $this->store->list_stores(), 'slug' );

		if ( ! in_array( Token_Store::default_slug(), $slugs, true ) ) {
			array_unshift( $slugs, Token_Store::default_slug() );
		}

		return $slugs;
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
