<?php
/**
 * Build-time generator for the published DTCG JSON Schema.
 *
 * This is developer tooling, not runtime code: it lives in dev_scripts/src/ (excluded from the
 * distributed zip via .distignore) under an autoload-dev namespace, so it is never in the production
 * autoloader. Production never generates the schema — the runtime validator does not consult it, and any
 * endpoint that serves the schema serves the committed static dtcg.schema.json. Only the regeneration CLI
 * (dev_scripts/bin/) and the conformance test use this class.
 *
 * The namespace mirrors the runtime Design_Tokens\Schema tree, so the dev counterpart of a class sits at
 * the same relative path under dev_scripts/src/.
 *
 * @package KadenceWP\KadenceBlocks\Dev\Design_Tokens\Schema
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Dev\Design_Tokens\Schema;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Emits the published DTCG JSON Schema (draft-07) FROM the same PHP source of truth the runtime
 * validator uses — Token_Type (the $type enum + composite field maps) and Alias (the alias pattern).
 * Because both the schema and Dtcg_Validator read those classes, the structural contract cannot drift
 * between them; a conformance test regenerates and diffs the committed dtcg.schema.json to hold the line.
 *
 * Scope mirrors the validator's published contract: it models the full document grammar (the baseline
 * shape) — group recursion, the $type enum, the alias pattern, leaf shape, and composite field shapes.
 * Literal colour/dimension grammar is intentionally permissive here (the PHP Literals layer is the
 * authority for that), and the store-only override sentinels are a runtime concern, not part of the
 * public document contract. Draft-07 is chosen for universal tool support.
 *
 * @since TBD
 */
final class Dtcg_Schema_Generator {

	/**
	 * Canonical $id for the published schema.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SCHEMA_ID = 'https://schemas.kadencewp.com/design-tokens/dtcg.schema.json';

	/**
	 * Token/group name keys are any property whose name does not start with "$".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const GROUP_KEY_PATTERN = '^[^$].*$';

	/**
	 * Build the draft-07 schema as a PHP array (ready for json_encode).
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function generate(): array {
		return [
			'$schema'              => 'http://json-schema.org/draft-07/schema#',
			'$id'                  => self::SCHEMA_ID,
			'title'                => 'Kadence Blocks DTCG document',
			'description'          => 'Design Tokens Community Group document for the Kadence Blocks Design Tokens module. Generated from the PHP source of truth (Token_Type, Alias); do not edit by hand.',
			'type'                 => 'object',
			'properties'           => [
				'$description' => [ 'type' => 'string' ],
				'$extensions'  => [ 'type' => 'object' ],
			],
			'patternProperties'    => [
				self::GROUP_KEY_PATTERN => [ '$ref' => '#/definitions/node' ],
			],
			'additionalProperties' => false,
			'definitions'          => $this->definitions(),
		];
	}

	/**
	 * The reusable schema definitions.
	 *
	 * @return array<string, mixed>
	 */
	private function definitions(): array {
		return [
			'alias' => [
				'type'        => 'string',
				'pattern'     => Alias::get_pattern(),
				'description' => 'A whole-string DTCG alias, e.g. "{primitive.color.brand.primary}".',
			],
			// A node is exactly one of a token leaf or a group of child nodes. They are mutually
			// exclusive: a leaf requires $type + $value (and forbids non-"$" children), a group forbids
			// $type/$value (additionalProperties:false) and recurses into child nodes. if/then is avoided
			// deliberately — the dev-side draft-07 engine (justinrainbow) does not enforce it.
			'node'  => [
				'type'  => 'object',
				'oneOf' => [
					[ '$ref' => '#/definitions/leaf' ],
					[ '$ref' => '#/definitions/group' ],
				],
			],
			'group' => [
				'type'                 => 'object',
				'properties'           => [
					'$description' => [ 'type' => 'string' ],
					'$extensions'  => [ 'type' => 'object' ],
				],
				'patternProperties'    => [
					self::GROUP_KEY_PATTERN => [ '$ref' => '#/definitions/node' ],
				],
				'additionalProperties' => false,
			],
			'leaf'  => [
				'type'                 => 'object',
				'required'             => [ '$type', '$value' ],
				'properties'           => [
					'$type'        => [ 'enum' => Token_Type::all() ],
					'$value'       => true,
					'$description' => [ 'type' => 'string' ],
					'$extensions'  => [ 'type' => 'object' ],
				],
				// Select the $value shape by $type: exactly one branch's $type const matches.
				'oneOf'                => $this->value_branches(),
				'additionalProperties' => false,
			],
		] + $this->value_definitions();
	}

