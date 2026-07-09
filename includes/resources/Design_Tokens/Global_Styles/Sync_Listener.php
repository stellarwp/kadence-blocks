<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use RuntimeException;
use Throwable;
use WP_Post;

/**
 * Syncs Site Editor edits to token-backed presets back into the active token set.
 *
 * Bound to WordPress's generic "wp_after_insert_post" (there is no REST-specific hook for Global
 * Styles writes). Runs the exact write pipeline Rest\V1\Documents_Controller::set_token() uses:
 * Mutator::set() assembles the candidate document, Dtcg_Validator checks its grammar,
 * Token_Resolver::resolve_overrides() dry-runs it to reject alias cycles / dangling aliases, and
 * Token_Store::save_document() commits it.
 *
 * Only tokens Site_Editor_Preset_Locator returns (wp_preset + site_editor => true) are ever
 * touched; every other preset in the payload — ad-hoc or token-backed-but-not-opted-in — is left
 * exactly as WordPress wrote it. A changed preset whose category has no Value_Translator support
 * (currently "shadow") is skipped and logged, not guessed at.
 *
 * @since TBD
 */
final class Sync_Listener {

	/**
	 * The wp_global_styles post type this listener reacts to.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const POST_TYPE = 'wp_global_styles';

	/**
	 * Fires after any token-backed presets are synced to the store, carrying the synced targets.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SYNCED_ACTION = 'kadence_blocks_global_styles_tokens_synced';

	/**
	 * @since TBD
	 *
	 * @var Site_Editor_Preset_Locator
	 */
	private Site_Editor_Preset_Locator $locator;

	/**
	 * @since TBD
	 *
	 * @var Value_Translator
	 */
	private Value_Translator $translator;

	/**
	 * @since TBD
	 *
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @var Mutator
	 */
	private Mutator $mutator;

	/**
	 * @since TBD
	 *
	 * @var Dtcg_Validator
	 */
	private Dtcg_Validator $validator;

	/**
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * @since TBD
	 *
	 * @param Site_Editor_Preset_Locator $locator    Finds tokens opted into Site Editor sync.
	 * @param Value_Translator           $translator Translates a literal preset value to a DTCG leaf.
	 * @param Active_Set_Store           $active     Which token set is the theme.json-injected set.
	 * @param Token_Store                $store      The sole gateway to the kb_design_tokens table.
	 * @param Mutator                    $mutator    Assembles the candidate overrides document.
	 * @param Dtcg_Validator             $validator  Validates the DTCG grammar of a candidate document.
	 * @param Token_Resolver             $resolver   Dry-runs a candidate document before commit.
	 * @param LoggerInterface            $logger     Logger for a per-preset sync failure.
	 */
	public function __construct(
		Site_Editor_Preset_Locator $locator,
		Value_Translator $translator,
		Active_Set_Store $active,
		Token_Store $store,
		Mutator $mutator,
		Dtcg_Validator $validator,
		Token_Resolver $resolver,
		LoggerInterface $logger
	) {
		$this->locator    = $locator;
		$this->translator = $translator;
		$this->active     = $active;
		$this->store      = $store;
		$this->mutator    = $mutator;
		$this->validator  = $validator;
		$this->resolver   = $resolver;
		$this->logger     = $logger;
	}

	/**
	 * The action hook fired after presets are synced, for downstream listeners (Restorer,
	 * and eventually the detached-from-brand surfacing feature).
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function synced_action(): string {
		return self::SYNCED_ACTION;
	}

	/**
	 * Handle wp_after_insert_post.
	 *
	 * @since TBD
	 *
	 * @param int          $post_id     The post ID (unused; kept for the hook's exact signature).
	 * @param WP_Post      $post        The post after the write.
	 * @param bool         $update      Whether this was an update (unused; a create has no
	 *                                  presets to have changed, so the diff naturally no-ops).
	 * @param WP_Post|null $post_before The post before the write, or null for a new post (unused;
	 *                                  kept for the hook's exact signature — a target's
	 *                                  already-synced state is checked against the token store,
	 *                                  not $post_before, since Restorer's own wp_update_post()
	 *                                  call has already rewritten it to the canonical form by
	 *                                  the time a later save runs).
	 *
	 * @return void
	 */
	// phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter -- $update and $post_before are kept to match wp_after_insert_post's exact signature.
	public function on_after_insert_post( int $post_id, WP_Post $post, bool $update, ?WP_Post $post_before ): void {
		if ( $post->post_type !== self::POST_TYPE ) {
			return;
		}

		$after = $this->decode( $post->post_content );
		$slug  = $this->active->get();

		$changed = $this->find_changed_targets( $slug, $after );
		if ( $changed === [] ) {
			return;
		}

		$synced = [];

		foreach ( $changed as [ $target, $literal ] ) {
			try {
				$this->sync_target( $slug, $target, $literal );
				$synced[] = $target;
			} catch ( Throwable $e ) {
				// A single bad preset must not block the others, and must never surface a fatal to
				// the Site Editor's save request — the CPT write already committed by the time this
				// hook runs. Log for diagnosis; the preset simply stays a plain literal (not synced,
				// not stripped) until the next successful edit.
				$this->logger->error(
					sprintf(
						'Global Styles token sync failed for "%s" (%s): %s',
						$target->token->id,
						$target->category,
						$e->getMessage()
					)
				);
			}
		}

		if ( $synced === [] ) {
			return;
		}

		/**
		 * Fires after Site Editor edits to token-backed presets are synced to the store.
		 *
		 * @since TBD
		 *
		 * @param array<int, Preset_Target> $synced The presets that were synced.
		 * @param WP_Post                   $post   The wp_global_styles post.
		 */
		// do_action_ref_array(), not do_action(): do_action()'s single-object-array backward-
		// compatibility unwrap (`array( &$this )`, wp-includes/plugin.php) silently collapses
		// $synced to its bare element whenever exactly one preset is synced, handing subscribers
		// a lone Preset_Target instead of a one-item list.
		do_action_ref_array( self::SYNCED_ACTION, [ $synced, $post ] );
	}

