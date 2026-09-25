<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset;

/**
 * Shared helper for a dynamic (PHP-rendered) block that adds its selected design-token preset class to
 * its own markup. A static (save.js) block gets this class from the editor save filter instead, but a
 * dynamic block builds its class list in PHP, so it composes this trait and merges {@see self::preset_classes()}
 * into that list.
 *
 * The class is the same `kb-preset--<preset>` shape the projector's scoped CSS targets and the editor's
 * preview/save filters emit for the block's `kbPreset` selection. The shape itself has a single source,
 * {@see Style::preset_class()}; this trait is only the "read the attribute, produce the list" seam so every
 * block does it identically.
 *
 * @since TBD
 */
trait Renders_Preset_Classes {

	/**
	 * The `kb-preset--<preset>` class a block's `kbPreset` selection outputs, followed by the classes a
	 * class-painted preset puts on the element (or an empty list when nothing is selected). A non-string or
	 * empty selection yields nothing, so a block can pass the raw attribute straight through.
	 *
	 * @since TBD
	 *
	 * @param mixed  $kb_preset   The block's `kbPreset` attribute (the selected preset slug).
	 * @param string $theme_class The selected preset's space-separated theme classes, or '' when it has none.
	 *
	 * @return string[]
	 */
	protected function preset_classes( $kb_preset, string $theme_class = '' ): array {
		$preset = is_string( $kb_preset ) ? $kb_preset : '';

		if ( $preset === '' ) {
			return [];
		}

		$classes = [ Style::preset_class( $preset ) ];

		foreach ( preg_split( '/\s+/', trim( $theme_class ) ) ?: [] as $class ) {
			if ( $class !== '' ) {
				$classes[] = sanitize_html_class( $class );
			}
		}

		return array_values( array_unique( $classes ) );
	}
}
