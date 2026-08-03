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
	 * The lowercase host of a URL, with or without a scheme.
	 *
	 * @since TBD
	 *
	 * @param string $url The URL to read.
	 */
	protected function url_host( string $url ): string {
		$url = trim( $url );

		if ( '' !== $url && ! str_contains( $url, '://' ) ) {
			$url = 'https://' . ltrim( $url, '/' );
		}

		return strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) );
	}

	/**
	 * Whether a URL's host matches one of the given URLs, subdomains included.
	 *
	 * @since TBD
	 *
	 * @param string   $url     The URL to check.
	 * @param string[] $allowed The URLs to check against.
	 */
	protected function url_host_matches( string $url, array $allowed ): bool {
		$host = $this->url_host( $url );

		if ( '' === $host ) {
			return false;
		}

		foreach ( $allowed as $allowed_url ) {
			$allowed_host = $this->url_host( (string) $allowed_url );

			if ( '' !== $allowed_host && ( $host === $allowed_host || str_ends_with( $host, '.' . $allowed_host ) ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * The Kadence library base URLs.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	protected function get_kadence_api_urls(): array {
		return [
			$this->get_patterns_base_url(),
			$this->get_starter_base_url(),
			$this->get_template_sites_base_url(),
		];
	}

	/**
	 * Whether a URL points at one of the Kadence library hosts.
	 *
	 * @since 3.7.8.1
	 *
	 * @param string $url The URL to check.
	 */
	protected function is_kadence_api_url( string $url ): bool {
		return $this->url_host_matches( $url, $this->get_kadence_api_urls() );
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
	 * The library URLs registered as custom prebuilt libraries.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	protected function get_registered_library_urls(): array {
		$libraries = apply_filters( 'kadence_blocks_custom_prebuilt_libraries', [] );

		return array_filter( array_column( (array) $libraries, 'url' ), 'is_string' );
	}

	/**
	 * The library locations this site allows the editor to request.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	protected function get_allowed_library_urls(): array {
		/*
		 * ---------------------------------------------------------------
		 * Add your own design library locations here, one per line:
		 *
		 *     'https://patterns.mycompany.com',
		 *
		 * Matching is by host, so one entry covers every path on it.
		 * ---------------------------------------------------------------
		 */
		$custom = [];

		$urls = array_merge(
			$custom,
			$this->get_kadence_api_urls(),
			$this->get_saved_library_urls(),
			$this->get_registered_library_urls()
		);

		/**
		 * Filters the library locations the editor is allowed to request.
		 *
		 * Matching is by host, so one entry covers every path on it.
		 *
		 * @since TBD
		 *
		 * @param string[] $urls Allowed library URLs.
		 */
		return (array) apply_filters( 'kadence_blocks_allowed_library_urls', $urls );
	}

	/**
	 * Resolve a requested library URL into a full endpoint URL.
	 *
	 * Only the library locations this site allows are valid request targets.
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

		return $this->url_host_matches( $requested, $this->get_allowed_library_urls() )
			? $requested . $endpoint
			: '';
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
