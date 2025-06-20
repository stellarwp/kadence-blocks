<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

final class State {

	/**
	 * Whether the Optimizer is enabled.
	 *
	 * @TODO hook this up to a setting.
	 *
	 * @return bool
	 */
	public function enabled(): bool {
		return true;
	}
}
