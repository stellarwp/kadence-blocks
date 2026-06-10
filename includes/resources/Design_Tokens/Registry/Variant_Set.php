<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * Immutable registration that a block accepts variants, plus its per-property bindings — the *structure*
 * half of the variant model, and the only part that cannot live in the document.
 *
 * It deliberately holds NO variant names, default, labels or values: those are document data
 * (`$extensions.com.kadence.designTokens.variants.<block>` — the `$default`, the variant keys, and each
 * variant's `tokens`), read through the Variant_Resolver. Keeping them out of the registry means a
 * single source of truth for the variant list (so a user-added variant in the store is honoured) and no
 * drift between a declaration and the document.
 *
 * Bindings are keyed by property (e.g. "button-bg" => {@see Binding}); all variants of a block share
 * the same bindings, since "the button's background" maps to the same output slot whichever variant is
 * active — only the value changes.
 *
 * @since TBD
 */
final class Variant_Set {

	/**
	 * The block name, e.g. "kadence/advancedbtn".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $block;

	/**
	 * Per-property bindings, keyed by property name.
	 *
	 * @since TBD
	 *
	 * @var array<string, Binding>
	 */
	public array $bindings;

	/**
	 * @since TBD
	 *
	 * @param string                 $block    The block name.
	 * @param array<string, Binding> $bindings Per-property bindings.
	 */
	private function __construct( string $block, array $bindings ) {
		$this->block    = $block;
		$this->bindings = $bindings;
	}

	/**
	 * Build a variant set from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $set The declaration: "block" and optional "bindings" (property =>
	 *                                  {@see Binding::from_array()}). Variant names, default and values
	 *                                  are document data, not declared here.
	 *
	 * @throws InvalidArgumentException When "block" is missing or a binding is malformed.
	 *
	 * @return self
	 */
	public static function from_array( array $set ): self {
		// Require a present, non-empty string. Avoid empty() so a legitimate "0" block name is not
		// mistaken for a missing value, matching Token_Definition::from_array().
		if ( ! isset( $set['block'] ) || ! is_string( $set['block'] ) || $set['block'] === '' ) {
			throw new InvalidArgumentException( 'Variant-set declaration is missing required string "block".' );
		}

		return new self( $set['block'], self::bindings( $set['block'], $set['bindings'] ?? [] ) );
	}

	/**
	 * The binding for a property, or null when the block declares none.
	 *
	 * @since TBD
	 *
	 * @param string $property The block property, e.g. "button-bg".
	 *
	 * @return Binding|null
	 */
	public function binding( string $property ): ?Binding {
		return $this->bindings[ $property ] ?? null;
	}

	/**
	 * Report binding ↔ value mismatches against the properties the document's variants actually set.
	 *
	 * Pass the union of value properties across the block's variants (see
	 * Variant_Resolver::value_properties()). "unbound" are valued properties with no binding — they
	 * cannot reach output and are the harmful case; "unvalued" are bindings no variant ever sets — dead
	 * wiring. A well-formed block reports neither.
	 *
	 * @since TBD
	 *
	 * @param string[] $value_properties Properties set by the block's variants in the document.
	 *
	 * @return array{unbound: string[], unvalued: string[]}
	 */
	public function consistency( array $value_properties ): array {
		$bound = array_keys( $this->bindings );

		return [
			'unbound'  => array_values( array_diff( $value_properties, $bound ) ),
			'unvalued' => array_values( array_diff( $bound, $value_properties ) ),
		];
	}

	/**
	 * Structure-only serialization for the admin UI feed: the bound properties and, per
	 * property, the token reference and inline projection targets. Values, variant names and the default
	 * are NOT here — those are document data read through the Variant_Resolver. Mirrors
	 * {@see Token_Registry::to_ui_schema()}.
	 *
	 * @since TBD
	 *
	 * @return array{bindings: array<string, array{token: string|null, projections: array<string, mixed>}>}
	 */
	public function to_ui_array(): array {
		$bindings = [];

		foreach ( $this->bindings as $property => $binding ) {
			$bindings[ $property ] = [
				'token'       => $binding->token,
				'projections' => $binding->projections,
			];
		}

		return [ 'bindings' => $bindings ];
	}

	/**
	 * Build the property => Binding map from a declaration's "bindings".
	 *
	 * @since TBD
	 *
	 * @param string $block    The block name, for error messages.
	 * @param mixed  $declared The declared "bindings" value.
	 *
	 * @throws InvalidArgumentException When "bindings" is not a map of property => spec, or a binding is
	 *                                  malformed.
	 *
	 * @return array<string, Binding>
	 */
	private static function bindings( string $block, $declared ): array {
		if ( ! is_array( $declared ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Variant-set "%s" declaration "bindings" must be a map of property => target.', $block )
			);
		}

		$bindings = [];

		foreach ( $declared as $property => $spec ) {
			if ( ! is_string( $property ) || $property === '' || ! is_array( $spec ) ) {
				throw new InvalidArgumentException(
					sprintf( 'Variant-set "%s" has a malformed binding; each must be "property" => target array.', $block )
				);
			}

			$bindings[ $property ] = Binding::from_array( $property, $spec );
		}

		return $bindings;
	}
}
