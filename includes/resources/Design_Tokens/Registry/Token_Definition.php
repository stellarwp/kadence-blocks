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

	/** @var string DTCG dot-path, e.g. "semantic.color.button-bg". */
	public string $id;

	/** @var string DTCG $type: color | dimension | shadow | typography | … */
	public string $type;

	/** @var string Human-readable label for the custom UI. */
	public string $label;

	/** @var string UI grouping bucket, e.g. "Brand". */
	public string $group;

	/** @var string The canonical (or overridden) CSS custom-property name. */
	public string $css_var;

	/**
	 * Projection targets. Keys are projection ids; values are projection-specific config.
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
		foreach ( [ 'id', 'type', 'label' ] as $required ) {
			// Require a present, non-empty string. Avoid empty() so a legitimate "0" string is not
			// mistaken for a missing value.
			if ( ! isset( $definition[ $required ] ) || ! is_string( $definition[ $required ] ) || $definition[ $required ] === '' ) {
				throw new InvalidArgumentException(
					sprintf( 'Design token declaration is missing required string "%s".', $required )
				);
			}
		}

		$id = $definition['id'];

		// Guard the id charset at declaration time: it feeds Css_Var::from_id() which only swaps "." for
		// "--", so an id with a space or slash would silently yield an invalid CSS custom-property name.
		// A DTCG dot-path is lowercase alphanumeric segments separated by "." or "-".
		if ( ! preg_match( '/^[a-z0-9]+([.-][a-z0-9]+)*$/', $id ) ) {
			throw new InvalidArgumentException(
				sprintf( 'Design token id "%s" must be a dot-path of lowercase alphanumeric segments separated by "." or "-".', $id )
			);
		}

		// Optional keys are type-checked so a bad declaration raises the documented InvalidArgumentException
		// rather than a raw TypeError from the constructor's typed params — this is a public helper.
		if ( isset( $definition['group'] ) && ! is_string( $definition['group'] ) ) {
			throw new InvalidArgumentException( 'Design token declaration "group" must be a string.' );
		}

		if ( isset( $definition['css_var'] ) && ! is_string( $definition['css_var'] ) ) {
			throw new InvalidArgumentException( 'Design token declaration "css_var" must be a string.' );
		}

		if ( isset( $definition['projections'] ) && ! is_array( $definition['projections'] ) ) {
			throw new InvalidArgumentException( 'Design token declaration "projections" must be an array.' );
		}

		return new self(
			$id,
			$definition['type'],
			$definition['label'],
			$definition['group'] ?? '',
			// css_var override is rare; default is derived and impossible to drift from the id.
			$definition['css_var'] ?? Css_Var::from_id( $id ),
			$definition['projections'] ?? []
		);
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
