<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;

/**
 * Reads user-created primitive definitions from every stored token library and registers them into
 * Token_Registry. Also the authoritative re-sync point after each store write (see Registry\Provider).
 *
 * Every stored library is synced, not only the active one: the multi-library CSS-var projection emits
 * every library on the page so visitors can switch between them, so every library's user primitives must
 * be known to the registry up front. The registry's id space is flat (not namespaced per library), so the
 * default library's definition wins any id collision; every other library's colliding entry is skipped
 * and logged.
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
	 * @param Token_Registry       $registry
	 * @param User_Primitive_Index $index
	 * @param LoggerInterface      $logger
	 */
	public function __construct(
		Token_Store $store,
		Token_Registry $registry,
		User_Primitive_Index $index,
		LoggerInterface $logger
	) {
		$this->store    = $store;
		$this->registry = $registry;
		$this->index    = $index;
		$this->logger   = $logger;
	}

	/**
	 * Deregister all current user primitives, then re-register from every stored library's committed
	 * document. Safe to call both at boot and from the change-action subscriber.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function sync(): void {
		foreach ( $this->registry->user_created_ids() as $id ) {
			$this->registry->deregister_user_primitive( $id );
		}

		foreach ( $this->slugs() as $slug ) {
			$document = $this->load_document( $slug );

			if ( $document === [] ) {
				continue;
			}

			foreach ( $this->index->all( $document ) as $id => $entry ) {
				$this->register_entry( $slug, $document, (string) $id, $entry );
			}
		}
	}

	/**
	 * Every stored library's slug, the default library first so it wins any cross-library id collision.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function slugs(): array {
		$slugs = array_column( $this->store->list_stores(), 'slug' );
		$slugs = array_values( array_diff( $slugs, [ Token_Store::default_slug() ] ) );

		array_unshift( $slugs, Token_Store::default_slug() );

		return $slugs;
	}

	/**
	 * @since TBD
	 *
	 * @param string                      $slug     The token library slug the entry was read from.
	 * @param array<string, mixed>        $document
	 * @param string                      $id
	 * @param array{label?: string}|mixed $entry
	 *
	 * @return void
	 */
	private function register_entry( string $slug, array $document, string $id, $entry ): void {
		if ( ! is_array( $entry ) ) {
			$this->logger->warning( sprintf( 'User primitive "%s" in library "%s": malformed envelope entry — skipped.', $id, $slug ) );

			return;
		}

		$existing = $this->registry->get( $id );

		if ( $existing !== null && $existing->is_user_created() ) {
			$this->logger->warning( sprintf( 'User primitive "%s" in library "%s": already registered by another token library — skipped.', $id, $slug ) );

			return;
		}

		$type = $this->type_from_tree( $document, $id );

		if ( $type === null ) {
			$this->logger->warning( sprintf( 'User primitive "%s" in library "%s": no matching tree leaf — half-present record, skipped.', $id, $slug ) );

			return;
		}

		if ( ! Token_Type::is_valid( $type ) ) {
			$this->logger->warning( sprintf( 'User primitive "%s" in library "%s": unknown $type "%s" — skipped.', $id, $slug, $type ) );

			return;
		}

		$label = is_string( $entry['label'] ?? null ) ? $entry['label'] : '';

		try {
			$this->registry->register_user_primitive( $id, $type, $label );
		} catch ( \RuntimeException $e ) {
			$this->logger->warning( sprintf( 'User primitive "%s" in library "%s": %s', $id, $slug, $e->getMessage() ) );
		} catch ( \InvalidArgumentException $e ) { // @phpstan-ignore-line -- Token_Definition::from_user_primitive() throws this; Token_Registry::register_user_primitive() does not re-declare it.
			$this->logger->warning( sprintf( 'User primitive "%s" in library "%s": invalid id — %s', $id, $slug, $e->getMessage() ) );
		}
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The document root, walked segment by segment as $id is traversed.
	 * @param string               $id
	 *
	 * @return string|null
	 */
	private function type_from_tree( array $node, string $id ): ?string {
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
	 * @param string $slug The token library slug to load.
	 *
	 * @return array<string, mixed>
	 */
	private function load_document( string $slug ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
