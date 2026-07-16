<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The responsive / fluid-clamp leaf-extension vocabulary this module owns, single-sourced so the
 * validator, the Resolver, the write-back adapters and the JSON Schema generator agree on the exact
 * spelling of every key and on which $types may carry the shape.
 *
 * A responsive-capable dimension / lineHeight leaf keeps a plain scalar $value (the desktop / base
 * value, so flat DTCG consumers still work) and carries the per-breakpoint or fluid shape under its
 * own $extensions:
 *
 *   "$extensions": { "com.kadence.designTokens": {
 *       "responsive": { "tablet": "1.5rem", "mobile": "1rem" }   // OR
 *       "clamp":      { "min": "1.1rem", "preferred": "0.995rem + 0.326vw", "max": "1.25rem" }
 *   } }
 *
 * "responsive" and "clamp" are mutually exclusive on one leaf. Both are optional: a leaf with neither
 * (or with no $extensions at all) is a flat token — indistinguishable from a pre-responsive override.
 * The responsive_of() / clamp_of() readers are the single seam every consumer goes through, so old and
 * new leaf shapes are interpreted identically in one place.
 *
 * @since TBD
 */
final class Responsive {

	/**
	 * The key carrying the per-breakpoint (stepped) override map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const RESPONSIVE_KEY = 'responsive';

	/**
	 * The tablet (max-width) breakpoint override key inside the responsive map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TABLET_KEY = 'tablet';

	/**
	 * The mobile (max-width) breakpoint override key inside the responsive map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const MOBILE_KEY = 'mobile';

	/**
	 * The key carrying the structured fluid-clamp shape.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CLAMP_KEY = 'clamp';

	/**
	 * The clamp minimum-bound slot key.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CLAMP_MIN_KEY = 'min';

	/**
	 * The clamp preferred (fluid) slot key; carries a calc-style expression.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CLAMP_PREFERRED_KEY = 'preferred';

	/**
	 * The clamp maximum-bound slot key.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CLAMP_MAX_KEY = 'max';

	/**
	 * The key carrying the per-breakpoint override map.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_responsive_key(): string {
		return self::RESPONSIVE_KEY;
	}

	/**
	 * The tablet breakpoint override key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_tablet_key(): string {
		return self::TABLET_KEY;
	}

	/**
	 * The mobile breakpoint override key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_mobile_key(): string {
		return self::MOBILE_KEY;
	}

	/**
	 * The breakpoint override keys, in cascade order (tablet, then mobile).
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function get_breakpoint_keys(): array {
		return [ self::TABLET_KEY, self::MOBILE_KEY ];
	}

	/**
	 * The key carrying the structured fluid-clamp shape.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_clamp_key(): string {
		return self::CLAMP_KEY;
	}

	/**
	 * The clamp minimum-bound slot key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_clamp_min_key(): string {
		return self::CLAMP_MIN_KEY;
	}

	/**
	 * The clamp preferred (fluid) slot key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_clamp_preferred_key(): string {
		return self::CLAMP_PREFERRED_KEY;
	}

	/**
	 * The clamp maximum-bound slot key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_clamp_max_key(): string {
		return self::CLAMP_MAX_KEY;
	}

	/**
	 * Whether a $type may carry the responsive / clamp shape. Only the dimension and lineHeight scalar
	 * types are responsive-capable; single-value types (fontFamily / fontWeight / fontStyle /
	 * textTransform) and composites are not.
	 *
	 * @since TBD
	 *
	 * @param string $type The token $type.
	 *
	 * @return bool
	 */
	public static function is_responsive_capable( string $type ): bool {
		return $type === Token_Type::get_type_dimension()
			|| $type === Token_Type::get_type_line_height();
	}

	/**
	 * The module's leaf-extension map ($extensions.com.kadence.designTokens) for a leaf, or an empty
	 * array when the leaf carries no such extension. The single seam for reading the shape.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded token leaf.
	 *
	 * @return array<string, mixed>
	 */
	public static function extension_of( array $leaf ): array {
		$extensions = $leaf[ Extensions::get_extensions_key() ] ?? null;

		if ( ! is_array( $extensions ) ) {
			return [];
		}

		$namespace = $extensions[ Extensions::get_namespace() ] ?? null;

		return is_array( $namespace ) ? $namespace : [];
	}

	/**
	 * The responsive (stepped) override map for a leaf, or null when absent. A present-but-non-array
	 * shape returns the raw value so the validator can reject it; readers should treat non-array as
	 * "no overrides".
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded token leaf.
	 *
	 * @return mixed The responsive map, or null when the key is absent.
	 */
	public static function responsive_of( array $leaf ) {
		$extension = self::extension_of( $leaf );

		return $extension[ self::RESPONSIVE_KEY ] ?? null;
	}

	/**
	 * The structured clamp map for a leaf, or null when absent. A present-but-non-array shape returns
	 * the raw value so the validator can reject it.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded token leaf.
	 *
	 * @return mixed The clamp map, or null when the key is absent.
	 */
	public static function clamp_of( array $leaf ) {
		$extension = self::extension_of( $leaf );

		return $extension[ self::CLAMP_KEY ] ?? null;
	}

	/**
	 * Whether the leaf declares a responsive (stepped) shape.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded token leaf.
	 *
	 * @return bool
	 */
	public static function has_responsive( array $leaf ): bool {
		return array_key_exists( self::RESPONSIVE_KEY, self::extension_of( $leaf ) );
	}

	/**
	 * Whether the leaf declares a structured clamp shape.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded token leaf.
	 *
	 * @return bool
	 */
	public static function has_clamp( array $leaf ): bool {
		return array_key_exists( self::CLAMP_KEY, self::extension_of( $leaf ) );
	}
}
