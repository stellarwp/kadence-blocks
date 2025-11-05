<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Not_Found_Rule;
use Tests\Support\Classes\TestCase;
use WP_Query;

final class NotFoundRuleTest extends TestCase {

	private Not_Found_Rule $rule;

	protected function setUp(): void {
		parent::setUp();

		$this->rule = $this->container->get( Not_Found_Rule::class );
	}

	protected function tearDown(): void {
		global $wp_query;

		// Reset wp_query to prevent test pollution.
		$wp_query = new WP_Query();

		parent::tearDown();
	}

	public function testItSkipsWhen404(): void {
		global $wp_query;

		$wp_query->set_404();

		$this->assertTrue( $this->rule->should_skip() );
	}

	public function testItDoesNotSkipWhenNot404(): void {
		global $wp_query;

		// Ensure we're not in a 404 state (default).
		$wp_query->is_404 = false;

		$this->assertFalse( $this->rule->should_skip() );
	}
}
