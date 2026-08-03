<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * Immutable registration of the preset bindings a block accepts — the block's full bindable surface: the
 * per-property bindings any of its presets may draw from. The *structure* half of the preset model, and
 * the only part that cannot live in the document.
 *
 * A block declares its preset bindings exactly once. Its `bindings` are the union of every property any preset
 * may control; a given preset in the document may define any subset of them (and different presets may
 * define different subsets), inheriting the rest from the block `$default` through the cascade.
 *
 * Preset bindings with a `label` are picker-driven: the editor renders a Design Presets control for them and
 * the preset projector emits `kb-preset--<preset>` rules. Preset bindings with no `label` are a preset /
 * default look with NO picker: it seeds block attributes / low-specificity CSS through
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Preset\Projector} and
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder} instead.
 *
 * It deliberately holds NO preset names, default or values, and no per-preset labels: those are document
 * data (`$extensions.com.kadence.designTokens.presets.<block>` — the `$default`, the preset keys, and
 * each preset's `tokens`), read through the Preset_Resolver. Keeping them out of the registry means a
 * single source of truth for the preset list (so a user-added preset in the store is honored) and no
 * drift between a declaration and the document. The `label` is the one exception — it names the editor
 * picker CONTROL, not a preset, so it is structural editor config declared here.
 *
 * Bindings are keyed by property (e.g. "button-bg" => {@see Binding}); every preset shares them, since
 * "the button's background" maps to the same output slot whichever preset is active — only the value
 * changes.
 *
 * The optional `style_library` section is a second, unrelated piece of structural config: the Style
 * Library admin page's per-block presentation metadata (today, the BLOCK PRESETS nav label). It is
 * intentionally distinct from `label` — that names the picker CONTROL rendered inside the block
 * inspector, not the block itself, so it is the wrong string to show as a nav entry.
 *
 * @since TBD
 */
final class Preset_Bindings {

	/**
	 * The block name, e.g. "kadence/advancedbtn".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $block;

	/**
	 * The block's bindable surface, keyed by property name — the union of properties any preset may
	 * control. Shared by every preset; a preset defines values for any subset of these.
	 *
	 * @since TBD
	 *
	 * @var array<string, Binding>
	 */
	public array $bindings;

	/**
	 * The editor picker's control label (e.g. "Style"), or null for preset bindings that show no picker.
	 * Names the CONTROL, not a preset.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $label;

	/**
	 * The selector the {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder}
	 * targets IN PLACE OF the block's `.wp-block-*` root when it builds the editor-scoped version of the
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
	 * The Style Library admin page's per-block presentation metadata, or null when the declaration
	 * omits the optional "style_library" section. Keyed for forward compatibility rather than a bare
	 * scalar: today it carries only "label" (the block's BLOCK PRESETS nav label — never the picker
	 * control's `$label`, which names the inspector control, not the block); a later per-block
	 * settings-field schema is expected to add sibling keys here without a breaking change.
	 *
	 * @since TBD
	 *
	 * @var array{label?: string}|null
	 */
	public ?array $style_library;

	/**
	 * @since TBD
	 *
	 * @param string                     $block           The block name.
	 * @param array<string, Binding>     $bindings        The block's bindable surface, keyed by property.
	 * @param string|null                $label           The picker control label, or null for preset bindings with no picker.
	 * @param string|null                $editor_selector The editor-only selector override, or null to reuse the
	 *                                                     front-end selector in the editor too.
	 * @param array{label?: string}|null $style_library The Style Library admin page's per-block presentation
	 *                                                   metadata, or null when the declaration omits it.
	 */
	private function __construct( string $block, array $bindings, ?string $label, ?string $editor_selector, ?array $style_library ) {
		$this->block           = $block;
		$this->bindings        = $bindings;
		$this->label           = $label;
		$this->editor_selector = $editor_selector;
		$this->style_library   = $style_library;
	}

	/**
	 * Build a preset bindings object from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $declaration The declaration: "block", optional "bindings" (property =>
	 *                                  {@see Binding::from_array()}), optional "label" (the picker control
	 *                                  label; omit for preset bindings with no picker), optional
	 *                                  "editor_selector" (see {@see self::$editor_selector}), and optional
	 *                                  "style_library" (see {@see self::$style_library}). Preset names,
	 *                                  default and values are document data, not declared here.
	 *
	 * @throws InvalidArgumentException When "block" is missing or a binding is malformed.
	 *
	 * @return self
	 */
	public static function from_array( array $declaration ): self {
		// Require a present, non-empty string. Avoid empty() so a legitimate "0" block name is not
		// mistaken for a missing value, matching Token_Definition::from_array().
		if ( ! isset( $declaration['block'] ) || ! is_string( $declaration['block'] ) || $declaration['block'] === '' ) {
			throw new InvalidArgumentException( 'Preset-bindings declaration is missing required string "block".' );
		}

		return new self(
			$declaration['block'],
			self::bindings( $declaration['block'], $declaration['bindings'] ?? [] ),
			isset( $declaration['label'] ) && is_string( $declaration['label'] ) ? $declaration['label'] : null,
			isset( $declaration['editor_selector'] ) && is_string( $declaration['editor_selector'] ) ? $declaration['editor_selector'] : null,
			self::style_library( $declaration['style_library'] ?? null )
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
	 * Report binding ↔ value mismatches against the properties the document's presets actually set.
	 *
	 * Pass the union of value properties across the block's presets (see
	 * Preset_Resolver::value_properties()). "unbound" are valued properties with no binding — they
	 * cannot reach output and are the harmful case; "unvalued" are bindings no preset ever sets — dead
	 * wiring. Well-formed preset bindings report neither.
	 *
	 * @since TBD
	 *
	 * @param string[] $value_properties Properties set by the block's presets in the document.
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
	 * property, the token reference and inline projection targets. Values, preset names and the default
	 * are NOT here — those are document data read through the Preset_Resolver. Mirrors
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
	 * A coarse input kind for a bound property — "color", "dimension" or "text" — so the editor's preset
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
	 * The Style Library BLOCK PRESETS nav label declared for this block, or null when the
	 * declaration has no "style_library" section or leaves "label" empty. Distinct from
	 * {@see self::$label}, which names the picker CONTROL rather than the block.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function style_library_label(): ?string {
		$label = $this->style_library['label'] ?? null;

		return is_string( $label ) && $label !== '' ? $label : null;
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
				sprintf( 'Preset-bindings declaration for "%s" must have "bindings" as a map of property => target.', $block )
			);
		}

		$bindings = [];

		foreach ( $declared as $property => $spec ) {
			if ( ! is_string( $property ) || $property === '' || ! is_array( $spec ) ) {
				throw new InvalidArgumentException(
					sprintf( 'Preset-bindings declaration for "%s" has a malformed binding; each must be "property" => target array.', $block )
				);
			}

			$bindings[ $property ] = Binding::from_array( $property, $spec );
		}

		return $bindings;
	}

	/**
	 * Parse the optional "style_library" declaration section: the Style Library admin page's
	 * per-block presentation metadata. Lenient like "label" and "editor_selector" — a missing or
	 * malformed section yields null rather than throwing, since it is optional and its absence must
	 * not block registration of the block's preset bindings.
	 *
	 * @since TBD
	 *
	 * @param mixed $declared The declared "style_library" value.
	 *
	 * @return array{label?: string}|null
	 */
	private static function style_library( $declared ): ?array {
		if ( ! is_array( $declared ) ) {
			return null;
		}

		$section = [];

		if ( isset( $declared['label'] ) && is_string( $declared['label'] ) && $declared['label'] !== '' ) {
			$section['label'] = $declared['label'];
		}

		return $section;
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
