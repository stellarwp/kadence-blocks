<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use RuntimeException;

/**
 * Syncs resolved palette-token values into two stored options so pre-existing code paths reflect tokens.
 *
 *   - kadence_blocks_colors    — KB's own palette option. Synced ALWAYS (any active theme), so KB's
 *                                editor palette UI and its theme.json / editor-settings injection track
 *                                tokens with no change to those code paths.
 *   - kadence_global_palette   — the Kadence theme's option. Synced ONLY when it already exists, NEVER
 *                                created, so non-Kadence-theme sites are left untouched.
 *
 * reconcile() is wired to a once-per-request boot pass AND to kadence_blocks_design_tokens_changed, so a
 * token write syncs immediately and a later theme switch (which newly exposes kadence_global_palette) is
 * caught on the next request. A version+theme marker short-circuits the common no-change case; update_option
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
	 * The Kadence theme's palette option key.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_PALETTE_OPTION = 'kadence_global_palette';

	/**
	 * Marker option storing the last-synced "{store-version}:{theme-present}" signature, so a request
	 * where nothing changed skips resolution entirely.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SYNC_MARKER_OPTION = 'kadence_blocks_design_tokens_palette_sync';

	/**
	 * Sentinel for the existence probe. A value a real option is overwhelmingly unlikely to equal, so
	 * get_option($key, SENTINEL) === SENTINEL reliably means "absent".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ABSENT = "\0kb-design-tokens-absent\0";

	private Token_Registry $registry;
	private Token_Resolver $resolver;
	private Token_Store $store;
	private Palette_Builder $builder;

	/**
	 * Guards against re-running the boot pass more than once per request (the action may also fire).
	 *
	 * @var bool
	 */
	private bool $reconciled_this_request = false;

	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Token_Store $store,
		Palette_Builder $builder
	) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->store    = $store;
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

		$theme_present = $this->theme_palette_exists();
		$signature     = $this->store->get_version() . ':' . ( $theme_present ? '1' : '0' );

		// Skip the resolve + writes when neither the store version nor the theme-option presence changed
		// since the last successful sync. The theme-present bit is what catches a theme switch.
		if ( get_option( self::SYNC_MARKER_OPTION ) === $signature ) {
			return;
		}

		try {
			$resolved = $this->resolver->resolve();
		} catch ( RuntimeException $e ) {
			// Corrupt stored document (alias cycle / dangling alias from a raw DB write). Fail open:
			// leave both options exactly as they are; do NOT advance the marker, so a later clean write
			// re-attempts.
			return;
		}

		$entries = $this->builder->entries( $resolved );
		if ( $entries === [] ) {
			return;
		}

		$this->sync_kb_colors( $entries );          // Always.

		if ( $theme_present ) {                       // Only when it already exists.
			$this->sync_theme_palette( $entries );
		}

		update_option( self::SYNC_MARKER_OPTION, $signature, false );
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
		$decoded = $this->decode( (string) get_option( self::KB_COLORS_OPTION, '' ) );
		$merged  = $this->builder->merge_kb_colors( $decoded, $entries );

		update_option( self::KB_COLORS_OPTION, (string) wp_json_encode( $merged ), false );
	}

	/**
	 * Conditional sync of the Kadence theme's kadence_global_palette. The caller has already proved the
	 * option exists; we re-read it for the merge. Never creates it.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{color: string, name: string}> $entries
	 *
	 * @return void
	 */
	private function sync_theme_palette( array $entries ): void {
		$raw = get_option( self::THEME_PALETTE_OPTION, self::ABSENT );
		if ( $raw === self::ABSENT ) {
			return; // raced away between probe and here; never create.
		}

		$decoded = $this->decode( (string) $raw );
		$merged  = $this->builder->merge_theme_palette( $decoded, $entries );

		update_option( self::THEME_PALETTE_OPTION, (string) wp_json_encode( $merged ), false );
	}

	/**
	 * Whether the Kadence theme's palette option exists, via the sentinel idiom — the §8C spec's exact
	 * "get_option($key, $sentinel) !== $sentinel" test. Never creates the option.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function theme_palette_exists(): bool {
		return get_option( self::THEME_PALETTE_OPTION, self::ABSENT ) !== self::ABSENT;
	}

	/**
	 * Decode a stored JSON option to an array, tolerating an empty/invalid value (=> []).
	 *
	 * @since TBD
	 *
	 * @param string $raw
	 *
	 * @return array<string, mixed>
	 */
	private function decode( string $raw ): array {
		if ( $raw === '' ) {
			return [];
		}
		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
