<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;

/**
 * One preset binding: how a single block property (e.g. "button-bg") reaches output when a preset is
 * active. This is *structure* — the projection target, not a value. The value lives in the DTCG
 * document and is flattened by the Preset_Resolver.
 *
 * A binding declares a **token reference**, **inline targets**, or **both** (they compose):
 *
 *   - **Token reference** — `['token' => 'semantic.color.button-bg']`. The property reuses that
 *     registered token's projections, so a preset retargets the exact variable the base property
 *     already feeds and there is no duplicated projection to drift.
 *   - **Inline target** — `['kadence_slot' => 'palette3']` (and/or `block_attr`, `css_var`, `css_prop`,
 *     `css_selector`). For a property that is not (yet) a registered token, or to add a target the token
 *     does not carry.
 *   - **Both** — e.g. `['token' => 'semantic.color.button-bg', 'block_attr' => 'background']`. The
 *     inline targets supplement (and override) the referenced token's projections, which is how a
 *     token-backed property still declares the `block_attr` a block preset needs.
 *
 * {@see Token_Registry::effective_projections()} merges the two. The projection vocabulary is the same
 * one tokens use, with three additions — `block_attr`, `css_prop`, and `css_selector`, which tokens
 * never carry.
 *
 * A binding may also declare `control_attr`, `responsive_attrs` and `axis` — editor-only metadata kept out
 * of the projected bindings. See {@see Binding::control_attr()}, {@see Binding::responsive_attrs()} and
 * {@see Binding::axis()}.
 *
 * @since TBD
 */
final class Binding {

