<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Owns the active-library pointer: which token library the module treats as canonical.
 *
 * The pointer is a single slug, so it lives in a WordPress option rather than the
 * kb_design_tokens table — Token_Store remains the sole gateway to that table,
 * and this store is its analog for the active-library selection. It always resolves
 * to a valid library: a pointer at a never-set or since-deleted library falls back to the
 * default library, so reads can never surface a dangling selection.
 *
 * Setting the pointer is the REST layer's write surface; validating that a slug
 * names an existing library is done there (a 404), while this store guarantees the
 * read invariant and signals a real change so caches and projectors can react.
 *
 * @since TBD
 */
final class Active_Token_Library_Store {

	/**
	 * @var string The option that holds the active token library slug.
	 *
	 * @since TBD
	 */
	private const OPTION = 'kadence_blocks_design_tokens_active_library';

	/**
	 * @var string Action fired after the active library changes, carrying the new and
	 *             now-previous slug, so caches and projectors can react. Distinct
	 *             from Token_Store's document-change signal: this announces the
	 *             selection moving, not a library's contents changing.
	 *
	 * @since TBD
	 */
	private const CHANGED_ACTION = 'kadence_blocks_design_tokens_active_library_changed';

	/**
	 * The sole gateway to the kb_design_tokens table, used to validate that a stored
	 * pointer still references an existing library.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @param Token_Store $store The sole gateway to the kb_design_tokens table.
	 */
	public function __construct( Token_Store $store ) {
		$this->store = $store;
	}

	/**
	 * The action hook that fires after the active library changes, for callers that need to react.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function changed_action(): string {
		return self::CHANGED_ACTION;
	}

	/**
	 * Read the active token library slug, always resolved to a valid library.
	 *
	 * Falls back to the default library when the pointer was never set or now references a library with no
	 * row (a since-deleted library) — the default is the always-present canonical library, so the returned
	 * slug always names a readable library.
	 *
	 * @since TBD
	 *
	 * @return string The active library slug, or the default library when the stored pointer is empty or dangling.
	 */
	public function get(): string {
		$slug = Cast::to_string( get_option( self::OPTION, '' ) );

		if ( ! $this->is_known( $slug ) ) {
			return Token_Store::default_slug();
		}

		return $slug;
	}

	/**
	 * Point the active library at a slug, signalling the change.
	 *
	 * A no-op when the slug already resolves to the current active library: nothing is written and no
	 * change is signalled, so subscribers only see a real move. Validating that the slug names an
	 * existing library is the REST layer's job (a 404); this store persists the pointer and announces
	 * the change.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug to make active.
	 *
	 * @return void
	 */
	public function set( string $slug ): void {
		$previous = $this->get();

		if ( $slug === $previous ) {
			return;
		}

		update_option( self::OPTION, $slug, true );

		$this->changed( $slug, $previous );
	}

	/**
	 * Drop the pointer when the library it references is deleted, resetting it to the default.
	 *
	 * Wired to Token_Store::deleted_action(), mirroring how Token_History_Store::forget() drops a
	 * deleted library's trail: once the active library's row is gone, the now-dangling pointer is dropped and
	 * the change is signalled so caches can rebuild against the default. Reads already fall back on
	 * their own, so this only keeps the stored option clean and emits the change signal at deletion
	 * time. A delete of any other library leaves the pointer untouched.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug that was deleted.
	 *
	 * @return void
	 */
	public function forget( string $slug ): void {
		if ( $slug !== Cast::to_string( get_option( self::OPTION, '' ) ) ) {
			return;
		}

		delete_option( self::OPTION );

		$this->changed( Token_Store::default_slug(), $slug );
	}

	/**
	 * Whether a slug names a readable token library.
	 *
	 * The default library is always known — it renders from baseline even before it has a row — and any
	 * other slug is known once it has a stored row. Mirrors Documents_Controller's read gate.
	 *
	 * @since TBD
	 *
	 * @param string $slug The slug to test.
	 *
	 * @return bool
	 */
	private function is_known( string $slug ): bool {
		return $slug === Token_Store::default_slug() || $this->store->exists( $slug );
	}

	/**
	 * Signal that the active library changed so caches and projectors can react.
	 *
	 * @since TBD
	 *
	 * @param string $new_slug The now-active library slug.
	 * @param string $old_slug The now-previous library slug.
	 *
	 * @return void
	 */
	private function changed( string $new_slug, string $old_slug ): void {
		/**
		 * Fires after the active design token library changes.
		 *
		 * @param string $new_slug The now-active library slug.
		 * @param string $old_slug The now-previous library slug.
		 */
		do_action( self::CHANGED_ACTION, $new_slug, $old_slug );
	}
}
