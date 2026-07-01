<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;

/**
 * Reads user-created primitive definitions from the store and registers them into Token_Registry.
 * Also the authoritative re-sync point after each store write (see Registry\Provider).
 *
 * @since TBD
 */
final class User_Primitive_Registrar {

	/**
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @since TBD
	 *
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $index;

	/**
	 * @since TBD
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * @since TBD
	 *
	 * @param Token_Store          $store
	 * @param Active_Set_Store     $active
	 * @param Token_Registry       $registry
	 * @param User_Primitive_Index $index
	 * @param LoggerInterface      $logger
	 */
	public function __construct(
		Token_Store $store,
		Active_Set_Store $active,
		Token_Registry $registry,
		User_Primitive_Index $index,
		LoggerInterface $logger
	) {
		$this->store    = $store;
		$this->active   = $active;
		$this->registry = $registry;
		$this->index    = $index;
		$this->logger   = $logger;
	}

	/**
	 * Deregister all current user primitives, then re-register from the committed document.
	 * Safe to call both at boot and from the change-action subscriber.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function sync(): void {
		foreach ( $this->registry->user_created_ids() as $id ) {
			$this->registry->deregister_user_primitive( $id );
		}

		$document = $this->load_document();

		if ( $document === [] ) {
			return;
		}

		foreach ( $this->index->all( $document ) as $id => $entry ) {
			$this->register_entry( $document, (string) $id, $entry );
		}
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed>        $document
	 * @param string                      $id
	 * @param array{label?: string}|mixed $entry
	 *
	 * @return void
	 */
	private function register_entry( array $document, string $id, $entry ): void {
		if ( ! is_array( $entry ) ) {
			$this->logger->warning( sprintf( 'User primitive "%s": malformed envelope entry — skipped.', $id ) );

			return;
		}

		$type = $this->type_from_tree( $document, $id );

		if ( $type === null ) {
			$this->logger->warning( sprintf( 'User primitive "%s": no matching tree leaf — half-present record, skipped.', $id ) );

			return;
		}

		if ( ! Token_Type::is_valid( $type ) ) {
			$this->logger->warning( sprintf( 'User primitive "%s": unknown $type "%s" — skipped.', $id, $type ) );

			return;
		}

		$label = is_string( $entry['label'] ?? null ) ? $entry['label'] : '';

		try {
			$this->registry->register_user_primitive( $id, $type, $label );
		} catch ( \RuntimeException $e ) {
			$this->logger->warning( sprintf( 'User primitive "%s": %s', $id, $e->getMessage() ) );
		} catch ( \InvalidArgumentException $e ) { // @phpstan-ignore-line -- Token_Definition::from_user_primitive() throws this; Token_Registry::register_user_primitive() does not re-declare it.
			$this->logger->warning( sprintf( 'User primitive "%s": invalid id — %s', $id, $e->getMessage() ) );
		}
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id
	 *
	 * @return string|null
	 */
	private function type_from_tree( array $document, string $id ): ?string {
		$node = $document;

		foreach ( explode( '.', $id ) as $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				return null;
			}

			$node = $node[ $segment ];
		}

		if ( ! is_array( $node ) ) {
			return null;
		}

		$type = $node[ Token_Type::get_type_key() ] ?? null;

		return is_string( $type ) && $type !== '' ? $type : null;
	}

	/**
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function load_document(): array {
		$raw = $this->store->get_document( $this->active->get() );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
