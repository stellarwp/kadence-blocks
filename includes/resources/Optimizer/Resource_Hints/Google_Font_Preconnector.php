<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Resource_Hints;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;

/**
 * Adds the following to the frontend head section, to allow faster loading
 * Google Fonts:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 */
final class Google_Font_Preconnector {

	public const PRECONNECT = 'preconnect';

	private Analysis_Registry $registry;

	public function __construct(
		Analysis_Registry $registry
	) {
		$this->registry = $registry;
	}

	/**
	 * Add preconnect links for Google Fonts. We actually have no way of knowing that Kadence is using
	 * them as the style enqueuing happens later in the execution.
	 *
	 * @filter wp_resource_hints
	 *
	 * @param array<array|string> $urls Array of resources and their attributes, or URLs to print for resource hints.
	 * @param string              $relation_type The relation type the URLs are printed for. One of 'dns-prefetch', 'preconnect', 'prefetch', or 'prerender'.
	 *
	 * @return array<array|string>
	 */
	public function preconnect( array $urls, string $relation_type ): array {
		if ( ! $this->registry->is_optimized() ) {
			return $urls;
		}

		if ( self::PRECONNECT !== $relation_type ) {
			return $urls;
		}

		$urls[] = 'https://fonts.googleapis.com';
		$urls[] = [
			'href' => 'https://fonts.gstatic.com',
			true   => 'crossorigin',
		];

		return $urls;
	}
}
