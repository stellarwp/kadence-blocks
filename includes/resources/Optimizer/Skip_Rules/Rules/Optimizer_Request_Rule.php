<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules;

use KadenceWP\KadenceBlocks\Optimizer\Request\Request;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Skip_Rule;

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
