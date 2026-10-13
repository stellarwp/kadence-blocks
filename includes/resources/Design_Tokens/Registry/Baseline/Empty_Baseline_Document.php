<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * Placeholder baseline whose has() is always false: with no real baseline, every declared token is
 * "missing". Combined with the fail-closed policy this keeps token projection OFF until the real
 * document (Json_Baseline_Document) is bound — the safe default when no baseline exists.
 *
 * Not the bound default in this ticket (see Always_Present_Baseline_Document); kept as the
 * fail-closed reference stub and exercised by the guard's "missing" tests.
 *
 * @since 3.8.0
 */
final class Empty_Baseline_Document implements Baseline_Document {

	/**
	 * @since 3.8.0
	 *
	 * @param string $id A token DTCG dot-path id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool {
		return false;
	}

	/**
	 * No baseline exists, so the document is empty — consistent with has() always being false.
	 *
	 * @since 3.8.0
	 *
	 * @return array<string, mixed>
	 */
	public function document(): array {
		return [];
	}
}
