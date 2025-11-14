<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules;

/**
 * Holds the collection of rules that determine whether to skip operations.
 */
final class Rule_Collection {

	/**
	 * @var Skip_Rule[]
	 */
	private array $rules;

	/**
	 * @param Skip_Rule[] $rules
	 */
	public function __construct( array $rules ) {
		$this->rules = $rules;
	}

	/**
	 * Get all the rules in the collection.
	 *
	 * @return Skip_Rule[]
	 */
	public function all(): array {
		return $this->rules;
	}
}
