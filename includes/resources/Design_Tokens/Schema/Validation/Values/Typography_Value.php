<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Validates a typography $value: an alias, or an object of { fontFamily, fontSize, fontWeight,
 * lineHeight } where each sub-field is itself an alias or its literal kind.
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
