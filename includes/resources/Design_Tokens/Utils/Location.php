<?php declare( strict_types=1 );
// cspell:ignore pagenow .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Utils;

/**
 * Answers "where are we?" questions about the current request, shared by the projectors that decide
 * whether to append their CSS to the editor style handles.
 *
 * @since TBD
 */
final class Location {

	/**
	 * Whether the current admin request is a block-editor page.
	 *
	 * Uses the global $pagenow because get_current_screen() is not yet available at admin_init priority 5,
	 * which is when the editor style handles are registered. The post-editing screens (post.php and
	 * post-new.php) defer to use_block_editor_for_post(_type)(), so a post type running the classic editor
	 * (e.g. via the Classic Editor plugin) is correctly reported as not a block-editor page; the
	 * site editor and widgets screens are always block-based.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public static function is_block_editor(): bool {
		global $pagenow;

		if ( in_array( $pagenow, [ 'site-editor.php', 'widgets.php' ], true ) ) {
			return true;
		}

		if ( $pagenow === 'post-new.php' ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only screen detection, not form processing.
			$post_type = isset( $_GET['post_type'] ) ? sanitize_key( wp_unslash( $_GET['post_type'] ) ) : 'post';

			return post_type_exists( $post_type ) && use_block_editor_for_post_type( $post_type );
		}

		if ( $pagenow === 'post.php' ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only screen detection, not form processing.
			$post_id = isset( $_GET['post'] ) ? absint( wp_unslash( $_GET['post'] ) ) : 0;

			return $post_id > 0 && use_block_editor_for_post( $post_id );
		}

		return false;
	}
}
