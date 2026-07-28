<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

/**
 * Reads the effective colorPalettes section: the shipped baseline's palettes deep-merged with a set's stored
 * overrides, so a palette authored through the store is visible alongside the baseline ones.
 *
 * A thin reader mirroring {@see Effective_Variants}: the deep-merge is {@see Mutator::merge()} (which
 * preserves the whole "$extensions" layer untouched, exactly what a palettes view needs), so this class only
 * decodes the baseline and the stored overrides, walks each down to the `$extensions...colorPalettes`
 * subtree, and delegates the merge. The sibling {@see Effective_Document} deliberately strips "$extensions",
 * so it cannot be reused here — palettes are read through this seam instead.
 *
 * Beyond the raw section it exposes the two things the resolver and projection need: the set's `$current`
 * pointer (which palette is active at `:root`), and a palette flattened to a `{ token => $value }` overlay
 * (its groups' swatches collapsed) so the resolver can re-tint the color tokens before alias flattening.
 *
 * @since TBD
 */
final class Effective_Palettes {

	/**
	 * @var Baseline_Document The shipped baseline the palette definitions are merged onto.
	 *
	 * @since TBD
	 */
	private Baseline_Document $baseline;

	/**
	 * @var Token_Store The gateway the stored overrides are read from.
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * @var Mutator The pure deep-merge the baseline and overrides palettes are combined through.
	 *
	 * @since TBD
	 */
	private Mutator $mutator;

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document $baseline The shipped baseline document.
	 * @param Token_Store       $store    The persistence gateway.
	 * @param Mutator           $mutator  The pure deep-merge.
	 */
	public function __construct( Baseline_Document $baseline, Token_Store $store, Mutator $mutator ) {
		$this->baseline = $baseline;
		$this->store    = $store;
		$this->mutator  = $mutator;
	}

	/**
	 * The effective colorPalettes section for a stored set: baseline deep-merged with the set's overrides,
	 * keyed by palette id (plus the `$default` / `$current` pointers).
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>
	 */
	public function section( string $slug = 'default' ): array {
		return $this->for_overrides( $this->raw( $slug ) );
	}

	/**
	 * The effective palette node for one palette id in a stored set, or null when neither the baseline nor
	 * the overrides define it.
	 *
	 * @since TBD
	 *
	 * @param string $id   The palette id, e.g. "default", "dark".
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>|null
	 */
	public function palette( string $id, string $slug = 'default' ): ?array {
		$section = $this->section( $slug );

		return isset( $section[ $id ] ) && is_array( $section[ $id ] ) ? $section[ $id ] : null;
	}

	/**
	 * The effective colorPalettes section for an arbitrary candidate overrides document: the baseline
	 * palettes deep-merged with the candidate's colorPalettes subtree. Used to validate a write against its
	 * post-merge effective section before it is committed (e.g. that `$current` still names a present palette).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, mixed>
	 */
	public function for_overrides( array $overrides ): array {
		return $this->mutator->merge( $this->palettes_of( $this->baseline->document() ), $this->palettes_of( $overrides ) );
	}

	/**
	 * The named palette ids a set defines (every key except the `$default` / `$current` pointers), in order.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return string[]
	 */
	public function palette_ids( string $slug = 'default' ): array {
		$ids = [];

		foreach ( array_keys( $this->section( $slug ) ) as $key ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$ids[] = (string) $key;
		}

		return $ids;
	}

	/**
	 * The set's `$default` palette id (the shipped/fallback palette), falling back to "default".
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return string
	 */
	public function default_palette( string $slug = 'default' ): string {
		return $this->pointer_of( $this->section( $slug ), Extensions::get_default_key() );
	}

	/**
	 * The set's `$current` (active) palette id — the palette the resolver applies at `:root`. Falls back to
	 * the `$default` pointer, then to "default", and only ever returns an id that names a present palette.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return string
	 */
	public function current( string $slug = 'default' ): string {
		return $this->current_of( $this->section( $slug ) );
	}

