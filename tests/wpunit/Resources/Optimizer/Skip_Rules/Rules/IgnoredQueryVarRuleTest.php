<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Optimizer_Provider;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Ignored_Query_Var_Rule;
use Tests\Support\Classes\OptimizerTestCase;

final class IgnoredQueryVarRuleTest extends OptimizerTestCase {

	private const MY_QUERY_VAR = 'my_query_var';

	private Ignored_Query_Var_Rule $rule;

	protected function setUp(): void {
		parent::setUp();

		$this->rule = $this->container->get( Ignored_Query_Var_Rule::class );
	}

	protected function tearDown(): void {
		// Clean up global request vars.
		unset( $_GET['preview'], $_GET[ self::MY_QUERY_VAR ] );

		parent::tearDown();
	}

	public function testItDoesntSkipWhenNotPreview(): void {
		$this->assertFalse( $this->rule->should_skip() );
	}

	public function testItSkipsWhenPreview(): void {
		$_GET['preview'] = '1';

		$this->assertTrue( $this->rule->should_skip() );
	}

	public function testItCanFilterQueryVars(): void {
		$_GET[ self::MY_QUERY_VAR ] = 'true';

		add_filter(
			'kadence_blocks_optimizer_rule_skip_query_vars',
			static function ( array $query_vars ): array {
				$query_vars[] = self::MY_QUERY_VAR;

				return $query_vars;
			},
		);

		// Register the provider again to run the apply_filters.
		$this->container->get( Optimizer_Provider::class )->register();

		// Grab the rule instance again.
		$rule = $this->container->get( Ignored_Query_Var_Rule::class );

		$this->assertTrue( $rule->should_skip() );
	}
}
