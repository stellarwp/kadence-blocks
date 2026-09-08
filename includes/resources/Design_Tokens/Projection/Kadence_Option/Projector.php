<?php declare( strict_types=1 );
// cspell:ignore palette autoloaded .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use RuntimeException;

/**
 * Syncs resolved palette-token values into KB's own stored option so pre-existing code paths reflect tokens.
 *
 *   - kadence_blocks_colors    — KB's own palette option. Synced ALWAYS (any active theme), so KB's
 *                                editor palette UI and its theme.json / editor-settings injection track
 *                                tokens with no change to those code paths.
 *
 * The Kadence theme's kadence_global_palette is NOT written. That option is the user's Style Guide, and
 * overwriting it destroyed colors the user chose in the Customizer with no way back. Tokens reach the
 * theme at read time instead, through the kadence_palette_option filter.
 *
 * reconcile() is wired to a once-per-request boot pass AND to kadence_blocks_design_tokens_changed, so a
 * token write syncs immediately. A version marker short-circuits the common no-change case; update_option
 * is itself a no-op when the encoded value is unchanged, the correctness backstop. Gated on
 * Token_Registry::is_active() (fail-closed) and a fail-open catch around resolution.
 *
 * @since TBD
 */
final class Projector {

	/**
	 * KB's own palette option key.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KB_COLORS_OPTION = 'kadence_blocks_colors';

	/**
	 * Marker option storing the last-synced "{plugin-version}:{store-version}" signature, so a request
	 * where nothing changed skips resolution entirely.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SYNC_MARKER_OPTION = 'kadence_blocks_design_tokens_palette_sync';

	/**
	 * The token registry.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The token resolver.
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * The token store.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Owns the active-library pointer, read at sync time so the synced options follow the active library.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The palette builder.
	 *
	 * @since TBD
	 *
	 * @var Palette_Builder
	 */
	private Palette_Builder $builder;

	/**
	 * Guards against re-running the boot pass more than once per request (the action may also fire).
	 *
	 * @var bool
	 */
	private bool $reconciled_this_request = false;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry             $registry
	 * @param Token_Resolver             $resolver
	 * @param Token_Store                $store
	 * @param Active_Token_Library_Store $active
	 * @param Palette_Builder            $builder
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Token_Store $store,
		Active_Token_Library_Store $active,
		Palette_Builder $builder
	) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->store    = $store;
		$this->active   = $active;
		$this->builder  = $builder;
	}

	/**
	 * Once-per-request reconcile. Bound to the boot pass (low priority on init) and may be re-entered by
	 * on_tokens_changed(); the per-request guard keeps it to one pass unless a write forces a re-sync.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function reconcile(): void {
		if ( $this->reconciled_this_request ) {
			return;
		}
		$this->reconciled_this_request = true;

		$this->sync();
	}

	/**
	 * Force a re-sync after a token write, regardless of the per-request guard, so the new values land
	 * in the same request. Bound to kadence_blocks_design_tokens_changed.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function on_tokens_changed(): void {
		$this->reconciled_this_request = true; // A write supersedes the boot pass for this request.
		$this->sync();
	}

	/**
	 * The sync itself: gate, resolve, short-circuit on an unchanged signature, then write.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function sync(): void {
		if ( ! $this->registry->is_active() || ! $this->builder->has_palette_tokens() ) {
			return;
		}

		$slug      = $this->active->get();
		$signature = KADENCE_BLOCKS_VERSION . ':' . $this->store->get_version( $slug );

		// Skip the resolve + write when the active library's version has not changed since the last
		// successful sync. Switching the active library changes its version, so the signature flips and
		// the next reconcile re-syncs.
		if ( get_option( self::SYNC_MARKER_OPTION ) === $signature ) {
			return;
		}

		try {
			$resolved = $this->resolver->resolve( $slug );
		} catch ( RuntimeException $e ) {
			// Corrupt stored document (alias cycle / dangling alias from a raw DB write). Fail open:
			// leave the option exactly as it is; do NOT advance the marker, so a later clean write
			// re-attempts.
			return;
		}

		$entries = $this->builder->entries( $resolved );

		// Empty entries is a valid resolved state (no token values set yet). Still advance the marker so
		// the next request short-circuits rather than re-resolving. When the user writes token values the
		// store version changes, the signature flips, and the next reconcile re-enters the write path.
		if ( $entries !== [] ) {
			$this->sync_kb_colors( $entries );
		}

		// Autoloaded: the boot pass reads this marker on every request to short-circuit, so it must not
		// cost a dedicated query. It is a tiny "{plugin-version}:{store-version}" string.
		update_option( self::SYNC_MARKER_OPTION, $signature, true );
	}

	/**
	 * Always-on sync of KB's own kadence_blocks_colors. Reads + decodes the existing JSON, merges, and
	 * writes back as JSON. update_option no-ops when the string is unchanged.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{color: string, name: string}> $entries
	 *
	 * @return void
	 */
	private function sync_kb_colors( array $entries ): void {
		$raw     = get_option( self::KB_COLORS_OPTION, '' );
		$decoded = $this->decode( $raw );
		$merged  = $this->builder->merge_kadence_blocks_colors( $decoded, $entries );

		// Pass true to ensure this option is autoloaded: it is read on every front-end request
		// (load_color_palette() in after_setup_theme, load_color_palette_theme_json() on
		// wp_theme_json_data_theme). update_option only writes when the value changes, and preserves
		// autoload each time it does — which is the state we want.
		update_option( self::KB_COLORS_OPTION, (string) wp_json_encode( $merged ), true );
	}

	/**
	 * Decode a stored JSON option to an array, tolerating an empty/invalid value (=> []).
	 *
	 * @since TBD
	 *
	 * @param mixed $raw
	 *
	 * @return array<string, mixed>
	 */
	private function decode( $raw ): array {
		if ( ! is_string( $raw ) || $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
