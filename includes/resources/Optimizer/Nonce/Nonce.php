<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Nonce;

/**
 * Custom nonce implementation for when the optimizer is running.
 */
final class Nonce {

	/**
	 * Random negative ID to never clash with a possible existing
	 * WordPress user ID.
	 */
	public const NONCE_ID = -1223685899;

	private string $action;

	/**
	 * @param string $action The nonce action for the optimizer.
	 */
	public function __construct( string $action = 'kb-optimizer' ) {
		$this->action = $action;
	}

	/**
	 * Create a nonce for use for a logged-out user, even if the user is logged in.
	 *
	 * @return string
	 */
	public function create(): string {
		$uid = get_current_user_id();
		wp_set_current_user( 0 );
		$nonce = wp_create_nonce( $this->action );
		wp_set_current_user( $uid );

		return $nonce;
	}

	/**
	 * Verify the nonce as a logged-out user and then restore the original user.
	 *
	 * @param string $nonce The nonce value.
	 *
	 * @return false|int
	 */
	public function verify( string $nonce ) {
		$uid = get_current_user_id();
		wp_set_current_user( 0 );
		$verified = wp_verify_nonce( $nonce, $this->action );
		wp_set_current_user( $uid );

		return $verified;
	}

	/**
	 * Customize the nonce ID in order to generate a unique nonce value for just this action.
	 *
	 * This way, it's not shared with all logged-out users.
	 *
	 * @filter nonce_user_logged_out
	 *
	 * @param int        $uid The current user ID.
	 * @param string|int $action The nonce action.
	 *
	 * @return int
	 */
	public function customize_nonce_id( int $uid, $action ): int {
		if ( 0 !== $uid || $action !== $this->action ) {
			return $uid;
		}

		return self::NONCE_ID;
	}
}
