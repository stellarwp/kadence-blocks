<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * Immutable description of a single design token — structure only, no value.
 *
 * Built from a declaration array via from_array(); the css-var is derived from the id by default
 * (Css_Var) and only overridden when a token must match a pre-existing variable name.
 *
 * @since TBD
 */
final class Token_Definition {

	/**
	 * DTCG dot-path, e.g. "semantic.color.button-bg".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $id;

	/**
	 * DTCG $type: color | dimension | shadow | typography | …
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $type;

	/**
	 * Human-readable label for the custom UI.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $label;

	/**
	 * UI grouping bucket, e.g. "Brand".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $group;

	/**
	 * The canonical (or overridden) CSS custom-property name.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $css_var;

	/**
	 * Projection targets. Keys are projection ids; values are projection-specific config.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed> e.g. [ 'wp_preset' => 'color', 'kadence_slot' => 'palette1', 'site_editor' => true ]
	 */
	public array $projections;

	/**
	 * @param string               $id          DTCG dot-path id.
	 * @param string               $type        DTCG $type.
	 * @param string               $label       Human-readable label.
	 * @param string               $group       UI grouping bucket.
	 * @param string               $css_var     Canonical (or overridden) CSS custom-property name.
	 * @param array<string, mixed> $projections Projection targets keyed by projection id.
	 */
	private function __construct(
		string $id,
		string $type,
		string $label,
		string $group,
		string $css_var,
		array $projections
	) {
		$this->id          = $id;
		$this->type        = $type;
		$this->label       = $label;
		$this->group       = $group;
		$this->css_var     = $css_var;
		$this->projections = $projections;
	}

	/**
	 * Build a token definition from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $definition The token declaration.
	 *
	 * @throws InvalidArgumentException When required keys are missing or an optional key is the wrong type.
	 *
	 * @return self
	 */
	public static function from_array( array $definition ): self {
		$id    = self::require_string( $definition['id'] ?? null, 'id' );
		$type  = self::require_string( $definition['type'] ?? null, 'type' );
		$label = self::require_string( $definition['label'] ?? null, 'label' );

		// Guard the id charset at declaration time: it feeds Css_Var::from_id() which only swaps "." for
		// "--", so an id with a space or slash would silently yield an invalid CSS custom-property name.
		// A DTCG dot-path is lowercase alphanumeric segments separated by "." or "-".
		if ( ! preg_match( '/^[a-z0-9]+([.-][a-z0-9]+)*$/', $id ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token id "%s" must be a dot-path of lowercase alphanumeric segments separated by "." or "-".', $id )
			);
		}

		$group   = self::optional_string( $definition['group'] ?? null, 'group' );
		$css_var = self::optional_string( $definition['css_var'] ?? null, 'css_var' );

		// Type-checked here so a bad declaration raises the documented InvalidArgumentException rather than
		// a raw TypeError from the constructor's typed param — this is a public helper.
		$projections = $definition['projections'] ?? [];
		if ( ! is_array( $projections ) ) {
			throw new InvalidArgumentException( 'Design token declaration "projections" must be an array.' );
		}

		return new self(
			$id,
			$type,
			$label,
			$group ?? '',
			// css_var override is rare; default is derived and impossible to drift from the id.
			$css_var ?? Css_Var::from_id( $id ),
			$projections
		);
	}

	/**
	 * Require a declaration value to be a present, non-empty string.
	 *
	 * Avoid empty() so a legitimate "0" string is not mistaken for a missing value.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The raw declaration value.
	 * @param string $key   The declaration key, used for the error message.
	 *
	 * @throws InvalidArgumentException When the value is missing or not a non-empty string.
	 *
	 * @return string
	 */
	private static function require_string( $value, string $key ): string {
		if ( ! is_string( $value ) || $value === '' ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token declaration is missing required string "%s".', $key )
			);
		}

		return $value;
	}

	/**
	 * Type-check an optional declaration value: a string when present, otherwise null.
	 *
	 * Validated here so a bad declaration raises the documented InvalidArgumentException rather than a
	 * raw TypeError from the constructor's typed params — this is a public helper.
	 *
	 * @since TBD
	 *
	 * @param mixed  $value The raw declaration value.
	 * @param string $key   The declaration key, used for the error message.
	 *
	 * @throws InvalidArgumentException When the value is present but not a string.
	 *
	 * @return string|null
	 */
	private static function optional_string( $value, string $key ): ?string {
		if ( $value !== null && ! is_string( $value ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token declaration "%s" must be a string.', $key )
			);
		}

		return $value;
	}

	/**
	 * Whether the token declares the given projection target.
	 *
	 * @since TBD
	 *
	 * @param string $projection A projection id, e.g. "wp_preset".
	 *
	 * @return bool
	 */
	public function has_projection( string $projection ): bool {
		return array_key_exists( $projection, $this->projections );
	}
}