	/**
	 * A palette flattened to a `{ token => $value }` overlay: every swatch across the palette's groups,
	 * keyed by the color-token dot-path it sets. A swatch whose `$value` is a RESET sentinel (null under
	 * `$value`) is omitted, so the token keeps its baseline value. Empty when the palette is absent.
	 *
	 * @since TBD
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, string> token dot-path => literal-or-alias value.
	 */
	public function swatch_values( string $id, string $slug = 'default' ): array {
		return $this->swatch_values_of( $this->section( $slug ), $id );
	}

	/**
	 * The effective `{ token => $value }` colors for a palette: the set's default palette overlaid with the
	 * palette's own swatches, so a palette that stores only deltas resolves to a COMPLETE color set (its
	 * deltas plus the default for everything it omits). This is what the per-block switch layer emits, so an
	 * override fully re-skins a subtree with default fallback regardless of the set's current palette.
	 *
	 * @since TBD
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, string> token dot-path => literal-or-alias value.
	 */
	public function effective_swatch_values( string $id, string $slug = 'default' ): array {
		$section = $this->section( $slug );
		$default = $this->swatch_values_of( $section, $this->pointer_of( $section, Extensions::get_default_key() ) );

		return array_merge( $default, $this->swatch_values_of( $section, $id ) );
	}

	/**
	 * The `{ token => $value }` overlay for the set's `$current` palette — the color re-tint the resolver
	 * applies at `:root`.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, string>
	 */
	public function current_swatch_values( string $slug = 'default' ): array {
		return $this->current_swatch_values_for_section( $this->section( $slug ) );
	}

	/**
	 * The `$current` palette overlay computed directly from an already-decoded overrides document, without a
	 * second store read: the baseline palettes deep-merged with the candidate, its `$current` resolved, then
	 * flattened. The resolver uses this so the overlay reads the SAME document it is resolving.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, string>
	 */
	public function current_swatch_values_for_overrides( array $overrides ): array {
		return $this->current_swatch_values_for_section( $this->for_overrides( $overrides ) );
	}

	/**
	 * The resolve-time color overlay for a set: the set's `$current` palette swatches that DIFFER from the
	 * baseline default palette (which carries the shipped baseline colors). Returning only the diff makes the
	 * overlay non-destructive — with the shipped default palette and no palette edits it is empty, so a color
	 * token that is otherwise unchanged (or carries a direct override) is left untouched; a non-default palette
	 * or an edited swatch contributes exactly the tokens it re-tints.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, string> token dot-path => re-tint value.
	 */
	public function overlay_for_overrides( array $overrides ): array {
		return $this->diff_against_baseline( $this->current_swatch_values_for_overrides( $overrides ) );
	}

	/**
	 * The resolve-time color overlay for a SPECIFIC palette (not the set's current): the palette's effective
	 * colors (default overlaid with its deltas) that differ from the baseline default. Used to resolve the
	 * whole token graph "as if this palette were active", which the per-block switch layer emits so an
	 * override fully re-skins its subtree.
	 *
	 * @since TBD
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, string> token dot-path => re-tint value.
	 */
	public function overlay_for_palette( string $id, string $slug = 'default' ): array {
		return $this->diff_against_baseline( $this->effective_swatch_values( $id, $slug ) );
	}

	/**
	 * Reduce a `{ token => value }` map to the entries that differ from the baseline default palette.
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $values token => value.
	 *
	 * @return array<string, string>
	 */
	private function diff_against_baseline( array $values ): array {
		$baseline = $this->baseline_default_swatch_values();
		$overlay  = [];

		foreach ( $values as $token => $value ) {
			if ( array_key_exists( $token, $baseline ) && $baseline[ $token ] === $value ) {
				continue;
			}

			$overlay[ $token ] = $value;
		}

		return $overlay;
	}

