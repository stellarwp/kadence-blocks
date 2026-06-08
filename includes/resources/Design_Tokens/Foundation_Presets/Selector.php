<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use RuntimeException;

/**
 * Applies a foundation-preset choice by seeding the primitive layer.
 *
 * Choosing a type scale or starter palette writes its primitive values into the store as DTCG overrides
 * on top of the baseline — it is the beginner on-ramp's only write path. Each preset token (a flat
 * `dot-path => raw value`) becomes a full override leaf `{ $type, $value }`; the $type is sourced from
 * the baseline leaf at the same dot-path, because the Resolver's deep-merge replaces a token leaf
 * WHOLESALE, so an override missing its $type would break the per-$type CSS renderer downstream.
 *
 * Selecting a preset is a **clean swap**: the group's whole footprint (every path any preset in the
 * group can touch) is cleared first, then the chosen preset's paths are written. So switching presets
 * never leaves an earlier preset's exclusive paths applied — and a manual override within the footprint
 * is discarded by a later preset selection. Re-selecting the current preset is a no-op (no write).
 *
 * Persisting through {@see Token_Store::save_document()} bumps the set version and fires
 * `kadence_blocks_design_tokens_changed`, so every projector and cache reacts automatically.
 *
 * @since TBD
 */
final class Selector {

	/**
	 * @var Catalog The catalogue reader the chosen preset's tokens and the group footprint come from.
	 *
	 * @since TBD
	 */
	private Catalog $catalog;

	/**
	 * @var Baseline_Document The baseline each override leaf's $type is sourced from.
	 *
	 * @since TBD
	 */
	private Baseline_Document $baseline;

	/**
	 * @var Token_Store The sole gateway the seeded overrides are persisted through.
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @param Catalog           $catalog  The catalogue reader.
	 * @param Baseline_Document $baseline The shipped baseline document.
	 * @param Token_Store       $store    The persistence gateway.
	 */
	public function __construct( Catalog $catalog, Baseline_Document $baseline, Token_Store $store ) {
		$this->catalog  = $catalog;
		$this->baseline = $baseline;
		$this->store    = $store;
	}

	/**
	 * Seed the primitive layer from a foundation-preset choice and persist it as store overrides.
	 *
	 * @since TBD
	 *
	 * @param string      $group  The preset group key, e.g. "typeScale" or "colorPalette".
	 * @param string      $choice The preset slug within the group, e.g. "goldenRatio".
	 * @param string|null $slug   The token set to write to. Defaults to the single v1 "default" set.
	 *
	 * @throws Unknown_Preset_Exception|RuntimeException When the group/choice does not exist, a preset
	 *         token targets a dot-path the baseline has no $type for, or the overrides cannot be encoded.
	 *
	 * @return void
	 */
	public function apply( string $group, string $choice, ?string $slug = null ): void {
		$slug ??= Token_Store::default_slug();

		// Resolve first: an unknown choice throws here, before the store is touched, so a bad call writes
		// nothing.
		$tokens = $this->catalog->tokens_for( $group, $choice );

		$document = $this->current_overrides( $slug );
		$original = $document;

		// Clear the group's whole footprint, then write the chosen preset — a clean swap, so a preset the
		// choice omits can never persist from a previous selection.
		foreach ( $this->catalog->group_paths( $group ) as $dot_path ) {
			$this->unset_leaf( $document, $dot_path );
		}

		foreach ( $tokens as $dot_path => $value ) {
			$leaf = [
				Token_Type::get_type_key() => $this->baseline_type( (string) $dot_path ),
				Sentinels::get_value_key() => $value,
			];

			$this->set_leaf( $document, (string) $dot_path, $leaf );
		}

		// No-op guard: re-selecting the current preset (or any selection that nets no change) leaves the
		// document equal to what is stored, so skip the write rather than bump the version, fire the
		// changed action and churn history for nothing. Loose equality ignores key order, which clearing
		// then re-writing the same paths can shuffle.
		if ( $document == $original ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual
			return;
		}

		$json = wp_json_encode( $document );

		// Encoding only fails on non-UTF-8 / malformed input; preset values are baseline-derived scalars,
		// so this guards a should-never-happen rather than silently saving an empty (baseline) document.
		if ( $json === false ) {
			throw new RuntimeException( 'Failed to encode the seeded design-token overrides to JSON.' );
		}

		$this->store->save_document( $json, $slug );
	}

