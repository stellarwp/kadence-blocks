<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts;

/**
 * Read-only view of the shipped baseline DTCG document.
 *
 * Two consumers, two methods:
 *   - the Registry guard asks has() — "does this token id exist in the baseline?";
 *   - the Resolver reads document() — the full baseline to deep-merge with the stored
 *     overrides into the effective document it then walks.
 *
 * Fulfilled by the shipped baseline DTCG document (Json_Baseline_Document).
 *
 * @since TBD
 */
interface Baseline_Document {

	/**
	 * Whether the baseline defines a token at the given dot-path id.
	 *
	 * @since TBD
	 *
	 * @param string $id A token DTCG dot-path id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool;

	/**
	 * The full shipped baseline document, decoded. Consumed by the Resolver to build the effective
	 * document (baseline deep-merged with the stored overrides). Empty when no baseline is available.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function document(): array;
}
