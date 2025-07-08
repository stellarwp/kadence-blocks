<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Skip_Rule;

final class Logged_In_Rule implements Skip_Rule {

	/**
	 * @inheritDoc
	 */
	public function should_skip(): bool {
		return is_user_logged_in();
	}
}
