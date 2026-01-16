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
	 * Build a composite hash string with individual component hashes.
	 *
	 * @param string $html The full HTML to be returned to the browser.
	 *
	 * @return string The composite hash string.
	 */
	public function build_hash( string $html ): string {
		$components = [
			'stylesheet' => hash( 'sha256', $this->extract_stylesheet_links( $html ) ),
			'inline'     => hash( 'sha256', $this->extract_inline_styles( $html ) ),
			'blocks'     => hash( 'sha256', $this->extract_block_structure( $html ) ),
			'structure'  => hash( 'sha256', $this->extract_structural_elements( $html ) ),
		];

		return implode(
			'|',
			array_map(
				static fn( string $key, string $hash ): string => "$key:$hash",
				array_keys( $components ),
				$components
			)
		);
	}

	/**
	 * Compare two composite hash strings and return which components changed.
	 *
	 * @param string $old_hash The previous composite hash.
	 * @param string $new_hash The new composite hash.
	 *
	 * @return string[] List of component names that changed.
	 */
	public function get_changed_components( string $old_hash, string $new_hash ): array {
		if ( $old_hash === $new_hash ) {
			return [];
		}

		$old_parts = $this->parse_composite_hash( $old_hash );
		$new_parts = $this->parse_composite_hash( $new_hash );
		$changed   = [];

		foreach ( $new_parts as $key => $new_value ) {
			if ( ! isset( $old_parts[ $key ] ) || $old_parts[ $key ] !== $new_value ) {
				$changed[] = $key;
			}
		}

		return $changed;
	}

	/**
	 * Parse a composite hash string into components.
	 *
	 * @param string $composite_hash The composite hash string.
	 *
	 * @return array Associative array of component => hash.
	 */
	private function parse_composite_hash( string $composite_hash ): array {
		$parts  = explode( '|', $composite_hash );
		$result = [];

		foreach ( $parts as $part ) {
			$split = explode( ':', $part, 2 );

			if ( count( $split ) === 2 ) {
				$result[ $split[0] ] = $split[1];
			}
		}

		return $result;
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
