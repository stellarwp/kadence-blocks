<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;

/**
 * Single source for the preset class a selected design-token preset outputs, so the class the editor
 * adds and the class the projected CSS targets can never drift apart.
 *
 * A block's preset is an ADDITIVE class (not a register_block_style() block style), so it composes
 * with any other block style rather than replacing it. The editor adds the class via the shared kbPreset
 * save/preview filters (see src/early-filters.js), mirroring the same sanitizer used here.
 *
 * @since TBD
 */
final class Style {

	use Sanitizes_Css_Identifier;

	/**
	 * The class prefix a selected preset outputs, shared by every Kadence block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CLASS_PREFIX = 'kb-preset--';

	/**
	 * The class a preset slug outputs, e.g. "secondary" => "kb-preset--secondary". Mirrors the JS
	 * kbPresetClassName() sanitizer so the class always matches the selector the projected CSS targets.
	 *
	 * @since TBD
	 *
	 * @param string $preset The preset slug.
	 *
	 * @return string
	 */
	public static function preset_class( string $preset ): string {
		return self::CLASS_PREFIX . self::sanitize_identifier( $preset );
	}
}
