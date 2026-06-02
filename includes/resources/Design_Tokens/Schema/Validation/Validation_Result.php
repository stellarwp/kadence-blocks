<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation;

/**
 * The outcome of validating a document: the (possibly empty) list of Validation_Errors collected in a
 * single pass.
 *
 * The validator collects every error rather than throwing on the first, so the REST write layer
 * can return them all at once. This object stays WordPress-agnostic — to_array() yields a plain
 * payload and the WP_Error / HTTP 422 envelope is the REST layer's concern, which keeps the Schema
 * module unit-testable without loading REST.
 *
 * @since TBD
 */
final class Validation_Result {

	/**
	 * The collected errors, in discovery order.
	 *
	 * @since TBD
	 *
	 * @var Validation_Error[]
	 */
	private array $errors;

	/**
	 * @param Validation_Error[] $errors The collected errors.
	 */
	public function __construct( array $errors = [] ) {
		$this->errors = array_values( $errors );
	}

	/**
	 * Whether the document validated cleanly.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		return $this->errors === [];
	}

	/**
	 * The collected errors.
	 *
	 * @since TBD
	 *
	 * @return Validation_Error[]
	 */
	public function errors(): array {
		return $this->errors;
	}

	/**
	 * Plain-array form of every error, for the REST/MCP boundary.
	 *
	 * @since TBD
	 *
	 * @return array<int, array{path: string, code: string, message: string}>
	 */
	public function to_array(): array {
		return array_map(
			static function ( Validation_Error $error ): array {
				return $error->to_array();
			},
			$this->errors
		);
	}
}
