<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

/**
 * Derives the canonical CSS custom-property name from a token id.
 *
 * The id is a DTCG dot-path (e.g. "semantic.color.button-bg"). The variable name is never
 * declared — it is produced by a single deterministic rule so ids and var names cannot drift:
 *
 *   prefix "--kb-token--", then replace each "." with "--".
 *
 *   semantic.color.button-bg  →  --kb-token--semantic--color--button-bg
 *
 * The --kb-token-- prefix keeps the variable inside KB's --global-kb-* family.
 *
 * @since TBD
 */
final class Css_Var {

	private const PREFIX = '--kb-token--';

	/**
	 * The shared custom-property prefix every token variable carries ("--kb-token--").
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_prefix(): string {
		return self::PREFIX;
	}

	/**
	 * Derive the canonical CSS custom-property name from a token id.
	 *
	 * @since TBD
	 *
	 * @param string $id The DTCG dot-path id.
	 *
	 * @return string The derived CSS custom-property name.
	 */
	public static function from_id( string $id ): string {
		return self::PREFIX . str_replace( '.', '--', $id );
	}
}
