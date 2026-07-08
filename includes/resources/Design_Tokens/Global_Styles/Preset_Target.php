<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * The full theme.json address a syncable token's preset resolves to: which settings sub-path,
 * which entry field carries the value, the entry slug, and the token that owns it. Built once per
 * token by Site_Editor_Preset_Locator and consumed by the sync listener, the value translator and
 * the override stripper, so the four never disagree about where a preset lives.
 *
 * @since TBD
 */
final class Preset_Target {

	/**
	 * The settings sub-path, e.g. ['color', 'palette', 'theme'].
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	public array $path;

	/**
	 * The preset-entry field carrying the value, e.g. "color", "fontFamily", "size".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $value_key;

	/**
	 * The preset slug within its bucket, e.g. "button-bg".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slug;

	/**
	 * The wp_preset category, e.g. "color". Doubles as the DTCG-adjacent "kind" the value
	 * translator dispatches on (color/dimension/font-family; "spacing" is reported as "dimension"
	 * — see Value_Translator, Phase 2).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $category;

	/**
	 * The token that owns this preset.
	 *
	 * @since TBD
	 *
	 * @var Token_Definition
	 */
	public Token_Definition $token;

	/**
	 * @param string[]         $path
	 * @param string           $value_key
	 * @param string           $slug
	 * @param string           $category
	 * @param Token_Definition $token
	 */
	public function __construct( array $path, string $value_key, string $slug, string $category, Token_Definition $token ) {
		$this->path      = $path;
		$this->value_key = $value_key;
		$this->slug      = $slug;
		$this->category  = $category;
		$this->token     = $token;
	}
}
