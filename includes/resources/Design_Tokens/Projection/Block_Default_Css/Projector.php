<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts\Abstract_Css_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use Throwable;

/**
 * Projects the per-block default dimension CSS into the WordPress style pipeline.
 *
 * Appends the low-specificity, block-scoped rules built by {@see Css_Builder} to KB's existing inline
 * style handles, on the front end and in the editor, gated on Token_Registry::is_active() so a
 * deactivated registry leaves KB's behavior untouched. Enqueuing onto the editor handle as well as the
 * front-end one is what gives the token default editor-canvas parity for free — a block's `$default`
 * radius / icon-size applies until a per-instance value KB renders wins by higher specificity.
 *
 * @since TBD
 */
final class Projector extends Abstract_Css_Projector {

	/**
	 * The token registry, used to gate projection on the registry being active.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The store, for the cache-busting version.
	 *
	 * @since TBD
	 *
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
	 * The block-default CSS builder.
	 *
	 * @since TBD
	 *
	 * @var Css_Builder
	 */
	private Css_Builder $css_builder;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry    The token registry.
	 * @param Token_Store      $store       The store, for the cache-busting version.
	 * @param Active_Token_Library_Store $active      Owns the active-library pointer.
	 * @param Css_Builder      $css_builder The block-default CSS builder.
	 */
	public function __construct( Token_Registry $registry, Token_Store $store, Active_Token_Library_Store $active, Css_Builder $css_builder ) {
		$this->registry    = $registry;
		$this->store       = $store;
		$this->active      = $active;
		$this->css_builder = $css_builder;
	}

	/**
	 * Append the block-default CSS to the front-end global-variables handle.
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
	 * Append the block-default CSS to the editor global-styles handle.
	 *
	 * Shares the Css_Var projector's editor gate (the same page check and filter), so the default CSS and
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

		$css = $this->editor_css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-editor-styles', $css );
		}
	}

	/**
	 * Build the FRONT-END block-default CSS for the current library, via the builder's version-keyed cache.
	 *
	 * Returns an empty string when the store version cannot be read or a block cannot be resolved (e.g. an
	 * alias cycle from a direct DB write that bypassed the REST gate), so the page never crashes — the
	 * inline style is simply omitted and KB falls back to its own defaults.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string {
		$slug = $this->active->get();

		try {
			$version = $this->store->get_version( $slug );
		} catch ( Throwable $e ) {
			return '';
		}

		return $this->css_builder->css_for_version( $version, $slug );
	}

	/**
	 * Build the EDITOR-scoped block-default CSS for the current library, via the builder's version-keyed cache.
	 * Identical to {@see self::css()} for every block that declares no `editor_selector`; scoped under
	 * `.editor-styles-wrapper` and re-targeted at the block's editor markup for the ones that do (see
	 * {@see Css_Builder::editor_css()}).
	 *
	 * Returns an empty string under the same failure conditions as {@see self::css()}.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function editor_css(): string {
		$slug = $this->active->get();

		try {
			$version = $this->store->get_version( $slug );
		} catch ( Throwable $e ) {
			return '';
		}

		return $this->css_builder->editor_css_for_version( $version, $slug );
	}
}
