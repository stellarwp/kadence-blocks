<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash\Rule;

/**
 * Whether to skip the hash check.
 */
interface Skip_Rule {

	/**
	 * Whether the result of this rule will skip
	 * hash checking.
	 *
	 * @return bool
	 */
	public function should_skip(): bool;
}
