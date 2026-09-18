<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * A "slot" projection target: a token that claims one of Kadence Blocks' fixed CSS custom-property slots
 * for a dimension family (spacing, gap, …).
 *
 * Kadence Blocks renders an attribute holding a preset slug as `var(--global-kb-<family>-<slug>,
 * <literal>)` but ships those slug values as plain literals with no filter to override (unlike colors and
 * font sizes). A token claims a slot, and the Css_Var builder redefines that custom property as the
 * token's variable — so every block already storing the slug follows the token with no block change.
 * Implementations validate against the slugs Kadence Blocks ships so an override never points at a slug
 * no block reads.
 *
 * @since TBD
 */
interface Target {

	/**
	 * The projection key a token declares to claim a slot in this family, e.g. "kb_spacing_slot".
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_projection_key(): string;

	/**
	 * Resolve a token's slot projection to a target, or null when the token declares no usable slot (so
	 * callers skip it).
	 *
	 * @since TBD
	 *
	 * @param Token_Definition $token The token definition.
	 *
	 * @return self|null
	 */
	public static function from_token( Token_Definition $token ): ?self;

	/**
	 * The Kadence Blocks custom property this slot is emitted under, e.g. "--global-kb-spacing-lg".
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css_property(): string;

	/**
	 * The claimed slug, e.g. "lg".
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function slot(): string;

	/**
	 * The id of the primitive dimension token backing a slug in this family, e.g.
	 * "primitive.dimension.spacing.lg". For spacing/gap this is the projection-holding token itself; for
	 * font-size it is the primitive the projection-holding semantic aliases. Used to resolve a slug's
	 * scale value.
	 *
	 * @since TBD
	 *
	 * @param string $slug The claimed slug, e.g. "lg".
	 *
	 * @return string
	 */
	public static function get_primitive_id( string $slug ): string;
}