	/**
	 * One branch per $type pinning $type to a const and $value to that type's value schema. The branches
	 * are mutually exclusive (distinct $type consts), so the enclosing oneOf selects exactly one.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function value_branches(): array {
		$branches = [];

		foreach ( Token_Type::all() as $type ) {
			$branches[] = [
				'properties' => [
					'$type'  => [ 'const' => $type ],
					'$value' => [ '$ref' => '#/definitions/' . $this->value_def_name( $type ) ],
				],
				'required'   => [ '$type', '$value' ],
			];
		}

		return $branches;
	}

	/**
	 * The per-type $value definitions, each "alias OR the type's literal shape". anyOf (not oneOf):
	 * an alias is itself a string, so a string literal branch would otherwise double-match an alias.
	 *
	 * @return array<string, mixed>
	 */
	private function value_definitions(): array {
		$defs = [];

		foreach ( Token_Type::all() as $type ) {
			$defs[ $this->value_def_name( $type ) ] = [
				'anyOf' => [
					[ '$ref' => '#/definitions/alias' ],
					$this->literal_shape( $type ),
				],
			];
		}

		return $defs;
	}

	/**
	 * The permissive literal shape for a $type. Composite types are built from composite_fields() so the
	 * field set tracks Token_Type; scalar literal grammar stays permissive (PHP Literals is the authority).
	 *
	 * @param string $type A v1 $type.
	 *
	 * @return array<string, mixed>
	 */
	private function literal_shape( string $type ): array {
		if ( $type === Token_Type::get_type_font_family() ) {
			return [
				'type'     => 'array',
				'items'    => [ 'type' => 'string' ],
				'minItems' => 1,
			];
		}

		if ( Token_Type::is_composite( $type ) ) {
			return $this->composite_shape( $type );
		}

		// color, dimension: a literal string (hex/function/keyword/length). PHP Literals enforces grammar.
		return [ 'type' => 'string' ];
	}

	/**
	 * The object shape for a composite type: every sub-field required, each "alias OR kind shape".
	 *
	 * @param string $type A composite $type.
	 *
	 * @return array<string, mixed>
	 */
	private function composite_shape( string $type ): array {
		$fields     = Token_Type::composite_fields( $type );
		$properties = [];

		foreach ( $fields as $field => $kind ) {
			$properties[ $field ] = [
				'anyOf' => [
					[ '$ref' => '#/definitions/alias' ],
					$this->kind_shape( $kind ),
				],
			];
		}

		return [
			'type'                 => 'object',
			'required'             => array_keys( $fields ),
			'properties'           => $properties,
			'additionalProperties' => false,
		];
	}

	/**
	 * The permissive non-alias shape for a composite sub-field kind.
	 *
	 * @param string $kind A $type or KIND_* constant.
	 *
	 * @return array<string, mixed>
	 */
	private function kind_shape( string $kind ): array {
		switch ( $kind ) {
			case Token_Type::get_type_font_family():
				return [
					'type'     => 'array',
					'items'    => [ 'type' => 'string' ],
					'minItems' => 1,
				];
			case Token_Type::get_kind_font_weight():
			case Token_Type::get_kind_line_height():
				return [ 'type' => [ 'string', 'number' ] ];
			default:
				// color, dimension.
				return [ 'type' => 'string' ];
		}
	}

	/**
	 * Stable definition name for a type's $value schema.
	 *
	 * @param string $type A v1 $type.
	 *
	 * @return string
	 */
	private function value_def_name( string $type ): string {
		return $type . 'Value';
	}
}
