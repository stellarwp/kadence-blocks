<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

/**
 * Immutable result of resolution: two flat, alias-free maps projectors consume directly.
 *
 * @since TBD
 */
final class Resolved_Tokens {

	/** @var array<string,string> token-id => CSS value */
	private array $by_id;

	/** @var array<string,string> css-var => CSS value */
	private array $by_var;

	/**
	 * The css-var projection form, css-var => CSS value, with alias indirection preserved as var()
	 * references rather than flattened: a reference-valued token reads var(--<target>), and a composite
	 * keeps var() for any aliased field. Equal to the literal map for raw-valued tokens. The css-var
	 * projection consumes this; the literal maps stay the source for host-publishing surfaces.
	 *
	 * @since TBD
	 *
	 * @var array<string,string>
	 */
	private array $by_var_projected;

	/**
	 * Immediate alias target per reference-valued token, token-id => target token-id. Only tokens whose
	 * effective $value is a whole-string alias appear here; raw-valued and composite tokens are absent.
	 *
	 * @since TBD
	 *
	 * @var array<string,string>
	 */
	private array $by_id_target;

	/**
	 * Resolved composite sub-field map per composite token, token-id => (field => resolved literal). Each
	 * field holds its alias-flattened literal (a fontFamily as its list, other fields as scalars), the raw
	 * shape a consumer that needs the individual properties (rather than the rendered `font` shorthand in
	 * by_id) reads. Only composite tokens (shadow, typography) appear here.
	 *
	 * @since TBD
	 *
	 * @var array<string,array<string,mixed>>
	 */
	private array $by_id_composite;

	/**
	 * Build the resolved maps. The projection defaults to the literal var map when omitted, so a
	 * caller with no aliases to preserve constructs with just the two literal maps.
	 *
	 * @since TBD
	 *
	 * @param array<string,string>              $by_id            token-id => literal CSS value.
	 * @param array<string,string>              $by_var           css-var => literal CSS value.
	 * @param array<string,string>              $by_var_projected css-var => var()-preserving CSS value;
	 *                                                            defaults to the literal map when omitted.
	 * @param array<string,string>              $by_id_target     token-id => immediate target token-id.
	 * @param array<string,array<string,mixed>> $by_id_composite  token-id => resolved composite sub-field map.
	 */
	public function __construct( array $by_id, array $by_var, array $by_var_projected = [], array $by_id_target = [], array $by_id_composite = [] ) {
		$this->by_id            = $by_id;
		$this->by_var           = $by_var;
		$this->by_var_projected = $by_var_projected === [] ? $by_var : $by_var_projected;
		$this->by_id_target     = $by_id_target;
		$this->by_id_composite  = $by_id_composite;
	}

	/**
	 * The flat literal map keyed by token id, the source for host-publishing surfaces.
	 *
	 * @since TBD
	 *
	 * @return array<string,string> token-id => literal CSS value
	 */
	public function by_id(): array {
		return $this->by_id;
	}

	/**
	 * The flat literal map keyed by css-var.
	 *
	 * @since TBD
	 *
	 * @return array<string,string> css-var => literal CSS value
	 */
	public function by_var(): array {
		return $this->by_var;
	}

	/**
	 * The css-var projection form, with alias indirection preserved as var() references.
	 *
	 * @since TBD
	 *
	 * @return array<string,string> css-var => var()-preserving CSS value
	 */
	public function projected_vars(): array {
		return $this->by_var_projected;
	}

	/**
	 * The immediate alias target per reference-valued token.
	 *
	 * @since TBD
	 *
	 * @return array<string,string> token-id => target token-id
	 */
	public function target_ids(): array {
		return $this->by_id_target;
	}

	/**
	 * The literal CSS value for a token, or null when the token is unknown.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return string|null
	 */
	public function value( string $id ): ?string {
		return $this->by_id[ $id ] ?? null;
	}

	/**
	 * The immediate alias target for a token, or null when the token is not reference-valued.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return string|null
	 */
	public function target( string $id ): ?string {
		return $this->by_id_target[ $id ] ?? null;
	}

	/**
	 * The resolved composite sub-field map for a composite token (field => resolved literal), or null when
	 * the token is unknown or not a composite. A fontFamily field holds its list; other fields hold their
	 * resolved scalar. Consumers that need the individual properties read this rather than the rendered
	 * `font` shorthand in {@see value()}.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return array<string,mixed>|null
	 */
	public function composite( string $id ): ?array {
		return $this->by_id_composite[ $id ] ?? null;
	}
}
