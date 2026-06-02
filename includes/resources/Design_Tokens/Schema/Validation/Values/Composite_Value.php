<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Contracts\Value_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Kind;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;

/**
 * Shared walk for a composite $value (shadow, typography): an alias for the whole value, or an object
 * whose every declared sub-field validates "alias OR literal-of-kind" via Kind.
 *
 * The field => kind map comes from Token_Type::composite_fields(), so adding or reshaping a composite
 * is a data edit there, not a change here. Subclasses only name their $type.
 *
 * @since TBD
 */
abstract class Composite_Value implements Value_Validator {

	/**
	 * The composite $type this validator covers (Token_Type::get_type_shadow() or Token_Type::get_type_typography()).
	 *
	 * @return string
	 */
	abstract protected function type(): string;

	/**
	 * Validate a composite $value.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The decoded $value.
	 * @param string $path  Dot-path to the value, for error reporting.
	 *
	 * @return Validation_Error[] Empty when valid.
	 */
	public function validate( $value, string $path ): array {
		// The whole composite may itself be an alias.
		if ( Alias::is_alias( $value ) ) {
			return [];
		}

		// A brace-bearing string is a fumbled alias attempt — a composite literal is otherwise an object.
		if ( Alias::looks_like_alias( $value ) ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_alias_malformed(),
					sprintf( 'Value "%s" looks like an alias but is not a whole-string "{dot.path}" reference.', $value )
				),
			];
		}

		if ( ! is_array( $value ) ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_malformed_node(),
					sprintf( 'A %s value must be an object of sub-fields or an alias.', $this->type() )
				),
			];
		}

		$fields = Token_Type::composite_fields( $this->type() );
		$errors = [];

		// Every declared sub-field must be present and valid for its kind.
		foreach ( $fields as $field => $kind ) {
			if ( ! array_key_exists( $field, $value ) ) {
				$errors[] = new Validation_Error(
					$path . '.' . $field,
					Validation_Error::get_code_composite_field_missing(),
					sprintf( 'A %s value is missing the required "%s" sub-field.', $this->type(), $field )
				);

				continue;
			}

			$errors = array_merge( $errors, Kind::validate( $kind, $value[ $field ], $path . '.' . $field ) );
		}

		// Any sub-field not in the map (and not a "$"-prefixed extension) is unknown.
		foreach ( array_keys( $value ) as $field ) {
			if ( isset( $fields[ $field ] ) || ( is_string( $field ) && strncmp( $field, '$', 1 ) === 0 ) ) {
				continue;
			}

			$errors[] = new Validation_Error(
				$path . '.' . $field,
				Validation_Error::get_code_composite_field_unknown(),
				sprintf( 'A %s value has no "%s" sub-field.', $this->type(), (string) $field )
			);
		}

		return $errors;
	}
}
