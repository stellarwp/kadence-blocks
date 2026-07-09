<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits;

/**
 * Shared converter from a resolved CSS length to a raw pixel number, used by every adapter/catalog
 * that overlays a token-resolved default onto a block attribute typed `number` where the block
 * expects a `px` value.
 *
 * @since TBD
 */
trait Converts_Number_To_Px {

	/**
	 * Convert a resolved CSS length to a raw pixel number, assuming the browser/CSS default root
	 * font size (16px) for `rem`/`em` — the only units this token family's baseline values use.
	 * Returns null for a value this converter cannot safely convert (already px, or an unrecognized
	 * unit), so the caller can leave the attribute at its own default rather than guess.
	 *
	 * @since TBD
	 *
	 * @param string $length A resolved CSS length, e.g. "1.5rem", "24px".
	 *
	 * @return float|null The pixel value, or null when the unit is not rem/em/px.
	 */
	private function to_px( string $length ): ?float {
		if ( ! preg_match( '/^(-?[0-9.]+)(px|rem|em)$/', trim( $length ), $matches ) ) {
			return null;
		}

		$number = (float) $matches[1];

		return $matches[2] === 'px' ? $number : $number * 16.0;
	}
}
