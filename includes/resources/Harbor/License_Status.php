<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Contracts\License_Strategy;
use KadenceWP\KadenceBlocks\Harbor\Licensing\Legacy_License_Strategy;
use KadenceWP\KadenceBlocks\Harbor\Licensing\Unified_License_Strategy;

/**
 * Resolves the active license strategy for admin UI and key lookups.
 *
 * Resolution rules:
 * 1. Legacy (Kadence) active → Legacy strategy
 * 2. Unified active → Unified strategy
 * 3. Neither active → Unified strategy (default entry / inactive UI)
 * 4. Both active → Legacy strategy (Kadence preferred)
 *
 * @since TBD
 */
final class License_Status {

	/**
	 * @var Legacy_License_Strategy
	 */
	private Legacy_License_Strategy $legacy;

	/**
	 * @var Unified_License_Strategy
	 */
	private Unified_License_Strategy $unified;

	/**
	 * @param Legacy_License_Strategy|null  $legacy  Optional legacy strategy.
	 * @param Unified_License_Strategy|null $unified Optional unified strategy.
	 */
	public function __construct( ?Legacy_License_Strategy $legacy = null, ?Unified_License_Strategy $unified = null ) {
		$this->legacy  = $legacy ?? new Legacy_License_Strategy();
		$this->unified = $unified ?? new Unified_License_Strategy();
	}

	/**
	 * Resolve the license strategy using the preference rules above.
	 *
	 * Always returns a strategy. When neither license is active, returns the
	 * unified strategy so the inactive UI defaults to the unified entry flow.
	 *
	 * @since TBD
	 *
	 * @return License_Strategy
	 */
	public function resolve(): License_Strategy {
		// Kadence wins whenever it is active (including when both are).
		if ( $this->legacy->is_active() ) {
			return $this->legacy;
		}

		// Unified when it is active, also unified is the default.
		return $this->unified;
	}

	/**
	 * Get the unified Harbor license key when the Kadence product is active.
	 *
	 * Independent of strategy preference — always reads the unified key.
	 *
	 * @since TBD
	 *
	 * @return string The unified license key, or an empty string if not found.
	 */
	public function get_unified_key(): string {
		return $this->unified->get_key();
	}

	/**
	 * License status payload for the settings sidebar UI.
	 *
	 * @since TBD
	 *
	 * @return array{
	 *     type: 'none'|'unified'|'kadence',
	 *     maskedKey: string,
	 *     fullKey: string,
	 *     expires: string,
	 *     manageUrl: string
	 * }
	 */
	public function get_ui_status(): array {
		return $this->resolve()->get_ui_status();
	}
}
