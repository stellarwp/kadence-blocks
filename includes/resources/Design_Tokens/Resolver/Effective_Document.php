<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

/**
 * Deep-merges the stored overrides-only DTCG document onto the shipped baseline,
 * producing the single "effective" view the Resolver walks.
 *
 * Override leaves win over baseline leaves. Two sentinels let an override suppress a
 * baseline entry without physically deleting it: DISABLE ($disabled: true) removes the
 * entry entirely; RESET ($value: null) skips the override and keeps the baseline value.
 *
 * @since TBD
 */
final class Effective_Document {

	/**
	 * @var Baseline_Document
	 */
	private Baseline_Document $baseline;

	public function __construct( Baseline_Document $baseline ) {
		$this->baseline = $baseline;
	}

	/**
	 * Build the merged document from the baseline and a decoded overrides array.
	 *
	 * @param array<string,mixed> $overrides      Decoded overrides-only DTCG (token-set document).
	 * @param bool                $apply_disabled Whether a DISABLE override removes the baseline entry.
	 *                                            True (the Resolver's rendering view) drops disabled tokens
	 *                                            entirely; false (the write layer's inspection view) keeps the
	 *                                            baseline token visible, so a disabled token's $type and group
	 *                                            shape can still be read when authoring it.
	 *
	 * @return array<string,mixed> The effective document, $extensions stripped.
	 */
	public function build( array $overrides, bool $apply_disabled = true ): array {
		$effective = [];

		foreach ( Layers::token_layers() as $layer ) {
			$base = $this->baseline->document()[ $layer ] ?? [];
			$over = $overrides[ $layer ] ?? [];

			// The DTCG layers are always groups; coerce anything else to an empty group.
			$base = is_array( $base ) ? $base : [];
			$over = is_array( $over ) ? $over : [];

			if ( $base === [] && $over === [] ) {
				continue;
			}

			$effective[ $layer ] = $this->merge_node( $base, $over, $apply_disabled );
		}

		return $effective;
	}

	/**
	 * Recursively merge an overrides node onto a baseline node.
	 *
	 * @param array<string,mixed> $base
	 * @param array<string,mixed> $over
	 * @param bool                $apply_disabled Whether a DISABLE override removes the baseline entry.
	 *
	 * @return array<string,mixed>
	 */
	private function merge_node( array $base, array $over, bool $apply_disabled = true ): array {
		foreach ( $over as $key => $value ) {
			if ( ! is_array( $value ) ) {
				$base[ $key ] = $value;
				continue;
			}

			// DISABLE sentinel: remove the baseline entry entirely for the rendering view. The inspection
			// view keeps the baseline token instead, so authoring over a disabled token can still read its
			// $type and tell a disabled group apart from a disabled leaf.
			if ( Sentinels::is_disabled( $value ) ) {
				if ( $apply_disabled ) {
					unset( $base[ $key ] );
				}

				continue;
			}

			// RESET sentinel: skip the override and keep the baseline value as-is.
			if ( Sentinels::is_reset( $value ) ) {
				continue;
			}

			// A leaf ($value present) replaces wholesale — never field-merge a token value.
			if ( array_key_exists( Sentinels::get_value_key(), $value ) ) {
				$base[ $key ] = $value;
				continue;
			}

			// Two groups: descend. A baseline leaf is never a group, so when the override puts a group
			// where the baseline holds a leaf, the override replaces it (falls through below) rather than
			// merging the group's children alongside the leaf's $type/$value and corrupting the node.
			if (
				isset( $base[ $key ] )
				&& is_array( $base[ $key ] )
				&& ! array_key_exists( Sentinels::get_value_key(), $base[ $key ] )
			) {
				$base[ $key ] = $this->merge_node( $base[ $key ], $value, $apply_disabled );
				continue;
			}

			$base[ $key ] = $value;
		}

		return $base;
	}
}
