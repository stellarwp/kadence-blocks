<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use WP_Post;

/**
 * Binds Override_Stripper to Global_Styles_Sync_Listener::synced_action().
 *
 * @since TBD
 */
final class Override_Stripper_Hook_Listener {

	/**
	 * @since TBD
	 *
	 * @var Override_Stripper
	 */
	private Override_Stripper $stripper;

	/**
	 * @since TBD
	 *
	 * @param Override_Stripper $stripper Restores synced preset entries to var(--kb-token--*).
	 */
	public function __construct( Override_Stripper $stripper ) {
		$this->stripper = $stripper;
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
		$this->stripper->strip( $synced, $post );
	}
}
