<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Slot;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Slot\Contracts\Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * Normalizes a token's "kb_gap_slot" projection into one of Kadence Blocks' fixed gap slugs.
 *
 * Kadence Blocks renders gap/gutter attributes that hold a preset slug as
 * `var(--global-kb-gap-<slug>, <literal>)`. Unlike spacing, KB does not even define those `--global-kb-gap-*`
 * properties (they resolve to the literal fallback today), so a gap token claims one with
 * `'kb_gap_slot' => 'md'`; the Css_Var builder then defines `--global-kb-gap-md` as the token variable,
 * and every block already storing that slug — including the alias slugs that point at it, e.g. "default"
 * → `--global-kb-gap-md` — follows the token with no block change.
 *
 * The slot is validated against the gap variables KB references, so a typo never emits a dead override.
 * The literal-only gutter presets KB ships (narrow/wide/widest) have no variable to redirect and are not
 * slots.
 *
 * @since TBD
 */
final class Gap_Target implements Target {

	/**
	 * The projection key a token declares to claim a gap slot.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PROJECTION = 'kb_gap_slot';

	/**
	 * The custom-property prefix Kadence Blocks references each gap slug under.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VAR_PREFIX = '--global-kb-gap-';

	/**
	 * The gap variable slugs Kadence Blocks references (see class-kadence-blocks-css.php $gap_sizes). A
	 * claim on any other value — including the literal-only gutter presets (narrow/wide/widest) — is
	 * ignored so the override can never point at a slug no block reads.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const SLOTS = [ 'none', 'xs', 'sm', 'md', 'lg' ];

	/**
	 * The claimed gap slug, e.g. "md".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slot;

	/**
	 * @param string $slot The claimed gap slug.
	 */
	private function __construct( string $slot ) {
		$this->slot = $slot;
	}

	/**
	 * Get the projection key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_projection_key(): string {
		return self::PROJECTION;
	}

	/**
	 * Resolve a token's kb_gap_slot config to a target, or null when the token declares no usable gap slot
	 * (so callers skip it).
	 *
	 * @since TBD
	 *
	 * @param Token_Definition $token The token definition.
	 *
	 * @return self|null
	 */
	public static function from_token( Token_Definition $token ): ?self {
		if ( ! $token->has_projection( self::PROJECTION ) ) {
			return null;
		}

		$slot = $token->projections[ self::PROJECTION ] ?? null;

		if ( ! is_string( $slot ) || ! in_array( $slot, self::SLOTS, true ) ) {
			return null;
		}

		return new self( $slot );
	}

	/**
	 * The Kadence Blocks custom property this slug is emitted under, e.g. "--global-kb-gap-md".
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css_property(): string {
		return self::VAR_PREFIX . $this->slot;
	}
}
