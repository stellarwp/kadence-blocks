<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * Immutable registration of the ONE variant set a block accepts — the block's full bindable surface: the
 * per-property bindings any of its variants may draw from. The *structure* half of the variant model, and
 * the only part that cannot live in the document.
 *
 * A block declares exactly one set. Its `bindings` are the union of every property any variant may control;
 * a given variant in the document may define any subset of them (and different variants may define
 * different subsets), inheriting the rest from the block `$default` through the cascade.
 *
 * A set with a `label` is picker-driven: the editor renders a Design Variants control for it and the
 * variant projector emits `kb-variant--<variant>` rules. A set with no `label` is a preset / default look
 * with NO picker: it seeds block attributes / low-specificity CSS through
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Preset\Projector} and
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder} instead.
 *
 * It deliberately holds NO variant names, default or values, and no per-variant labels: those are document
 * data (`$extensions.com.kadence.designTokens.variants.<block>` — the `$default`, the variant keys, and
 * each variant's `tokens`), read through the Variant_Resolver. Keeping them out of the registry means a
 * single source of truth for the variant list (so a user-added variant in the store is honoured) and no
 * drift between a declaration and the document. The `label` is the one exception — it names the editor
 * picker CONTROL, not a variant, so it is structural editor config declared here.
 *
 * Bindings are keyed by property (e.g. "button-bg" => {@see Binding}); every variant shares them, since
 * "the button's background" maps to the same output slot whichever variant is active — only the value
 * changes.
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
	 * The block's bindable surface, keyed by property name — the union of properties any variant may
	 * control. Shared by every variant; a variant defines values for any subset of these.
	 *
	 * @since TBD
	 *
	 * @var array<string, Binding>
	 */
	public array $bindings;

	/**
	 * The editor picker's control label (e.g. "Style"), or null for a preset set that shows no picker.
	 * Names the CONTROL, not a variant.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $label;

	/**
	 * The selector the {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder}
	 * targets IN PLACE OF the block's `.wp-block-*` root when it builds the editor-scoped variant of the
	 * block-default CSS, or null when the block root is the right target in the editor too (the common
	 * case). Needed only when the block's editor markup does not put `.wp-block-*` on the element the
	 * bindings are meant to style — e.g. a wrapper `<div>` around the real rendered element — so the
	 * front-end selector would land the rule on the wrong node in the editor canvas.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $editor_selector;

	/**
	 * @since TBD
	 *
	 * @param string                 $block           The block name.
	 * @param array<string, Binding> $bindings        The block's bindable surface, keyed by property.
	 * @param string|null            $label           The picker control label, or null for a preset set.
	 * @param string|null            $editor_selector The editor-only selector override, or null to reuse the
	 *                                                 front-end selector in the editor too.
	 */
	private function __construct( string $block, array $bindings, ?string $label, ?string $editor_selector ) {
		$this->block           = $block;
		$this->bindings        = $bindings;
		$this->label           = $label;
		$this->editor_selector = $editor_selector;
	}

	/**
	 * Build a variant set from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $set The declaration: "block", optional "bindings" (property =>
	 *                                  {@see Binding::from_array()}), optional "label" (the picker control
	 *                                  label; omit for a preset set with no picker), and optional
	 *                                  "editor_selector" (see {@see self::$editor_selector}). Variant names,
	 *                                  default and values are document data, not declared here.
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

		return new self(
			$set['block'],
			self::bindings( $set['block'], $set['bindings'] ?? [] ),
			isset( $set['label'] ) && is_string( $set['label'] ) ? $set['label'] : null,
			isset( $set['editor_selector'] ) && is_string( $set['editor_selector'] ) ? $set['editor_selector'] : null
		);
	}

	/**
	 * The binding for a property, or null when the set declares none.
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
	 * Pass the union of value properties across the set's variants (see
	 * Variant_Resolver::value_properties()). "unbound" are valued properties with no binding — they
	 * cannot reach output and are the harmful case; "unvalued" are bindings no variant ever sets — dead
	 * wiring. A well-formed set reports neither.
	 *
	 * @since TBD
	 *
	 * @param string[] $value_properties Properties set by the set's variants in the document.
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
	 * A coarse input kind for a bound property — "color", "dimension" or "text" — so the editor's variant
	 * form can render the right control per property. Read from the referenced token's group segment when the
	 * binding is a token reference (e.g. `semantic.radius.media` => "dimension"), otherwise inferred from the
	 * property name (e.g. `button-bg` => "color", `button-radius` => "dimension"). Falls back to "text".
	 *
	 * @since TBD
	 *
	 * @param string $property The bound property, e.g. "button-bg".
	 *
	 * @return string One of "color", "dimension" or "text".
	 */
	public function kind( string $property ): string {
		$binding = $this->binding( $property );

		if ( $binding !== null && $binding->token !== null ) {
			$segments = explode( '.', $binding->token );
			$group    = self::classify( $segments[1] ?? '' );

			if ( $group !== '' ) {
				return $group;
			}
		}

		$by_name = self::classify( $property );

		return $by_name !== '' ? $by_name : 'text';
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
	 * Classify a term (a token group segment or a property name) into a coarse input kind, or "" when it
	 * matches neither a dimension nor a color. Dimension terms are checked first so "borderRadius" resolves to
	 * "dimension" rather than matching the "border" color term.
	 *
	 * @since TBD
	 *
	 * @param string $term The term to classify.
	 *
	 * @return string "color", "dimension" or "".
	 */
	private static function classify( string $term ): string {
		$term = strtolower( $term );

		foreach ( [ 'radius', 'width', 'gap', 'spacing', 'space', 'size', 'height', 'dimension' ] as $needle ) {
			if ( strpos( $term, $needle ) !== false ) {
				return 'dimension';
			}
		}

		foreach ( [ 'color', 'bg', 'background', 'text', 'border', 'fill', 'stroke' ] as $needle ) {
			if ( strpos( $term, $needle ) !== false ) {
				return 'color';
			}
		}

		return '';
	}
}
