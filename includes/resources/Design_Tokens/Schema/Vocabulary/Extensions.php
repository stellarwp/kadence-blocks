<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The DTCG `$extensions` vocabulary this module owns, single-sourced so every reader and the validator
 * agree on the exact spelling of the vendor namespace, its sections, and the structural keys inside a
 * preset collection.
 *
 * The baseline document carries these sections under the Kadence namespace:
 *
 *   - "foundationPresets" → the beginner on-ramp: type scales and starter palettes that seed primitives.
 *   - "presets"          → block presets (the preset data model's concern).
 *   - "colorPalettes"     → named color palettes within the library (the palette feature): each an ordered list
 *                           of groups, each an ordered list of self-describing swatches.
 *
 * The preset sections hold named groups; each group is a map of preset-slug =>
 * { "label": …, "tokens": … } alongside a "$default" key naming the group's default preset. A color palette
 * differs — its values live under each swatch's "$value" rather than in a flat "tokens" map — so it is NOT
 * returned by get_sections() (that drives the tokens-map walk).
 *
 * @since TBD
 */
final class Extensions {

	/**
	 * The DTCG vendor-extension namespace this module owns.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const NAMESPACE = 'com.kadence.designTokens';

	/**
	 * The `$extensions` key carrying the module's namespace.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const EXTENSIONS_KEY = '$extensions';

	/**
	 * The foundation-presets section: type scales and starter palettes that seed the primitive layer.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_FOUNDATION_PRESETS = 'foundationPresets';

	/**
	 * The presets section: block presets.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_PRESETS = 'presets';

	/**
	 * The color-palettes section: named palettes within the library, each an ordered list of groups of swatches.
	 * NOT returned by get_sections() — its values live under each swatch's `$value`, not a `tokens` map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_COLOR_PALETTES = 'colorPalettes';

	/**
	 * The user-created primitives section in the $extensions namespace.
	 * NOT returned by get_sections() — it is not preset-shaped.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_USER_PRIMITIVES = 'userPrimitives';

	/**
	 * The key naming a group's default preset slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_KEY = '$default';

	/**
	 * The key carrying a preset's flat dot-path => value token map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKENS_KEY = 'tokens';

	/**
	 * The key carrying a preset's human-readable label.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LABEL_KEY = 'label';

	/**
	 * The key naming a library's current (active) color palette, written to switch the color layer.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CURRENT_KEY = '$current';

	/**
	 * The key carrying a palette's ordered list of color groups.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const GROUPS_KEY = 'groups';

	/**
	 * The key carrying a group's ordered list of swatches.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SWATCHES_KEY = 'swatches';

	/**
	 * The key naming the color token dot-path a swatch sets.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SWATCH_TOKEN_KEY = 'token';

	/**
	 * The key carrying a group's stable id.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const GROUP_ID_KEY = 'id';

	/**
	 * The DTCG vendor-extension namespace this module owns.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_namespace(): string {
		return self::NAMESPACE;
	}

	/**
	 * The `$extensions` key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_extensions_key(): string {
		return self::EXTENSIONS_KEY;
	}

	/**
	 * The foundation-presets section name.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_foundation_presets(): string {
		return self::SECTION_FOUNDATION_PRESETS;
	}

	/**
	 * The presets section name: block presets.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_presets(): string {
		return self::SECTION_PRESETS;
	}

	/**
	 * The color-palettes section name: named palettes within the library.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_color_palettes(): string {
		return self::SECTION_COLOR_PALETTES;
	}

	/**
	 * The user-created primitives section name in the $extensions namespace.
	 * NOT returned by get_sections() — it is not preset-shaped.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_user_primitives(): string {
		return self::SECTION_USER_PRIMITIVES;
	}

	/**
	 * Every section name the module owns under its namespace.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function get_sections(): array {
		return [ self::SECTION_FOUNDATION_PRESETS, self::SECTION_PRESETS ];
	}

	/**
	 * The literal key path to the presets section, from the document root.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function get_presets_path(): array {
		return [
			self::get_extensions_key(),
			self::get_namespace(),
			self::get_section_presets(),
		];
	}

	/**
	 * The literal key path to the color-palettes section, from the document root.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function get_color_palettes_path(): array {
		return [
			self::get_extensions_key(),
			self::get_namespace(),
			self::get_section_color_palettes(),
		];
	}

	/**
	 * The key naming a group's default preset slug.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_default_key(): string {
		return self::DEFAULT_KEY;
	}

	/**
	 * The key carrying a preset's flat dot-path => value token map.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_tokens_key(): string {
		return self::TOKENS_KEY;
	}

	/**
	 * The key carrying a preset's human-readable label.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_label_key(): string {
		return self::LABEL_KEY;
	}

	/**
	 * The key naming a library's current (active) color palette.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_current_key(): string {
		return self::CURRENT_KEY;
	}

	/**
	 * The key carrying a palette's ordered list of color groups.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_groups_key(): string {
		return self::GROUPS_KEY;
	}

	/**
	 * The key carrying a group's ordered list of swatches.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_swatches_key(): string {
		return self::SWATCHES_KEY;
	}

	/**
	 * The key naming the color token dot-path a swatch sets.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_swatch_token_key(): string {
		return self::SWATCH_TOKEN_KEY;
	}

	/**
	 * The key carrying a group's stable id.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_group_id_key(): string {
		return self::GROUP_ID_KEY;
	}
}
