<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Path;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Complement_Color;

/**
 * Reads the effective colorPalettes section: the shipped baseline's palettes deep-merged with a library's stored
 * overrides, so a palette authored through the store is visible alongside the baseline ones.
 *
 * A thin reader mirroring {@see Effective_Presets}: the deep-merge is {@see Mutator::merge()} (which
 * preserves the whole "$extensions" layer untouched, exactly what a palettes view needs), so this class only
 * decodes the baseline and the stored overrides, walks each down to the `$extensions...colorPalettes`
 * subtree, and delegates the merge. The sibling {@see Effective_Document} deliberately strips "$extensions",
 * so it cannot be reused here — palettes are read through this seam instead.
 *
 * One thing is deliberately NOT merged: a palette's `groups`. A stored palette node owns its structure
 * outright and REPLACES the baseline's list rather than being merged onto it, because the merge descends
 * lists positionally and would otherwise leave the baseline's tail entries behind whenever a stored list is
 * shorter. See {@see without_superseded_groups()} for the failure that guards against.
 *
 * Beyond the raw section it exposes the two things the resolver and projection need: the library's `$current`
 * pointer (which palette is active at `:root`), and a palette flattened to a `{ token => $value }` overlay
 * (its groups' swatches collapsed) so the resolver can re-tint the color tokens before alias flattening.
 *
 * @since 3.8.0
 */
final class Effective_Palettes {

	/**
	 * The swatch the complement is worked out from: the theme's palette1.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRIMARY_TOKEN = 'primitive.color.brand.primary';

	/**
	 * The swatch for the theme's complement color, palette10.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const COMPLEMENT_TOKEN = 'primitive.color.extended.complement';

	/**
	 * @var Baseline_Document The shipped baseline the palette definitions are merged onto.
	 *
	 * @since 3.8.0
	 */
	private Baseline_Document $baseline;

	/**
	 * @var Token_Store The gateway the stored overrides are read from.
	 *
	 * @since 3.8.0
	 */
	private Token_Store $store;

	/**
	 * @var Mutator The pure deep-merge the baseline and overrides palettes are combined through.
	 *
	 * @since 3.8.0
	 */
	private Mutator $mutator;

	/**
	 * @since 3.8.0
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
	 * The effective colorPalettes section for a stored library: baseline deep-merged with the library's overrides,
	 * keyed by palette id (plus the `$default` / `$current` pointers).
	 *
	 * @since 3.8.0
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	public function section( string $slug = 'default' ): array {
		return $this->for_overrides( $this->raw( $slug ) );
	}

	/**
	 * The effective palette node for one palette id in a stored library, or null when neither the baseline nor
	 * the overrides define it.
	 *
	 * @since 3.8.0
	 *
	 * @param string $id   The palette id, e.g. "default", "dark".
	 * @param string $slug The token library slug.
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
	 * @since 3.8.0
	 * @since TBD Adds back shipped swatches a saved default palette is missing.
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, mixed>
	 */
	public function for_overrides( array $overrides ): array {
		$baseline = $this->palettes_of( $this->baseline->document() );
		$stored   = $this->palettes_of( $overrides );
		$section  = $this->mutator->merge( $this->without_superseded_groups( $baseline, $stored ), $stored );

		return $this->with_missing_baseline_swatches( $section, $baseline );
	}

	/**
	 * The named palette ids a library defines (every key except the `$default` / `$current` pointers), in order.
	 *
	 * @since 3.8.0
	 *
	 * @param string $slug The token library slug.
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
	 * The palette ids a library defines that are NOT in the baseline — i.e. the user-created ones.
	 * An id that shadows a baseline palette is excluded, since deleting it reverts that palette to
	 * baseline rather than removing it.
	 *
	 * @since 3.8.0
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string[]
	 */
	public function user_created( string $slug = 'default' ): array {
		$baseline_ids = [];

		foreach ( array_keys( $this->palettes_of( $this->baseline->document() ) ) as $key ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$baseline_ids[] = (string) $key;
		}

		return array_values( array_diff( $this->palette_ids( $slug ), $baseline_ids ) );
	}

	/**
	 * The library's `$default` palette id (the shipped/fallback palette), falling back to "default".
	 *
	 * @since 3.8.0
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string
	 */
	public function default_palette( string $slug = 'default' ): string {
		return $this->pointer_of( $this->section( $slug ), Extensions::get_default_key() );
	}

