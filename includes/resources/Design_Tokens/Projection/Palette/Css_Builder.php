<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;

/**
 * Builds the color-only, single-set palette switch layer: one `[data-kb-palette="<id>"]` selector per
 * palette that re-points the canonical color vars for the matched element's subtree.
 *
 * The set's `$current` palette is applied at `:root` by the resolver (see Effective_Palettes / Token_Resolver),
 * so every block follows it by default. A block that carries a per-instance palette override renders a
 * `data-kb-palette="<id>"` attribute; the matching selector here re-declares each of that palette's
 * `--kb-token--<color-token>` vars on the element, so its subtree — and every semantic color that reads one
 * of those vars through the alias cascade — resolves against the chosen palette instead of the set `$current`.
 *
 * This is the narrow color-only replacement for the cross-set `[data-kb-token-set]` switch removed in the
 * Phase A collapse: it stays within the single active set and swaps only colors. Accepted v1 limitation: the
 * legacy `--global-*` color bridges resolve at `:root`, so a `[data-kb-palette]` subtree live-swaps content
 * that reads `--kb-token--*` color vars directly, but not the `:root`-resolved bridge values.
 *
 * Pure: no WordPress calls, no globals, no side effects. The WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Identifier;
	use Sanitizes_Css_Value;

	/**
	 * The HTML attribute a block sets to render its subtree against a specific palette.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SWITCH_ATTR = 'data-kb-palette';

	/**
	 * The attribute name a block wrapper carries to select a palette for its subtree ("data-kb-palette").
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_switch_attribute(): string {
		return self::SWITCH_ATTR;
	}

	/**
	 * Build the palette switch layer from each palette's flattened swatches. One
	 * `[data-kb-palette="<id>"]{ --kb-token--<token>: <value>; … }` selector per palette; a palette with no
	 * swatches emits nothing.
	 *
	 * @since TBD
	 *
	 * @param array<string, array<string, string>> $palettes palette id => ( token dot-path => swatch value ).
	 *
	 * @return string
	 */
	public function css( array $palettes ): string {
		$css = '';

		foreach ( $palettes as $id => $swatches ) {
			$declarations = '';

			foreach ( $swatches as $token => $value ) {
				$declarations .= Css_Var::from_id( (string) $token ) . ':' . $this->render_value( (string) $value ) . ';';
			}

			if ( $declarations === '' ) {
				continue;
			}

			$css .= '[' . self::SWITCH_ATTR . '="' . self::sanitize_identifier( (string) $id ) . '"]{' . $declarations . '}';
		}

		return $css;
	}

	/**
	 * Render a swatch value to a CSS value: a whole-string alias becomes a `var(--kb-token--<target>)`
	 * reference (so it chains to the canonical token), and a literal is sanitized. The var() name derives
	 * from the alias grammar and survives sanitization untouched.
	 *
	 * @since TBD
	 *
	 * @param string $value The swatch value (literal color or alias).
	 *
	 * @return string
	 */
	private function render_value( string $value ): string {
		if ( Alias::is_alias( $value ) ) {
			return 'var(' . Css_Var::from_id( Alias::path_of( $value ) ) . ')';
		}

		return $this->sanitize_value( $value );
	}
}
