<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

/**
 * A stand-in for the bridge to a block, for tests of builders that never call a block helper: every call answers null.
 */
final class Null_Block_Bridge {

	/**
	 * Answer null to any helper call.
	 *
	 * @param string $member  The helper the builder asked for.
	 * @param mixed  ...$args The arguments of the call.
	 *
	 * @return null
	 */
	public function __invoke( $member = '', ...$args ) {
		return null;
	}
}
