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
 *   - "tokenLabels"       → per-token display-label overrides: a flat { token id => label } string map,
 *                           authoring metadata only.
 *   - "tokenOrder"        → token sort order: a single flat ordered token id list, authoring
 *                           metadata only. Flat rather than group-keyed so the stored order stays
 *                           locale-independent — a UI-schema group name is a translated display
 *                           label, not a stable identifier (see Token_Order_Index).
 *   - "favoriteFonts"     → the library's favorite font families: an ordered list of catalog family
 *                           names. Not a token layer — a favorite carries no indirection and no CSS
 *                           variable; it only pins a family to the top of a font picker.
 *
 * The preset sections hold named groups; each group is a map of preset-slug =>
 * { "label": …, "tokens": … } alongside a "$default" key naming the group's default preset. A color palette
 * differs — its values live under each swatch's "$value" rather than in a flat "tokens" map — and
 * "tokenLabels" is id-keyed metadata with no tokens map at all, so neither is returned by get_sections()
 * (that drives the tokens-map walk).
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
	 * The per-token display-label overrides section: a flat { token id => label } string map.
	 * NOT returned by get_sections() — it is id-keyed authoring metadata, not preset-shaped, so
	 * the tokens-map walk (and the reference scanner that follows get_sections()) must not
	 * descend into it; it holds ids and labels, never {alias} values. The validator covers it
	 * with its own explicit branch instead.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_TOKEN_LABELS = 'tokenLabels';

	/**
	 * The per-group token sort-order section: a map of UI-schema group => ordered list of token
	 * ids. NOT returned by get_sections() — it is id-keyed authoring metadata, not preset-shaped,
	 * so the tokens-map walk (and the reference scanner that follows get_sections()) must not
	 * descend into it; it holds ids only, never {alias} values. The stored order is partial and
	 * advisory, never authoritative membership: readers append unmentioned ids in declaration
	 * order and ignore stale ids, so an order can permute the registered set but never hide a
	 * token. The validator covers it with its own explicit branch instead.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_TOKEN_ORDER = 'tokenOrder';

	/**
	 * The per-block preset display-order section: a map of block name => ordered list of preset
	 * slugs. NOT returned by get_sections() — it is id-keyed authoring metadata, not
	 * preset-shaped, so the tokens-map walk (and the reference scanner that follows
	 * get_sections()) must not descend into it; it holds slugs only, never {alias} values. Keyed
	 * per block, unlike tokenOrder's single flat list, because a preset slug is only unique
	 * within its block. The stored order is partial and advisory, never authoritative membership:
	 * readers append unmentioned slugs in declaration order and ignore stale ones, so an order can
	 * permute the registered set but never hide a preset.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_PRESET_ORDER = 'presetOrder';

	/**
	 * The library's favorite font families: an ordered list of catalog family names, the fonts a
	 * site reaches for often pinned to the top of every font picker. NOT returned by
	 * get_sections() — it is neither preset-shaped nor a tokens map, so the tokens-map walk (and
	 * the reference scanner that follows get_sections()) must not descend into it; it holds
	 * family-name strings only, never {alias} values. The validator covers it with its own
	 * explicit branch instead.
	 *
	 * Deliberately not a token layer. A favorite carries no indirection: it never resolves through
	 * an alias, never emits a CSS variable, and re-pointing one site-wide is not a capability that
	 * exists. Storing families as tokens would imply all three, and would offer a narrower set than
	 * the font catalog a block's own picker already lists.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SECTION_FAVORITE_FONTS = 'favoriteFonts';

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
	 * The per-token display-label overrides section name.
	 * NOT returned by get_sections() — it is id-keyed metadata, not preset-shaped.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_token_labels(): string {
		return self::SECTION_TOKEN_LABELS;
	}

	/**
	 * The per-group token sort-order section name.
	 * NOT returned by get_sections() — it is id-keyed metadata, not preset-shaped.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_token_order(): string {
		return self::SECTION_TOKEN_ORDER;
	}

	/**
	 * The per-block preset display-order section name.
	 * NOT returned by get_sections() — it is id-keyed metadata, not preset-shaped.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_preset_order(): string {
		return self::SECTION_PRESET_ORDER;
	}

	/**
	 * The favorite-font-families section name.
	 * NOT returned by get_sections() — it is a flat name list, not preset-shaped.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_section_favorite_fonts(): string {
		return self::SECTION_FAVORITE_FONTS;
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

	/**
	 * The base value of a preset token entry.
	 *
	 * A preset property is normally a bare value — an alias, a literal, or a per-corner slot list. A
	 * property that varies by breakpoint instead carries the same envelope a responsive token leaf uses
	 * ({@see Responsive}): its base under `$value`, its overrides under the vendor extension. This reader
	 * collapses both shapes to the base, so no consumer hand-rolls the unwrap. A slot list has no `$value`
	 * key, so it is never mistaken for an envelope.
	 *
	 * @since TBD
	 *
	 * @param mixed $entry The preset token entry.
	 *
	 * @return mixed The base value.
	 */
	public static function preset_value_of( $entry ) {
		if ( is_array( $entry ) && array_key_exists( Sentinels::get_value_key(), $entry ) ) {
			return $entry[ Sentinels::get_value_key() ];
		}

		return $entry;
	}

	/**
	 * The per-breakpoint overrides a preset token entry declares, or an empty array when it declares none.
	 * Delegates to {@see Responsive} so the lookup path is byte-identical to a token leaf's.
	 *
	 * @since TBD
	 *
	 * @param mixed $entry The preset token entry.
	 *
	 * @return array<string, mixed> Breakpoint => override value.
	 */
	public static function preset_responsive_of( $entry ): array {
		if ( ! is_array( $entry ) || ! Responsive::has_responsive( $entry ) ) {
			return [];
		}

		$responsive = Responsive::responsive_of( $entry );

		return is_array( $responsive ) ? $responsive : [];
	}
}
