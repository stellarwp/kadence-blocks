<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

/**
 * Shared helper for a dynamic (PHP-rendered) block that adds its selected design-token variant classes to
 * its own markup. A static (save.js) block gets these classes from the editor save filter instead, but a
 * dynamic block builds its class list in PHP, so it composes this trait and merges {@see self::variant_classes()}
 * into that list.
 *
 * The classes are the same `kb-variant--<group>--<variant>` shape the projector's scoped CSS targets and the
 * editor's preview/save filters emit — one per variant set (axis) the block's `kbVariants` attribute selects.
 * The shape itself has a single source, {@see Style::group_variant_class()}; this trait is only the "read the
 * attribute map, produce the list" seam so every block does it identically.
 *
 * @since TBD
 */
trait Renders_Variant_Classes {

	/**
	 * The `kb-variant--<group>--<variant>` classes a block's `kbVariants` attribute selects — one per variant
	 * set (axis) with a non-empty selection. A non-array attribute, or an entry with an empty group or
	 * variant, yields nothing, so a block can pass the raw attribute straight through.
	 *
	 * @since TBD
	 *
	 * @param mixed $kb_variants The block's `kbVariants` attribute (variant-set group slug => variant slug map).
	 *
	 * @return string[]
	 */
	protected function variant_classes( $kb_variants ): array {
		if ( ! is_array( $kb_variants ) ) {
			return [];
		}

		$classes = [];

		foreach ( $kb_variants as $group => $variant ) {
			$group   = (string) $group;
			$variant = is_string( $variant ) ? $variant : '';

			if ( $group === '' || $variant === '' ) {
				continue;
			}

			$classes[] = Style::group_variant_class( $group, $variant );
		}

		return $classes;
	}
}
