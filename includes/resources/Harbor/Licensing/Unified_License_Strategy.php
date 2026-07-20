<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Licensing;

/**
 * Harbor unified (Liquid Web) license strategy.
 *
 * @since TBD
 */
final class Unified_License_Strategy extends Abstract_License_Strategy {

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
		if (
			! function_exists( 'lw_harbor_get_unified_license_key' )
			|| ! function_exists( 'lw_harbor_is_product_license_active' )
			|| ! lw_harbor_is_product_license_active( 'kadence' )
		) {
			return '';
		}

		$key = lw_harbor_get_unified_license_key();

		return ! empty( $key ) ? $key : '';
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
		$status['manageUrl'] = function_exists( 'lw_harbor_get_license_page_url' )
			? (string) lw_harbor_get_license_page_url()
			: admin_url( 'options-general.php?page=lw-software-manager' );

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
		$state = get_option( 'lw_harbor_licensing_products_state', [] );
		if ( ! is_array( $state ) || empty( $state['collection'] ) || ! is_array( $state['collection'] ) ) {
			return '';
		}

		$expires = '';
		foreach ( $state['collection'] as $entry ) {
			if ( ! is_array( $entry ) || ( $entry['product_slug'] ?? '' ) !== 'kadence' ) {
				continue;
			}
			if ( empty( $entry['expires'] ) || ! is_string( $entry['expires'] ) ) {
				continue;
			}
			// Prefer the entry activated on this site when available.
			if ( ! empty( $entry['activated_here'] ) || '' === $expires ) {
				$expires = $entry['expires'];
			}
			if ( ! empty( $entry['activated_here'] ) ) {
				break;
			}
		}

		if ( '' === $expires ) {
			return '';
		}

		$timestamp = strtotime( $expires );
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
