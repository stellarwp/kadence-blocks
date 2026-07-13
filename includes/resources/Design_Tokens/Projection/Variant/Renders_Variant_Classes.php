<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

/**
 * Shared helper for a dynamic (PHP-rendered) block that adds its selected design-token variant class to
 * its own markup. A static (save.js) block gets this class from the editor save filter instead, but a
 * dynamic block builds its class list in PHP, so it composes this trait and merges {@see self::variant_classes()}
 * into that list.
 *
 * The class is the same `kb-variant--<variant>` shape the projector's scoped CSS targets and the editor's
 * preview/save filters emit for the block's `kbVariant` selection. The shape itself has a single source,
 * {@see Style::variant_class()}; this trait is only the "read the attribute, produce the list" seam so every
 * block does it identically.
 *
 * @since TBD
 */
trait Renders_Variant_Classes {

	/**
	 * The `kb-variant--<variant>` class a block's `kbVariant` selection outputs, as a single-element list (or
	 * an empty list when nothing is selected). A non-string or empty selection yields nothing, so a block can
	 * pass the raw attribute straight through.
	 *
	 * @since TBD
	 *
	 * @param mixed $kb_variant The block's `kbVariant` attribute (the selected variant slug).
	 *
	 * @return string[]
	 */
	protected function variant_classes( $kb_variant ): array {
		$variant = is_string( $kb_variant ) ? $kb_variant : '';

		if ( $variant === '' ) {
			return [];
		}

		return [ Style::variant_class( $variant ) ];
	}
}
