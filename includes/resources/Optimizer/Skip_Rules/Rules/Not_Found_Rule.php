<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Skip_Rule;

final class Not_Found_Rule implements Skip_Rule {

	/**
	 * @inheritDoc
	 */
	public function should_skip(): bool {
		return is_404();
	}
}
