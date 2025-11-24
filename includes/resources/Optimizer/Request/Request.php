<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Request;

use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;

final class Request {

	public const QUERY_NOCACHE           = 'nocache';
	public const QUERY_TOKEN             = 'perf_token';
	public const QUERY_OPTIMIZER_PREVIEW = 'kb_optimizer_preview';
	public const MIN_LENGTH              = 5;

	/**
	 * Check if this request is an optimizer request.
	 *
	 * @return bool
	 */
	public function is_optimizer_request(): bool {
		$no_cache = SG::get_get_var( self::QUERY_NOCACHE );
		$token    = SG::get_get_var( self::QUERY_TOKEN );

		return $this->is_valid_param( $no_cache ) && $this->is_valid_param( $token );
	}

	/**
	 * Validate a request parameter: must be an alphanumeric string and a minimum length.
	 *
	 * @param mixed $value The query parameter value.
	 *
	 * @return bool
	 */
	private function is_valid_param( $value ): bool {
		return is_string( $value ) && strlen( $value ) >= self::MIN_LENGTH && ctype_alnum( $value );
	}
}
