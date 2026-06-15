<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Slot;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Slot\Contracts\Abstract_Target;

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
final class Gap_Target extends Abstract_Target {

	/**
	 * The projection key a token declares to claim a gap slot.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	protected const PROJECTION = 'kb_gap_slot';

	/**
	 * The custom-property prefix Kadence Blocks references each gap slug under.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	protected const VAR_PREFIX = '--global-kb-gap-';

	/**
	 * The gap variable slugs Kadence Blocks references (see class-kadence-blocks-css.php $gap_sizes). A
	 * claim on any other value — including the literal-only gutter presets (narrow/wide/widest) — is
	 * ignored so the override can never point at a slug no block reads.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	protected const SLOTS = [ 'none', 'xs', 'sm', 'md', 'lg' ];
}
