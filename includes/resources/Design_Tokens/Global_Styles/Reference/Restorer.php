<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Reference;

use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Preset_Target;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use WP_Post;

/**
 * Restores synced preset entries in a wp_global_styles post back to var(--kb-token--*), so the
 * CSS variable stays the single source of truth after Global_Styles_Sync_Listener has written the
 * user's literal into the token store.
 *
 * Listens on Global_Styles_Sync_Listener::synced_action(), which already carries the exact
 * Preset_Target objects that were synced — this class only writes, it never re-derives which
 * presets changed or where they live.
 *
 * The wp_update_post() call below re-fires wp_after_insert_post, but that pass is a guaranteed
 * no-op: Global_Styles_Sync_Listener compares against the canonical var(--kb-token--*) form
 * (which this class is about to restore), not the previous literal, so nothing "changes" on the
 * second pass. See the Phase 3 plan for the full self-terminating argument.
 *
 * @since TBD
 */
final class Restorer {

	/**
	 * @since TBD
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * @since TBD
	 *
	 * @param LoggerInterface $logger Logger for a failed post_content restore write.
	 */
	public function __construct( LoggerInterface $logger ) {
		$this->logger = $logger;
	}

	/**
	 * Strip overrides for every synced target, restoring var(--kb-token--*).
	 *
	 * @since TBD
	 *
	 * @param array<int, Preset_Target> $synced The presets that were just synced to the store.
	 * @param WP_Post                   $post   The wp_global_styles post.
	 *
	 * @return void
	 */
	public function strip( array $synced, WP_Post $post ): void {
		if ( $synced === [] ) {
			return;
		}

		// Decoded as objects, not associative arrays: an empty JSON object ("settings": {})
		// would otherwise decode to [] and re-encode as [] instead of {}, corrupting the
		// document's shape. JSON arrays (e.g. a palette's list of preset entries) still decode
		// to PHP arrays either way, so list traversal below is unaffected.
		$decoded = json_decode( $post->post_content );
		if ( ! is_object( $decoded ) ) {
			return; // Malformed post_content — nothing safe to rewrite.
		}

		$changed = false;

		foreach ( $synced as $target ) {
			if ( $this->restore( $decoded, $target ) ) {
				$changed = true;
			}
		}

		if ( ! $changed ) {
			return;
		}

		$encoded = wp_json_encode( $decoded );
		if ( $encoded === false ) {
			return;
		}

		$result = wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_slash( $encoded ),
			],
			true
		);

		if ( ! is_wp_error( $result ) ) {
			return;
		}

		// The token store already holds the synced literal by this point — a failed restore
		// leaves the CPT out of sync with it until the next successful edit. Log so that
		// divergence is diagnosable instead of silent.
		$this->logger->error(
			sprintf(
				'Restorer failed to restore wp_global_styles post %d: %s',
				$post->ID,
				$result->get_error_message()
			)
		);
	}

	/**
	 * Restore one target's entry to var(--kb-token--*) within the decoded document, in place.
	 *
	 * Objects mutate by handle, so rewriting a nested entry here is visible on $document without
	 * needing explicit by-reference traversal.
	 *
	 * @since TBD
	 *
	 * @param object        $document The decoded theme.json-shaped document (modified in place).
	 * @param Preset_Target $target   The target to restore.
	 *
	 * @return bool Whether an entry was found and rewritten.
	 */
	private function restore( object $document, Preset_Target $target ): bool {
		if ( ! isset( $document->settings ) || ! is_object( $document->settings ) ) {
			return false;
		}

		$cursor = $document->settings;

		foreach ( $target->path as $segment ) {
			if ( ! is_object( $cursor ) || ! isset( $cursor->$segment ) ) {
				return false;
			}
			$cursor = $cursor->$segment;
		}

		if ( ! is_array( $cursor ) ) {
			return false;
		}

		foreach ( $cursor as $entry ) {
			if ( is_object( $entry ) && ( $entry->slug ?? null ) === $target->slug ) {
				$entry->{$target->value_key} = 'var(' . $target->token->css_var . ')';

				return true;
			}
		}

		return false;
	}
}
