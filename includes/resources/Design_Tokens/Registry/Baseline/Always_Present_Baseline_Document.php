<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * Permissive baseline stub: its has() always returns true, so every declared token is treated as
 * present and the guard becomes a no-op.
 *
 * This was the bound default until SOFT-3377 shipped the real document (Json_Baseline_Document); the
 * container now binds that instead. Retained as a test fixture for exercising the guard's "all present"
 * path without the real baseline. The fail-closed "missing" path is covered by Empty_Baseline_Document
 * and per-test fakes.
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

	/**
	 * No real document backs this fixture; only has() is meaningful here.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function document(): array {
		return [];
	}
}
