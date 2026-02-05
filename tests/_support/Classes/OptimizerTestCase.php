<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use KadenceWP\KadenceBlocks\Optimizer\Optimizer_Provider;

/**
 * Base test class for Optimizer tests where the Optimizer needs to be
 * enabled.
 */
class OptimizerTestCase extends TestCase {

	protected function setUp(): void {
		parent::setUp();

		// Force the optimizer to be enabled.
		add_filter( 'kadence_blocks_optimizer_enabled', '__return_true' );

		// Load the Optimizer Provider again to run the filters again.
		$this->container->register( Optimizer_Provider::class );
	}

	protected function tearDown(): void {
		remove_filter( 'kadence_blocks_optimizer_enabled', '__return_true' );

		parent::tearDown();
	}
}
