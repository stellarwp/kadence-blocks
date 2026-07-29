<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;

/**
 * Shared helper for a dynamic (PHP-rendered) block that adds its selected per-block color-palette override to
 * its own wrapper markup. A static (save.js) block gets this attribute from the editor save filter instead, but
 * a dynamic block builds its wrapper attributes in PHP, so it composes this trait and merges
 * {@see self::palette_attributes()} into that list.
 *
 * The attribute is the `data-kb-palette="<id>"` the palette projector's `[data-kb-palette]` switch layer
 * re-points the block's canonical color vars through. The id runs through the shared
 * {@see Sanitizes_Css_Identifier} sanitizer so it always matches the switch selector; this trait is only the
 * "read the attribute, produce the wrapper args" seam so every block does it identically.
 *
 * @since TBD
 */
trait Renders_Palette_Attribute {

	use Sanitizes_Css_Identifier;

	/**
	 * The `data-kb-palette` wrapper attribute a block's `kbPalette` selection outputs, as a single-entry map
	 * (or an empty map when nothing is selected). A non-string or empty selection yields nothing, so a block can
	 * pass the raw attribute straight through.
	 *
	 * @since TBD
	 *
	 * @param mixed $kb_palette The block's `kbPalette` attribute (the selected palette id).
	 *
	 * @return array<string, string>
	 */
	protected function palette_attributes( $kb_palette ): array {
		if ( ! is_string( $kb_palette ) || $kb_palette === '' ) {
			return [];
		}

		return [ 'data-kb-palette' => self::sanitize_identifier( $kb_palette ) ];
	}
}