	/**
	 * The library's `$current` (active) palette id — the palette the resolver applies at `:root`. Falls back to
	 * the `$default` pointer, then to "default", and only ever returns an id that names a present palette.
	 *
	 * @since 3.8.0
	 *
	 * @param string $slug The token library slug.
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
	 * Reads the EFFECTIVE section, so it is neither the full color set nor what the palette stores. For a
	 * complete set use {@see complete_swatch_values()}; to ask what a palette actually stores use
	 * {@see stored_swatch_values()}.
	 *
	 * @since 3.8.0
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, string> token dot-path => literal-or-alias value.
	 */
	public function swatch_values( string $id, string $slug = 'default' ): array {
		return $this->swatch_values_of( $this->section( $slug ), $id );
	}

	/**
	 * The effective `{ token => $value }` colors for a palette: the library's default palette overlaid with the
	 * palette's own swatches, so a palette that stores only deltas resolves to a COMPLETE color set (its
	 * deltas plus the default for everything it omits). This is what the per-block switch layer emits, so an
	 * override fully re-skins a subtree with default fallback regardless of the library's current palette.
	 *
	 * @since 3.8.0
	 * @since TBD Works the complement out from the palette's primary when it follows the theme.
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, string> token dot-path => literal-or-alias value.
	 */
	public function effective_swatch_values( string $id, string $slug = 'default' ): array {
		$section    = $this->section( $slug );
		$default_id = $this->pointer_of( $section, Extensions::get_default_key() );
		$default    = $this->swatch_values_of( $section, $default_id );
		$stored     = array_merge( $this->stored_swatch_values( $default_id, $slug ), $this->stored_swatch_values( $id, $slug ) );

		return $this->with_derived_complement( array_merge( $default, $this->swatch_values_of( $section, $id ) ), $stored, $this->raw( $slug ) );
	}

	/**
	 * The `{ token => $value }` overlay for the library's `$current` palette — the color re-tint the resolver
	 * applies at `:root`.
	 *
	 * @since 3.8.0
	 * @since TBD Works the complement out from the palette's primary when it follows the theme.
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, string>
	 */
	public function current_swatch_values( string $slug = 'default' ): array {
		return $this->current_swatch_values_for_section( $this->section( $slug ), $this->raw( $slug ) );
	}

	/**
	 * The `$current` palette overlay computed directly from an already-decoded overrides document, without a
	 * second store read: the baseline palettes deep-merged with the candidate, its `$current` resolved, then
	 * flattened. The resolver uses this so the overlay reads the SAME document it is resolving.
	 *
	 * @since 3.8.0
	 * @since TBD Works the complement out from the palette's primary when it follows the theme.
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, string>
	 */
	public function current_swatch_values_for_overrides( array $overrides ): array {
		return $this->current_swatch_values_for_section( $this->for_overrides( $overrides ), $overrides );
	}

	/**
	 * The resolve-time color overlay for a library: the library's `$current` palette swatches that DIFFER from the
	 * baseline default palette (which carries the shipped baseline colors). Returning only the diff makes the
	 * overlay non-destructive — with the shipped default palette and no palette edits it is empty, so a color
	 * token that is otherwise unchanged (or carries a direct override) is left untouched; a non-default palette
	 * or an edited swatch contributes exactly the tokens it re-tints.
	 *
	 * @since 3.8.0
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, string> token dot-path => re-tint value.
	 */
	public function overlay_for_overrides( array $overrides ): array {
		return $this->diff_against_baseline( $this->current_swatch_values_for_overrides( $overrides ) );
	}

	/**
	 * The resolve-time color overlay for a SPECIFIC palette (not the library's current): the palette's effective
	 * colors (default overlaid with its deltas) that differ from the baseline default. Used to resolve the
	 * whole token graph "as if this palette were active", which the per-block switch layer emits so an
	 * override fully re-skins its subtree.
	 *
	 * @since 3.8.0
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, string> token dot-path => re-tint value.
	 */
	public function overlay_for_palette( string $id, string $slug = 'default' ): array {
		return $this->diff_against_baseline( $this->effective_swatch_values( $id, $slug ) );
	}

