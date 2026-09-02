<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The override-suppression sentinels, single-sourced so the validator, the store and the Resolver
 * agree on the exact spelling.
 *
 * The shipped baseline carries the full document; the store holds only sparse overrides deep-merged
 * on top. Two sentinels let an override suppress a baseline entry without physically deleting it (which
 * would break the deep-merge):
 *
 *   - "$value": null      → RESET: fall back to the baseline value at this path.
 *   - "$disabled": true   → DISABLE: remove this token from the effective document entirely.
 *
 * $disabled is spelled with the DTCG-reserved "$" prefix so it can never collide with a literal token
 * field named "disabled". Both sentinels are valid ONLY in the overrides context; the baseline must
 * carry concrete values. This locks the spelling the design doc left open.
 *
 * @since TBD
 */
final class Sentinels {

	/**
	 * The leaf key whose boolean-true value removes a token from the effective document.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DISABLED_KEY = '$disabled';

	/**
	 * The leaf key whose null value resets a token to its baseline.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VALUE_KEY = '$value';

	/**
	 * The leaf key that carries the DISABLE sentinel.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_disabled_key(): string {
		return self::DISABLED_KEY;
	}

	/**
	 * The DTCG $value key, which also carries the RESET sentinel when null.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_value_key(): string {
		return self::VALUE_KEY;
	}

	/**
	 * Whether a decoded leaf is the RESET sentinel: an explicit "$value": null.
	 *
	 * Uses array_key_exists rather than isset so a present-but-null $value is detected (isset would
	 * treat it as absent).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded leaf node.
	 *
	 * @return bool
	 */
	public static function is_reset( array $leaf ): bool {
		return array_key_exists( self::VALUE_KEY, $leaf ) && $leaf[ self::VALUE_KEY ] === null;
	}

	/**
	 * Whether a decoded leaf carries the DISABLE sentinel key (regardless of its value). Whether the
	 * value is the required boolean true is a validation concern, not a detection one.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded leaf node.
	 *
	 * @return bool
	 */
	public static function has_disabled( array $leaf ): bool {
		return array_key_exists( self::DISABLED_KEY, $leaf );
	}

	/**
	 * Whether a decoded leaf is a well-formed DISABLE sentinel: "$disabled": true exactly.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded leaf node.
	 *
	 * @return bool
	 */
	public static function is_disabled( array $leaf ): bool {
		return self::has_disabled( $leaf ) && $leaf[ self::DISABLED_KEY ] === true;
	}
}
