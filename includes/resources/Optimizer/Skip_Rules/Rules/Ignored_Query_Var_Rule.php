<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Skip_Rule;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;

final class Ignored_Query_Var_Rule implements Skip_Rule {

	/**
	 * @var string[]
	 */
	private array $query_vars;

	/**
	 * @filter kadence_blocks_optimizer_rule_skip_query_vars
	 *
	 * @param string[] $query_vars The query variable names.
	 */
	public function __construct( array $query_vars = [] ) {
		$this->query_vars = $query_vars;
	}

	/**
	 * @inheritDoc
	 */
	public function should_skip(): bool {
		foreach ( $this->query_vars as $query_var ) {
			if ( SG::get_get_var( $query_var ) !== null ) {
				return true;
			}
		}

		return false;
	}
}
