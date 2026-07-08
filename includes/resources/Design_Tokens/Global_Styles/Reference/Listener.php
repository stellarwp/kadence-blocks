<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Reference;

use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Preset_Target;
use WP_Post;

/**
 * Binds Restorer to Global_Styles_Sync_Listener::synced_action().
 *
 * @since TBD
 */
final class Listener {

	/**
	 * @since TBD
	 *
	 * @var Restorer
	 */
	private Restorer $restorer;

	/**
	 * @since TBD
	 *
	 * @param Restorer $restorer Restores synced preset entries to var(--kb-token--*).
	 */
	public function __construct( Restorer $restorer ) {
		$this->restorer = $restorer;
	}

	/**
	 * Handle Global_Styles_Sync_Listener::synced_action().
	 *
	 * @since TBD
	 *
	 * @param array<int, Preset_Target> $synced The synced presets.
	 * @param WP_Post                   $post   The wp_global_styles post.
	 *
	 * @return void
	 */
	public function on_synced( array $synced, WP_Post $post ): void {
		$this->restorer->restore_synced( $synced, $post );
	}
}
