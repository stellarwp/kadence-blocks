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
 *   - **Inline target** — `['kadence_slot' => 'palette3']` (and/or `wp_preset`, `block_attr`,
 *     `css_var`, `css_prop`, `css_selector`). For a property that is not (yet) a registered token, or
 *     to add a target the token does not carry.
 *   - **Both** — e.g. `['token' => 'semantic.color.button-bg', 'block_attr' => 'background']`. The
 *     inline targets supplement (and override) the referenced token's projections, which is how a
 *     token-backed property still declares the `block_attr` a block preset needs.
 *
 * {@see Token_Registry::effective_projections()} merges the two. The projection vocabulary is the same
 * one tokens use, with three additions — `block_attr`, `css_prop`, and `css_selector`, which tokens
 * never carry.
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
	 * Inline target: a WordPress preset category → `--wp--preset--<category>--<slug>`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const WP_PRESET = 'wp_preset';

	/**
	 * Inline target: a block attribute, so a block preset can seed an attribute default.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_ATTR = 'block_attr';

	/**
	 * Inline target (boolean flag): the property surfaces only as its `--kb-token--*` var, with no
	 * preset/slot bucket (e.g. border-radius, which WordPress has no preset category for).
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
	 * The inline string targets and their validation: each, when present, must be a non-empty string.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const STRING_TARGETS = [ self::KADENCE_SLOT, self::WP_PRESET, self::BLOCK_ATTR, self::CSS_PROP, self::CSS_SELECTOR ];

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
	 * @since TBD
	 *
	 * @param string               $property    The block property this binding drives.
	 * @param string|null          $token       Referenced token id, or null when inline.
	 * @param array<string, mixed> $projections Inline projection targets, empty when a token reference.
	 */
	private function __construct( string $property, ?string $token, array $projections ) {
		$this->property    = $property;
		$this->token       = $token;
		$this->projections = $projections;
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

		return new self( $property, $token, $inline );
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

		if ( array_key_exists( self::CSS_VAR, $spec ) ) {
			if ( $spec[ self::CSS_VAR ] !== true ) {
				throw new InvalidArgumentException(
					sprintf( 'Binding "%s" target "%s" must be true when present.', $property, self::CSS_VAR )
				);
			}

			$inline[ self::CSS_VAR ] = true;
		}

		return $inline;
	}
}