	/**
	 * Find every syncable preset whose new value differs from both its canonical
	 * var(--kb-token--*) form and whatever literal the store already holds for it, paired with
	 * the new literal to sync.
	 *
	 * Checked against the store's current value rather than $post_before: Restorer's own
	 * wp_update_post() call rewrites $post_before's would-be literal back to the canonical form
	 * within the same request, so a later save resending the exact literal already synced would
	 * otherwise look "changed" purely because of Restorer's own rewrite.
	 *
	 * @since TBD
	 *
	 * @param string               $slug  The active token set slug.
	 * @param array<string, mixed> $after  Decoded post-write theme.json-shaped document.
	 *
	 * @return array<int, array{0: Preset_Target, 1: string}>
	 */
	private function find_changed_targets( string $slug, array $after ): array {
		$changed = [];
		$stored  = $this->decode( $this->store->get_document( $slug ) );

		foreach ( $this->locator->locate() as $target ) {
			$canonical = 'var(' . $target->token->css_var . ')';
			$new_value = $this->entry_value( $after, $target );

			if ( $new_value === null || $new_value === $canonical ) {
				continue; // Untouched, or already restored by a prior pass.
			}

			if ( $this->already_synced( $stored, $target, $new_value ) ) {
				continue; // The store already holds this exact literal — nothing new to sync.
			}

			$changed[] = [ $target, $new_value ];
		}

		return $changed;
	}

	/**
	 * Whether a target's new literal translates to the exact leaf the store already holds for it,
	 * making a sync a no-op.
	 *
	 * A translation failure is left for sync_target() to throw and log the same way it always
	 * has, rather than being swallowed here as "already synced".
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $stored  The active token set's currently stored document.
	 * @param Preset_Target        $target  The target to check.
	 * @param string               $literal The new literal read from the Global Styles preset entry.
	 *
	 * @return bool
	 */
	private function already_synced( array $stored, Preset_Target $target, string $literal ): bool {
		try {
			$leaf = $this->translator->translate( $target->category, $literal );
		} catch ( Untranslatable_Value_Exception $e ) {
			return false;
		}

		$cursor = $stored;

		foreach ( explode( '.', $target->token->id ) as $segment ) {
			if ( ! is_array( $cursor ) || ! isset( $cursor[ $segment ] ) ) {
				return false;
			}
			$cursor = $cursor[ $segment ];
		}

		return $cursor === $leaf;
	}

	/**
	 * Sync one target: translate its literal, assemble the candidate document, validate, dry-run
	 * resolve, persist. Mirrors Documents_Controller::set_token() + validate_and_save() exactly.
	 *
	 * @since TBD
	 *
	 * @param string        $slug    The active token set slug.
	 * @param Preset_Target $target  The preset target to sync.
	 * @param string        $literal The new literal value from the Global Styles preset entry.
	 *
	 * @return void
	 *
	 * @throws Untranslatable_Value_Exception|Alias_Cycle_Exception|Dangling_Alias_Exception|DatabaseQueryException|RuntimeException When
	 *         the category has no translator, the candidate cannot be resolved, the write fails, the
	 *         assembled document fails DTCG validation, or the document cannot be encoded.
	 */
	private function sync_target( string $slug, Preset_Target $target, string $literal ): void {
		$leaf = $this->translator->translate( $target->category, $literal );

		$raw     = $this->store->get_document( $slug );
		$decoded = $raw === '' ? [] : json_decode( $raw, true );
		$decoded = is_array( $decoded ) ? $decoded : [];

		$candidate = $this->mutator->set( $decoded, $target->token->id, $leaf );

		$result = $this->validator->validate( $candidate, Dtcg_Validator::get_context_overrides() );
		if ( ! $result->is_valid() ) {
			throw new RuntimeException(
				sprintf( 'DTCG validation failed for "%s": %s', $target->token->id, wp_json_encode( $result->to_array() ) )
			);
		}

		// Throws Alias_Cycle_Exception / Dangling_Alias_Exception on an unresolvable candidate —
		// deliberately uncaught here, caught by the caller's blanket Throwable handler.
		$this->resolver->resolve_overrides( $candidate );

		$encoded = wp_json_encode( $candidate );
		if ( $encoded === false ) {
			throw new RuntimeException( sprintf( 'Failed to encode candidate document for "%s".', $target->token->id ) );
		}

		$this->store->save_document( $encoded, $slug );
	}

	/**
	 * Read a preset entry's value for a target from a decoded theme.json-shaped document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded document.
	 * @param Preset_Target        $target   The target to look up.
	 *
	 * @return string|null The entry's value, or null when the bucket/entry is absent.
	 */
	private function entry_value( array $document, Preset_Target $target ): ?string {
		$cursor = $document['settings'] ?? null;

		foreach ( $target->path as $segment ) {
			if ( ! is_array( $cursor ) || ! isset( $cursor[ $segment ] ) ) {
				return null;
			}
			$cursor = $cursor[ $segment ];
		}

		if ( ! is_array( $cursor ) ) {
			return null;
		}

		foreach ( $cursor as $entry ) {
			if ( is_array( $entry ) && ( $entry['slug'] ?? null ) === $target->slug ) {
				$value = $entry[ $target->value_key ] ?? null;

				return is_string( $value ) ? $value : null;
			}
		}

		return null;
	}

	/**
	 * Decode a wp_global_styles post_content string.
	 *
	 * @since TBD
	 *
	 * @param string $raw The raw post_content.
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
