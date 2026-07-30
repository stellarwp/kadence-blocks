<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;

/**
 * Builds the color-only, single-library palette switch layer: one `[data-kb-palette="<id>"]` selector per
 * palette that re-declares the matched element's subtree with that palette's fully-resolved colors.
 *
 * The library's `$current` palette is applied at `:root` by the resolver (see Effective_Palettes / Token_Resolver),
 * so every block follows it by default. A block that carries a per-instance palette override renders a
 * `data-kb-palette="<id>"` attribute; the matching selector here re-declares that palette's resolved color
 * vars — primitives, the semantics that alias them, and shadow composites — as literals on the element, so
 * its subtree resolves against the chosen palette instead of the library `$current`.
 *
 * A single attribute-presence `[data-kb-palette]` rule re-emits the canonical `--kb-token--preset--*`
 * declarations (var()-preserving) so a preset var re-resolves against the subtree's re-declared semantics —
 * a preset Button whose color aliases a palette-changed token re-skins with the rest of its subtree, at any
 * palette, respecting preset selection (a selected preset keeps its own binding, re-tinted).
 *
 * This is the narrow color-only replacement for the cross-library `[data-kb-token-set]` switch removed in the
 * Phase A collapse: it stays within the single active library and swaps only colors. Accepted v1 limitation: the
 * numbered `--global-palette*` bridges resolve at `:root`, so a `[data-kb-palette]` subtree live-swaps content
 * that reads `--kb-token--*` color vars (directly or through a preset), but not blocks that read a numbered
 * `--global-paletteN` bridge directly.
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
	 * Build the palette switch layer: a shared `[data-kb-palette]{ --kb-token--preset--*: … }` rule (so
	 * preset vars re-resolve inside any palette subtree) followed by one
	 * `[data-kb-palette="<id>"]{ <css-var>: <literal>; … }` selector per palette. A palette with no resolved
	 * color vars emits nothing.
	 *
	 * @since TBD
	 *
	 * @param array<string, array<string, string>> $palettes             palette id => ( css-var => resolved literal ).
	 * @param string                               $preset_declarations The canonical `--kb-token--preset--*`
	 *                                                                    declarations to re-emit under the shared
	 *                                                                    presence selector (already sanitized).
	 *
	 * @return string
	 */
	public function css( array $palettes, string $preset_declarations = '' ): string {
		$css = '';

		if ( $preset_declarations !== '' ) {
			$css .= '[' . self::SWITCH_ATTR . ']{' . $preset_declarations . '}';
		}

		foreach ( $palettes as $id => $vars ) {
			$declarations = '';

			foreach ( $vars as $var => $value ) {
				$declarations .= (string) $var . ':' . $this->sanitize_value( (string) $value ) . ';';
			}

			if ( $declarations === '' ) {
				continue;
			}

			$css .= '[' . self::SWITCH_ATTR . '="' . self::sanitize_identifier( (string) $id ) . '"]{' . $declarations . '}';
		}

		return $css;
	}
}
