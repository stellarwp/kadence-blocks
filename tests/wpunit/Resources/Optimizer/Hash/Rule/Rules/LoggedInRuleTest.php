<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash\Rule\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Logged_In_Rule;
use Tests\Support\Classes\TestCase;

final class LoggedInRuleTest extends TestCase {

	private Logged_In_Rule $rule;

	protected function setUp(): void {
		parent::setUp();

		$this->rule = $this->container->get( Logged_In_Rule::class );
	}

	protected function tearDown(): void {
		// Reset logged in user state.
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function testItDoesntSkipWhenNotLoggedIn(): void {
		$this->assertFalse( $this->rule->should_skip() );
	}

	public function testItSkipsWhenLoggedIn(): void {
		wp_set_current_user( 1 );

		$this->assertTrue( $this->rule->should_skip() );
	}
}
