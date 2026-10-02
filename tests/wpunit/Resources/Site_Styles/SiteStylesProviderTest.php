<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Site_Styles_Provider;
use Tests\Support\Classes\TestCase;

/**
 * Covers the registration of the site-level styles module.
 */
final class SiteStylesProviderTest extends TestCase {

	public function testTheProviderIsRegisteredWhenThePluginBoots(): void {
		// `has()` is true for any existing class; a registered provider is bound as a singleton.
		$this->assertTrue( $this->container->isBound( Site_Styles_Provider::class ) );
	}
}
