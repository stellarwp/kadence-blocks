<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

/**
 * Shared defense-in-depth sanitizer for a CSS custom-property value, used by the projection CSS builders.
 *
 * @since TBD
 */
trait Sanitizes_Css_Value {

	/**
	 * Defense-in-depth sanitizer for a custom-property value.
	 *
	 * Values from the Resolver are already well-formed; this only guarantees a stray value can never
	 * break out of the declaration or inject a rule (strips "{", "}", ";", "<", ">" and control
	 * characters). Not esc_attr(), which would mangle legitimate CSS such as the quotes/commas in a
	 * font-family stack.
	 *
	 * @since TBD
	 *
	 * @param string $value The raw CSS value.
	 *
	 * @return string
	 */
	private function sanitize_value( string $value ): string {
		$value = preg_replace( '/[\x00-\x1F\x7F]/', '', $value ) ?? '';

		return str_replace( [ '{', '}', ';', '<', '>' ], '', $value );
	}
}
