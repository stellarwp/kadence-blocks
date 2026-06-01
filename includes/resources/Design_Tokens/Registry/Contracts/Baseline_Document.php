<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts;

/**
 * Read-only view of the shipped baseline DTCG document, narrowed to what the Registry guard needs:
 * "does this token id exist in the baseline?".
 *
 * Fulfilled by SOFT-3377 (Baseline DTCG document). Until then, a stub is bound.
 *
 * @since TBD
 */
interface Baseline_Document {

	/**
	 * @since TBD
	 *
	 * @param string $id A token DTCG dot-path id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool;
}
