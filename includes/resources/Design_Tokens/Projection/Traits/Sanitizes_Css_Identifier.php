<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits;

/**
 * Shared sanitizer for a CSS identifier segment (a block name, variant slug or property), used by the
 * projection helpers that build selectors and custom-property names.
 *
 * @since TBD
 */
trait Sanitizes_Css_Identifier {

	/**
	 * Reduce a segment to a CSS-identifier-safe form, so a variant slug, block name or property can never
	 * break out of a selector or a custom-property name. Keeps word characters and hyphens; collapses
	 * anything else to a single hyphen.
	 *
	 * @since TBD
	 *
	 * @param string $segment The raw segment.
	 *
	 * @return string
	 */
	private static function sanitize_identifier( string $segment ): string {
		return (string) preg_replace( '/[^A-Za-z0-9_-]+/', '-', $segment );
	}
}
