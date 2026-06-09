<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * Normalizes a token's "kadence_slot" projection into a Kadence color-palette slot.
 *
 * The Kadence ecosystem keys nine color slots palette1…palette9. That slug is the identifier in BOTH
 * KB's own kadence_blocks_colors option AND the Kadence theme's kadence_global_palette option, and is
 * also the suffix of the --global-paletteN CSS variable. Both the Css_Var legacy bridge (which rewrites
 * the --global-paletteN filter on non-Kadence sites) and the Kadence_Option projector (which writes the
 * two palette options) resolve through this one class, so the slot they target can never drift.
 *
 * A token opts in with a bare slug string under "kadence_slot":
 *
 *   'kadence_slot' => 'palette1'   // semantic.color.button-bg => slot "palette1"
 *
 * Font-size slots (sm/md/lg/…) also travel under "kadence_slot" but are NOT palette slots; from_token()
 * returns null for them, so callers that only care about colors skip them cleanly.
 *
 * @since TBD
 */
final class Kadence_Palette_Slot {

	/**
	 * The projection key a token declares to claim a Kadence slot.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PROJECTION = 'kadence_slot';

	/**
	 * Matches the nine Kadence palette slots, palette1…palette9.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLOT_PATTERN = '/^palette[1-9]$/';

	/**
	 * The palette slot slug, e.g. "palette1". This is the entry slug in both palette options and the
	 * suffix of --global-paletteN.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slug;

	/**
	 * @param string $slug Palette slot slug (palette1…palette9).
	 */
	private function __construct( string $slug ) {
		$this->slug = $slug;
	}

	/**
	 * The projection key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_projection_key(): string {
		return self::PROJECTION;
	}

	/**
	 * Resolve a token's kadence_slot config to a palette slot, or null when the token declares no
	 * kadence_slot, or declares one that is not a palette slot (e.g. a font-size key).
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

		if ( ! is_string( $slot ) || preg_match( self::SLOT_PATTERN, $slot ) !== 1 ) {
			return null;
		}

		return new self( $slot );
	}
}
