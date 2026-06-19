<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * Immutable registration that a block accepts variants, plus its per-property bindings — the *structure*
 * half of the variant model, and the only part that cannot live in the document.
 *
 * It deliberately holds NO variant names, default or values, and no per-variant labels: those are document
 * data (`$extensions.com.kadence.designTokens.variants.<block>` — the `$default`, the variant keys, and
 * each variant's `tokens`), read through the Variant_Resolver. Keeping them out of the registry means a
 * single source of truth for the variant list (so a user-added variant in the store is honoured) and no
 * drift between a declaration and the document. The optional `label` is the one exception — it names the
 * editor picker CONTROL (the variant axis), not a variant, so it is structural editor config and is
 * declared here.
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
	 * The editor picker's control label for this block's variant axis (e.g. "Style"), or null to fall back
	 * to the editor's default label. Names the CONTROL, not a variant. For a multi-axis (grouped) block,
	 * this is the fallback when a group declares no label of its own; see {@see self::$group_labels}.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $label;

	/**
	 * Per-group editor picker control labels, keyed by group slug, for a multi-axis (grouped) block (e.g.
	 * "color" => "Color", "emphasis" => "Emphasis"). Empty for a flat block, which uses {@see self::$label}
	 * for its single axis. Names the CONTROL for each axis, not a variant.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	public array $group_labels;

	/**
	 * @since TBD
	 *
	 * @param string                 $block        The block name.
	 * @param array<string, Binding> $bindings     Per-property bindings.
	 * @param string|null            $label        The picker control label, or null for the editor default.
	 * @param array<string, string>  $group_labels Per-group control labels, keyed by group slug.
	 */
	private function __construct( string $block, array $bindings, ?string $label, array $group_labels ) {
		$this->block        = $block;
		$this->bindings     = $bindings;
		$this->label        = $label;
		$this->group_labels = $group_labels;
	}

	/**
	 * Build a variant set from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $set The declaration: "block", optional "bindings" (property =>
	 *                                  {@see Binding::from_array()}), optional "label" (the picker control
	 *                                  label), and optional "groups" (group slug => { "label" } for a
	 *                                  multi-axis block). Variant names, default and values are document
	 *                                  data, not declared here.
	 *
	 * @throws InvalidArgumentException When "block" is missing or a binding/group is malformed.
	 *
	 * @return self
	 */
	public static function from_array( array $set ): self {
		// Require a present, non-empty string. Avoid empty() so a legitimate "0" block name is not
		// mistaken for a missing value, matching Token_Definition::from_array().
		if ( ! isset( $set['block'] ) || ! is_string( $set['block'] ) || $set['block'] === '' ) {
			throw new InvalidArgumentException( 'Variant-set declaration is missing required string "block".' );
		}

		return new self(
			$set['block'],
			self::bindings( $set['block'], $set['bindings'] ?? [] ),
			isset( $set['label'] ) && is_string( $set['label'] ) ? $set['label'] : null,
			self::group_labels( $set['block'], $set['groups'] ?? [] )
		);
	}

	/**
	 * The editor picker control label for one of the block's variant groups (axes): the group's own
	 * declared label, falling back to {@see self::$label} (the single-axis label) when the group declares
	 * none — including for a flat block's implicit single group. Null when neither is declared.
	 *
	 * @since TBD
	 *
	 * @param string $group The variant group slug (the implicit-group sentinel for a flat block).
	 *
	 * @return string|null
	 */
	public function group_label( string $group ): ?string {
		return $this->group_labels[ $group ] ?? $this->label;
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
	public function to_ui_schema(): array {
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

	/**
	 * Build the group slug => control label map from a declaration's "groups". Each entry is a group slug
	 * mapping to a config array; only a non-empty string "label" is read (a group may declare other config
	 * later). A group with no usable label is simply omitted, so {@see self::group_label()} falls back to
	 * the single-axis label.
	 *
	 * @since TBD
	 *
	 * @param string $block    The block name, for error messages.
	 * @param mixed  $declared The declared "groups" value.
	 *
	 * @throws InvalidArgumentException When "groups" is not a map of group => config.
	 *
	 * @return array<string, string>
	 */
	private static function group_labels( string $block, $declared ): array {
		if ( ! is_array( $declared ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Variant-set "%s" declaration "groups" must be a map of group => config.', $block )
			);
		}

		$labels = [];

		foreach ( $declared as $group => $config ) {
			if ( ! is_string( $group ) || $group === '' || ! is_array( $config ) ) {
				throw new InvalidArgumentException(
					sprintf( 'Variant-set "%s" has a malformed group; each must be "group" => config array.', $block )
				);
			}

			if ( isset( $config['label'] ) && is_string( $config['label'] ) && $config['label'] !== '' ) {
				$labels[ $group ] = $config['label'];
			}
		}

		return $labels;
	}
}
