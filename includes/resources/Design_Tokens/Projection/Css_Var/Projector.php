<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use RuntimeException;

/**
 * Projects the resolved token set into the WordPress style pipeline.
 *
 * Reacts to WordPress hooks to inject --kb-token--* / --wp--preset--* into KB's existing inline
 * styles and feeds the legacy color/font-size filters — all gated on Token_Registry::is_active()
 * so a deactivated registry leaves KB's behavior untouched.
 *
 * @since TBD
 */
final class Projector {

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
	 * @var Css_Builder
	 */
	private Css_Builder $css_builder;

	/**
	 * @var Legacy_Filter_Bridge
	 */
	private Legacy_Filter_Bridge $bridge;

	/**
	 * @param Token_Registry       $registry
	 * @param Token_Resolver       $resolver
	 * @param Token_Store          $store
	 * @param Css_Builder          $css_builder
	 * @param Legacy_Filter_Bridge $bridge
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Token_Store $store,
		Css_Builder $css_builder,
		Legacy_Filter_Bridge $bridge
	) {
		$this->registry    = $registry;
		$this->resolver    = $resolver;
		$this->store       = $store;
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

		$css = $this->build_css();
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

		return $this->bridge->global_colors( $colors );
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

		return $this->bridge->font_sizes( $sizes );
	}

	/**
	 * Build the projected CSS from the current resolved token set, using the per-request memo
	 * and object cache so repeated calls within the same request are free.
	 *
	 * Returns an empty string when the stored document cannot be resolved (e.g. an alias cycle
	 * introduced by a direct DB write that bypassed the REST validation gate) so the page does
	 * not crash — the inline style is simply omitted and KB falls back to its existing variables.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function build_css(): string {
		try {
			$version  = $this->store->get_version();
			$resolved = $this->resolver->resolve();
		} catch ( RuntimeException $e ) {
			return '';
		}

		return $this->css_builder->css_for_version( $resolved, $version );
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
