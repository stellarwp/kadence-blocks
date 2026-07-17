<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Licensing;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_key;

/**
 * Kadence (Uplink) license strategy.
 *
 * Preferred over the unified Harbor license when both are active.
 *
 * @since TBD
 */
final class Legacy_License_Strategy extends Abstract_License_Strategy {

	/**
	 * {@inheritdoc}
	 */
	public function is_active(): bool {
		return kadence_blocks_is_legacy_license_authorized();
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_type(): string {
		return 'kadence';
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_key(): string {
		$key = get_license_key( kadence_blocks_get_current_product_slug() );

		return ! empty( $key ) ? $key : '';
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_ui_status(): array {
		if ( ! $this->is_active() ) {
			return $this->empty_ui_status();
		}

		$status         = $this->empty_ui_status();
		$status['type'] = $this->get_type();

		return $status;
	}
}
