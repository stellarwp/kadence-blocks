<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

use KadenceWP\KadenceBlocks\Hasher;

/**
 * Builds a hash based off specific parts of an HTML document
 * that could affect which optimizations are in place.
 */
final class Hash_Builder {

	private Hasher $hasher;

	public function __construct( Hasher $hasher ) {
		$this->hasher = $hasher;
	}

	/**
	 * Build the hash based on specific parts of the HTML.
	 *
	 * @param string $html The full HTML to be returned to the browser.
	 *
	 * @return string The hash.
	 */
	public function build_hash( string $html ): string {
		// Regular expressions.
		$links_regex   = '~<link\b[^>]*\brel=["\'](?:stylesheet|preload)["\'][^>]*>~i';
		$styles_regex  = '~<style\b[^>]*>.*?</style>~is';
		$body_regex    = '~<body\b[^>]*>(.*?)</body>~is';
		$scripts_regex = '~<script\b[^>]*>.*?</script>~is';

		// Match stylesheet <link> tags.
		preg_match_all( $links_regex, $html, $m1 );
		$parts[] = implode( '', $m1[0] );

		// Match inline <style> blocks.
		preg_match_all( $styles_regex, $html, $m2 );
		$parts[] = implode( '', $m2[0] );

		// Match body content without <script> tags.
		if ( preg_match( $body_regex, $html, $m3 ) ) {
			// strip scripts.
			$body = preg_replace( $scripts_regex, '', $m3[1] );

			// collapse whitespace.
			$body    = preg_replace( '~\s++~', ' ', $body );
			$parts[] = $body;
		}

		// Combine all.
		$payload = implode( '|', $parts );

		// Hash the string.
		return $this->hasher->hash( $payload );
	}
}
