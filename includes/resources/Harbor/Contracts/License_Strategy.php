<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Contracts;

/**
 * Strategy for resolving a specific license type (Kadence Uplink or Harbor unified).
 *
 * @since TBD
 */
interface License_Strategy {

	/**
	 * Whether this license type is currently active/authorized.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_active(): bool;

	/**
	 * Machine-readable license type for the admin UI.
	 *
	 * @since TBD
	 *
	 * @return 'kadence'|'unified'
	 */
	public function get_type(): string;

	/**
	 * The full license key for this strategy, or empty when unavailable.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function get_key(): string;

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
	public function get_ui_status(): array;
}