	/**
	 * Decode a library's stored overrides document, tolerating an absent/empty/malformed row as "no overrides".
	 * The single decode seam for the stored overrides, mirroring {@see Effective_Presets::raw()}.
	 *
	 * @since 3.8.0
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	public function raw( string $slug = 'default' ): array {
		return $this->store->get_decoded_document( $slug );
	}

	/**
	 * The baseline `$default` palette flattened to a `{ token => $value }` map, independent of any stored
	 * library. The baseline it reads is the decorated one, so on a Kadence site these are the theme's Style
	 * Guide colors (see `Theme_Style_Guide_Baseline_Document`), not the hex values the plugin ships; without
	 * a Kadence theme they are the shipped values.
	 *
	 * Both halves are load-bearing. Its KEYS are the permanent swatch set, whose rows a palette write may
	 * never drop; its VALUES are what a delete reverts one of those swatches to — the theme's color on a
	 * Kadence site, the shipped color elsewhere. No other method can answer either question:
	 * {@see Baseline_Document::has()} indexes only the primitive/semantic token layers and deliberately
	 * skips "$extensions", so it never sees a palette swatch at all.
	 *
	 * Returned whole rather than behind a per-token predicate because every caller needs the values too,
	 * or walks the whole set — and the flatten re-walks the baseline document, so a predicate would redo it
	 * once per swatch.
	 *
	 * @since 3.8.0
	 *
	 * @return array<string, string> token dot-path => the baseline literal-or-alias value.
	 */
	public function baseline_swatch_values(): array {
		$section = $this->palettes_of( $this->baseline->document() );

		return $this->swatch_values_of( $section, $this->pointer_of( $section, Extensions::get_default_key() ) );
	}

	/**
	 * The `{ token => $value }` colors a palette ACTUALLY STORES, read straight from the overrides document
	 * with no baseline merge behind it. This is the "has its own value" question, and it is not the same as
	 * {@see swatch_values()}: the default palette also lives in the baseline, so its effective node carries
	 * every shipped swatch whether or not the site has ever edited one.
	 *
	 * The default palette stores only the swatches it changes — a swatch left at the baseline keeps its row
	 * but drops `$value`, so the token follows whatever the baseline resolves to (on a Kadence site, the
	 * theme's Style Guide). Reading the effective node instead would report every one of those as stored.
	 *
	 * @since 3.8.0
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, string> token dot-path => the stored literal-or-alias value.
	 */
	public function stored_swatch_values( string $id, string $slug = 'default' ): array {
		return $this->swatch_values_of( $this->palettes_of( $this->raw( $slug ) ), $id );
	}

	/**
	 * A palette's COMPLETE color set: the shipped baseline colors, overlaid with the library default palette's
	 * own swatches, overlaid with the palette's. Every baseline token resolves to a value here, which
	 * {@see swatch_values()} and {@see effective_swatch_values()} no longer guarantee — a swatch the default
	 * palette leaves at the baseline stores no `$value` at all.
	 *
	 * Use this wherever a caller needs the color a token WILL render as. Use the sparser accessors only to ask
	 * what a palette stores.
	 *
	 * @since 3.8.0
	 *
	 * @param string $id   The palette id.
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, string> token dot-path => literal-or-alias value.
	 */
	public function complete_swatch_values( string $id, string $slug = 'default' ): array {
		return array_merge( $this->baseline_swatch_values(), $this->effective_swatch_values( $id, $slug ) );
	}

	/**
	 * The complement swatch's token dot-path.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_complement_token(): string {
		return self::COMPLEMENT_TOKEN;
	}

	/**
	 * Whether the shipped complement is worked out from the shipped primary. On a Kadence site that uses the
	 * theme's complement color the Style Guide gives both, so they match; with a palette10 color of its own,
	 * or without the theme, they don't and the complement is left alone.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function derives_complement(): bool {
		$baseline = $this->baseline_swatch_values();
		$primary  = $baseline[ self::PRIMARY_TOKEN ] ?? null;

		return is_string( $primary ) && ( $baseline[ self::COMPLEMENT_TOKEN ] ?? null ) === Complement_Color::of( $primary );
	}

	/**
	 * Whether a complement swatch value is just the one worked out from the palette's primary color, so it
	 * follows the primary rather than being a color of its own. Always false unless the shipped complement
	 * is itself worked out from the shipped primary, which is the case on a Kadence site using the theme's
	 * complement color.
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $values token dot-path => value, for one palette.
	 *
	 * @return bool
	 */
	public function is_derived_complement( array $values ): bool {
		$complement = $values[ self::COMPLEMENT_TOKEN ] ?? null;
		$primary    = $values[ self::PRIMARY_TOKEN ] ?? null;

		return $this->derives_complement() && is_string( $complement ) && is_string( $primary ) && $complement === Complement_Color::of( $primary );
	}

