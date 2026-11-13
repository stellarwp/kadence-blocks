<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

/**
 * Reduces CSS to what it means, so two stylesheets can be compared without caring how they are laid out.
 *
 * The result maps each media query to each selector to its final properties. It ignores the order of
 * rules, how a selector's declarations are split across blocks, whitespace, and a property written
 * twice for one selector (the last value wins, as in the cascade). It keeps every value, selector and
 * media query, so a changed, added or missing declaration still shows.
 */
final class Css_Normalizer {

	/**
	 * Reduce CSS to media query, then selector, then property, then value.
	 *
	 * @param string $css The CSS.
	 *
	 * @return array<string, array<string, array<string, string>>>
	 */
	public function normalize( string $css ): array {
		$rules = [];
		$this->collect( $css, '', $rules );

		if ( [] === $rules && '' !== trim( $css ) ) {
			// Not CSS at all, such as a recorded exception: keep it so it is still compared.
			return [ '' => [ 'raw' => [ 'text' => trim( $css ) ] ] ];
		}

		return $this->sorted( $rules );
	}

	/**
	 * A short hash of the normalized CSS.
	 *
	 * @param string $css The CSS.
	 *
	 * @return string
	 */
	public function hash( string $css ): string {
		return sha1( (string) json_encode( $this->normalize( $css ) ) );
	}

	/**
	 * Read the rules of a stylesheet, descending into media queries.
	 *
	 * @param string                                                       $css   The CSS.
	 * @param string                                                       $media The media query the CSS sits in, or an empty string.
	 * @param array<string, array<string, array<string, string>>>          $rules The rules found so far, filled in place.
	 *
	 * @return void
	 */
	private function collect( string $css, string $media, array &$rules ): void {
		$offset = 0;

		while ( false !== ( $open = strpos( $css, '{', $offset ) ) ) { // phpcs:ignore WordPress.CodeAnalysis.AssignmentInCondition.Found
			$close   = $this->closing_brace( $css, $open );
			$prelude = $this->squash( substr( $css, $offset, $open - $offset ) );
			$body    = substr( $css, $open + 1, $close - $open - 1 );
			$offset  = $close + 1;

			if ( 0 === strpos( $prelude, '@media' ) ) {
				$this->collect( $body, $prelude, $rules );
				continue;
			}

			$this->add_declarations( $rules, $media, $prelude, $body );
		}
	}

	/**
	 * The position of the brace that closes the one at an offset.
	 *
	 * @param string $css  The CSS.
	 * @param int    $open The position of an opening brace.
	 *
	 * @return int
	 */
	private function closing_brace( string $css, int $open ): int {
		$depth  = 0;
		$length = strlen( $css );

		for ( $i = $open; $i < $length; $i++ ) {
			$depth += '{' === $css[ $i ] ? 1 : 0;
			$depth -= '}' === $css[ $i ] ? 1 : 0;

			if ( 0 === $depth ) {
				return $i;
			}
		}

		return $length - 1;
	}

	/**
	 * Add the declarations of one rule, the last value of a property winning.
	 *
	 * @param array<string, array<string, array<string, string>>> $rules    The rules found so far, filled in place.
	 * @param string                                              $media    The media query, or an empty string.
	 * @param string                                              $selector The selector.
	 * @param string                                              $body     The declarations.
	 *
	 * @return void
	 */
	private function add_declarations( array &$rules, string $media, string $selector, string $body ): void {
		foreach ( $this->split_declarations( $body ) as $declaration ) {
			$colon = strpos( $declaration, ':' );

			if ( false === $colon ) {
				continue;
			}

			$property = strtolower( trim( substr( $declaration, 0, $colon ) ) );

			$rules[ $media ][ $selector ][ $property ] = $this->squash( substr( $declaration, $colon + 1 ) );
		}
	}

	/**
	 * Split a rule body on semicolons that are not inside brackets or quotes.
	 *
	 * @param string $body The declarations.
	 *
	 * @return string[]
	 */
	private function split_declarations( string $body ): array {
		$parts   = [];
		$current = '';
		$depth   = 0;
		$quote   = '';

		foreach ( str_split( $body ) as $char ) {
			$quote  = $this->next_quote( $quote, $char );
			$depth += '' === $quote && '(' === $char ? 1 : 0;
			$depth -= '' === $quote && ')' === $char ? 1 : 0;

			if ( ';' === $char && 0 === $depth && '' === $quote ) {
				$parts[] = $current;
				$current = '';
				continue;
			}

			$current .= $char;
		}

		$parts[] = $current;

		return array_filter( array_map( 'trim', $parts ), 'strlen' );
	}

	/**
	 * Track whether a character opens or closes a quoted string.
	 *
	 * @param string $quote The quote character currently open, or an empty string.
	 * @param string $char  The next character.
	 *
	 * @return string The quote character that is open after this character.
	 */
	private function next_quote( string $quote, string $char ): string {
		if ( '' === $quote && ( '"' === $char || "'" === $char ) ) {
			return $char;
		}

		return $quote === $char ? '' : $quote;
	}

	/**
	 * Collapse runs of whitespace and trim.
	 *
	 * @param string $text The text.
	 *
	 * @return string
	 */
	private function squash( string $text ): string {
		return trim( (string) preg_replace( '/\s+/', ' ', $text ) );
	}

	/**
	 * Sort media queries, selectors and properties so the result does not depend on order.
	 *
	 * @param array<string, array<string, array<string, string>>> $rules The rules.
	 *
	 * @return array<string, array<string, array<string, string>>>
	 */
	private function sorted( array $rules ): array {
		ksort( $rules );

		foreach ( $rules as $media => $selectors ) {
			ksort( $selectors );

			foreach ( $selectors as $selector => $properties ) {
				ksort( $properties );
				$selectors[ $selector ] = $properties;
			}

			$rules[ $media ] = $selectors;
		}

		return $rules;
	}
}
