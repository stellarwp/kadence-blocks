<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

use KadenceWP\KadenceBlocks\Optimizer\Optimizer_Provider;

trait Viewport_Trait {

	/**
	 * Check if a mobile device is viewing this URL.
	 *
	 * @see Optimizer_Provider::register_mobile_override()
	 *
	 * @return bool
	 */
	private function is_mobile(): bool {
		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_is_mobile_wp_is_mobile
		return function_exists( 'jetpack_is_mobile' ) ? jetpack_is_mobile() : wp_is_mobile();
	}
}
