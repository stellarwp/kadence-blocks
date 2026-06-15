<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use RuntimeException;
use WP_Theme_JSON_Data;

/**
 * Projects native block-style variants into the WordPress pipeline ("Projector B" for native blocks).
 *
 * Two surfaces: it appends the per (block, variant) scoped overrides from {@see Css_Builder} to KB's
 * front-end and editor style handles, and it injects each native block's $default baseline {@see
 * Default_Styles} into theme.json so an unstyled block is on-brand. Both are gated on
 * Token_Registry::is_active() so a deactivated registry leaves native blocks untouched. The class that
 * activates a variant is added by WordPress's block-style system; this side only emits the CSS it hooks.
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
	 * @var Default_Styles
	 *
	 * @since TBD
	 */
	private Default_Styles $default_styles;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry       The token registry.
	 * @param Token_Store    $store          The store, for the cache-busting version.
	 * @param Css_Builder    $css_builder    The native variant CSS builder.
	 * @param Default_Styles $default_styles The native $default theme.json builder.
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Store $store,
		Css_Builder $css_builder,
		Default_Styles $default_styles
	) {
		$this->registry       = $registry;
		$this->store          = $store;
		$this->css_builder    = $css_builder;
		$this->default_styles = $default_styles;
	}

	/**
	 * Append the native variant CSS to the front-end global-variables handle.
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
	 * Append the native variant CSS to the editor global-styles handle, so a picked style previews live.
	 * Shares the Css_Var projector's editor gate so it loads with the token vars or not at all.
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
	 * Inject each native block's $default baseline into a theme.json data object, so an unstyled block
	 * consumes the token-backed presets. Bound to both wp_theme_json_data_default and
	 * wp_theme_json_data_theme. A no-op when projection is inactive or no native block contributes a
	 * $default.
	 *
	 * @since TBD
	 *
	 * @param WP_Theme_JSON_Data $theme_json The theme.json data object.
	 *
	 * @return WP_Theme_JSON_Data
	 */
	public function inject( WP_Theme_JSON_Data $theme_json ): WP_Theme_JSON_Data {
		if ( ! $this->registry->is_active() || ! $this->default_styles->has_styles() ) {
			return $theme_json;
		}

		$theme_json->update_with( $this->default_styles->payload() );

		return $theme_json;
	}

	/**
	 * Build the native variant CSS for the current set, via the builder's version-keyed cache.
	 *
	 * Returns an empty string when the store version cannot be read, so the page never crashes — the
	 * inline style is simply omitted and KB falls back to the block's native styles.
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
