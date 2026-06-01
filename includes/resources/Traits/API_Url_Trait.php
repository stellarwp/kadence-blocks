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
}
