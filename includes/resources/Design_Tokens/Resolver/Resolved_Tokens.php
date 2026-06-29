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
	 * @param array<string,string> $by_id            token-id => literal CSS value.
	 * @param array<string,string> $by_var           css-var => literal CSS value.
	 * @param array<string,string> $by_var_projected css-var => var()-preserving CSS value; defaults to
	 *                                                the literal map when omitted (no aliases to preserve).
	 * @param array<string,string> $by_id_target     token-id => immediate target token-id.
	 */
	public function __construct( array $by_id, array $by_var, array $by_var_projected = [], array $by_id_target = [] ) {
		$this->by_id            = $by_id;
		$this->by_var           = $by_var;
		$this->by_var_projected = $by_var_projected === [] ? $by_var : $by_var_projected;
		$this->by_id_target     = $by_id_target;
	}

	/** @return array<string,string> */
	public function by_id(): array {
		return $this->by_id;
	}

	/** @return array<string,string> */
	public function by_var(): array {
		return $this->by_var;
	}

	/** @return array<string,string> css-var => var()-preserving CSS value */
	public function projected_vars(): array {
		return $this->by_var_projected;
	}

	/** @return array<string,string> token-id => target token-id */
	public function target_ids(): array {
		return $this->by_id_target;
	}

	public function value( string $id ): ?string {
		return $this->by_id[ $id ] ?? null;
	}

	public function target( string $id ): ?string {
		return $this->by_id_target[ $id ] ?? null;
	}
}
