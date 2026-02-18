<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Detection\MobileDetect;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals;

/**
 * Resolve if we consider this a mobile device or not.
 *
 * This matches Solid Performance's detection.
 */
final class Device_Resolver {

	private MobileDetect $detect;

	public function __construct( MobileDetect $detect ) {
		$this->detect = $detect;
	}

	/**
	 * Allow force overriding mobile detection with a query string variable.
	 *
	 * @return bool
	 */
	public function is_mobile(): bool {
		if ( SuperGlobals::get_get_var( 'kadence_is_mobile' ) ) {
			return true;
		}

		return $this->detect->isMobile() && ! $this->detect->isTablet();
	}
}
