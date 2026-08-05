<?php
/**
 * Approve design library locations the editor could not load.
 *
 * CSpell:ignore unslash
 *
 * @package Kadence Blocks
 */

use KadenceWP\KadenceBlocks\Traits\API_Url_Trait;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Lets a site manager approve a design library location.
 *
 * @since 3.7.9
 */
class Kadence_Blocks_Library_Locations {

	use API_Url_Trait;

	/**
	 * The admin-post action.
	 *
	 * @since 3.7.9
	 */
	const ACTION = 'kadence_blocks_library_location';

	/**
	 * Instance of this class
	 *
	 * @since 3.7.9
	 *
	 * @var null|Kadence_Blocks_Library_Locations
	 */
	private static $instance = null;

	/**
	 * Instance Control
	 *
	 * @since 3.7.9
	 *
	 * @return self
	 */
	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Class Constructor.
	 *
	 * @since 3.7.9
	 */
	public function __construct() {
		add_action( 'admin_notices', [ $this, 'render_notice' ] );
		add_action( 'admin_post_' . self::ACTION, [ $this, 'handle_decision' ] );
	}

	/**
	 * The recorded locations that are still not allowed.
	 *
	 * @since 3.7.9
	 *
	 * @return string[]
	 */
	private function get_pending_library_urls(): array {
		$blocked = $this->get_blocked_library_urls();

		if ( empty( $blocked ) ) {
			return [];
		}

		$allowed = $this->get_allowed_library_urls();

		return array_values(
			array_filter(
				$blocked,
				function ( string $url ) use ( $allowed ): bool {
					return ! $this->url_host_matches( $url, $allowed );
				}
			)
		);
	}

	/**
	 * The link that carries a decision about a location.
	 *
	 * @since 3.7.9
	 *
	 * @param string $url      The library URL.
	 * @param string $decision Either approve or dismiss.
	 *
	 * @return string
	 */
	private function get_decision_url( string $url, string $decision ): string {
		return wp_nonce_url(
			add_query_arg(
				[
					'action'   => self::ACTION,
					'decision' => $decision,
					'url'      => rawurlencode( $url ),
				],
				admin_url( 'admin-post.php' )
			),
			self::ACTION
		);
	}

	/**
	 * Ask about the locations the editor could not load.
	 *
	 * @since 3.7.9
	 *
	 * @return void
	 */
	public function render_notice(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		foreach ( $this->get_pending_library_urls() as $url ) {
			printf(
				'<div class="notice notice-warning"><p>%1$s</p><p><a href="%2$s" class="button button-primary">%3$s</a> <a href="%4$s" class="button">%5$s</a></p></div>',
				sprintf(
					/* translators: %s: the library address. */
					esc_html__( 'Kadence Blocks did not load a design library from %s because the address is not approved on this site.', 'kadence-blocks' ),
					'<strong>' . esc_html( $this->url_host( $url ) ) . '</strong>'
				),
				esc_url( $this->get_decision_url( $url, 'approve' ) ),
				esc_html__( 'Approve this location', 'kadence-blocks' ),
				esc_url( $this->get_decision_url( $url, 'dismiss' ) ),
				esc_html__( 'Dismiss', 'kadence-blocks' )
			);
		}
	}

	/**
	 * Store the decision about a location.
	 *
	 * @since 3.7.9
	 *
	 * @return void
	 */
	public function handle_decision(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to approve design library locations.', 'kadence-blocks' ), '', [ 'response' => 403 ] );
		}

		check_admin_referer( self::ACTION );

		// Not escaped as a URL, so it still matches the stored value exactly.
		$url      = isset( $_GET['url'] ) ? sanitize_text_field( wp_unslash( $_GET['url'] ) ) : '';
		$decision = isset( $_GET['decision'] ) ? sanitize_key( wp_unslash( $_GET['decision'] ) ) : '';
		$blocked  = $this->get_blocked_library_urls();

		if ( in_array( $url, $blocked, true ) ) {
			if ( 'approve' === $decision ) {
				$approved   = $this->get_approved_library_urls();
				$approved[] = $url;

				update_option( 'kadence_blocks_approved_library_urls', array_values( array_unique( $approved ) ), false );
			}

			update_option( 'kadence_blocks_blocked_library_urls', array_values( array_diff( $blocked, [ $url ] ) ), false );
		}

		$referer = wp_get_referer();

		wp_safe_redirect( $referer ? $referer : admin_url() );
		exit;
	}
}
Kadence_Blocks_Library_Locations::get_instance();
