<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Contracts\Value_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Border_Style_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Color_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Dimension_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Family_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Style_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Weight_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Line_Height_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Shadow_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Text_Transform_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Literals;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Utils\Cast;

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
 * Leaf-level "$"-extensions carry the responsive / clamp shape (see validate_leaf_extensions): a
 * dimension / lineHeight leaf may declare a per-breakpoint `responsive` map or a structured `clamp` map
 * (mutually exclusive) whose slots are validated as alias-or-literal of the leaf's own $type; any other
 * leaf "$"-extension is passed through untouched. The document-level $extensions layer is validated only
 * as far as this ticket's scope: foundation-preset / block-preset `tokens` map values must be alias-or-literal; richer
 * preset semantics are out of scope here.
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
	 * The side count of a per-corner preset token slot list, matching the 4-side measure attribute a
	 * block stores (top-left, top-right, bottom-right, bottom-left).
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const SLOT_LIST_SIDES = 4;

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
			Token_Type::get_type_color()          => new Color_Value(),
			Token_Type::get_type_dimension()      => new Dimension_Value(),
			Token_Type::get_type_font_family()    => new Font_Family_Value(),
			Token_Type::get_type_font_weight()    => new Font_Weight_Value(),
			Token_Type::get_type_line_height()    => new Line_Height_Value(),
			Token_Type::get_type_font_style()     => new Font_Style_Value(),
			Token_Type::get_type_text_transform() => new Text_Transform_Value(),
			Token_Type::get_type_border_style()   => new Border_Style_Value(),
			Token_Type::get_type_shadow()         => new Shadow_Value(),
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
		$errors = [];
		$type   = $leaf[ Token_Type::get_type_key() ] ?? null;

		if ( ! is_string( $type ) || ! Token_Type::is_valid( $type ) ) {
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
		} elseif ( is_string( $type ) && Token_Type::is_valid( $type ) ) {
			// Without a known type there is no validator to dispatch the value to.
			$errors = array_merge( $errors, $this->validators[ $type ]->validate( $leaf['$value'], $path . '.$value' ) );
		}

		// The responsive / clamp leaf-extension shape is validated against the leaf's own $type, so it can
		// only run once the type is known; it is independent of whether $value itself validated.
		if ( is_string( $type ) && Token_Type::is_valid( $type ) ) {
			$errors = array_merge( $errors, $this->validate_leaf_extensions( $leaf, $type, $path ) );
		}

		return $errors;
	}

	/**
	 * Validate a concrete leaf's responsive / clamp extension shape, when present. A flat leaf (no shape)
	 * validates trivially, so enabling responsive on a previously-flat token is safe against already-stored
	 * data. The shape is rejected on non-responsive-capable types, `responsive` and `clamp` are mutually
	 * exclusive, and each present slot is validated as an alias-or-literal of the leaf's own $type (the
	 * clamp preferred slot additionally accepts a bare calc-style expression).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $leaf The decoded leaf.
	 * @param string               $type The leaf's validated $type.
	 * @param string               $path Dot-path to the leaf.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_leaf_extensions( array $leaf, string $type, string $path ): array {
		$has_responsive = Responsive::has_responsive( $leaf );
		$has_clamp      = Responsive::has_clamp( $leaf );

		if ( ! $has_responsive && ! $has_clamp ) {
			return [];
		}

		$base = $path . '.' . Extensions::get_extensions_key() . '.' . Extensions::get_namespace();

		if ( ! Responsive::is_responsive_capable( $type ) ) {
			return [
				new Validation_Error(
					$base,
					Validation_Error::get_code_responsive_not_allowed(),
					sprintf(
						'The responsive / clamp shape is not allowed on a "%s" token; only dimension and lineHeight are responsive-capable.',
						$type
					)
				),
			];
		}

		if ( $has_responsive && $has_clamp ) {
			return [
				new Validation_Error(
					$base,
					Validation_Error::get_code_responsive_clamp_conflict(),
					'A token may carry either a responsive or a clamp shape, not both.'
				),
			];
		}

		if ( $has_responsive ) {
			return $this->validate_responsive_shape(
				Responsive::responsive_of( $leaf ),
				$type,
				$base . '.' . Responsive::get_responsive_key()
			);
		}

		return $this->validate_clamp_shape(
			Responsive::clamp_of( $leaf ),
			$type,
			$base . '.' . Responsive::get_clamp_key()
		);
	}

	/**
	 * Validate a per-breakpoint `responsive` map: a non-empty object whose keys are known breakpoints and
	 * whose values are each an alias-or-literal of the leaf's $type.
	 *
	 * @since TBD
	 *
	 * @param mixed  $responsive The decoded responsive map.
	 * @param string $type       The leaf's $type.
	 * @param string $path       Dot-path to the responsive map.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_responsive_shape( $responsive, string $type, string $path ): array {
		if ( ! is_array( $responsive ) || $responsive === [] ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_value_invalid(),
					'The responsive shape must be a non-empty object of breakpoint overrides.'
				),
			];
		}

		$allowed = Responsive::get_breakpoint_keys();
		$errors  = [];

		foreach ( $responsive as $breakpoint => $value ) {
			if ( ! in_array( $breakpoint, $allowed, true ) ) {
				$errors[] = new Validation_Error(
					$path . '.' . $breakpoint,
					Validation_Error::get_code_composite_field_unknown(),
					sprintf(
						'Unknown responsive breakpoint "%s"; expected one of: %s.',
						(string) $breakpoint,
						implode( ', ', $allowed )
					)
				);

				continue;
			}

			$errors = array_merge( $errors, $this->validators[ $type ]->validate( $value, $path . '.' . $breakpoint ) );
		}

		return $errors;
	}

	/**
	 * Validate a structured `clamp` map: an object carrying exactly the min / preferred / max slots. min and
	 * max are alias-or-literal of the leaf's $type; preferred additionally accepts a bare calc-style
	 * expression (a clamp() argument is a <calc-sum>, which a plain dimension literal rejects).
	 *
	 * @since TBD
	 *
	 * @param mixed  $clamp The decoded clamp map.
	 * @param string $type  The leaf's $type.
	 * @param string $path  Dot-path to the clamp map.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_clamp_shape( $clamp, string $type, string $path ): array {
		if ( ! is_array( $clamp ) ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_value_invalid(),
					'The clamp shape must be an object with min, preferred and max slots.'
				),
			];
		}

		$min       = Responsive::get_clamp_min_key();
		$preferred = Responsive::get_clamp_preferred_key();
		$max       = Responsive::get_clamp_max_key();
		$required  = [ $min, $preferred, $max ];
		$errors    = [];

		foreach ( array_keys( $clamp ) as $key ) {
			if ( ! in_array( $key, $required, true ) ) {
				$errors[] = new Validation_Error(
					$path . '.' . $key,
					Validation_Error::get_code_composite_field_unknown(),
					sprintf( 'Unknown clamp slot "%s"; expected min, preferred and max.', (string) $key )
				);
			}
		}

		foreach ( $required as $slot ) {
			if ( ! array_key_exists( $slot, $clamp ) ) {
				$errors[] = new Validation_Error(
					$path . '.' . $slot,
					Validation_Error::get_code_composite_field_missing(),
					sprintf( 'The clamp shape is missing its required "%s" slot.', $slot )
				);
			}
		}

		if ( array_key_exists( $min, $clamp ) ) {
			$errors = array_merge( $errors, $this->validators[ $type ]->validate( $clamp[ $min ], $path . '.' . $min ) );
		}

		if ( array_key_exists( $max, $clamp ) ) {
			$errors = array_merge( $errors, $this->validators[ $type ]->validate( $clamp[ $max ], $path . '.' . $max ) );
		}

		if ( array_key_exists( $preferred, $clamp ) ) {
			$errors = array_merge( $errors, $this->validate_clamp_preferred( $clamp[ $preferred ], $type, $path . '.' . $preferred ) );
		}

		return $errors;
	}

	/**
	 * Validate a clamp preferred slot: an alias, a literal of the leaf's own $type, or a bare calc-style
	 * fluid expression. The $type check is what lets a lineHeight clamp carry a unitless preferred (e.g.
	 * "1.2") exactly as its min / max slots do; the calc-style branch accepts what a plain type literal
	 * rejects — a clamp() preferred takes a <calc-sum> like "0.995rem + 0.326vw" without a calc() wrapper.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The decoded preferred slot.
	 * @param string $type  The leaf's $type.
	 * @param string $path  Dot-path to the slot.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_clamp_preferred( $value, string $type, string $path ): array {
		if ( Alias::is_alias( $value ) ) {
			return [];
		}

		if ( Alias::looks_like_alias( $value ) ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_alias_malformed(),
					'The clamp preferred slot looks like an alias but is not a whole-string "{dot.path}" reference.'
				),
			];
		}

		// A literal of the leaf's own type — a bare dimension, or a unitless lineHeight — is a valid
		// preferred, mirroring how the min / max slots validate against $this->validators[ $type ].
		if ( $this->validators[ $type ]->validate( $value, $path ) === [] ) {
			return [];
		}

		// A bare calc-style fluid expression, which a plain type literal rejects.
		if ( Literals::is_clamp_preferred( $value ) ) {
			return [];
		}

		return [
			new Validation_Error(
				$path,
				Validation_Error::get_code_value_invalid(),
				'The clamp preferred slot must be an alias, a literal of the token type, or a calc-style expression.'
			),
		];
	}

	/**
	 * Validate the $extensions layer to this scope: every foundation-preset / block-preset `tokens` map value must be an
	 * alias or a literal scalar. $default / label / structural preset semantics are validated elsewhere,
	 * and any non-Kadence extension namespace is passed through untouched.
	 *
	 * Each owned section is walked without assuming a fixed depth: a `tokens` map can sit at varying depths — a
	 * foundation preset and a preset nest it two levels under the section (preset → tokens, block/preset →
	 * tokens). The walk descends every array branch and validates each `tokens` map it finds, so all of these
	 * are covered by the same logic.
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

			$errors = array_merge(
				$errors,
				$this->validate_extension_tokens( $namespace[ $section ], $base . '.' . $section )
			);
		}

		// colorPalettes carries its values under each swatch's `$value`, not a `tokens` map, so the
		// tokens-map walk above (driven by get_sections(), which excludes it) never covers them. Validate
		// each swatch `$value` with the same alias-or-literal grammar here.
		$palettes_section = Extensions::get_section_color_palettes();

		if ( isset( $namespace[ $palettes_section ] ) && is_array( $namespace[ $palettes_section ] ) ) {
			$errors = array_merge(
				$errors,
				$this->validate_color_palettes( $namespace[ $palettes_section ], $base . '.' . $palettes_section )
			);
		}

		// tokenLabels is a flat { token id => label } string map — id-keyed metadata, not
		// preset-shaped, so the tokens-map walk (driven by get_sections(), which excludes it)
		// never covers it. Without this branch it would pass through with no validation at all.
		$labels_section = Extensions::get_section_token_labels();

		if ( isset( $namespace[ $labels_section ] ) && is_array( $namespace[ $labels_section ] ) ) {
			$errors = array_merge(
				$errors,
				$this->validate_token_labels( $namespace[ $labels_section ], $base . '.' . $labels_section )
			);
		}

		return $errors;
	}

	/**
	 * Validate each swatch `$value` in a colorPalettes section with the alias-or-literal grammar. Walks each
	 * palette's `groups[].swatches[]`, skipping the `$default` / `$current` pointer keys and any node that is
	 * not shaped as a palette / group / swatch. Referential integrity (a `token` that targets a real color
	 * leaf, no duplicate `token` within a palette, `$default` / `$current` naming a real palette) is enforced
	 * by the palette controller's write guards, not here — this branch is the value-grammar gate only.
	 *
	 * @since TBD
	 *
	 * @param array<int|string, mixed> $palettes The decoded colorPalettes section.
	 * @param string                   $prefix   Dot-path to the section, for error messages.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_color_palettes( array $palettes, string $prefix ): array {
		$groups_key   = Extensions::get_groups_key();
		$swatches_key = Extensions::get_swatches_key();
		$value_key    = Sentinels::get_value_key();
		$errors       = [];

		foreach ( $palettes as $palette_id => $palette ) {
			// Skip the $default / $current pointer keys (scalars) and any non-array palette.
			if ( ! is_array( $palette ) || ( is_string( $palette_id ) && strpos( $palette_id, '$' ) === 0 ) ) {
				continue;
			}

			$groups = $palette[ $groups_key ] ?? null;

			if ( ! is_array( $groups ) ) {
				continue;
			}

			foreach ( $groups as $group_index => $group ) {
				if ( ! is_array( $group ) || ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] ) ) {
					continue;
				}

				foreach ( $group[ $swatches_key ] as $swatch_index => $swatch ) {
					if ( ! is_array( $swatch ) || ! array_key_exists( $value_key, $swatch ) ) {
						continue;
					}

					$path = $prefix . '.' . $palette_id . '.' . $groups_key . '.' . $group_index
						. '.' . $swatches_key . '.' . $swatch_index . '.' . $value_key;

					$error = $this->validate_extension_value( $swatch[ $value_key ], $path );

					if ( $error !== null ) {
						$errors[] = $error;
					}
				}
			}
		}

		return $errors;
	}

	/**
	 * Validate a tokenLabels section: every entry must map a non-empty string key to a
	 * non-empty string label. Whether the id names a registered token is enforced by the REST
	 * write guard, not here — a label for a since-unregistered token is stale data, not a
	 * grammar error, and read-side consumers already ignore it.
	 *
	 * @since TBD
	 *
	 * @param array<int|string, mixed> $labels The decoded tokenLabels section.
	 * @param string                   $prefix Dot-path to the section, for error messages.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_token_labels( array $labels, string $prefix ): array {
		$errors = [];

		foreach ( $labels as $id => $label ) {
			if ( ! is_string( $id ) || $id === '' || ! is_string( $label ) || $label === '' ) {
				$errors[] = new Validation_Error(
					$prefix . '.' . Cast::to_string( $id ),
					Validation_Error::get_code_value_invalid(),
					'A token label override must map a non-empty token id to a non-empty string label.'
				);
			}
		}

		return $errors;
	}

	/**
	 * Recursively validate every `tokens` map within a section subtree, regardless of nesting depth. A node
	 * carrying a `tokens` map has each of its values checked; every other array branch is descended into.
	 * The `$default` slug (and any other non-array metadata) is a leaf with no `tokens` map, so it is
	 * skipped naturally.
	 *
	 * @since TBD
	 *
	 * @param array<int|string, mixed> $node   The current subtree node.
	 * @param string                   $prefix Dot-path to the node, for error messages.
	 *
	 * @return Validation_Error[]
	 */
	private function validate_extension_tokens( array $node, string $prefix ): array {
		$tokens_key = Extensions::get_tokens_key();
		$errors     = [];

		if ( isset( $node[ $tokens_key ] ) && is_array( $node[ $tokens_key ] ) ) {
			foreach ( $node[ $tokens_key ] as $token_path => $value ) {
				$error = $this->validate_extension_value( $value, $prefix . '.' . $tokens_key . '.' . $token_path );

				if ( $error !== null ) {
					$errors[] = $error;
				}
			}

			return $errors;
		}

		foreach ( $node as $key => $child ) {
			if ( is_array( $child ) ) {
				$errors = array_merge( $errors, $this->validate_extension_tokens( $child, $prefix . '.' . $key ) );
			}
		}

		return $errors;
	}

	/**
	 * A foundation-preset / block-preset token value must be an alias, a non-empty literal scalar, or a
	 * per-corner slot list. The target token's $type is not resolved here, so the literal is checked only
	 * for shape, not per-type grammar; whether a slot list is meaningful for the bound property's kind is
	 * a registry-aware question answered by the REST write guard, not by the schema.
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

		if ( is_array( $value ) && $this->is_list( $value ) ) {
			return $this->validate_extension_slots( $value, $path );
		}

		if ( is_array( $value ) && array_key_exists( Sentinels::get_value_key(), $value ) ) {
			return $this->validate_extension_envelope( $value, $path );
		}

		return new Validation_Error(
			$path,
			Validation_Error::get_code_value_invalid(),
			'A foundation-preset/block-preset token value must be an alias, a non-empty literal, a slot list, or a responsive entry.'
		);
	}

	/**
	 * Validate a preset token entry that varies by breakpoint: its `$value` is the base, and each override
	 * under the vendor extension's `responsive` map is itself a preset token value.
	 *
	 * Mirrors {@see self::validate_responsive_shape()} — same envelope, same breakpoint-key check — but
	 * validates each override by SHAPE rather than against a `$type`. A preset property has no `$type`
	 * (the walk sees a property name like "button-radius", not a token id), which is also why the kind
	 * gate lives in the REST write guard rather than here.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $entry The decoded entry.
	 * @param string               $path  Dot-path to the entry.
	 *
	 * @return Validation_Error|null Null when valid.
	 */
	private function validate_extension_envelope( array $entry, string $path ): ?Validation_Error {
		$error = $this->validate_extension_value( Extensions::preset_value_of( $entry ), $path );

		if ( $error !== null ) {
			return $error;
		}

		$responsive = Extensions::preset_responsive_of( $entry );

		// An entry object with no overrides says nothing a bare value does not; refuse the dead shape.
		if ( $responsive === [] ) {
			return new Validation_Error(
				$path,
				Validation_Error::get_code_value_invalid(),
				'A responsive preset token entry must declare at least one breakpoint override; use a bare value otherwise.'
			);
		}

		$allowed = Responsive::get_breakpoint_keys();

		foreach ( $responsive as $breakpoint => $override ) {
			if ( ! in_array( $breakpoint, $allowed, true ) ) {
				return new Validation_Error(
					$path . '.' . $breakpoint,
					Validation_Error::get_code_composite_field_unknown(),
					sprintf(
						'Unknown responsive breakpoint "%s"; expected one of: %s.',
						(string) $breakpoint,
						implode( ', ', $allowed )
					)
				);
			}

			$error = $this->validate_extension_value( $override, $path . '.' . $breakpoint );

			if ( $error !== null ) {
				return $error;
			}
		}

		return null;
	}

	/**
	 * Validate a per-corner slot list: exactly 4 slots (top-left, top-right, bottom-right, bottom-left),
	 * each an alias or a non-empty literal scalar. "Every corner" is already expressed by a bare scalar, so
	 * a shorter list would be a second spelling of the same thing. A slot is validated by the
	 * same alias-or-literal rule as a scalar value, so "alias anywhere" stays one rule applied once; a
	 * nested list is rejected because that rule accepts no array.
	 *
	 * @since TBD
	 *
	 * @param array<int, mixed> $slots The slot list.
	 * @param string            $path  Dot-path to the list.
	 *
	 * @return Validation_Error|null Null when valid.
	 */
	private function validate_extension_slots( array $slots, string $path ): ?Validation_Error {
		$count = count( $slots );

		if ( $count !== self::SLOT_LIST_SIDES ) {
			return new Validation_Error(
				$path,
				Validation_Error::get_code_value_invalid(),
				sprintf( 'A preset token slot list must hold exactly %d values, %d given.', self::SLOT_LIST_SIDES, $count )
			);
		}

		foreach ( $slots as $index => $slot ) {
			if ( is_array( $slot ) ) {
				return new Validation_Error(
					$path . '.' . $index,
					Validation_Error::get_code_value_invalid(),
					'A preset token slot must be an alias or a non-empty literal, not a nested list.'
				);
			}

			$error = $this->validate_extension_value( $slot, $path . '.' . $index );

			if ( $error !== null ) {
				return $error;
			}
		}

		return null;
	}

	/**
	 * Whether an array is a list — sequential integer keys from zero. Hand-rolled because the plugin
	 * supports PHP 7.4, where array_is_list() does not exist.
	 *
	 * @since TBD
	 *
	 * @param array<int|string, mixed> $value The array to test.
	 *
	 * @return bool True when the array is a list.
	 */
	private function is_list( array $value ): bool {
		// range( 0, -1 ) yields [ 0, -1 ], so the empty array is answered before the key compare.
		if ( $value === [] ) {
			return true;
		}

		return array_keys( $value ) === range( 0, count( $value ) - 1 );
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
			|| array_key_exists( Token_Type::get_type_key(), $node );
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
