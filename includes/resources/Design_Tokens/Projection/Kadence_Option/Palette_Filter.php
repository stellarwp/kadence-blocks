<?php declare( strict_types=1 );
// cspell:ignore palette subkey .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
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
 * A literal color is returned rather than a var(--kb-token--…) reference: the theme passes this value
 * through hex2rgb() in places and the Customizer live preview writes it straight into CSS.
 *
 * Fail-open: a corrupt stored document (alias cycle / dangling alias) leaves every read untouched.
 * Gated on Token_Registry::is_active() so the fail-closed guard is honored.
 *
 * @since TBD
 */
final class Palette_Filter {

	/**
	 * The token registry.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The token resolver.
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Owns the active-library pointer, read at filter time so the projected colors follow the active library.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * Builds the slug => { color, name } map from the resolved tokens.
	 *
	 * @since TBD
	 *
	 * @var Palette_Builder
	 */
	private Palette_Builder $builder;

	/**
	 * Per-request memo of slug => { color, name }. Null until first built; cleared on a token write.
	 *
	 * @since TBD
	 *
	 * @var array<string, array{color: string, name: string}>|null
	 */
	private ?array $entries = null;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry             $registry The token registry.
	 * @param Token_Resolver             $resolver The token resolver.
	 * @param Active_Token_Library_Store $active   The active-library pointer.
	 * @param Palette_Builder            $builder  The palette entries builder.
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Active_Token_Library_Store $active,
		Palette_Builder $builder
	) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->active   = $active;
		$this->builder  = $builder;
	}

	/**
	 * Return the resolved token color for a palette slot a token claims, or the theme's own value.
	 *
	 * @since TBD
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

		return isset( $entries[ $subkey ] ) ? $entries[ $subkey ]['color'] : $value;
	}

	/**
	 * Drop the per-request memo so a token written in this request is visible to later palette reads
	 * in the same request. Bound to the store's changed action.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function on_tokens_changed(): void {
		$this->entries = null;
	}

	/**
	 * The slug => { color, name } map for the active library, built once per request.
	 *
	 * @since TBD
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
