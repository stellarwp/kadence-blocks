<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Skip_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Request;

final class Optimizer_Request_Rule implements Skip_Rule {

	private Request $request;

	public function __construct( Request $request ) {
		$this->request = $request;
	}

	/**
	 * @inheritDoc
	 */
	public function should_skip(): bool {
		return $this->request->is_optimizer_request();
	}
}
