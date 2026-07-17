<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Licensing;

use KadenceWP\KadenceBlocks\Harbor\Contracts\License_Strategy;

/**
 * Shared helpers for license strategies.
 *
 * @since TBD
 */
abstract class Abstract_License_Strategy implements License_Strategy {

	/**
	 * Empty UI status payload used when a strategy is inactive.
	 *
	 * @since TBD
	 *
	 * @return array{
	 *     type: 'none',
	 *     maskedKey: string,
	 *     fullKey: string,
	 *     expires: string,
	 *     manageUrl: string
	 * }
	 */
	protected function empty_ui_status(): array {
		return [
			'type'      => 'none',
			'maskedKey' => '',
			'fullKey'   => '',
			'expires'   => '',
			'manageUrl' => '',
		];
	}

	/**
	 * Mask a license key for display (e.g. LWSW-••••••••••••-9KQ2).
	 *
	 * @since TBD
	 *
	 * @param string $key The full license key.
	 *
	 * @return string
	 */
	protected function mask_key( string $key ): string {
		$key = trim( $key );
		if ( '' === $key ) {
			return '';
		}

		$parts = explode( '-', $key );
		if ( count( $parts ) >= 2 ) {
			$first = $parts[0];
			$last  = (string) end( $parts );
			$tail  = strlen( $last ) > 4 ? substr( $last, -4 ) : $last;

			return $first . '-' . str_repeat( '•', 12 ) . '-' . $tail;
		}

		if ( strlen( $key ) <= 8 ) {
			return str_repeat( '•', strlen( $key ) );
		}

		return substr( $key, 0, 4 ) . str_repeat( '•', max( 4, strlen( $key ) - 8 ) ) . substr( $key, -4 );
	}
}
