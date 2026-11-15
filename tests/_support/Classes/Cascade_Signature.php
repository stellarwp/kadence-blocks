<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

/**
 * A fingerprint of what the CSS does to the cascade, stricter than the meaning that Css_Normalizer hashes.
 *
 * For every media query and property it keeps the declarations that can still win, in the order they are written: a later
 * declaration of the same selector replaces an earlier one, but the order of rules of different selectors is kept, because
 * with equal specificity the later rule wins. How declarations are grouped into rules does not change the signature.
 */
final class Cascade_Signature {

	/**
	 * The signature of a stylesheet.
	 *
	 * @param string $css The CSS.
	 *
	 * @return string
	 */
	public static function of( string $css ): string {
		$events = [];

		self::walk( (string) preg_replace( '~/\*.*?\*/~s', '', $css ), '', $events );

		$by = [];

		foreach ( $events as [ $media, $selector, $property, $value ] ) {
			$key = $media . '|' . $property;

			// Moving the selector to the end keeps the order of the last declaration of every selector.
			unset( $by[ $key ][ $selector ] );

			$by[ $key ][ $selector ] = $value;
		}

		ksort( $by );

		return sha1( (string) wp_json_encode( $by ) );
	}

	/**
	 * Collect the declarations of a stylesheet, or of the inside of a media query.
	 *
	 * @param string                           $css    The CSS.
	 * @param string                           $media  The at-rules the CSS is inside.
	 * @param array<int, array<int, string>>   $events The declarations found, in order: media, selector, property, value.
	 *
	 * @return void
	 */
	private static function walk( string $css, string $media, array &$events ): void {
		$length = strlen( $css );
		$offset = 0;

		while ( $offset < $length ) {
			$open = strpos( $css, '{', $offset );

			if ( false === $open ) {
				return;
			}

			$head  = trim( substr( $css, $offset, $open - $offset ) );
			$depth = 1;
			$end   = $open + 1;

			while ( $end < $length && $depth > 0 ) {
				$depth += ( '{' === $css[ $end ] ? 1 : 0 ) - ( '}' === $css[ $end ] ? 1 : 0 );
				++$end;
			}

			$inner  = substr( $css, $open + 1, $end - $open - 2 );
			$offset = $end;

			if ( 0 === strpos( $head, '@' ) ) {
				self::walk( $inner, $media . '/' . preg_replace( '/\s+/', ' ', $head ), $events );
				continue;
			}

			self::declarations( $media, (string) preg_replace( '/\s*,\s*/', ', ', (string) preg_replace( '/\s+/', ' ', $head ) ), $inner, $events );
		}
	}

	/**
	 * Add the declarations of one rule.
	 *
	 * @param string                         $media    The at-rules the rule is inside.
	 * @param string                         $selector The selector.
	 * @param string                         $inner    The declarations.
	 * @param array<int, array<int, string>> $events   The declarations found so far.
	 *
	 * @return void
	 */
	private static function declarations( string $media, string $selector, string $inner, array &$events ): void {
		foreach ( explode( ';', $inner ) as $declaration ) {
			if ( false === strpos( $declaration, ':' ) ) {
				continue;
			}

			[ $property, $value ] = explode( ':', $declaration, 2 );

			$events[] = [ $media, $selector, trim( $property ), (string) preg_replace( '/\s+/', ' ', trim( $value ) ) ];
		}
	}
}
