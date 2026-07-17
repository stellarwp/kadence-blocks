<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * One variant binding: how a single block property (e.g. "button-bg") reaches output when a variant is
 * active. This is *structure* — the projection target, not a value. The value lives in the DTCG
 * document and is flattened by the Variant_Resolver.
 *
 * A binding declares a **token reference**, **inline targets**, or **both** (they compose):
 *
 *   - **Token reference** — `['token' => 'semantic.color.button-bg']`. The property reuses that
 *     registered token's projections, so a variant retargets the exact variable the base property
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
 * A binding may also declare `control_attr`, editor-only metadata kept out of the projection set — see
 * {@see Binding::control_attr()}.
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
	 * variant sets `--<css_var>` on its scope so the value can vary per variant.
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
	 * Editor-only target: the block attribute the editor control for this property writes, so the
	 * indicator layer can tell whether a control is bound to the active variant or has been overridden.
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
	 * The inline string targets and their validation: each, when present, must be a non-empty string.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const STRING_TARGETS = [ self::KADENCE_SLOT, self::BLOCK_ATTR, self::CSS_PROP, self::CSS_SELECTOR, self::CSS_VAR ];

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
	 * @since TBD
	 *
	 * @param string               $property     The block property this binding drives.
	 * @param string|null          $token        Referenced token id, or null when inline.
	 * @param array<string, mixed> $projections  Inline projection targets, empty when a token reference.
	 * @param string|null          $control_attr The editor control attribute, or null when none declared.
	 */
	private function __construct( string $property, ?string $token, array $projections, ?string $control_attr ) {
		$this->property     = $property;
		$this->token        = $token;
		$this->projections  = $projections;
		$this->control_attr = $control_attr;
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

		return new self( $property, $token, $inline, self::control_attr_of( $property, $spec ) );
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
	 * projector to map a resolved variant value onto a block's default attribute. Always an inline target
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
	 * none. Editor-only: read by the variant catalog so the indicator layer can key an override signal to a
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
	 * The KB-owned CSS custom property this binding drives (named without the leading `--`, e.g.
	 * "kb-btn-radius"), or null when it declares none. Read by the variant projector to set that variable on a
	 * selected variant's scope so the value can vary per variant. Inline only.
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
}
