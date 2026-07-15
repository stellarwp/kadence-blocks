<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Validates a typography $value: an alias, or an object carrying the required fontFamily plus any of the
 * optional text-style fields (fontSize, fontWeight, lineHeight, fontStyle, textTransform,
 * letterSpacing), where each sub-field is itself an alias or its literal kind. The field set is data on
 * Token_Type, so a typography token drives exactly the properties it declares and leaves the rest to
 * inherit.
 *
 * Extension seam for future responsive / clamp() typography: it lands by overriding validate() here to
 * branch on the structured shape before delegating the scalar object to the parent walk.
 *
 * @since TBD
 */
final class Typography_Value extends Composite_Value {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	protected function type(): string {
		return Token_Type::get_type_typography();
	}
}
