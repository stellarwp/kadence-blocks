<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Contracts\Value_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Kind;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;

/**
 * Validates a dimension $value: an alias or a length literal ("0", number+unit, or a CSS function).
 *
 * Extension seam for future responsive / clamp() work: when those dimension shapes land, an additional branch
 * for the structured shape goes here, BEFORE delegating the scalar case to Kind, so the scalar path is
 * untouched.
 *
 * @since TBD
 */
final class Dimension_Value implements Value_Validator {

	/**
	 * Validate a dimension $value.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The decoded $value.
	 * @param string $path  Dot-path to the value, for error reporting.
	 *
	 * @return Validation_Error[] Empty when valid.
	 */
	public function validate( $value, string $path ): array {
		return Kind::validate( Token_Type::get_type_dimension(), $value, $path );
	}
}
