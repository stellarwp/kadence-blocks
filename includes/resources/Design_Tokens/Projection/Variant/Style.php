<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;

/**
 * Single source for the variant class a selected design-token variant outputs, so the class the editor
 * adds and the class the projected CSS targets can never drift apart — and so a Kadence block and a native
 * block (core/button) share one class shape for the color axis.
 *
 * A block's color variant is an ADDITIVE class (not a register_block_style() block style), so it composes
 * with WordPress's own single-select block styles (e.g. the built-in "Outline"): a button can carry
 * "is-style-outline" and "kb-variant--secondary" at once. The editor adds the class via the shared kbVariant
 * save/preview filters (see src/early-filters.js), mirroring the same sanitizer used here.
 *
 * A variant may belong to a named GROUP (axis). A grouped selection carries the group in the class —
 * "kb-variant--<group>--<variant>" — so two independently chosen axes (e.g. a color and an emphasis)
 * compose as two classes on one block. A flat block's implicit single group omits the group segment and
 * keeps the "kb-variant--<variant>" shape, so stored documents are unaffected.
 *
 * @since TBD
 */
final class Style {

	use Sanitizes_Css_Identifier;

	/**
	 * The class prefix a selected variant outputs, shared by every block (Kadence and native).
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

	/**
	 * The class a grouped variant selection outputs, e.g. ("emphasis", "outline") =>
	 * "kb-variant--emphasis--outline". Each segment is sanitized independently so the group and variant
	 * slugs cannot merge across the "--" delimiter, mirroring the JS kbVariantsClassNames() sanitizer so the
	 * class always matches the selector the projected CSS targets.
	 *
	 * @since TBD
	 *
	 * @param string $group   The variant group (axis) slug.
	 * @param string $variant The variant slug.
	 *
	 * @return string
	 */
	public static function group_variant_class( string $group, string $variant ): string {
		return self::CLASS_PREFIX . self::sanitize_identifier( $group ) . '--' . self::sanitize_identifier( $variant );
	}
}
