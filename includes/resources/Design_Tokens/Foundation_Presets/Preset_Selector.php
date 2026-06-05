<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
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
 * Persisting through {@see Token_Store::save_document()} bumps the set version and fires
 * `kadence_blocks_design_tokens_changed`, so every projector and cache reacts automatically.
 *
 * @since TBD
 */
final class Preset_Selector {

	/**
	 * @var string The DTCG leaf key carrying a token's type.
	 *
	 * @since TBD
	 */
	private const TYPE_KEY = '$type';

	/**
	 * @var Foundation_Presets The catalogue reader the chosen preset's tokens come from.
	 *
	 * @since TBD
	 */
	private Foundation_Presets $presets;

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
	 * @param Foundation_Presets $presets  The catalogue reader.
	 * @param Baseline_Document  $baseline The shipped baseline document.
	 * @param Token_Store        $store    The persistence gateway.
	 */
	public function __construct( Foundation_Presets $presets, Baseline_Document $baseline, Token_Store $store ) {
		$this->presets  = $presets;
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
		$tokens = $this->presets->tokens_for( $group, $choice );

		$document = $this->current_overrides( $slug );

		foreach ( $tokens as $dot_path => $value ) {
			$leaf = [
				self::TYPE_KEY             => $this->baseline_type( (string) $dot_path ),
				Sentinels::get_value_key() => $value,
			];

			$this->set_leaf( $document, (string) $dot_path, $leaf );
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

		if ( ! is_array( $node ) || ! isset( $node[ self::TYPE_KEY ] ) || ! is_string( $node[ self::TYPE_KEY ] ) ) {
			throw Unknown_Preset_Exception::for_missing_baseline_type( $dot_path );
		}

		return $node[ self::TYPE_KEY ];
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
}
