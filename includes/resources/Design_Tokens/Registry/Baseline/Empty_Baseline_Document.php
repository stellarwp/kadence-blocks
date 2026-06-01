<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * Placeholder baseline whose has() is always false: with no real baseline, every declared token is
 * "missing". Combined with the fail-closed policy this keeps token projection OFF until SOFT-3377
 * ships the real document — the safe default when no baseline exists.
 *
 * Not the bound default in this ticket (see Always_Present_Baseline_Document); kept as the
 * fail-closed reference stub and exercised by the guard's "missing" tests.
 *
 * @since TBD
 */
final class Empty_Baseline_Document implements Baseline_Document {

	/**
	 * @since TBD
	 *
	 * @param string $id A token DTCG dot-path id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool {
		return false;
	}
}
