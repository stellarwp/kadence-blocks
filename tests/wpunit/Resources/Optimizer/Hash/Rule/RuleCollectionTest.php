<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash\Rule;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Ignored_Query_Var_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Logged_In_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Optimizer_Request_Rule;
use Tests\Support\Classes\TestCase;

final class RuleCollectionTest extends TestCase {

	private Rule_Collection $collection;

	protected function setUp(): void {
		parent::setUp();

		$this->collection = $this->container->get( Rule_Collection::class );
	}

	public function testItHasAllRules(): void {
		$rules = $this->collection->all();

		foreach ( $rules as $rule ) {
			$this->assertThat(
				$rule,
				$this->logicalOr(
					$this->isInstanceOf( Ignored_Query_Var_Rule::class ),
					$this->isInstanceOf( Optimizer_Request_Rule::class ),
					$this->isInstanceOf( Logged_In_Rule::class )
				)
			);
		}
	}
}
