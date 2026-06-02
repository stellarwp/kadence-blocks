<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * Permissive baseline stub bound until SOFT-3377 ships the real DTCG document.
 *
 * Its has() always returns true, so the example declarations flow through registration, the guard
 * and (later) projection end-to-end now — proving the path this ticket promises. The guard is therefore
 * effectively a no-op at runtime until SOFT-3377 swaps this binding for the real document, at which
 * point every declared token must have a genuine baseline entry or the guard fires. The fail-closed
 * "missing" path is still fully covered by tests using a fake baseline.
 *
 * @since TBD
 */
final class Always_Present_Baseline_Document implements Baseline_Document {

	/**
	 * @since TBD
	 *
	 * @param string $id A token DTCG dot-path id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool {
		return true;
	}
}
