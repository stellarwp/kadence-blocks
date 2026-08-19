<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts\Abstract_Css_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Css_Builder as Preset_Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use Throwable;

/**
 * Projects the per-block palette switch layer into the WordPress style pipeline.
 *
 * Emits, for the active library, one `[data-kb-palette="<id>"]` selector per palette (built by {@see Css_Builder}),
 * appended to KB's inline style handles on the front end and in the editor, gated on
 * Token_Registry::is_active(). A block that carries a `data-kb-palette` override renders its subtree against
 * the chosen palette; a block with no override follows the library `$current` at `:root` (applied by the resolver).
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
	 * Owns the active-library pointer, read at build time so the projection follows the active library.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @var Effective_Palettes Reads the active library's effective palettes and their flattened swatches.
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
	 * @var Preset_Css_Builder Supplies the canonical preset-var declarations the switch layer re-emits.
	 *
	 * @since TBD
	 */
	private Preset_Css_Builder $presets;

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
	 * @param Token_Registry             $registry    The token registry.
	 * @param Token_Store                $store       The store, for the cache-busting version.
	 * @param Active_Token_Library_Store $active      Owns the active-library pointer.
	 * @param Effective_Palettes         $palettes    Reads the active library's effective palettes.
	 * @param Token_Resolver             $resolver    Resolves each palette's full color graph.
	 * @param Preset_Css_Builder         $presets     Supplies the canonical preset-var declarations.
	 * @param Css_Builder                $css_builder The palette switch-layer builder.
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Store $store,
		Active_Token_Library_Store $active,
		Effective_Palettes $palettes,
		Token_Resolver $resolver,
		Preset_Css_Builder $presets,
		Css_Builder $css_builder
	) {
		$this->registry    = $registry;
		$this->store       = $store;
		$this->active      = $active;
		$this->palettes    = $palettes;
		$this->resolver    = $resolver;
		$this->presets     = $presets;
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
	 * Build the palette switch layer for the active library, memoised per request and cached on the store
	 * version. Returns an empty string when the active library cannot be read, so the page never crashes.
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
			$this->presets->canonical_declarations( $active )
		) . $this->global_palette_overrides();

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		$this->memo[ $cache_key ] = $css;

		return $css;
	}

	/**
	 * Each palette's fully-resolved color graph, limited to the vars any palette re-tints, keyed
	 * `id => ( css-var => resolved literal )`. Every palette emits the SAME var set (the union of what each
	 * palette changes against the baseline default), each carrying that palette's own value, so a per-block
	 * `[data-kb-palette]` override completely replaces the subtree's colors — semantics and shadow composites
	 * included — no matter which palette the library `$current` points at. A var no palette changes is identical
	 * everywhere, so it is left to inherit and never re-declared.
	 *
	 * Each slot-backed color additionally re-declares its numbered `--global-paletteN` bridge to the same
	 * per-palette value, so content that reads the numbered bridge (including the WordPress preset color classes
	 * redirected to it by {@see global_palette_overrides()}) swaps alongside the `--kb-token--*` vars.
	 *
	 * @since TBD
	 *
	 * @param string $active The active library slug.
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

		$slots    = $this->palette_slot_vars();
		$palettes = [];

		foreach ( $ids as $id ) {
			$declarations = [];

			foreach ( array_keys( $changed ) as $var ) {
				if ( array_key_exists( $var, $resolved[ $id ] ) ) {
					$declarations[ $var ] = $resolved[ $id ][ $var ];

					// Also swap the numbered --global-paletteN bridge for a slot-backed color, so blocks (and the
					// WordPress preset color classes redirected to it, see global_palette_overrides()) that read the
					// numbered bridge follow the palette too — not only content reading --kb-token--* directly.
					if ( isset( $slots[ $var ] ) ) {
						$declarations[ '--global-' . $slots[ $var ] ] = $resolved[ $id ][ $var ];
					}
				}
			}

			if ( $declarations !== [] ) {
				$palettes[ $id ] = $declarations;
			}
		}

		return $palettes;
	}

	/**
	 * The palette-slot tokens' css vars mapped to their slot slug (e.g.
	 * `--kb-token--primitive--color--brand--secondary` => `palette2`), so palettes_for() can bridge each slot's
	 * per-palette value onto the numbered `--global-paletteN` variable. Skips any non-palette `kadence_slot`
	 * (e.g. a font-size slot).
	 *
	 * @since TBD
	 *
	 * @return array<string, string> css var => slot slug.
	 */
	private function palette_slot_vars(): array {
		$slots = [];

		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );

			if ( $slot === null ) {
				continue;
			}

			$slots[ $token->css_var ] = $slot->slug;
		}

		return $slots;
	}

	/**
	 * Static CSS that redirects a Kadence block's WordPress preset color classes — `has-<slug>-color` and
	 * `has-<slug>-background-color` — to the numbered `--global-paletteN` variable.
	 *
	 * The selector is scoped to Kadence's own classes (`[class*="kadence-"]`), so only our own blocks are affected
	 * — core and third-party blocks keep reading WordPress's untouched global `--wp--preset--color--*` variables.
	 * The broad `kadence-` match (not `wp-block-kadence-`) is deliberate: on the front end the preset class and the
	 * block's `wp-block-kadence-*` class share one element, but in the editor the preset class lands on an inner
	 * heading that carries a `kadence-*` class without the `wp-block-kadence-*` wrapper class. The `:root` prefix
	 * adds specificity, enough to beat both the front-end preset rule and the editor's zero-specificity
	 * `:where(.editor-styles-wrapper)`-scoped copy of it.
	 *
	 * The baseline is unchanged. At `:root`, `--global-paletteN` already equals the color WordPress provides for
	 * that slot (Kadence feeds both from the same palette). Inside a `[data-kb-palette]` subtree the numbered
	 * bridge is re-declared (see palettes_for()), so the redirected color follows the per-block palette.
	 *
	 * Why that subtree re-declaration is needed depends on the theme. On a non-Kadence theme `--global-paletteN`
	 * is itself a `var(--kb-token--*)` reference (set by the Css_Var Legacy_Filter_Bridge), so it already
	 * re-resolves against a subtree's re-declared token on its own — the re-declaration there is a harmless
	 * redundancy. Under the Kadence theme `--global-paletteN` is a fixed customizer literal with no token
	 * reference (and Legacy_Filter_Bridge is a no-op), so re-declaring it in palettes_for() is what makes it swap.
	 *
	 * Both slug schemes map to the same bridge: the plugin's own `palette-N` and the Kadence theme's
	 * `theme-palette-N`. The `theme-palette-N` selectors are simply inert on other themes.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function global_palette_overrides(): string {
		$css = '';

		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );

			if ( $slot === null ) {
				continue;
			}

			// WordPress kebab-cases the stored slug ("palette2") for the class/var name ("palette-2").
			$kebab = preg_replace( '/([a-z])(\d)/', '$1-$2', $slot->slug );

			if ( ! is_string( $kebab ) ) {
				continue;
			}

			$var   = 'var(--global-' . $slot->slug . ')';
			$scope = ':root [class*="kadence-"]';

			foreach ( [ $kebab, 'theme-' . $kebab ] as $class_slug ) {
				$css .= $scope . '.has-' . $class_slug . '-color{color:' . $var . ' !important;}';
				$css .= $scope . '.has-' . $class_slug . '-background-color{background-color:' . $var . ' !important;}';
			}
		}

		return $css;
	}
}
