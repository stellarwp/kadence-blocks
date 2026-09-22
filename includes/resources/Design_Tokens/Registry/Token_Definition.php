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
	 * Stable machine key for the group, e.g. "border-radius". Empty for a group nothing can mint
	 * a user primitive into. Never a translated string — see Token_Registry::group_label_for().
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $group_key;

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
	 * @var array<string, mixed> e.g. [ 'kadence_slot' => 'palette1' ]
	 */
	public array $projections;

	/**
	 * Whether this token was created by a user (not shipped with the plugin).
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private bool $user_created;

	/**
	 * @param string               $id           DTCG dot-path id.
	 * @param string               $type         DTCG $type.
	 * @param string               $label        Human-readable label.
	 * @param string               $group        UI grouping bucket.
	 * @param string               $css_var      Canonical (or overridden) CSS custom-property name.
	 * @param array<string, mixed> $projections  Projection targets keyed by projection id.
	 * @param bool                 $user_created Whether the token was created by a user.
	 * @param string               $group_key    Stable machine key for the group.
	 */
	private function __construct(
		string $id,
		string $type,
		string $label,
		string $group,
		string $css_var,
		array $projections,
		bool $user_created = false,
		string $group_key = ''
	) {
		$this->id           = $id;
		$this->type         = $type;
		$this->label        = $label;
		$this->group        = $group;
		$this->css_var      = $css_var;
		$this->projections  = $projections;
		$this->user_created = $user_created;
		$this->group_key    = $group_key;
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
		// "--", so an id with a space, slash, or uppercase letter would silently yield an invalid CSS
		// custom-property name. Segments must be lowercase kebab-case (e.g. primitive.dimension.border-width.sm).
		if ( ! preg_match( '/^[a-z0-9]+([.-][a-z0-9]+)*$/', $id ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token id "%s" must be a dot-path of lowercase alphanumeric segments separated by "." or "-".', $id )
			);
		}

		$group   = self::optional_string( $definition['group'] ?? null, 'group' );
		$css_var = self::optional_string( $definition['css_var'] ?? null, 'css_var' );

		$group_key = self::optional_string( $definition['group_key'] ?? null, 'group_key' );
		if ( $group_key !== null && $group_key !== '' && ! preg_match( '/^[a-z0-9]+(-[a-z0-9]+)*$/', $group_key ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token declaration "group_key" "%s" must be a lowercase kebab-case key.', $group_key )
			);
		}

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
			$projections,
			false,
			$group_key ?? ''
		);
	}

	/**
	 * The only factory that produces a user-created definition.
	 *
	 * @since TBD
	 *
	 * @param string $id        Canonical dot-path id.
	 * @param string $type      DTCG $type.
	 * @param string $label     Display label; derived from the terminal slug when empty.
	 * @param string $group     Already-resolved, current-locale group label. Empty for ungrouped.
	 * @param string $group_key Stable machine key the group label was resolved from. Empty for ungrouped.
	 *
	 * @throws \InvalidArgumentException When the id fails the charset check.
	 *
	 * @return self
	 */
	public static function from_user_primitive( string $id, string $type, string $label = '', string $group = '', string $group_key = '' ): self {
		if ( ! preg_match( '/^[a-z0-9]+([.-][a-z0-9]+)*$/', $id ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token id "%s" must be a dot-path of lowercase alphanumeric segments.', $id )
			);
		}

		if ( $label === '' ) {
			$segments = explode( '.', $id );
			$label    = ucwords( str_replace( '-', ' ', (string) end( $segments ) ) );
		}

		return new self( $id, $type, $label, $group, Css_Var::from_id( $id ), [], true, $group_key );
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
	 * Whether this token was created by a user rather than shipped with the plugin.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_user_created(): bool {
		return $this->user_created;
	}

	/**
	 * Whether the token declares the given projection target.
	 *
	 * @since TBD
	 *
	 * @param string $projection A projection id, e.g. "kadence_slot".
	 *
	 * @return bool
	 */
	public function has_projection( string $projection ): bool {
		return array_key_exists( $projection, $this->projections );
	}
}
