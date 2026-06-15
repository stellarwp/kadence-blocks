<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts\Abstract_Target;

/**
 * Normalizes a token's "kb_spacing_slot" projection into one of Kadence Blocks' fixed spacing slugs.
 *
 * Kadence Blocks renders spacing attributes that hold a preset slug (sm/md/lg/…) as
 * `var(--global-kb-spacing-<slug>, <literal>)`, and emits those slugs' values as plain literals it owns
 * (no filter hook, unlike colors and font sizes). A spacing token claims one of those slugs with
 * `'kb_spacing_slot' => 'lg'`; the Css_Var builder then redefines `--global-kb-spacing-lg` as the token
 * variable, so every block already storing that slug follows the token with no block change.
 *
 * The slug is validated against the set Kadence Blocks ships, so a typo never emits a dead override.
 *
 * @since TBD
 */
final class Spacing_Target extends Abstract_Target {

	/**
	 * The projection key a token declares to claim a spacing slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	protected const PROJECTION = 'kb_spacing_slot';

	/**
	 * The custom-property prefix Kadence Blocks emits each spacing slug under.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	protected const VAR_PREFIX = '--global-kb-spacing-';

	/**
	 * The spacing slugs Kadence Blocks defines (see includes/init.php / class-kadence-blocks-css.php).
	 * A claim on any other slug is ignored so the override can never point at a slug no block reads.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	protected const SLOTS = [ 'ss-auto', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ];
}
