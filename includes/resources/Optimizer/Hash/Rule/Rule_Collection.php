<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash\Rule;

/**
 * Holds the collection of rules that will skip hash checks.
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
	 * Get all the skip rules.
	 *
	 * @return Skip_Rule[]
	 */
	public function all(): array {
		return $this->rules;
	}
}
