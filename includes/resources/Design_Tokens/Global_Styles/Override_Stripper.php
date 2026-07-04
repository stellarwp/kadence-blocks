<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

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
final class Override_Stripper {

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

		$decoded = json_decode( $post->post_content, true );
		if ( ! is_array( $decoded ) ) {
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

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_slash( $encoded ),
			]
		);
	}

	/**
	 * Restore one target's entry to var(--kb-token--*) within the decoded document, in place.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded theme.json-shaped document (modified in place).
	 * @param Preset_Target        $target   The target to restore.
	 *
	 * @return bool Whether an entry was found and rewritten.
	 */
	private function restore( array &$document, Preset_Target $target ): bool {
		if ( ! isset( $document['settings'] ) || ! is_array( $document['settings'] ) ) {
			return false;
		}

		$cursor = &$document['settings'];

		foreach ( $target->path as $segment ) {
			if ( ! isset( $cursor[ $segment ] ) || ! is_array( $cursor[ $segment ] ) ) {
				return false;
			}
			$cursor = &$cursor[ $segment ];
		}

		if ( ! is_array( $cursor ) ) {
			return false;
		}

		foreach ( $cursor as &$entry ) {
			if ( is_array( $entry ) && ( $entry['slug'] ?? null ) === $target->slug ) {
				$entry[ $target->value_key ] = 'var(' . $target->token->css_var . ')';

				return true;
			}
		}

		return false;
	}
}
