<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Owns the active-set pointer: which token set the module treats as canonical.
 *
 * The pointer is a single slug, so it lives in a WordPress option rather than the
 * kb_design_tokens table — Token_Store remains the sole gateway to that table,
 * and this store is its analog for the active-set selection. It always resolves
 * to a valid set: a pointer at a never-set or since-deleted set falls back to the
 * default set, so reads can never surface a dangling selection.
 *
 * Setting the pointer is the REST layer's write surface; validating that a slug
 * names an existing set is done there (a 404), while this store guarantees the
 * read invariant and signals a real change so caches and projectors can react.
 *
 * @since TBD
 */
final class Active_Set_Store {

	/**
	 * @var string The option that holds the active token set slug.
	 *
	 * @since TBD
	 */
	private const OPTION = 'kadence_blocks_design_tokens_active_set';

	/**
	 * @var string Action fired after the active set changes, carrying the new and
	 *             now-previous slug, so caches and projectors can react. Distinct
	 *             from Token_Store's document-change signal: this announces the
	 *             selection moving, not a set's contents changing.
	 *
	 * @since TBD
	 */
	private const CHANGED_ACTION = 'kadence_blocks_design_tokens_active_changed';

	/**
	 * The sole gateway to the kb_design_tokens table, used to validate that a stored
	 * pointer still references an existing set.
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
	 * The action hook that fires after the active set changes, for callers that need to react.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function changed_action(): string {
		return self::CHANGED_ACTION;
	}

	/**
	 * Read the active token set slug, always resolved to a valid set.
	 *
	 * Falls back to the default set when the pointer was never set or now references a set with no
	 * row (a since-deleted set) — the default is the always-present canonical set, so the returned
	 * slug always names a readable set.
	 *
	 * @since TBD
	 *
	 * @return string The active set slug, or the default set when the stored pointer is empty or dangling.
	 */
	public function get(): string {
		$slug = Cast::to_string( get_option( self::OPTION, '' ) );

		if ( ! $this->is_known( $slug ) ) {
			return Token_Store::default_slug();
		}

		return $slug;
	}

	/**
	 * Point the active set at a slug, signalling the change.
	 *
	 * A no-op when the slug already resolves to the current active set: nothing is written and no
	 * change is signalled, so subscribers only see a real move. Validating that the slug names an
	 * existing set is the REST layer's job (a 404); this store persists the pointer and announces
	 * the change.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug to make active.
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
	 * Drop the pointer when the set it references is deleted, resetting it to the default.
	 *
	 * Wired to Token_Store::deleted_action(), mirroring how Token_History_Store::forget() drops a
	 * deleted set's trail: once the active set's row is gone, the now-dangling pointer is dropped and
	 * the change is signalled so caches can rebuild against the default. Reads already fall back on
	 * their own, so this only keeps the stored option clean and emits the change signal at deletion
	 * time. A delete of any other set leaves the pointer untouched.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug that was deleted.
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
	 * Whether a slug names a readable token set.
	 *
	 * The default set is always known — it renders from baseline even before it has a row — and any
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
	 * Signal that the active set changed so caches and projectors can react.
	 *
	 * @since TBD
	 *
	 * @param string $new The now-active set slug.
	 * @param string $old The now-previous set slug.
	 *
	 * @return void
	 */
	private function changed( string $new, string $old ): void {
		/**
		 * Fires after the active design token set changes.
		 *
		 * @param string $new The now-active set slug.
		 * @param string $old The now-previous set slug.
		 */
		do_action( self::CHANGED_ACTION, $new, $old );
	}
}