	/**
	 * Declaration key selecting the token-reference form.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKEN = 'token';

	/**
	 * Inline target: a Kadence palette slot (palette1..9) → `--global-paletteN`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KADENCE_SLOT = 'kadence_slot';

	/**
	 * Inline target: a block attribute, so a block preset can seed an attribute default.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_ATTR = 'block_attr';

	/**
	 * Inline target: a KB-owned CSS custom property this property drives, named without the leading `--`
	 * (e.g. "kb-btn-radius" → `--kb-btn-radius`). For a property with no Kadence palette slot or WordPress
	 * preset bucket (e.g. border-radius): the block reads `var(--<css_var>, <token fallback>)`, and a selected
	 * preset sets `--<css_var>` on its scope so the value can vary per preset.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CSS_VAR = 'css_var';

	/**
	 * Inline target: a CSS property the block renders as a raw literal (e.g. "border-radius"), so the
	 * block-default-CSS projector can emit a low-specificity block-scoped rule pointing it at the bound
	 * token's variable. Used for the dimension families KB gives no ownable variable for (radius, icon
	 * size); see that projector's Css_Builder for the full rationale.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CSS_PROP = 'css_prop';

	/**
	 * Inline target: a selector suffix appended after the block's `.wp-block-*` class for the `css_prop`
	 * rule, when the property is rendered on a descendant rather than the block root (e.g. `img` for an
	 * image). A bare selector is treated as a descendant — the projector inserts the combinator space, so
	 * no load-bearing leading space is needed; a value that opens with a combinator or attachment character
	 * (`>`, `+`, `~`, `.`, `:`, `#`, `[`, `&`) is used verbatim. Optional; the rule targets the block root
	 * when omitted.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CSS_SELECTOR = 'css_selector';

	/**
	 * Inline target: the selector suffix to use instead of `css_selector` when the block-default-CSS
	 * projector is building for the editor canvas, for a block whose editor markup renders the bound
	 * property on a DIFFERENT descendant than its saved markup does (the Section renders
	 * `.kadence-inner-column-inner` while `save.js` renders `.kt-inside-inner-col`). Without it the
	 * front-end suffix is reused in the editor, where it matches nothing, and the property silently keeps
	 * its editor look while the front end follows the token.
	 *
	 * This is the per-property counterpart to {@see Preset_Bindings::$editor_selector}, which swaps the
	 * block ROOT rather than the descendant suffix. The two compose, and neither substitutes for the
	 * other: a block whose editor root differs declares that one, a block whose editor descendant differs
	 * declares this one. Optional; `css_selector` is reused in the editor when omitted, which is the
	 * right answer for every block whose two render paths agree.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const EDITOR_CSS_SELECTOR = 'editor_css_selector';

	/**
	 * Inline target: the selector suffix — pseudo-class included — that scopes this property to a UI state
	 * rather than to the block's resting appearance, e.g. `:hover > .kt-inside-inner-col` for the Section's
	 * hover background. Declaring it makes the binding a STATE binding, which changes which projector
	 * renders it and how.
	 *
	 * A state binding is rendered only by the selected-preset projector, which emits a real declaration
	 * (`<css_prop>: var(<preset var>)`) scoped to `.wp-block-<block>.kb-preset--<preset><css_state>` — and,
	 * for the block's `$default` preset, to the class-less `.wp-block-<block><css_state>`. The
	 * block-default-CSS projector skips it entirely: that layer renders only the `$default` preset, so its
	 * rule would be present on every block whether or not a preset asked for a state, and any `:hover` rule
	 * outranks the block's own resting per-instance rule — a shipped state default would repaint content
	 * that never opted in.
	 *
	 * The whole suffix lives here, pseudo included, because which element carries the state differs per
	 * block: the Section and the Icon are hovered on the block root and paint a descendant
	 * (`:hover > .kt-inside-inner-col`), while the Button is hovered on the element it paints
	 * (`*.kb-button:hover`). It is composed exactly like {@see self::CSS_SELECTOR} — a bare selector gains
	 * the combinator space, one opening with a combinator or attachment character is used verbatim, and a
	 * leading `*` is how a descendant whose own selector starts with `.` asks for the space.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CSS_STATE = 'css_state';

	/**
	 * Inline target: the state selector suffix to use instead of `css_state` when the preset projector is
	 * building for the editor canvas, for a block whose editor markup renders the bound property on a
	 * different element than its saved markup does (the Section paints `.kadence-inner-column-inner` in the
	 * editor and `.kt-inside-inner-col` on the front end).
	 *
	 * The per-state counterpart to {@see self::EDITOR_CSS_SELECTOR}, and it behaves the same way: optional,
	 * with `css_state` reused in the editor when omitted, which is right for every block whose two render
	 * paths agree on the element.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const EDITOR_CSS_STATE = 'editor_css_state';

	/**
	 * Editor-only target: the block attribute the editor control for this property writes, so the
	 * indicator layer can tell whether a control is bound to the active preset or has been overridden.
	 * Deliberately NOT a projection target — it is excluded from STRING_TARGETS / inline_targets(), so it
	 * never enters $projections and effective_projections() never emits it. That is what keeps a bound but
	 * untouched attribute EMPTY (nothing is seeded), which the editor's "empty = bound" detection relies on.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CONTROL_ATTR = 'control_attr';

	/**
	 * Declaration key naming the per-breakpoint block attributes an editor control writes, keyed by
	 * breakpoint. Editor-only metadata, like CONTROL_ATTR.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const RESPONSIVE_ATTRS = 'responsive_attrs';

	/**
	 * Editor-only metadata naming the axis of a composite control this property edits, for the case where
	 * several properties share ONE `control_attr` whose stored value is a nested per-side/per-axis shape
	 * rather than a flat scalar (the border controls: width, style and color all live inside a single
	 * `[{top: [color, style, size], ...}, unit]` attribute).
	 *
	 * The generic kind classification cannot tell those apart — a width property reads as "dimension" and
	 * both style and color read as "color" — so the editor would compare the nested value as if it were
	 * flat and never match. Declaring the axis tells the indicator layer which slot of the composite this
	 * property owns. Omitted for the overwhelming majority of bindings, whose `control_attr` holds the
	 * property's own value directly.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const AXIS = 'axis';

	/**
	 * The inline string targets and their validation: each, when present, must be a non-empty string.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const STRING_TARGETS = [ self::KADENCE_SLOT, self::BLOCK_ATTR, self::CSS_PROP, self::CSS_SELECTOR, self::EDITOR_CSS_SELECTOR, self::CSS_STATE, self::EDITOR_CSS_STATE, self::CSS_VAR ];

	/**
	 * The block property this binding drives, e.g. "button-bg". Carried for error messages and so a
	 * binding can travel without its map key.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $property;

	/**
	 * The referenced token id for the token-reference form, or null for an inline binding.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $token;

	/**
	 * Inline projection targets (target key => value); empty for the token-reference form.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>
	 */
	public array $projections;

