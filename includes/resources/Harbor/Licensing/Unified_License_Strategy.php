<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Licensing;

use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Licensing\Product_Collection;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Licensing\Repositories\License_Repository;

/**
 * Harbor unified (Liquid Web) license strategy.
 *
 * @since TBD
 */
final class Unified_License_Strategy extends Abstract_License_Strategy {

	/**
	 * Memoized result of {@see get_key()} for this instance.
	 *
	 * Null means not yet resolved. Empty string means inactive / no key.
	 * Strategies are short-lived (constructed per lookup), so this only
	 * collapses repeated Harbor checks within one object lifetime.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private ?string $resolved_key = null;

	/**
	 * {@inheritdoc}
	 */
	public function is_active(): bool {
		return '' !== $this->get_key();
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_type(): string {
		return 'unified';
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_key(): string {
		if ( null !== $this->resolved_key ) {
			return $this->resolved_key;
		}

		if ( ! lw_harbor_is_product_license_active( 'kadence' ) ) {
			$this->resolved_key = '';

			return '';
		}

		$key = lw_harbor_get_unified_license_key();

		$this->resolved_key = ! empty( $key ) ? $key : '';

		return $this->resolved_key;
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_ui_status(): array {
		$key = $this->get_key();
		if ( '' === $key ) {
			return $this->empty_ui_status();
		}

		$status              = $this->empty_ui_status();
		$status['type']      = $this->get_type();
		$status['maskedKey'] = $this->mask_key( $key );
		$status['fullKey']   = $key;
		$status['expires']   = $this->get_expires_label();
		$status['manageUrl'] = (string) lw_harbor_get_license_page_url();

		return $status;
	}

	/**
	 * Formatted expiration label for the active unified Kadence entitlement.
	 *
	 * @since TBD
	 *
	 * @return string Localized "Expires on …" label, or empty string when unknown.
	 */
	private function get_expires_label(): string {
		$repository = new License_Repository();
		$collection = $repository->get_products();

		if ( ! $collection instanceof Product_Collection ) {
			return '';
		}

		// Prefer the entry activated on this site when available.
		$entry = $collection->get_activated_entry( 'kadence' );
		if ( null === $entry ) {
			$entries = $collection->get_all_by_slug( 'kadence' );
			$entry   = reset( $entries ) ?: null;
		}

		if ( null === $entry ) {
			return '';
		}

		$timestamp = $entry->get_expires()->getTimestamp();
		if ( ! $timestamp ) {
			return '';
		}

		$date_format = get_option( 'date_format' );
		if ( ! is_string( $date_format ) || '' === $date_format ) {
			$date_format = 'F j, Y';
		}

		return sprintf(
			/* translators: %s: localized expiration date. */
			__( 'Expires on %s', 'kadence-blocks' ),
			wp_date( $date_format, $timestamp )
		);
	}
}

