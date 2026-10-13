<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * A single invariant violation detected by User_Primitive_Document_Validator.
 *
 * @since 3.8.0
 */
final class User_Primitive_Validation_Error {

	/**
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private string $id;

	/**
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private string $message;

	/**
	 * @since 3.8.0
	 *
	 * @param string $id      The canonical dot-path id that is corrupt.
	 * @param string $message Human-readable description of the violation.
	 */
	public function __construct( string $id, string $message ) {
		$this->id      = $id;
		$this->message = $message;
	}

	/**
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public function get_message(): string {
		return $this->message;
	}
}
