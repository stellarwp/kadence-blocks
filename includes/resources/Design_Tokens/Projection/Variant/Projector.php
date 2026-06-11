<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use RuntimeException;

/**
 * Projects the selectable-variant CSS into the WordPress style pipeline.
 *
 * Appends the per (block, variant) scoped overrides built by {@see Css_Builder} to KB's existing inline
 * style handles, on the front end and in the editor, gated on Token_Registry::is_active() so a
 * deactivated registry leaves KB's behavior untouched. The class that activates a rule is added by the
 * editor-side kbVariant filter; this side only emits the CSS the class hooks.
 *
 * @since TBD
 */
final class Projector {

	/**
	 * @var Token_Registry
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Store
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * @var Css_Builder
	 *
	 * @since TBD
	 */
	private Css_Builder $css_builder;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry    The token registry.
	 * @param Token_Store    $store       The store, for the cache-busting version.
	 * @param Css_Builder    $css_builder The variant CSS builder.
	 */
	public function __construct( Token_Registry $registry, Token_Store $store, Css_Builder $css_builder ) {
		$this->registry    = $registry;
		$this->store       = $store;
		$this->css_builder = $css_builder;
	}

	/**
	 * Append the variant CSS to the front-end global-variables handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_front_end(): void {
		if ( ! $this->registry->is_active() ) {
			return;
		}

		$css = $this->build_css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-variables', $css );
		}
	}

	/**
	 * Append the variant CSS to the editor global-styles handle.
	 *
	 * Shares the Css_Var projector's editor gate (the same page check and filter), so the variant CSS and
	 * the token vars load together in the editor or not at all.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_editor(): void {
		if ( ! $this->registry->is_active() ) {
			return;
		}

		/** This filter is documented in includes/resources/Design_Tokens/Projection/Css_Var/Projector.php */
		if ( ! apply_filters( 'kadence_blocks_load_editor_token_vars', Location::is_block_editor() ) ) {
			return;
		}

		$css = $this->build_css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-editor-styles', $css );
		}
	}

	/**
	 * Build the variant CSS for the current set, via the builder's version-keyed cache.
	 *
	 * Returns an empty string when the store version cannot be read or a variant cannot be resolved (e.g.
	 * an alias cycle from a direct DB write that bypassed the REST gate), so the page never crashes — the
	 * inline style is simply omitted and KB falls back to its $default look.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function build_css(): string {
		try {
			$version = $this->store->get_version();
		} catch ( RuntimeException $e ) {
			return '';
		}

		return $this->css_builder->css_for_version( $version, Token_Store::default_slug() );
	}
}
