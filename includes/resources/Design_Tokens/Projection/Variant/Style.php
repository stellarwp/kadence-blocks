<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;

/**
 * Single source for the variant class a selected design-token variant outputs, so the class the editor
 * adds and the class the projected CSS targets can never drift apart.
 *
 * A block's variant is an ADDITIVE class (not a register_block_style() block style), so it composes
 * with any other block style rather than replacing it. The editor adds the class via the shared kbVariant
 * save/preview filters (see src/early-filters.js), mirroring the same sanitizer used here.
 *
 * @since TBD
 */
final class Style {

	use Sanitizes_Css_Identifier;

	/**
	 * The class prefix a selected variant outputs, shared by every Kadence block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CLASS_PREFIX = 'kb-variant--';

	/**
	 * The class a variant slug outputs, e.g. "secondary" => "kb-variant--secondary". Mirrors the JS
	 * kbVariantClassName() sanitizer so the class always matches the selector the projected CSS targets.
	 *
	 * @since TBD
	 *
	 * @param string $variant The variant slug.
	 *
	 * @return string
	 */
	public static function variant_class( string $variant ): string {
		return self::CLASS_PREFIX . self::sanitize_identifier( $variant );
	}
}
