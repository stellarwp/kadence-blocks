<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules;

use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Ignored_Query_Var_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Logged_In_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Not_Found_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Optimizer_Request_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Post_Excluded_Rule;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		/**
		 * Filter the list of query variables, that if present will bypass
		 * the hash check.
		 *
		 * @param string[] $query_vars The query variable names.
		 */
		$query_vars = apply_filters(
			'kadence_blocks_optimizer_rule_skip_query_vars',
			[
				'preview',
			]
		);

		$this->container->when( Ignored_Query_Var_Rule::class )
						->needs( '$query_vars' )
						->give(
							static fn(): array => $query_vars
						);

		$this->container->when( Rule_Collection::class )
						->needs( '$rules' )
						->give(
							fn(): array => [
								$this->container->get( Optimizer_Request_Rule::class ),
								$this->container->get( Ignored_Query_Var_Rule::class ),
								$this->container->get( Not_Found_Rule::class ),
								$this->container->get( Logged_In_Rule::class ),
								$this->container->get( Post_Excluded_Rule::class ),
							]
						);
	}
}