	/**
	 * Decode the set's current overrides document, tolerating an absent/empty/malformed row as "no
	 * overrides yet" so a fresh site seeds onto a clean slate.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>
	 */
	private function current_overrides( string $slug ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * The concrete $type the baseline declares for a token dot-path.
	 *
	 * @since TBD
	 *
	 * @param string $dot_path A token dot-path, e.g. "primitive.fontSize.lg".
	 *
	 * @throws Unknown_Preset_Exception When the baseline has no concrete $type at the path.
	 *
	 * @return string
	 */
	private function baseline_type( string $dot_path ): string {
		$node = $this->baseline->document();

		foreach ( explode( '.', $dot_path ) as $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				throw Unknown_Preset_Exception::for_missing_baseline_type( $dot_path );
			}

			$node = $node[ $segment ];
		}

		$type_key = Token_Type::get_type_key();

		if ( ! is_array( $node ) || ! isset( $node[ $type_key ] ) || ! is_string( $node[ $type_key ] ) ) {
			throw Unknown_Preset_Exception::for_missing_baseline_type( $dot_path );
		}

		return $node[ $type_key ];
	}

	/**
	 * Set an override leaf at a dot-path, creating intermediate groups as needed. A leaf replaces
	 * whatever sits at the path wholesale — preset tokens always target a primitive leaf.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The overrides document, mutated in place.
	 * @param string               $dot_path The token dot-path to write.
	 * @param array<string, mixed> $leaf     The DTCG leaf to set.
	 *
	 * @return void
	 */
	private function set_leaf( array &$document, string $dot_path, array $leaf ): void {
		$segments = explode( '.', $dot_path );
		$last     = (int) array_key_last( $segments );
		$node     = &$document;

		foreach ( $segments as $index => $segment ) {
			if ( $index === $last ) {
				$node[ $segment ] = $leaf;

				break;
			}

			// Descend into a group, creating one where the path is absent, non-array, or currently a leaf.
			// A leaf and its children can't coexist, so a stray override leaf on an ancestor path is
			// replaced rather than merged into (mirrors Effective_Document: a leaf is never a group).
			if (
				! isset( $node[ $segment ] )
				|| ! is_array( $node[ $segment ] )
				|| array_key_exists( Sentinels::get_value_key(), $node[ $segment ] )
			) {
				$node[ $segment ] = [];
			}

			$node = &$node[ $segment ];
		}

		unset( $node );
	}

	/**
	 * Remove the leaf at a dot-path, pruning any ancestor group left empty by the removal so the
	 * overrides document stays sparse (no `primitive: { fontSize: {} }` residue). A no-op when the path
	 * is absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node     The current group node, mutated in place.
	 * @param string               $dot_path The token dot-path to remove.
	 *
	 * @return void
	 */
	private function unset_leaf( array &$node, string $dot_path ): void {
		$this->unset_segments( $node, explode( '.', $dot_path ) );
	}

	/**
	 * Recursive worker for {@see unset_leaf()}: walk the remaining segments, unset the final key, then
	 * prune the parent if the removal emptied it.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node     The current group node, mutated in place.
	 * @param string[]             $segments The remaining dot-path segments.
	 *
	 * @return void
	 */
	private function unset_segments( array &$node, array $segments ): void {
		$segment = array_shift( $segments );

		if ( $segment === null || ! array_key_exists( $segment, $node ) ) {
			return;
		}

		if ( $segments === [] ) {
			unset( $node[ $segment ] );

			return;
		}

		if ( ! is_array( $node[ $segment ] ) ) {
			return;
		}

		$this->unset_segments( $node[ $segment ], $segments );

		if ( $node[ $segment ] === [] ) {
			unset( $node[ $segment ] );
		}
	}
}
