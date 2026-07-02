<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;

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

	use Sanitizes_Css_Identifier;

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
	 * Derive the CSS custom-property name from a token id, optionally namespaced to a token set.
	 *
	 * With no namespace the canonical name is produced (`semantic.color.text` →
	 * `--kb-token--semantic--color--text`). With a namespace the set slug is inserted as a leading
	 * segment after the prefix (`semantic.color.text`, `dark` →
	 * `--kb-token--dark--semantic--color--text`), so every set's tokens occupy their own namespace while
	 * sharing the one derivation rule — names and ids cannot drift, namespaced or not.
	 *
	 * @since TBD
	 *
	 * @param string $id        The DTCG dot-path id.
	 * @param string $namespace Optional token-set slug to namespace the variable under. Empty yields the
	 *                          canonical (un-namespaced) name.
	 *
	 * @return string The derived CSS custom-property name.
	 */
	public static function from_id( string $id, string $namespace = '' ): string {
		$name = str_replace( '.', '--', $id );

		if ( $namespace !== '' ) {
			$namespace = self::sanitize_identifier( $namespace ) . '--';
		}

		return self::PREFIX . $namespace . $name;
	}
}
