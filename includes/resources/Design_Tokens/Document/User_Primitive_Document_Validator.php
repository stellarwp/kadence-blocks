<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Enforces the user-primitive document invariant: every envelope entry has a matching valid
 * tree leaf, and every custom tree leaf has a matching envelope entry.
 *
 * Phase 1: only primitive.color.custom.* is accepted.
 *
 * @since TBD
 */
final class User_Primitive_Document_Validator {

	/**
	 * @since TBD
	 *
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $index;

	/**
	 * @since TBD
	 *
	 * @var Baseline_Document
	 */
	private Baseline_Document $baseline;

	/**
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @since TBD
	 *
	 * @param User_Primitive_Index $index    Envelope reader.
	 * @param Baseline_Document    $baseline Baseline document, for collision detection.
	 * @param Token_Registry       $registry Registry, for system-token collision detection.
	 */
	public function __construct(
		User_Primitive_Index $index,
		Baseline_Document $baseline,
		Token_Registry $registry
	) {
		$this->index    = $index;
		$this->baseline = $baseline;
		$this->registry = $registry;
	}

	/**
	 * Validate the user-primitive invariant in a candidate document.
	 * Returns all violations; an empty array means the invariant holds.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded candidate overrides document.
	 *
	 * @return User_Primitive_Validation_Error[]
	 */
	public function validate( array $document ): array {
		$errors = [];

		foreach ( $this->index->all( $document ) as $id => $entry ) {
			$id     = (string) $id;
			$errors = array_merge( $errors, $this->check_envelope_entry( $document, $id, $entry ) );
		}

		$orphans = $this->find_orphan_leaves( $document );

		foreach ( $orphans as $orphan_id ) {
			$errors[] = new User_Primitive_Validation_Error(
				$orphan_id,
				sprintf( 'Custom tree leaf "%s" has no provenance envelope entry.', $orphan_id )
			);
		}

		return $errors;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed>        $document
	 * @param string                      $id
	 * @param array{label?: string}|mixed $entry
	 *
	 * @return User_Primitive_Validation_Error[]
	 */
	private function check_envelope_entry( array $document, string $id, $entry ): array {
		$errors = [];

		if ( ! $this->is_allowed_id( $id ) ) {
			$errors[] = new User_Primitive_Validation_Error(
				$id,
				sprintf( 'User primitive id "%s" is not in the allowed namespace (primitive.color.custom.*).', $id )
			);

			return $errors;
		}

		if ( ! is_array( $entry ) || ! isset( $entry['label'] ) || ! is_string( $entry['label'] ) || $entry['label'] === '' ) {
			$errors[] = new User_Primitive_Validation_Error( $id, sprintf( 'User primitive "%s" has a missing or empty label.', $id ) );
		}

		if ( $this->baseline->has( $id ) ) {
			$errors[] = new User_Primitive_Validation_Error( $id, sprintf( 'User primitive "%s" collides with a baseline token.', $id ) );
		}

		$existing = $this->registry->get( $id );

		if ( $existing !== null && ! $existing->is_user_created() ) {
			$errors[] = new User_Primitive_Validation_Error( $id, sprintf( 'User primitive "%s" collides with a system-registered token.', $id ) );
		}

		$leaf = Document_Path::node_at( $document, $id );

		if ( $leaf === null ) {
			$errors[] = new User_Primitive_Validation_Error( $id, sprintf( 'User primitive "%s" envelope entry has no matching tree leaf.', $id ) );

			return $errors;
		}

		$type = $leaf[ Token_Type::get_type_key() ] ?? null;

		if ( $type !== Token_Type::get_type_color() ) {
			$errors[] = new User_Primitive_Validation_Error(
				$id,
				sprintf( 'User primitive "%s" tree leaf has $type "%s"; only "color" is allowed in phase one.', $id, Cast::to_string( $type ) )
			);
		}

		if ( ! array_key_exists( '$value', $leaf ) ) {
			$errors[] = new User_Primitive_Validation_Error( $id, sprintf( 'User primitive "%s" tree leaf is missing $value.', $id ) );
		} elseif ( Alias::is_alias( $leaf['$value'] ) ) {
			$errors[] = new User_Primitive_Validation_Error(
				$id,
				sprintf( 'User primitive "%s" $value must be a literal; aliases are not allowed on user primitives in phase one.', $id )
			);
		}

		return $errors;
	}

	/**
	 * Walk primitive.color.custom.* in the document and return any id that has no envelope entry.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return string[]
	 */
	private function find_orphan_leaves( array $document ): array {
		$primitive = $document['primitive'] ?? [];

		if ( ! is_array( $primitive ) ) {
			return [];
		}

		$color = $primitive['color'] ?? [];

		if ( ! is_array( $color ) ) {
			return [];
		}

		$custom = $color['custom'] ?? [];

		if ( ! is_array( $custom ) ) {
			return [];
		}

		$orphans = [];

		foreach ( $custom as $slug => $node ) {
			if ( ! is_string( $slug ) || strncmp( $slug, '$', 1 ) === 0 || ! is_array( $node ) ) {
				continue;
			}

			$id = 'primitive.color.custom.' . $slug;

			if ( ! $this->index->has( $document, $id ) ) {
				$orphans[] = $id;
			}
		}

		return $orphans;
	}

	/**
	 * Whether a canonical id is in the allowed phase-1 namespace.
	 *
	 * @since TBD
	 *
	 * @param string $id
	 *
	 * @return bool
	 */
	private function is_allowed_id( string $id ): bool {
		return (bool) preg_match( '/^primitive\.color\.custom\.[a-z0-9]+(?:-[a-z0-9]+)*$/', $id );
	}
}
