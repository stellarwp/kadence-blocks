<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

/**
 * Resolves the prebuilt-library remote API URLs, with constant overrides.
 *
 * The base-url methods honor the KADENCE_BLOCKS_PATTERNS_BASE_URL /
 * KADENCE_BLOCKS_STARTER_BASE_URL constants (otherwise production defaults),
 * letting a local-dev docker stack point the editor at containerized
 * patterns/starter sites without code changes. The endpoint getters build
 * the full remote URLs on top of those bases so every path string lives in
 * exactly one place.
 */
trait API_Url_Trait {

	/**
	 * Resolve the patterns-cloud base URL with override.
	 *
	 * KADENCE_BLOCKS_PATTERNS_BASE_URL constant, otherwise production default.
	 *
	 * @since 3.7.5
	 */
	protected function get_patterns_base_url(): string {
		$url = defined( 'KADENCE_BLOCKS_PATTERNS_BASE_URL' ) && KADENCE_BLOCKS_PATTERNS_BASE_URL
			? KADENCE_BLOCKS_PATTERNS_BASE_URL
			: 'https://patterns.startertemplatecloud.com';
		return rtrim( (string) $url, '/' );
	}

	/**
	 * Resolve the starter-templates base URL with override.
	 *
	 * KADENCE_BLOCKS_STARTER_BASE_URL constant, otherwise production default.
	 *
	 * @since 3.7.5
	 */
	protected function get_starter_base_url(): string {
		$url = defined( 'KADENCE_BLOCKS_STARTER_BASE_URL' ) && KADENCE_BLOCKS_STARTER_BASE_URL
			? KADENCE_BLOCKS_STARTER_BASE_URL
			: 'https://api.startertemplatecloud.com';
		return rtrim( (string) $url, '/' );
	}

	/**
	 * Patterns-cloud "get" (sections) endpoint.
	 *
	 * @since 3.7.5
	 */
	protected function get_patterns_get_url(): string {
		return $this->get_patterns_base_url() . '/wp-json/kadence-cloud/v1/get/';
	}

	/**
	 * Patterns-cloud categories endpoint.
	 *
	 * @since 3.7.5
	 */
	protected function get_patterns_categories_url(): string {
		return $this->get_patterns_base_url() . '/wp-json/kadence-cloud/v1/categories/';
	}

	/**
	 * Patterns-cloud pages endpoint.
	 *
	 * @since 3.7.5
	 */
	protected function get_patterns_pages_url(): string {
		return $this->get_patterns_base_url() . '/wp-json/kadence-cloud/v1/pages/';
	}

	/**
	 * Patterns-cloud pages-categories endpoint.
	 *
	 * @since 3.7.5
	 */
	protected function get_patterns_pages_categories_url(): string {
		return $this->get_patterns_base_url() . '/wp-json/kadence-cloud/v1/pages-categories/';
	}

	/**
	 * Patterns-cloud single-item endpoint.
	 *
	 * @since 3.7.5
	 */
	protected function get_patterns_single_url(): string {
		return $this->get_patterns_base_url() . '/wp-json/kadence-cloud/v1/single/';
	}

	/**
	 * Starter-templates "get" endpoint.
	 *
	 * @since 3.7.5
	 */
	protected function get_starter_get_url(): string {
		return $this->get_starter_base_url() . '/wp-json/kadence-starter/v1/get/';
	}

	/**
	 * Resolve the starter-template sites base URL with override.
	 *
	 * KADENCE_BLOCKS_TEMPLATE_SITES_BASE_URL constant, otherwise production default.
	 *
	 * @since 3.7.8.1
	 */
	protected function get_template_sites_base_url(): string {
		$url = defined( 'KADENCE_BLOCKS_TEMPLATE_SITES_BASE_URL' ) && KADENCE_BLOCKS_TEMPLATE_SITES_BASE_URL
			? KADENCE_BLOCKS_TEMPLATE_SITES_BASE_URL
			: 'https://startertemplatecloud.com';
		return rtrim( (string) $url, '/' );
	}

	/**
	 * Whether a URL points at one of the Kadence library hosts.
	 *
	 * @since 3.7.8.1
	 *
	 * @param string $url The URL to check.
	 */
	protected function is_kadence_api_url( string $url ): bool {
		$host = wp_parse_url( $url, PHP_URL_HOST );

		if ( empty( $host ) ) {
			return false;
		}

		$allowed = array_filter(
			[
				wp_parse_url( $this->get_patterns_base_url(), PHP_URL_HOST ),
				wp_parse_url( $this->get_starter_base_url(), PHP_URL_HOST ),
				wp_parse_url( $this->get_template_sites_base_url(), PHP_URL_HOST ),
			]
		);

		return in_array( $host, $allowed, true );
	}

	/**
	 * The library URLs saved in the cloud connection settings.
	 *
	 * @since 3.7.8.1
	 *
	 * @return string[]
	 */
	protected function get_saved_library_urls(): array {
		$settings = json_decode( (string) get_option( 'kadence_blocks_cloud' ), true );
		$urls     = [];

		if ( ! empty( $settings['connections'] ) && is_array( $settings['connections'] ) ) {
			foreach ( $settings['connections'] as $connection ) {
				if ( ! empty( $connection['url'] ) ) {
					$urls[] = rtrim( (string) $connection['url'], '/' );
				}
			}
		}

		return $urls;
	}

	/**
	 * Resolve a requested library URL into a full endpoint URL.
	 *
	 * Only the Kadence library hosts and the saved cloud connections are
	 * allowed as request targets.
	 *
	 * @since 3.7.8.1
	 *
	 * @param string $requested The requested library URL.
	 * @param string $endpoint  The endpoint path to append.
	 * @param string $fallback  Returned when no library URL was requested.
	 *
	 * @return string Empty string when the requested URL is not allowed.
	 */
	protected function resolve_library_url( string $requested, string $endpoint, string $fallback = '' ): string {
		$requested = rtrim( trim( $requested ), '/' );

		if ( '' === $requested ) {
			return $fallback;
		}

		if ( $this->is_kadence_api_url( $requested ) || in_array( $requested, $this->get_saved_library_urls(), true ) ) {
			return $requested . $endpoint;
		}

		return '';
	}

	/**
	 * Resolve a requested library URL for a connection lookup.
	 *
	 * Adding a connection to a new library is limited to users who can manage
	 * the connection settings.
	 *
	 * @since 3.7.8.1
	 *
	 * @param string $requested The requested library URL.
	 * @param string $endpoint  The endpoint path to append.
	 *
	 * @return string Empty string when the requested URL is not allowed.
	 */
	protected function resolve_connection_url( string $requested, string $endpoint ): string {
		$url = $this->resolve_library_url( $requested, $endpoint );

		if ( '' === $url && current_user_can( 'manage_options' ) ) {
			$requested = rtrim( trim( $requested ), '/' );
			$url       = '' === $requested ? '' : $requested . $endpoint;
		}

		return $url;
	}
}