	/**
	 * The block attribute the editor control for this property writes, or null when the binding declares
	 * none. Editor-only metadata; kept out of $projections on purpose so no projector seeds it.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $control_attr;

	/**
	 * The per-breakpoint block attributes this binding's editor control writes, keyed by breakpoint
	 * ("tablet" => "tabletBorderRadius"). Empty when the binding declares none.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	public array $responsive_attrs;

	/**
	 * The axis of a composite control this property edits ("border-width", "border-style",
	 * "border-color"), or null when the binding's control attribute holds this property's value directly.
	 * Editor-only metadata; kept out of $projections like control_attr.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	public ?string $axis;

	/**
	 * @since TBD
	 *
	 * @param string                $property     The block property this binding drives.
	 * @param string|null           $token        Referenced token id, or null when inline.
	 * @param array<string, mixed>  $projections  Inline projection targets, empty when a token reference.
	 * @param string|null           $control_attr     The editor control attribute, or null when none declared.
	 * @param array<string, string> $responsive_attrs Breakpoint => attribute, empty when none declared.
	 * @param string|null           $axis             The composite-control axis, or null when none declared.
	 */
	private function __construct( string $property, ?string $token, array $projections, ?string $control_attr, array $responsive_attrs = [], ?string $axis = null ) {
		$this->property         = $property;
		$this->token            = $token;
		$this->projections      = $projections;
		$this->control_attr     = $control_attr;
		$this->responsive_attrs = $responsive_attrs;
		$this->axis             = $axis;
	}

	/**
	 * Build a binding from its declaration, validating the token-reference XOR inline-target contract.
	 *
	 * @since TBD
	 *
	 * @param string               $property The block property (the binding map key).
	 * @param array<string, mixed> $spec     The binding declaration.
	 *
	 * @throws InvalidArgumentException When the binding is neither a valid token reference nor a valid
	 *                                  inline target, or mixes the two.
	 *
	 * @return self
	 */
	public static function from_array( string $property, array $spec ): self {
		$inline = self::inline_targets( $property, $spec );
		$token  = null;

		if ( array_key_exists( self::TOKEN, $spec ) ) {
			$token = $spec[ self::TOKEN ];

			if ( ! is_string( $token ) || $token === '' ) {
				throw new InvalidArgumentException(
					sprintf( 'Binding "%s" token reference must be a non-empty token id.', $property )
				);
			}
		}

		// A binding must say *something* — reference a token, declare an inline target, or both. The two
		// compose: a token reference contributes the token's projections, and inline targets supplement
		// or override them (e.g. add a block_attr a token never carries). See effective_projections().
		if ( $token === null && $inline === [] ) {
			throw new InvalidArgumentException(
				sprintf( 'Binding "%s" must reference a token and/or declare at least one inline target.', $property )
			);
		}

		return new self(
			$property,
			$token,
			$inline,
			self::control_attr_of( $property, $spec ),
			self::responsive_attrs_of( $property, $spec ),
			self::axis_of( $property, $spec )
		);
	}

	/**
	 * The projection key for the Kadence palette-slot target ("kadence_slot"), used to read a binding's
	 * slot out of its effective projections.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kadence_slot_key(): string {
		return self::KADENCE_SLOT;
	}

	/**
	 * Whether this binding reuses a registered token's projections rather than declaring inline targets.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_token_ref(): bool {
		return $this->token !== null;
	}

	/**
	 * The block attribute this binding seeds, or null when it declares none. Used by the block-preset
	 * projector to map a resolved preset value onto a block's default attribute. Always an inline target
	 * — tokens never carry a `block_attr` — so it is read straight off this binding.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function block_attr(): ?string {
		$attribute = $this->projections[ self::BLOCK_ATTR ] ?? null;

		return is_string( $attribute ) ? $attribute : null;
	}

	/**
	 * The block attribute the editor control for this property writes, or null when the binding declares
	 * none. Editor-only: read by the preset catalog so the indicator layer can key an override signal to a
	 * control. Unlike block_attr(), this is NOT a projection target and never seeds an attribute default.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function control_attr(): ?string {
		return $this->control_attr;
	}

	/**
	 * The per-breakpoint block attributes this binding's editor control writes, keyed by breakpoint, or an
	 * empty map when it declares none.
	 *
	 * A block names these by a prefix convention ("borderRadius" => "tabletBorderRadius"), which is a
	 * naming rule rather than something safely derivable across blocks, so it is declared. Editor-only,
	 * like control_attr(): never a projection target.
	 *
	 * @since TBD
	 *
	 * @return array<string, string> Breakpoint => attribute name.
	 */
	public function responsive_attrs(): array {
		return $this->responsive_attrs;
	}

