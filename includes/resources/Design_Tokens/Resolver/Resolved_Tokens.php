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
	 * Per-breakpoint css-var overrides, css-var => [ breakpoint => var()-preserving CSS value ], for the
	 * per-media-query redeclaration the css-var projection emits. Only responsive (stepped) tokens with an
	 * override at a breakpoint appear; a flat token is absent, so a flat token projects exactly as before.
	 *
	 * @since TBD
	 *
	 * @var array<string,array<string,string>>
	 */
	private array $by_var_responsive;

	/**
	 * Per-breakpoint literal overrides, token-id => [ breakpoint => literal CSS value ], for host surfaces
	 * and the write-back adapters that fan a breakpoint value into a block's indexed / suffixed attributes.
	 * Mirrors by_var_responsive keyed by id, with literals rather than var() references.
	 *
	 * @since TBD
	 *
	 * @var array<string,array<string,string>>
	 */
	private array $by_id_responsive;

	/**
	 * Build the resolved maps. The projection defaults to the literal var map when omitted, so a
	 * caller with no aliases to preserve constructs with just the two literal maps.
	 *
	 * @since TBD
	 *
	 * @param array<string,string>               $by_id             token-id => literal CSS value.
	 * @param array<string,string>               $by_var            css-var => literal CSS value.
	 * @param array<string,string>               $by_var_projected  css-var => var()-preserving CSS value;
	 *                                                               defaults to the literal map when omitted.
	 * @param array<string,string>               $by_id_target      token-id => immediate target token-id.
	 * @param array<string,array<string,string>> $by_var_responsive css-var => [ breakpoint => projected value ].
	 * @param array<string,array<string,string>> $by_id_responsive  token-id => [ breakpoint => literal value ].
	 */
	public function __construct(
		array $by_id,
		array $by_var,
		array $by_var_projected = [],
		array $by_id_target = [],
		array $by_var_responsive = [],
		array $by_id_responsive = []
	) {
		$this->by_id             = $by_id;
		$this->by_var            = $by_var;
		$this->by_var_projected  = $by_var_projected === [] ? $by_var : $by_var_projected;
		$this->by_id_target      = $by_id_target;
		$this->by_var_responsive = $by_var_responsive;
		$this->by_id_responsive  = $by_id_responsive;
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
	 * The per-breakpoint css-var projection overrides, css-var => [ breakpoint => var()-preserving value ].
	 * The css-var projection redeclares each of these inside the matching media query. Empty for a document
	 * with no responsive tokens, so flat projection is byte-for-byte unchanged.
	 *
	 * @since TBD
	 *
	 * @return array<string,array<string,string>>
	 */
	public function projected_responsive(): array {
		return $this->by_var_responsive;
	}

	/**
	 * The literal CSS value for a token at a breakpoint, or null when the token has no override there. A
	 * token with no responsive shape returns null for every breakpoint (its base value is read via value()).
	 *
	 * @since TBD
	 *
	 * @param string $id         The token id.
	 * @param string $breakpoint The breakpoint key (e.g. "tablet", "mobile").
	 *
	 * @return string|null
	 */
	public function value_at( string $id, string $breakpoint ): ?string {
		return $this->by_id_responsive[ $id ][ $breakpoint ] ?? null;
	}
}
