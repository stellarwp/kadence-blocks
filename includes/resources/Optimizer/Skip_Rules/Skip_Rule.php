<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules;

/**
 * Defines a rule for determining whether to skip a specific operation.
 */
interface Skip_Rule {

	/**
	 * Whether the result of this rule will skip
	 * the associated operation.
	 *
	 * @return bool
	 */
	public function should_skip(): bool;
}
