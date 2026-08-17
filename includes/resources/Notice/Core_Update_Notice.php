<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

/**
 * Prompts site administrators to update WordPress while the install is behind the latest release.
 *
 * @since TBD
 */
final class Core_Update_Notice {

	/**
	 * Dismissal flag shared with the other StellarWP plugins that display this notice, so a site
	 * running more than one of them only has to dismiss it once. Do not prefix it per plugin.
	 *
	 * @since TBD
	 */
	public const DISMISSED_OPTION = 'nxs_wp_core_update_notice_dismissed';

	/**
	 * The query argument and nonce action carried by the dismiss link.
	 *
	 * @since TBD
	 */
	public const DISMISS_ACTION = 'kadence-blocks-dismiss-wp-core-update-notice';

	/**
	 * Store the shared dismissal flag when the notice's dismiss control is used.
	 *
	 * @since TBD
	 *
	 * @hook admin_init
	 *
	 * @return void
	 */
	public function handle_dismissal(): void {
		if ( ! isset( $_GET[ self::DISMISS_ACTION ] ) ) {
			return;
		}

		check_admin_referer( self::DISMISS_ACTION );

		if ( ! current_user_can( 'update_core' ) ) {
			return;
		}

		update_option( self::DISMISSED_OPTION, true, false );

		wp_safe_redirect( remove_query_arg( [ self::DISMISS_ACTION, '_wpnonce' ] ) );

		exit;
	}

	/**
	 * Render the notice.
	 *
	 * @since TBD
	 *
	 * @hook admin_notices
	 *
	 * @return void
	 */
	public function render(): void {
		if ( ! current_user_can( 'update_core' ) || ! $this->should_display() ) {
			return;
		}

		/*
		 * The dismiss control is a link so the shared flag can be stored server side, without a
		 * script. "is-dismissible" supplies the positioning context the control needs, and core's
		 * makeNoticesDismissible() skips notices that already carry a .notice-dismiss, so it does
		 * not append a second, non-persisting button.
		 */
		printf(
			'<div class="notice notice-warning is-dismissible"><p><strong>%1$s</strong></p><p>%2$s</p><a href="%3$s" class="notice-dismiss" style="text-decoration:none;"><span class="screen-reader-text">%4$s</span></a></div>',
			esc_html__( 'Keep your site protected. Update to the latest version of WordPress.', 'kadence-blocks' ),
			esc_html__( 'Your site is running on an outdated version of WordPress, which can leave it vulnerable to security issues. To decrease your risk of exposure, please update your WordPress install to the latest version.', 'kadence-blocks' ),
			esc_url( $this->get_dismiss_url() ),
			esc_html__( 'Dismiss this notice.', 'kadence-blocks' )
		);
	}

	/**
	 * Whether a core update is available and the notice has not been dismissed.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function should_display(): bool {
		return ! $this->is_dismissed() && $this->is_core_update_available();
	}

	/**
	 * Whether the shared dismissal flag has been stored.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_dismissed(): bool {
		return (bool) get_option( self::DISMISSED_OPTION, false );
	}

	/**
	 * Whether WordPress is offering a core update for the installed version.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function is_core_update_available(): bool {
		if ( ! function_exists( 'get_core_updates' ) ) {
			require_once ABSPATH . 'wp-admin/includes/update.php';
		}

		$updates = get_core_updates( [ 'dismissed' => false ] );

		if ( empty( $updates ) || ! isset( $updates[0]->response ) ) {
			return false;
		}

		return 'upgrade' === $updates[0]->response;
	}

	/**
	 * The nonce-protected link that stores the shared dismissal flag.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function get_dismiss_url(): string {
		return wp_nonce_url( add_query_arg( self::DISMISS_ACTION, '1' ), self::DISMISS_ACTION );
	}
}