	/**
	 * Strip the `groups` list from every baseline palette node the overrides also define groups for, so the
	 * stored list REPLACES the baseline's instead of being merged onto it.
	 *
	 * {@see Mutator::merge()} descends a `groups` / `swatches` list as a group, merging the two lists
	 * POSITIONALLY — only an individual swatch is a leaf (it carries "$value") and replaces wholesale. The
	 * default palette is in the baseline and stores every swatch, so any write that SHRINKS it (removing a
	 * swatch, removing a group) leaves the baseline's tail entries un-overwritten: the removed swatch
	 * reappears as a duplicate of its successor, and the duplicate then fails the palette write's own
	 * no-repeated-token guard, wedging every later save.
	 *
	 * Dropping the baseline `groups` first makes the stored structure authoritative, which is what it
	 * already is everywhere else — the palette write assembles a complete node and
	 * {@see Palettes_Controller::write_palette_node()} removes-then-merges for exactly this reason one
	 * layer down. Sibling keys (`label`) still merge normally, and a baseline palette the overrides only
	 * relabel keeps its baseline groups.
	 *
	 * @since 3.8.0
	 *
	 * @param array<string, mixed> $baseline The baseline colorPalettes section.
	 * @param array<string, mixed> $stored   The stored overrides' colorPalettes section.
	 *
	 * @return array<string, mixed> The baseline section with superseded groups lists removed.
	 */
	private function without_superseded_groups( array $baseline, array $stored ): array {
		$groups_key = Extensions::get_groups_key();

		foreach ( $stored as $id => $node ) {
			if ( ! is_array( $node ) || ! isset( $node[ $groups_key ] ) || ! is_array( $node[ $groups_key ] ) ) {
				continue;
			}

			if ( isset( $baseline[ $id ] ) && is_array( $baseline[ $id ] ) ) {
				unset( $baseline[ $id ][ $groups_key ] );
			}
		}

		return $baseline;
	}

	/**
	 * Add back any shipped swatch the default palette's stored groups don't list, so a palette saved before a
	 * newer release added swatches still shows them. Without this the stored groups hide the new swatches,
	 * and every later save of the palette is refused for dropping a shipped swatch it never had.
	 *
	 * A missing swatch joins its shipped group when the stored palette still has a group with that id, and
	 * otherwise lands in a copy of that group appended after the stored ones. A shipped swatch the site moved
	 * to another group is already listed, so it is left where it is.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section  The effective colorPalettes section.
	 * @param array<string, mixed> $baseline The baseline colorPalettes section.
	 *
	 * @return array<string, mixed> The section with the default palette's missing shipped swatches added.
	 */
	private function with_missing_baseline_swatches( array $section, array $baseline ): array {
		$id           = $this->pointer_of( $baseline, Extensions::get_default_key() );
		$groups_key   = Extensions::get_groups_key();
		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();
		$group_id_key = Extensions::get_group_id_key();

		$shipped_palette = $baseline[ $id ] ?? null;
		$palette         = $section[ $id ] ?? null;

		if ( ! is_array( $shipped_palette ) || ! is_array( $palette ) ) {
			return $section;
		}

		$shipped = $shipped_palette[ $groups_key ] ?? null;
		$groups  = $palette[ $groups_key ] ?? null;

		if ( ! is_array( $shipped ) || ! is_array( $groups ) ) {
			return $section;
		}

		$present = [];

		foreach ( $groups as $group ) {
			foreach ( is_array( $group ) && is_array( $group[ $swatches_key ] ?? null ) ? $group[ $swatches_key ] : [] as $swatch ) {
				if ( is_array( $swatch ) && is_string( $swatch[ $token_key ] ?? null ) ) {
					$present[ $swatch[ $token_key ] ] = true;
				}
			}
		}

		foreach ( $shipped as $shipped_group ) {
			if ( ! is_array( $shipped_group ) || ! is_array( $shipped_group[ $swatches_key ] ?? null ) ) {
				continue;
			}

			$missing = [];

			foreach ( $shipped_group[ $swatches_key ] as $swatch ) {
				if ( is_array( $swatch ) && is_string( $swatch[ $token_key ] ?? null ) && ! isset( $present[ $swatch[ $token_key ] ] ) ) {
					$missing[] = $swatch;
				}
			}

			if ( $missing === [] ) {
				continue;
			}

			foreach ( $groups as $index => $group ) {
				if ( is_array( $group ) && is_array( $group[ $swatches_key ] ?? null ) && ( $group[ $group_id_key ] ?? null ) === ( $shipped_group[ $group_id_key ] ?? null ) ) {
					$groups[ $index ][ $swatches_key ] = array_merge( $group[ $swatches_key ], $missing );

					continue 2;
				}
			}

			$shipped_group[ $swatches_key ] = $missing;
			$groups[]                       = $shipped_group;
		}

		$palette[ $groups_key ] = $groups;
		$section[ $id ]         = $palette;

		return $section;
	}

