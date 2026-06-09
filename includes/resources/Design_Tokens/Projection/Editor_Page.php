<?php declare( strict_types=1 );
// cspell:ignore pagenow .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

/**
 * Detects whether the current admin request is a block-editor page, shared by the projectors that append
 * their CSS to the editor style handles.
 *
 * @since TBD
 */
final class Editor_Page {

	/**
	 * Whether the current admin request is a known block-editor page.
	 *
	 * Uses the global $pagenow because get_current_screen() is not yet available at admin_init priority 5,
	 * which is when the editor style handles are registered.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public static function is_block_editor(): bool {
		global $pagenow;

		return in_array( $pagenow, [ 'post.php', 'post-new.php', 'site-editor.php', 'widgets.php' ], true );
	}
}
