<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Contracts;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;

/**
 * Validates the $value of one $type. Implementations accept an alias anywhere a literal is expected and
 * COLLECT failures (never throw), returning a flat list of Validation_Errors so the document walker can
 * gather every problem in a single pass.
 *
 * One implementation per v1 $type; the walker dispatches by $type. Composite implementations (shadow,
 * typography) validate the object $value field by field.
 *
 * @since TBD
 */
interface Value_Validator {

	/**
	 * Validate a decoded value.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The decoded $value (PHP scalar, array, or null).
	 * @param string $path  DTCG dot-path to the value, for error reporting (e.g. "semantic.color.text.$value").
	 *
	 * @return Validation_Error[] Empty when valid.
	 */
	public function validate( $value, string $path ): array;
}
