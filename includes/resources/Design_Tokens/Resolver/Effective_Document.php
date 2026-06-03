<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

/**
 * Deep-merges the stored overrides-only DTCG document onto the shipped baseline,
 * producing the single "effective" view the Resolver walks.
 *
 * Override leaves win over baseline leaves. Two removal sentinels delete a baseline
 * entry instead of overriding it: a $value of null, or a "$disabled": true marker.
 *
 * @since TBD
 */
final class Effective_Document {

	/**
	 * The DTCG layers that carry resolvable tokens. Mirrors Json_Baseline_Document
	 * so $extensions (presets/variants) is never treated as a token tree.
	 *
	 * @var string[]
	 */
	private const TOKEN_LAYERS = [ 'primitive', 'semantic' ];

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
	 * @param array<string,mixed> $overrides Decoded overrides-only DTCG (token-set document).
	 *
	 * @return array<string,mixed> The effective document, $extensions stripped.
	 */
	public function build( array $overrides ): array {
		$effective = [];

		foreach ( self::TOKEN_LAYERS as $layer ) {
			$base = $this->baseline->document()[ $layer ] ?? [];
			$over = $overrides[ $layer ] ?? [];

			// The DTCG layers are always groups; coerce anything else to an empty group.
			$base = is_array( $base ) ? $base : [];
			$over = is_array( $over ) ? $over : [];

			if ( $base === [] && $over === [] ) {
				continue;
			}

			$effective[ $layer ] = $this->merge_node( $base, $over );
		}

		return $effective;
	}

	/**
	 * Recursively merge an overrides node onto a baseline node.
	 *
	 * @param array<string,mixed> $base
	 * @param array<string,mixed> $over
	 *
	 * @return array<string,mixed>
	 */
	private function merge_node( array $base, array $over ): array {
		foreach ( $over as $key => $value ) {
			// Removal sentinels: drop the baseline entry entirely.
			if ( $this->is_removal( $value ) ) {
				unset( $base[ $key ] );
				continue;
			}

			// A leaf ($value present) replaces wholesale — never field-merge a token value.
			if ( is_array( $value ) && array_key_exists( '$value', $value ) ) {
				$base[ $key ] = $value;
				continue;
			}

			// Two groups: descend. Otherwise the override introduces a new branch.
			if ( is_array( $value ) && isset( $base[ $key ] ) && is_array( $base[ $key ] ) ) {
				$base[ $key ] = $this->merge_node( $base[ $key ], $value );
				continue;
			}

			$base[ $key ] = $value;
		}

		return $base;
	}

	/**
	 * Whether an override node is a removal marker for its baseline counterpart.
	 *
	 * @param mixed $value
	 */
	private function is_removal( $value ): bool {
		if ( ! is_array( $value ) ) {
			return false;
		}

		// Both override-suppression sentinels drop the baseline entry from the effective document; the
		// spellings live on Sentinels so this never hard-codes "$value"/"$disabled".
		return Sentinels::is_reset( $value ) || Sentinels::is_disabled( $value );
	}
}
