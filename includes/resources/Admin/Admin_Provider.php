<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Admin;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Dashboard / wp-admin container definitions and hooks.
 */
final class Admin_Provider extends Provider {

	public const HANDLE_POST_SAVED_EVENT = 'post-saved-event';

	public function register(): void {
		add_action(
			'admin_init',
			function (): void {
				$this->register_post_saved_event();
			}
		);
	}

	/**
	 * Register the post-saved-event action that fires when a Gutenberg post is saved.
	 *
	 * @return void
	 */
	private function register_post_saved_event(): void {
		global $pagenow;

		// Only load on post edit screens (not widgets.php or site-editor.php).
		if ( ! in_array( $pagenow, [ 'post.php', 'post-new.php' ] ) ) {
			return;
		}

		add_action(
			'enqueue_block_editor_assets',
			function (): void {
				$asset = $this->container->get( Asset::class );

				$asset->enqueue_script( self::HANDLE_POST_SAVED_EVENT, 'dist/post-saved-event' );
			}
		);
	}
}
