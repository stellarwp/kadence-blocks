<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

/**
 * Translates a literal Site Editor preset value into a DTCG leaf for the categories
 * Theme_Json\Preset_Bucket actually injects: color, spacing (dimension), font-family.
 *
 * Deliberately does NOT handle "shadow": the Site Editor's shadow preset value is a CSS shorthand
 * string, while the DTCG shadow $type is a structured, alias-able composite object
 * (Schema\Vocabulary\Token_Type). Translating shorthand -> structured correctly is out of scope
 * for this ticket; a changed shadow preset is skipped upstream (Sync_Listener) and
 * reported, not guessed at.
 *
 * @since TBD
 */
interface Value_Translator {

	/**
	 * Translate a literal preset value to a DTCG leaf for the given wp_preset category.
	 *
	 * @since TBD
	 *
	 * @param string $category       The wp_preset category ("color", "spacing", "font-family").
	 * @param string $literal_value  The literal value read from the Global Styles preset entry.
	 *
	 * @return array<string, mixed> A DTCG leaf: ['$type' => ..., '$value' => ...].
	 *
	 * @throws Untranslatable_Value_Exception When the category is unsupported or the value is malformed.
	 */
	public function translate( string $category, string $literal_value ): array;
}
