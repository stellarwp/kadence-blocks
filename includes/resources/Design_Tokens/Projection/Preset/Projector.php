<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts\Abstract_Css_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use Throwable;

/**
 * Projects the selectable-preset CSS into the WordPress style pipeline.
 *
 * Appends the per (block, preset) scoped overrides built by {@see Css_Builder} to KB's existing inline
 * style handles, on the front end and in the editor, gated on Token_Registry::is_active() so a
 * deactivated registry leaves KB's behavior untouched. The class that activates a rule is added by the
 * editor-side kbPreset filter; this side only emits the CSS the class hooks.
 *
 * @since TBD
 */
final class Projector extends Abstract_Css_Projector {

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
	 * Owns the active-library pointer, read at build time so the projection follows the active library.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @var Css_Builder
	 *
	 * @since TBD
	 */
	private Css_Builder $css_builder;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry             $registry    The token registry.
	 * @param Token_Store                $store       The store, for the cache-busting version.
	 * @param Active_Token_Library_Store $active      Owns the active-library pointer.
	 * @param Css_Builder                $css_builder The preset CSS builder.
	 */
	public function __construct( Token_Registry $registry, Token_Store $store, Active_Token_Library_Store $active, Css_Builder $css_builder ) {
		$this->registry    = $registry;
		$this->store       = $store;
		$this->active      = $active;
		$this->css_builder = $css_builder;
	}

	/**
	 * Append the preset CSS to the front-end global-variables handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_front_end(): void {
		if ( ! $this->registry->is_active() ) {
			return;
		}

		$css = $this->css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-variables', $css );
		}
	}

	/**
	 * Append the preset CSS to the editor global-styles handle.
	 *
	 * Shares the Css_Var projector's editor gate (the same page check and filter), so the preset CSS and
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

		$css = $this->css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-editor-styles', $css );
		}
	}

	/**
	 * Build the preset CSS for the single active token library, via the builder's fragment cache.
	 *
	 * The active library's presets are emitted as canonical --kb-token--preset--* vars plus the coercive scoped
	 * rules. Returns an empty string when the store version cannot be read or a preset cannot be resolved
	 * (e.g. an alias cycle from a direct DB write that bypassed the REST gate), so the page never crashes —
	 * the inline style is simply omitted and KB falls back to its $default look.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string {
		try {
			$active  = $this->active->get();
			$version = $this->store->get_version( $active );

			return $this->css_builder->css_for_version( $active, $version );
		} catch ( Throwable $e ) {
			return '';
		}
	}
}
