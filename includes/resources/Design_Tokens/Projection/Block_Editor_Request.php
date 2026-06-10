<?php declare( strict_types=1 );
// cspell:ignore pagenow .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

/**
 * Shared block-editor request detection for the projectors that append editor inline styles at
 * admin_init priority 5, before get_current_screen() is available.
 *
 * @since TBD
 */
trait Block_Editor_Request {

	/**
	 * Whether the current admin request is a known block-editor page.
	 *
	 * Uses the global $pagenow because get_current_screen() is not yet available at admin_init priority 5,
	 * which is when the editor handle is registered.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_block_editor_page(): bool {
		global $pagenow;

		return in_array( $pagenow, [ 'post.php', 'post-new.php', 'site-editor.php', 'widgets.php' ], true );
	}
}
