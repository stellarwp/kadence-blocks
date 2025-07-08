<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash\Rule\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Optimizer_Request_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Request;
use Tests\Support\Classes\TestCase;

final class OptimizerRequestRuleTest extends TestCase {

	private Optimizer_Request_Rule $rule;

	protected function setUp(): void {
		parent::setUp();

		$this->rule = $this->container->get( Optimizer_Request_Rule::class );
	}

	protected function tearDown(): void {
		// Clean up global request vars.
		unset( $_GET[ Request::QUERY_NOCACHE ], $_GET[ Request::QUERY_TOKEN ] );

		parent::tearDown();
	}

	public function testItDoesntSkipWhenNotOptimizerRequest(): void {
		$this->assertFalse( $this->rule->should_skip() );
	}

	public function testItSkipsWhenOptimizerRequest(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '17ahsy2723';
		$_GET[ Request::QUERY_TOKEN ]   = 'ga51hwya6s';

		$this->assertTrue( $this->rule->should_skip() );
	}
}
