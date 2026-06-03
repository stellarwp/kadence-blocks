<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Validates a shadow $value: an alias, or an object of { color, offsetX, offsetY, blur, spread } where
 * each sub-field is itself an alias or its literal kind (a color, the rest dimensions).
 *
 * @since TBD
 */
final class Shadow_Value extends Composite_Value {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	protected function type(): string {
		return Token_Type::get_type_shadow();
	}
}
