<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Contracts\License_Strategy;
use KadenceWP\KadenceBlocks\Harbor\Licensing\Legacy_License_Strategy;
use KadenceWP\KadenceBlocks\Harbor\Licensing\Unified_License_Strategy;

/**
 * Resolves the active license strategy for admin UI and key lookups.
 *
 * Strategies are evaluated in order; the first active strategy wins. By default
 * Kadence (Uplink) licenses are preferred over Harbor unified licenses when both
 * are active.
 *
 * @since TBD
 */
final class License_Status {

	/**
	 * @var list<License_Strategy>
	 */
	private array $strategies;

	/**
	 * @param list<License_Strategy>|null $strategies Ordered strategies; first active wins.
	 */
	public function __construct( ?array $strategies = null ) {
		$this->strategies = $strategies ?? [
			new Legacy_License_Strategy(),
			new Unified_License_Strategy(),
		];
	}

	/**
	 * The first active license strategy, or null when none are authorized.
	 *
	 * @since TBD
	 *
	 * @return License_Strategy|null
	 */
	public function resolve(): ?License_Strategy {
		foreach ( $this->strategies as $strategy ) {
			if ( $strategy->is_active() ) {
				return $strategy;
			}
		}

		return null;
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
		return ( new Unified_License_Strategy() )->get_key();
	}

	/**
	 * License status payload for the settings sidebar UI.
	 *
	 * Prefers a Kadence (Uplink) license when active; otherwise falls back to a
	 * Harbor unified license. Returns type "none" when unauthorized.
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
		$strategy = $this->resolve();

		if ( null === $strategy ) {
			return [
				'type'      => 'none',
				'maskedKey' => '',
				'fullKey'   => '',
				'expires'   => '',
				'manageUrl' => '',
			];
		}

		return $strategy->get_ui_status();
	}
}
