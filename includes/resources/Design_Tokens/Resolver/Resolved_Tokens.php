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
	 * @param array<string,string> $by_id
	 * @param array<string,string> $by_var
	 */
	public function __construct( array $by_id, array $by_var ) {
		$this->by_id  = $by_id;
		$this->by_var = $by_var;
	}

	/** @return array<string,string> */
	public function by_id(): array {
		return $this->by_id;
	}

	/** @return array<string,string> */
	public function by_var(): array {
		return $this->by_var;
	}

	public function value( string $id ): ?string {
		return $this->by_id[ $id ] ?? null;
	}
}