	/**
	 * The axis of the composite control this property edits, or null when the binding's control attribute
	 * holds this property's value directly.
	 *
	 * Read by the preset catalog so the editor's indicator layer knows which slot of a nested per-axis
	 * attribute to compare, instead of keying that off a hardcoded list of property names. Editor-only,
	 * like control_attr(): never a projection target.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function axis(): ?string {
		return $this->axis;
	}

	/**
	 * The CSS property this binding feeds a block-scoped default rule for, or null when it declares none.
	 * Read by the block-default-CSS projector to emit `<prop>: var(--kb-token--*)` for a dimension the
	 * block renders as a literal. Always an inline target — tokens never carry a `css_prop` — so it is read
	 * straight off this binding.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function css_prop(): ?string {
		$property = $this->projections[ self::CSS_PROP ] ?? null;

		return is_string( $property ) ? $property : null;
	}

	/**
	 * The selector suffix for this binding's `css_prop` rule (e.g. " img"), or null when the property is
	 * rendered on the block root. Inline only.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function css_selector(): ?string {
		$selector = $this->projections[ self::CSS_SELECTOR ] ?? null;

		return is_string( $selector ) ? $selector : null;
	}

	/**
	 * The selector suffix for this binding's `css_prop` rule in the EDITOR canvas: the declared
	 * `editor_css_selector` when the block's editor markup renders the property on a different descendant
	 * than its saved markup, and otherwise {@see self::css_selector()}, which is the right answer whenever
	 * the two render paths agree. Inline only.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function editor_css_selector(): ?string {
		$selector = $this->projections[ self::EDITOR_CSS_SELECTOR ] ?? null;

		return is_string( $selector ) ? $selector : $this->css_selector();
	}

	/**
	 * The state selector suffix this binding's declaration is scoped to (e.g. ":hover > .kt-inside-inner-col"),
	 * or null when the binding drives the block's resting appearance. Its presence is what marks a binding as
	 * a state binding — see {@see self::CSS_STATE} for what that changes. Inline only.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function css_state(): ?string {
		$selector = $this->projections[ self::CSS_STATE ] ?? null;

		return is_string( $selector ) ? $selector : null;
	}

	/**
	 * The state selector suffix for the EDITOR canvas: the declared `editor_css_state` when the block's
	 * editor markup paints a different element than its saved markup, and otherwise {@see self::css_state()},
	 * which is right whenever the two render paths agree. Inline only.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function editor_css_state(): ?string {
		$selector = $this->projections[ self::EDITOR_CSS_STATE ] ?? null;

		return is_string( $selector ) ? $selector : $this->css_state();
	}

	/**
	 * Whether this binding scopes its property to a UI state rather than to the block's resting appearance.
	 * True exactly when it declares a `css_state`.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_state(): bool {
		return $this->css_state() !== null;
	}

	/**
	 * The KB-owned CSS custom property this binding drives (named without the leading `--`, e.g.
	 * "kb-btn-radius"), or null when it declares none. Read by the preset projector to set that variable on a
	 * selected preset's scope so the value can vary per preset. Inline only.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	public function css_var(): ?string {
		$name = $this->projections[ self::CSS_VAR ] ?? null;

		return is_string( $name ) ? $name : null;
	}

	/**
	 * Extract and validate the inline projection targets from a binding declaration.
	 *
	 * @since TBD
	 *
	 * @param string               $property The block property, for error messages.
	 * @param array<string, mixed> $spec     The binding declaration.
	 *
	 * @throws InvalidArgumentException When a present target carries an invalid value.
	 *
	 * @return array<string, mixed> The recognised inline targets only.
	 */
	private static function inline_targets( string $property, array $spec ): array {
		$inline = [];

		foreach ( self::STRING_TARGETS as $key ) {
			if ( ! array_key_exists( $key, $spec ) ) {
				continue;
			}

			if ( ! is_string( $spec[ $key ] ) || $spec[ $key ] === '' ) {
				throw new InvalidArgumentException(
					sprintf( 'Binding "%s" target "%s" must be a non-empty string.', $property, $key )
				);
			}

			$inline[ $key ] = $spec[ $key ];
		}

		return $inline;
	}

