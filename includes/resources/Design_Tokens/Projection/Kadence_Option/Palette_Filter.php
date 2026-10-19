<?php declare( strict_types=1 );
// cspell:ignore palette subkey .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use RuntimeException;

/**
 * Answers the Kadence theme's palette reads with resolved token colors.
 *
 * The theme emits --global-palette1…15 (and every other palette read) through
 * kadence()->palette_option(), which ends in the kadence_palette_option filter. Hooking that filter
 * makes tokens win wherever the theme renders a palette color while the stored kadence_global_palette
 * option — the user's Style Guide — is never written. That keeps the Style Guide intact as the source
 * the token baseline reads from, so resetting a token gives the user their own color back, and it
 * works for whichever palette set (palette / second-palette / third-palette) the theme has active,
 * because the filter runs after the theme picked the set.
 *
 * The filter only receives the slot, not the set, so a read for a set other than the saved active one
 * (Kadence Pro's dark mode asks for second-palette while the site renders palette) is told apart by its
 * value: it does not match the color the active set has saved for that slot, and is left untouched.
 *
 * A literal color is returned rather than a var(--kb-token--…) reference: the theme passes this value
 * through hex2rgb() in places, and a var() reference cannot be converted that way.
 *
 * Known limit: the Customizer live preview never reaches this filter. The theme registers the palette
 * setting with postMessage transport and its preview script writes the control value straight onto
 * --global-paletteN, so while a palette color is being edited the preview shows the theme's own color
 * even for a slot a token overrides. The token color is back on the next full page load.
 *
 * Fail-open: a corrupt stored document (alias cycle / dangling alias) leaves every read untouched.
 * Gated on Token_Registry::is_active() so the fail-closed guard is honored.
 *
 * @since 3.8.0
 */
final class Palette_Filter {

	/**
	 * The token registry.
	 *
	 * @since 3.8.0
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The token resolver.
	 *
	 * @since 3.8.0
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Owns the active-library pointer, read at filter time so the projected colors follow the active library.
	 *
	 * @since 3.8.0
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * Supplies the color the active palette set has saved for a slot.
	 *
	 * @since 3.8.0.1
	 *
	 * @var Style_Guide_Overlay
	 */
	private Style_Guide_Overlay $overlay;

	/**
	 * Builds the slug => { color, name } map from the resolved tokens.
	 *
	 * @since 3.8.0
	 *
	 * @var Palette_Builder
	 */
	private Palette_Builder $builder;

	/**
	 * Per-request memo of slug => { color, name }. Null until first built; cleared when any input it is
	 * built from changes: a token write, an active-library switch, or a change to the theme's Style Guide.
	 *
	 * @since 3.8.0
	 *
	 * @var array<string, array{color: string, name: string}>|null
	 */
	private ?array $entries = null;

	/**
	 * @since 3.8.0
	 *
	 * @param Token_Registry             $registry The token registry.
	 * @param Token_Resolver             $resolver The token resolver.
	 * @param Active_Token_Library_Store $active   The active-library pointer.
	 * @param Palette_Builder            $builder  The palette entries builder.
	 * @param Style_Guide_Overlay        $overlay  The Style Guide overlay.
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Active_Token_Library_Store $active,
		Palette_Builder $builder,
		Style_Guide_Overlay $overlay
	) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->active   = $active;
		$this->builder  = $builder;
		$this->overlay  = $overlay;
	}

	/**
	 * Return the resolved token color for a palette slot a token claims, or the theme's own value.
	 *
	 * @since 3.8.0
	 *
	 * @param mixed $value  The value the theme resolved for this slot.
	 * @param mixed $subkey The slot being read, e.g. "palette1". Not type-hinted because the theme
	 *                      applies the filter with whatever it was called with.
	 *
	 * @return mixed The token color for a claimed slot, otherwise the theme's value untouched.
	 */
	public function filter( $value, $subkey ) {
		if ( ! is_string( $subkey ) || ! $this->registry->is_active() ) {
			return $value;
		}

		$entries = $this->entries();

		if ( ! isset( $entries[ $subkey ] ) || $this->is_other_palette_set( $value, $subkey ) ) {
			return $value;
		}

		return $entries[ $subkey ]['color'];
	}

	/**
	 * Drop the per-request memo so a change made in this request is visible to later palette reads in the
	 * same request. Bound to every input the memo is built from: the store's changed action, the
	 * active-library pointer's, the theme's palette option hooks and the Customizer preview init.
	 *
	 * @since 3.8.0
	 *
	 * @return void
	 */
	public function on_tokens_changed(): void {
		$this->entries = null;
	}

	/**
	 * Whether the theme resolved this slot from a palette set other than the saved active one.
	 *
	 * The theme hands the filter the color it read for the slot. For the active set that is exactly the
	 * color saved in kadence_global_palette, so a different value means another set was requested.
	 * Unknown when the active set has no color for the slot (or the theme is not readable), which is not
	 * treated as a mismatch.
	 *
	 * Known limit: a slot saved with the same color in both sets is indistinguishable, so it still gets
	 * the token color.
	 *
	 * @since 3.8.0.1
	 *
	 * @param mixed  $value  The value the theme resolved for the slot.
	 * @param string $subkey The slot being read.
	 *
	 * @return bool
	 */
	private function is_other_palette_set( $value, string $subkey ): bool {
		$saved = $this->overlay->active_palette()[ $subkey ] ?? null;

		if ( $saved === null || ! is_string( $value ) ) {
			return false;
		}

		return strtolower( trim( $value ) ) !== strtolower( trim( $saved ) );
	}

	/**
	 * The slug => { color, name } map for the active library, built once per request.
	 *
	 * @since 3.8.0
	 *
	 * @return array<string, array{color: string, name: string}>
	 */
	private function entries(): array {
		if ( $this->entries !== null ) {
			return $this->entries;
		}

		// Not memoized: declarations register on init:0, and the theme reads the palette earlier than that
		// (the Customizer and the theme's own CSS both call palette_option()). Caching the empty map here
		// would answer every later read in the request with the theme's value, so a token override would
		// silently do nothing.
		//
		// Reads that early still get the theme's own color, not the token's. The theme fills its
		// editor-color-palette theme support from palette_option() on after_setup_theme, so those entries
		// carry the raw Style Guide colors, and the plugin's load_color_palette() (after_setup_theme:999)
		// merges them into its own palette as-is. The block editor does not show them: the theme's
		// theme.json defines the same slugs as var(--global-paletteN), which this filter feeds once the
		// declarations are in, and theme.json wins over the theme support by slug.
		if ( ! $this->builder->has_palette_tokens() ) {
			return [];
		}

		try {
			$resolved = $this->resolver->resolve( $this->active->get() );
		} catch ( RuntimeException $e ) {
			// A corrupt stored document must not break the theme's CSS. Memoize the empty result so the
			// fifteen palette reads on a page do not each re-attempt the failing resolve.
			$this->entries = [];

			return $this->entries;
		}

		$this->entries = $this->builder->entries( $resolved );

		return $this->entries;
	}
}