	/**
	 * Decode a set's stored overrides document, tolerating an absent/empty/malformed row as "no overrides".
	 * The single decode seam for the stored overrides, mirroring {@see Effective_Variants::raw()}.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>
	 */
	public function raw( string $slug = 'default' ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * The baseline `$default` palette flattened to a `{ token => $value }` map — the shipped baseline color
	 * values, the reference the resolve-time overlay diffs against.
	 *
	 * @since TBD
	 *
	 * @return array<string, string>
	 */
	private function baseline_default_swatch_values(): array {
		$section = $this->palettes_of( $this->baseline->document() );

		return $this->swatch_values_of( $section, $this->pointer_of( $section, Extensions::get_default_key() ) );
	}

	/**
	 * The `$current` palette overlay for an effective section: resolve its `$current` pointer, then flatten
	 * that palette's swatches.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section The effective colorPalettes section.
	 *
	 * @return array<string, string>
	 */
	private function current_swatch_values_for_section( array $section ): array {
		return $this->swatch_values_of( $section, $this->current_of( $section ) );
	}

	/**
	 * The `$current` (active) palette id for an effective section, falling back to `$default`, then "default".
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section The effective colorPalettes section.
	 *
	 * @return string
	 */
	private function current_of( array $section ): string {
		$current = $section[ Extensions::get_current_key() ] ?? null;

		if ( is_string( $current ) && isset( $section[ $current ] ) && is_array( $section[ $current ] ) ) {
			return $current;
		}

		return $this->pointer_of( $section, Extensions::get_default_key() );
	}

	/**
	 * Flatten a palette within an effective section to a `{ token => $value }` overlay. A swatch that names
	 * no token, or carries no non-empty scalar `$value` (e.g. a RESET), is skipped. Empty when the palette is
	 * absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section The effective colorPalettes section.
	 * @param string               $id      The palette id.
	 *
	 * @return array<string, string>
	 */
	private function swatch_values_of( array $section, string $id ): array {
		$palette = $section[ $id ] ?? null;

		if ( ! is_array( $palette ) ) {
			return [];
		}

		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();
		$value_key    = Sentinels::get_value_key();

		$groups = $palette[ Extensions::get_groups_key() ] ?? [];

		if ( ! is_array( $groups ) ) {
			return [];
		}

		$values = [];

		foreach ( $groups as $group ) {
			if ( ! is_array( $group ) || ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] ) ) {
				continue;
			}

			foreach ( $group[ $swatches_key ] as $swatch ) {
				if ( ! is_array( $swatch ) ) {
					continue;
				}

				$token = $swatch[ $token_key ] ?? null;
				$value = $swatch[ $value_key ] ?? null;

				// A swatch must name a token and carry a non-reset scalar value; a RESET ($value: null) or a
				// malformed swatch is skipped so the token keeps its baseline value.
				if ( ! is_string( $token ) || $token === '' || ! is_string( $value ) || $value === '' ) {
					continue;
				}

				$values[ $token ] = $value;
			}
		}

		return $values;
	}

	/**
	 * The pointer value (`$default` or `$current`) in an effective section, when it is a string naming a
	 * present palette; otherwise the set's default slug ("default").
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section The effective colorPalettes section.
	 * @param string               $key     The pointer key.
	 *
	 * @return string
	 */
	private function pointer_of( array $section, string $key ): string {
		$value = $section[ $key ] ?? null;

		if ( is_string( $value ) && isset( $section[ $value ] ) && is_array( $section[ $value ] ) ) {
			return $value;
		}

		return Token_Store::default_slug();
	}

	/**
	 * Walk a decoded document down to its `$extensions...colorPalettes` subtree, or an empty array when
	 * absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded document.
	 *
	 * @return array<string, mixed>
	 */
	private function palettes_of( array $document ): array {
		$node = $document;

		foreach ( Extensions::get_color_palettes_path() as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