	/**
	 * Parse a binding's `responsive_attrs` declaration into a breakpoint => attribute map.
	 *
	 * Breakpoint keys are checked against {@see Responsive::get_breakpoint_keys()} at registration, so a
	 * typo fails loudly here rather than silently never capturing that device.
	 *
	 * @since TBD
	 *
	 * @param string               $property The property the binding is for, for error messages.
	 * @param array<string, mixed> $spec     The binding declaration.
	 *
	 * @throws InvalidArgumentException When the map, a key, or a value is malformed.
	 *
	 * @return array<string, string> Breakpoint => attribute, empty when the declaration omits it.
	 */
	private static function responsive_attrs_of( string $property, array $spec ): array {
		if ( ! array_key_exists( self::RESPONSIVE_ATTRS, $spec ) ) {
			return [];
		}

		$declared = $spec[ self::RESPONSIVE_ATTRS ];

		if ( ! is_array( $declared ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Binding "%s" target "%s" must be a breakpoint => attribute map.', $property, self::RESPONSIVE_ATTRS )
			);
		}

		$allowed = Responsive::get_breakpoint_keys();
		$out     = [];

		foreach ( $declared as $breakpoint => $attribute ) {
			if ( ! in_array( (string) $breakpoint, $allowed, true ) ) {
				throw new InvalidArgumentException(
					sprintf(
						'Binding "%s" declares unknown responsive breakpoint "%s"; expected one of: %s.',
						$property,
						(string) $breakpoint,
						implode( ', ', $allowed )
					)
				);
			}

			if ( ! is_string( $attribute ) || $attribute === '' ) {
				throw new InvalidArgumentException(
					sprintf( 'Binding "%s" responsive attribute for "%s" must be a non-empty string.', $property, (string) $breakpoint )
				);
			}

			$out[ (string) $breakpoint ] = $attribute;
		}

		return $out;
	}

	/**
	 * Extract and validate the editor-only control attribute from a binding declaration. Kept separate from
	 * inline_targets() on purpose: control_attr is NOT a projection target, so it must never reach
	 * $projections (and hence effective_projections()).
	 *
	 * @since TBD
	 *
	 * @param string               $property The block property, for error messages.
	 * @param array<string, mixed> $spec     The binding declaration.
	 *
	 * @throws InvalidArgumentException When the control attribute is present but not a non-empty string.
	 *
	 * @return string|null The control attribute, or null when the declaration omits it.
	 */
	private static function control_attr_of( string $property, array $spec ): ?string {
		if ( ! array_key_exists( self::CONTROL_ATTR, $spec ) ) {
			return null;
		}

		$value = $spec[ self::CONTROL_ATTR ];

		if ( ! is_string( $value ) || $value === '' ) {
			throw new InvalidArgumentException(
				sprintf( 'Binding "%s" target "%s" must be a non-empty string.', $property, self::CONTROL_ATTR )
			);
		}

		return $value;
	}

	/**
	 * Read and validate the optional composite-control axis, which must be a non-empty string when present.
	 *
	 * @since TBD
	 *
	 * @param string               $property The block property (for the error message).
	 * @param array<string, mixed> $spec     The binding declaration.
	 *
	 * @throws InvalidArgumentException When the declared axis is not a non-empty string.
	 *
	 * @return string|null The axis, or null when the binding declares none.
	 */
	private static function axis_of( string $property, array $spec ): ?string {
		if ( ! array_key_exists( self::AXIS, $spec ) ) {
			return null;
		}

		$value = $spec[ self::AXIS ];

		if ( ! is_string( $value ) || $value === '' ) {
			throw new InvalidArgumentException(
				sprintf( 'Binding "%s" target "%s" must be a non-empty string.', $property, self::AXIS )
			);
		}

		return $value;
	}
}
