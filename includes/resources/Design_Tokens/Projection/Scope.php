<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

/**
 * The single CSS scope every projector emits its custom properties under.
 *
 * Bare :root makes the variables live everywhere KB prints them (front end and editor iframe alike).
 * :where(.kb-tokens) is an additional zero-specificity hook for opt-in / variant scoping. Neither
 * selector weighs more than a bare :root, and nothing emitted under this scope is !important, so a
 * per-instance override always wins by ordinary cascade.
 *
 * @since TBD
 */
final class Scope {

	/**
	 * The root scope selector shared by the projection CSS builders.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ROOT = ':root,:root:where(.kb-tokens)';

	/**
	 * The root scope selector shared by the projection CSS builders.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function root(): string {
		return self::ROOT;
	}
}
