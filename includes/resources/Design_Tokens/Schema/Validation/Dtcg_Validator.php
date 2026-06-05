<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Contracts\Value_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Color_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Dimension_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Family_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Shadow_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Typography_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Validates a decoded DTCG document against the v1 grammar: leaf shape, the $type enum, the alias
 * pattern, per-type value checks, composite shapes, and the override sentinels. This is the single
 * validation layer the design doc requires to be shared by the baseline doc, the JSON Schema and the
 * REST writes; it does NOT detect alias cycles or render CSS — that is the Resolver, run as a separate
 * dry-run before commit.
 *
 * It walks the document and COLLECTS every error into a Validation_Result (never throws on bad data) so
 * the REST write layer can return them all at once. Two contexts differ only in how leaves are judged:
 *
 *   - CONTEXT_BASELINE  — the shipped, full document: every leaf must carry a concrete $type + $value;
 *                         override sentinels are rejected.
 *   - CONTEXT_OVERRIDES — a store write that is sparse in PATHS (only the tokens being changed appear),
 *                         not in keys: every concrete leaf is still self-describing and must carry
 *                         $type + $value, exactly as in the baseline. The two override-only sparse
 *                         forms are the "$value": null (reset to baseline) and "$disabled": true
 *                         (remove the token) sentinels; outside of those, an override leaf without a
 *                         $type is rejected as $type_unknown.
 *
 * Leaf-level "$"-extensions are passed through without validation and reserved for future responsive /
 * clamp work. The $extensions layer is validated only as far as this ticket's scope: variant / preset
 * `tokens` map values must be alias-or-literal; richer variant semantics are out of scope here.
 *
 * @since TBD
 */
final class Dtcg_Validator {

	/**
	 * Validate the shipped, full baseline document. Sentinels are not allowed.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CONTEXT_BASELINE = 'baseline';

	/**
	 * Validate a sparse overrides document (a store write). Sentinels are allowed.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CONTEXT_OVERRIDES = 'overrides';

	/**
	 * Value validators keyed by $type.
	 *
	 * @since TBD
	 *
	 * @var array<string, Value_Validator>
	 */
	private array $validators;

	/**
	 * Wire the per-$type value validators. The map is the dispatch table walk() uses once a leaf's $type
	 * has been verified, so this set must match Token_Type's v1 enum exactly.
	 *
	 * @since TBD
	 */
	public function __construct() {
		$this->validators = [
			Token_Type::get_type_color()       => new Color_Value(),
			Token_Type::get_type_dimension()   => new Dimension_Value(),
			Token_Type::get_type_font_family() => new Font_Family_Value(),
			Token_Type::get_type_shadow()      => new Shadow_Value(),
			Token_Type::get_type_typography()  => new Typography_Value(),
		];
	}

	/**
	 * Context for validating the shipped, full baseline document (sentinels not allowed).
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_context_baseline(): string {
		return self::CONTEXT_BASELINE;
	}

	/**
	 * Context for validating a sparse overrides document / store write (sentinels allowed).
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_context_overrides(): string {
		return self::CONTEXT_OVERRIDES;
	}

	/**
	 * Validate a decoded DTCG document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded document (json_decode with associative = true).
	 * @param string               $context  self::CONTEXT_BASELINE or self::CONTEXT_OVERRIDES.
	 *
	 * @throws InvalidArgumentException When $context is not a known context (a programmer error).
	 *
	 * @return Validation_Result
	 */
	public function validate( array $document, string $context ): Validation_Result {
		if ( $context !== self::CONTEXT_BASELINE && $context !== self::CONTEXT_OVERRIDES ) {
			throw new InvalidArgumentException( sprintf( 'Unknown validation context "%s".', $context ) );
		}

		$errors = [];

		foreach ( $document as $key => $node ) {
			if ( $key === '$extensions' ) {
				$errors = array_merge( $errors, $this->validate_extensions( $node ) );

				continue;
			}

			// Document-level metadata ($description, a root $type default, …) is passed through.
			if ( $this->is_meta_key( $key ) ) {
				continue;
			}

			$errors = array_merge( $errors, $this->walk( $node, (string) $key, $context ) );
		}

		return new Validation_Result( $errors );
	}

