<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts\Abstract_Css_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Css_Builder as Variant_Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use Throwable;

/**
 * Projects the per-block palette switch layer into the WordPress style pipeline.
 *
 * Emits, for the active set, one `[data-kb-palette="<id>"]` selector per palette (built by {@see Css_Builder}),
 * appended to KB's inline style handles on the front end and in the editor, gated on
 * Token_Registry::is_active(). A block that carries a `data-kb-palette` override renders its subtree against
 * the chosen palette; a block with no override follows the set `$current` at `:root` (applied by the resolver).
 *
 * @since TBD
 */
final class Projector extends Abstract_Css_Projector {

	/**
	 * Object-cache group shared with the rest of the Design Tokens module.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * @var Token_Registry
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Store The store, for the cache-busting version.
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * Owns the active-set pointer, read at build time so the projection follows the active set.
	 *
	 * @since TBD
	 *
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @var Effective_Palettes Reads the active set's effective palettes and their flattened swatches.
	 *
	 * @since TBD
	 */
	private Effective_Palettes $palettes;

	/**
	 * @var Token_Resolver Resolves each palette's full color graph (primitives, semantics, composites).
	 *
	 * @since TBD
	 */
	private Token_Resolver $resolver;

	/**
	 * @var Variant_Css_Builder Supplies the canonical variant-var declarations the switch layer re-emits.
	 *
	 * @since TBD
	 */
	private Variant_Css_Builder $variants;

	/**
	 * @var Css_Builder
	 *
	 * @since TBD
	 */
	private Css_Builder $css_builder;

	/**
	 * Per-request memo of built CSS, keyed on the active slug and store version.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * @since TBD
	 *
	 * @param Token_Registry      $registry    The token registry.
	 * @param Token_Store         $store       The store, for the cache-busting version.
	 * @param Active_Set_Store    $active      Owns the active-set pointer.
	 * @param Effective_Palettes  $palettes    Reads the active set's effective palettes.
	 * @param Token_Resolver      $resolver    Resolves each palette's full color graph.
	 * @param Variant_Css_Builder $variants   Supplies the canonical variant-var declarations.
	 * @param Css_Builder         $css_builder The palette switch-layer builder.
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Store $store,
		Active_Set_Store $active,
		Effective_Palettes $palettes,
		Token_Resolver $resolver,
		Variant_Css_Builder $variants,
		Css_Builder $css_builder
	) {
		$this->registry    = $registry;
		$this->store       = $store;
		$this->active      = $active;
		$this->palettes    = $palettes;
		$this->resolver    = $resolver;
		$this->variants    = $variants;
		$this->css_builder = $css_builder;
	}

	/**
	 * Append the palette switch layer to the front-end global-variables handle.
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
	 * Append the palette switch layer to the editor global-styles handle.
	 *
	 * Shares the Css_Var projector's editor gate (the same page check and filter), so the palette layer and
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
	 * Build the palette switch layer for the active set, memoised per request and cached on the store
	 * version. Returns an empty string when the active set cannot be read, so the page never crashes.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string {
		try {
			$active  = $this->active->get();
			$version = $this->store->get_version( $active );
		} catch ( Throwable $e ) {
			return '';
		}

		$cache_key = 'palette_switch_css_' . KADENCE_BLOCKS_VERSION . '_' . $active . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			$this->memo[ $cache_key ] = $cached;

			return $cached;
		}

		$css = $this->css_builder->css(
			$this->palettes_for( $active ),
			$this->variants->canonical_declarations( $active )
		);

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		$this->memo[ $cache_key ] = $css;

		return $css;
	}

	/**
	 * Each palette's fully-resolved color graph, limited to the vars any palette re-tints, keyed
	 * `id => ( css-var => resolved literal )`. Every palette emits the SAME var set (the union of what each
	 * palette changes against the baseline default), each carrying that palette's own value, so a per-block
	 * `[data-kb-palette]` override completely replaces the subtree's colors — semantics and shadow composites
	 * included — no matter which palette the set `$current` points at. A var no palette changes is identical
	 * everywhere, so it is left to inherit and never re-declared.
	 *
	 * @since TBD
	 *
	 * @param string $active The active set slug.
	 *
	 * @return array<string, array<string, string>>
	 */
	private function palettes_for( string $active ): array {
		$ids      = $this->palettes->palette_ids( $active );
		$baseline = $this->resolver->resolve_palette( $active, $this->palettes->default_palette( $active ) )->by_var();

		$resolved = [];
		$changed  = [];

		foreach ( $ids as $id ) {
			$by_var          = $this->resolver->resolve_palette( $active, $id )->by_var();
			$resolved[ $id ] = $by_var;

			foreach ( $by_var as $var => $value ) {
				if ( ( $baseline[ $var ] ?? null ) !== $value ) {
					$changed[ $var ] = true;
				}
			}
		}

		$palettes = [];

		foreach ( $ids as $id ) {
			$declarations = [];

			foreach ( array_keys( $changed ) as $var ) {
				if ( array_key_exists( $var, $resolved[ $id ] ) ) {
					$declarations[ $var ] = $resolved[ $id ][ $var ];
				}
			}

			if ( $declarations !== [] ) {
				$palettes[ $id ] = $declarations;
			}
		}

		return $palettes;
	}
}
