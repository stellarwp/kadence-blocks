<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The DTCG `$extensions` vocabulary this module owns, single-sourced so every reader and the validator
 * agree on the exact spelling of the vendor namespace, its sections, and the structural keys inside a
 * preset collection.
 *
 * The baseline document carries two sections under the Kadence namespace:
 *
 *   - "foundationPresets" → the beginner on-ramp: type scales and starter palettes that seed primitives.
 *   - "presets"          → block presets (the preset data model's concern).
 *
 * Each section holds named groups; each group is a map of preset-slug => { "label": …, "tokens": … }
 * alongside a "$default" key naming the group's default preset.
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
}
