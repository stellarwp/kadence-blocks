<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Slot;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Slot\Contracts\Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

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
final class Spacing_Target implements Target {

	/**
	 * The projection key a token declares to claim a spacing slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PROJECTION = 'kb_spacing_slot';

	/**
	 * The custom-property prefix Kadence Blocks emits each spacing slug under.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VAR_PREFIX = '--global-kb-spacing-';

	/**
	 * The spacing slugs Kadence Blocks defines (see includes/init.php / class-kadence-blocks-css.php).
	 * A claim on any other slug is ignored so the override can never point at a slug no block reads.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const SLOTS = [ 'ss-auto', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ];

	/**
	 * The claimed spacing slug, e.g. "lg".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slot;

	/**
	 * @param string $slot The claimed spacing slug.
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
	 * Resolve a token's kb_spacing_slot config to a target, or null when the token declares no usable
	 * spacing slot (so callers skip it).
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
	 * The Kadence Blocks custom property this slug is emitted under, e.g. "--global-kb-spacing-lg".
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css_property(): string {
		return self::VAR_PREFIX . $this->slot;
	}
}
