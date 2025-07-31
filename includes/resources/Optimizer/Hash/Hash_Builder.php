<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

/**
 * Builds a hash based off specific parts of an HTML document
 * that could affect which optimizations are in place.
 *
 * This is a good compromise for URLs that load random data, so we can
 * keep as many optimizations as possible, even if they may not apply
 * to some elements.
 */
final class Hash_Builder {

	/**
	 * Build the hash based on a selected portion of the HTML.
	 *
	 * @param string $html The full HTML to be returned to the browser.
	 *
	 * @return string The hash.
	 */
	public function build_hash( string $html ): string {
		$parts = [
			$this->extract_stylesheet_links( $html ),
			$this->extract_inline_styles( $html ),
			$this->extract_block_structure( $html ),
			$this->extract_structural_elements( $html ),
		];

		return hash( 'sha256', implode( '|', $parts ) );
	}

	/**
	 * Extract stylesheet and preload link tags.
	 *
	 * @param string $html The HTML content.
	 *
	 * @return string Concatenated link tags.
	 */
	private function extract_stylesheet_links( string $html ): string {
		preg_match_all( '~<link\b[^>]*\brel=["\'](?:stylesheet|preload)["\'][^>]*>~i', $html, $matches );

		return implode( '', $matches[0] );
	}

	/**
	 * Extract inline style tags.
	 *
	 * @param string $html The HTML content.
	 *
	 * @return string Concatenated style tags.
	 */
	private function extract_inline_styles( string $html ): string {
		preg_match_all( '~<style\b[^>]*>.*?</style>~is', $html, $matches );

		return implode( '', $matches[0] );
	}

	/**
	 * Extract block structures.
	 *
	 * @param string $html The HTML content.
	 *
	 * @return string Pipe-separated block comments.
	 */
	private function extract_block_structure( string $html ): string {
		$matches = [];

		preg_match_all( '~<!-- wp:[^>]*-->~i', $html, $matches );

		return implode( '|', $matches[0] ?? [] );
	}

	/**
	 * Extract structural element counts.
	 *
	 * @param string $html The HTML content.
	 *
	 * @return string Pipe-separated element counts.
	 */
	private function extract_structural_elements( string $html ): string {
		$matches = [];

		preg_match_all( '~<(div|section|article|header|footer|main)[^>]*>~i', $html, $matches );

		$counts = array_count_values( array_map( 'strtolower', $matches[1] ?? [] ) );

		return implode(
			'|',
			array_map(
				static fn( string $element ): string => "$element:" . ( $counts[ $element ] ?? 0 ),
				[ 'div', 'section', 'article', 'header', 'footer', 'main' ]
			)
		);
	}
}
