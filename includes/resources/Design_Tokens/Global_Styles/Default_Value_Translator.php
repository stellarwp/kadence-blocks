<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Default Value_Translator: color, spacing (dimension), font-family only.
 *
 * @since TBD
 */
final class Default_Value_Translator implements Value_Translator {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param string $category       The wp_preset category ("color", "spacing", "font-family").
	 * @param string $literal_value  The literal value read from the Global Styles preset entry.
	 *
	 * @return array<string, mixed>
	 *
	 * @throws Untranslatable_Value_Exception When the category is unsupported or the value is malformed.
	 */
	public function translate( string $category, string $literal_value ): array {
		switch ( $category ) {
			case 'color':
				return $this->color( $literal_value );
			case 'spacing':
				return $this->dimension( $literal_value );
			case 'font-family':
				return $this->font_family( $literal_value );
			default:
				throw new Untranslatable_Value_Exception(
					sprintf( 'No Value_Translator for wp_preset category "%s".', $category )
				);
		}
	}

	/**
	 * Translate a color literal: hex, rgb()/rgba(), hsl()/hsla(). Passed through as-is — the
	 * write pipeline's own Dtcg_Validator (Schema\Validation\Values\Color_Value) re-validates it
	 * before commit, so this only needs to reject the obviously-empty case.
	 *
	 * @since TBD
	 *
	 * @param string $value The color value to translate.
	 *
	 * @return array<string, mixed>
	 *
	 * @throws Untranslatable_Value_Exception When the value is empty.
	 */
	private function color( string $value ): array {
		$value = trim( $value );
		if ( $value === '' ) {
			throw new Untranslatable_Value_Exception( 'Color value cannot be empty.' );
		}

		return [
			'$type'  => Token_Type::get_type_color(),
			'$value' => $value,
		];
	}

	/**
	 * Translate a spacing literal to a "dimension" leaf. The theme.json spacingSizes "size" field
	 * is already a CSS length string (e.g. "1rem", "8px", "clamp(...)"); passed through unchanged.
	 *
	 * @since TBD
	 *
	 * @param string $value The dimension value to translate.
	 *
	 * @return array<string, mixed>
	 *
	 * @throws Untranslatable_Value_Exception When the value is empty.
	 */
	private function dimension( string $value ): array {
		$value = trim( $value );
		if ( $value === '' ) {
			throw new Untranslatable_Value_Exception( 'Dimension value cannot be empty.' );
		}

		return [
			'$type'  => Token_Type::get_type_dimension(),
			'$value' => $value,
		];
	}

	/**
	 * Translate a font-family literal to a "fontFamily" leaf: DTCG requires an array $value
	 * (Schema\Validation\Values\Font_Family_Value), so a plain family name is wrapped, and a
	 * comma-separated stack is split into its elements.
	 *
	 * @since TBD
	 *
	 * @param string $value The font family value to translate.
	 *
	 * @return array<string, mixed>
	 *
	 * @throws Untranslatable_Value_Exception When the value is empty or contains only whitespace.
	 */
	private function font_family( string $value ): array {
		$families = array_values(
			array_filter(
				array_map( 'trim', explode( ',', $value ) ),
				static fn( string $family ): bool => $family !== ''
			)
		);

		if ( $families === [] ) {
			throw new Untranslatable_Value_Exception( 'Font family value cannot be empty.' );
		}

		return [
			'$type'  => Token_Type::get_type_font_family(),
			'$value' => $families,
		];
	}
}
