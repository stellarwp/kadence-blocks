<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

/**
 * The single CSS scope every projector emits its custom properties under.
 *
 * Bare :root makes the variables live everywhere KB prints them (front end and editor iframe alike).
 * :where(.kb-tokens) is an additional zero-specificity hook for opt-in / preset scoping. Neither
 * selector weighs more than a bare :root, and nothing emitted under this scope is !important, so a
 * per-instance override always wins by ordinary cascade.
 *
 * @since 3.8.0
 */
final class Scope {

	/**
	 * The root scope selector shared by the projection CSS builders.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const ROOT = ':root,:root:where(.kb-tokens)';

	/**
	 * The root scope selector shared by the projection CSS builders.
	 *
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public static function root(): string {
		return self::ROOT;
	}
}