	/**
	 * Work the complement out from the palette's primary color when the theme derives it that way and the
	 * palette doesn't store a complement of its own, so overriding the primary in the Style Library moves the
	 * complement with it, as the theme's own formula does. A complement set directly in the token document is
	 * left alone too.
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $values    token dot-path => value, for one palette.
	 * @param array<string, string> $stored    token dot-path => value the palette (or the default it falls back to) stores.
	 * @param array<string, mixed>  $overrides The decoded overrides document.
	 *
	 * @return array<string, string>
	 */
	private function with_derived_complement( array $values, array $stored, array $overrides ): array {
		if ( array_key_exists( self::COMPLEMENT_TOKEN, $stored ) || Document_Path::has_value( $overrides, self::COMPLEMENT_TOKEN ) || ! $this->derives_complement() ) {
			return $values;
		}

		$primary = $this->rendered_primary( $values, $overrides );

		if ( $primary === null ) {
			return $values;
		}

		$complement = Complement_Color::of( $primary );

		if ( $complement !== null ) {
			$values[ self::COMPLEMENT_TOKEN ] = $complement;
		}

		return $values;
	}

	/**
	 * The primary color a palette renders: its own when it re-tints the primary, otherwise one set directly in
	 * the token document, which the palette overlay then leaves in place.
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $values    token dot-path => value, for one palette.
	 * @param array<string, mixed>  $overrides The decoded overrides document.
	 *
	 * @return string|null
	 */
	private function rendered_primary( array $values, array $overrides ): ?string {
		$primary = $values[ self::PRIMARY_TOKEN ] ?? null;
		$direct  = Document_Path::node_at( $overrides, self::PRIMARY_TOKEN )[ Sentinels::get_value_key() ] ?? null;

		if ( is_string( $direct ) && $primary === ( $this->baseline_swatch_values()[ self::PRIMARY_TOKEN ] ?? null ) ) {
			$primary = $direct;
		}

		return is_string( $primary ) ? $primary : null;
	}

	/**
	 * Reduce a `{ token => value }` map to the entries that differ from the baseline default palette.
	 *
	 * @since 3.8.0
	 *
	 * @param array<string, string> $values token => value.
	 *
	 * @return array<string, string>
	 */
	private function diff_against_baseline( array $values ): array {
		$baseline = $this->baseline_swatch_values();
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
	 * The `$current` palette overlay for an effective section: resolve its `$current` pointer, then flatten
	 * that palette's swatches.
	 *
	 * @since 3.8.0
	 * @since TBD Takes the overrides document and works out the complement.
	 *
	 * @param array<string, mixed> $section   The effective colorPalettes section.
	 * @param array<string, mixed> $overrides The decoded overrides document the section was built from.
	 *
	 * @return array<string, string>
	 */
	private function current_swatch_values_for_section( array $section, array $overrides ): array {
		$id     = $this->current_of( $section );
		$stored = $this->palettes_of( $overrides );
		$stored = array_merge(
			$this->swatch_values_of( $stored, $this->pointer_of( $section, Extensions::get_default_key() ) ),
			$this->swatch_values_of( $stored, $id )
		);

		return $this->with_derived_complement( $this->swatch_values_of( $section, $id ), $stored, $overrides );
	}

	/**
	 * The `$current` (active) palette id for an effective section, falling back to `$default`, then "default".
	 *
	 * @since 3.8.0
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
	 * @since 3.8.0
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
	 * present palette; otherwise the library's default slug ("default").
	 *
	 * @since 3.8.0
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
	 * @since 3.8.0
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