	/**
	 * Walk one node, which is either a token leaf or a group of child nodes.
	 *
	 * @since TBD
	 *
	 * @param mixed  $node    The decoded node.
	 * @param string $path    Dot-path to the node.
	 * @param string $context The validation context.
	 *
	 * @return Validation_Error[]
	 */
	private function walk( $node, string $path, string $context ): array {
		if ( ! is_array( $node ) ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_malformed_node(),
					'Expected a token object or a group of tokens.'
				),
			];
		}

		if ( $this->is_leaf( $node ) ) {
			return $this->validate_leaf( $node, $path, $context );
		}

		$errors = [];

		foreach ( $node as $key => $child ) {
			// Group-level metadata ($description, $type default, nested $extensions) is passed through.
			if ( $this->is_meta_key( $key ) ) {
				continue;
			}

			$errors = array_merge( $errors, $this->walk( $child, $path . '.' . $key, $context ) );
		}

		return $errors;
	}

	/**
	 * Validate a token leaf, applying the context's sentinel rules.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf    The decoded leaf.
	 * @param string               $path    Dot-path to the leaf.
	 * @param string               $context The validation context.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_leaf( array $leaf, string $path, string $context ): array {
		$errors = $this->validate_leaf_keys( $leaf, $path );

		$has_disabled = Sentinels::has_disabled( $leaf );
		$is_reset     = Sentinels::is_reset( $leaf );

		if ( $context === self::CONTEXT_BASELINE ) {
			if ( $is_reset ) {
				$errors[] = new Validation_Error(
					$path . '.' . Sentinels::get_value_key(),
					Validation_Error::get_code_sentinel_not_allowed(),
					'The "$value": null reset sentinel is not allowed in the baseline document.'
				);
			}

			if ( $has_disabled ) {
				$errors[] = new Validation_Error(
					$path . '.' . Sentinels::get_disabled_key(),
					Validation_Error::get_code_sentinel_not_allowed(),
					'The "$disabled" sentinel is not allowed in the baseline document.'
				);
			}

			if ( $is_reset || $has_disabled ) {
				return $errors;
			}
		} else {
			if ( $has_disabled ) {
				if ( ! Sentinels::is_disabled( $leaf ) ) {
					$errors[] = new Validation_Error(
						$path . '.' . Sentinels::get_disabled_key(),
						Validation_Error::get_code_sentinel_invalid(),
						'The "$disabled" sentinel must be boolean true.'
					);
				}

				// A well-formed disable sentinel removes the token; nothing else to check.
				return $errors;
			}

			if ( $is_reset ) {
				// A reset falls back to baseline; no $type/$value to validate.
				return $errors;
			}
		}

		return array_merge( $errors, $this->validate_typed_leaf( $leaf, $path ) );
	}

	/**
	 * Reject leaf keys that are not "$"-prefixed. The DTCG leaf shape only carries "$"-prefixed metadata
	 * ($type, $value, $description, $extensions, sentinels and forward-looking extensions); a non-"$" key
	 * is structural noise that the published schema rejects via additionalProperties:false.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded leaf.
	 * @param string               $path Dot-path to the leaf.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_leaf_keys( array $leaf, string $path ): array {
		$errors = [];

		foreach ( array_keys( $leaf ) as $key ) {
			if ( $this->is_meta_key( $key ) ) {
				continue;
			}

			$errors[] = new Validation_Error(
				$path . '.' . $key,
				Validation_Error::get_code_leaf_field_unknown(),
				sprintf( 'Token leaf has an unknown field "%s"; only "$"-prefixed keys are allowed.', (string) $key )
			);
		}

		return $errors;
	}

	/**
	 * Validate a concrete (non-sentinel) leaf: it must carry a valid $type and a $value of that type.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded leaf.
	 * @param string               $path Dot-path to the leaf.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_typed_leaf( array $leaf, string $path ): array {
		$errors   = [];
		$type     = $leaf['$type'] ?? null;
		$has_type = is_string( $type ) && Token_Type::is_valid( $type );

		if ( ! $has_type ) {
			$errors[] = new Validation_Error(
				$path . '.$type',
				Validation_Error::get_code_type_unknown(),
				is_string( $type ) && $type !== ''
					? sprintf( 'Unknown token $type "%s".', $type )
					: 'Token is missing a string $type.'
			);
		}

		if ( ! array_key_exists( '$value', $leaf ) ) {
			$errors[] = new Validation_Error(
				$path,
				Validation_Error::get_code_missing_value(),
				'Token is missing a $value.'
			);

			return $errors;
		}

		// Without a known type there is no validator to dispatch the value to.
		if ( $has_type ) {
			$errors = array_merge( $errors, $this->validators[ $type ]->validate( $leaf['$value'], $path . '.$value' ) );
		}

		return $errors;
	}

	/**
	 * Validate the $extensions layer to this ticket's scope: every preset / variant `tokens` map value
	 * must be an alias or a literal scalar. $default / label / structural variant semantics are
	 * deferred to the variant data-model work, and any non-Kadence extension namespace is passed through untouched.
	 *
	 * @since TBD
	 *
	 * @param mixed $extensions The decoded $extensions node.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_extensions( $extensions ): array {
		if ( ! is_array( $extensions ) || ! isset( $extensions[ Extensions::get_namespace() ] ) ) {
			return [];
		}

		$namespace = $extensions[ Extensions::get_namespace() ];

		if ( ! is_array( $namespace ) ) {
			return [];
		}

		$base   = Extensions::get_extensions_key() . '.' . Extensions::get_namespace();
		$errors = [];

		foreach ( Extensions::get_sections() as $section ) {
			if ( ! isset( $namespace[ $section ] ) || ! is_array( $namespace[ $section ] ) ) {
				continue;
			}

			foreach ( $namespace[ $section ] as $group => $preset_set ) {
				if ( ! is_array( $preset_set ) ) {
					continue;
				}

				foreach ( $preset_set as $preset_name => $preset ) {
					$tokens_key = Extensions::get_tokens_key();

					// $default names a preset; its structure is the variant data model's concern.
					if (
						$preset_name === Extensions::get_default_key()
						|| ! is_array( $preset )
						|| ! isset( $preset[ $tokens_key ] )
						|| ! is_array( $preset[ $tokens_key ] )
					) {
						continue;
					}

					$prefix = sprintf( '%s.%s.%s.%s.%s', $base, $section, $group, $preset_name, $tokens_key );

					foreach ( $preset[ $tokens_key ] as $token_path => $value ) {
						$error = $this->validate_extension_value( $value, $prefix . '.' . $token_path );

						if ( $error !== null ) {
							$errors[] = $error;
						}
					}
				}
			}
		}

		return $errors;
	}

	/**
	 * A preset / variant token value must be an alias or a non-empty literal scalar. The target token's
	 * $type is not resolved here, so the literal is checked only for shape, not per-type grammar.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The decoded value.
	 * @param string $path  Dot-path to the value.
	 *
	 * @return Validation_Error|null Null when valid.
	 */
	private function validate_extension_value( $value, string $path ): ?Validation_Error {
		if ( Alias::is_alias( $value ) ) {
			return null;
		}

		if ( Alias::looks_like_alias( $value ) ) {
			return new Validation_Error(
				$path,
				Validation_Error::get_code_alias_malformed(),
				'Value looks like an alias but is not a whole-string "{dot.path}" reference.'
			);
		}

		if ( ( is_string( $value ) && $value !== '' ) || is_int( $value ) || is_float( $value ) ) {
			return null;
		}

		return new Validation_Error(
			$path,
			Validation_Error::get_code_value_invalid(),
			'A preset/variant token value must be an alias or a non-empty literal.'
		);
	}

	/**
	 * Whether the node is a token leaf rather than a group. A leaf carries a $value (concrete or reset),
	 * a $disabled sentinel, or a $type. v1 does not support a group-level default $type, so a $type-only
	 * node is a leaf that is missing its $value rather than a typed group — which surfaces the right
	 * error. Child token/group names are dot-path segments and never collide with these "$" keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The decoded node.
	 *
	 * @return bool
	 */
	private function is_leaf( array $node ): bool {
		return array_key_exists( Sentinels::get_value_key(), $node )
			|| array_key_exists( Sentinels::get_disabled_key(), $node )
			|| array_key_exists( '$type', $node );
	}

	/**
	 * Whether a node key is DTCG metadata (a "$"-prefixed key) rather than a child token/group name.
	 *
	 * @since TBD
	 *
	 * @param mixed $key The node key.
	 *
	 * @return bool
	 */
	private function is_meta_key( $key ): bool {
		return is_string( $key ) && strncmp( $key, '$', 1 ) === 0;
	}
}
