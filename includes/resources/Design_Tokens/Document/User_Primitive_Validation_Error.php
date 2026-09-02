<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * A single invariant violation detected by User_Primitive_Document_Validator.
 *
 * @since TBD
 */
final class User_Primitive_Validation_Error {

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	private string $id;

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	private string $message;

	/**
	 * @since TBD
	 *
	 * @param string $id      The canonical dot-path id that is corrupt.
	 * @param string $message Human-readable description of the violation.
	 */
	public function __construct( string $id, string $message ) {
		$this->id      = $id;
		$this->message = $message;
	}

	/**
	 * @since TBD
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * @since TBD
	 *
	 * @return string
	 */
	public function get_message(): string {
		return $this->message;
	}
}
