<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Contracts\Value_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Kind;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;

/**
 * Validates a fontWeight $value: an alias or a fontWeight literal.
 *
 * @since TBD
 */
final class Font_Weight_Value implements Value_Validator {

	/**
	 * Validate a fontWeight $value.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The decoded $value.
	 * @param string $path  Dot-path to the value, for error reporting.
	 *
	 * @return Validation_Error[] Empty when valid.
	 */
	public function validate( $value, string $path ): array {
		return Kind::validate( Token_Type::get_type_font_weight(), $value, $path );
	}
}
