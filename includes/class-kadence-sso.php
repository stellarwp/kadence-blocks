<?php

class Kadence_Blocks_SSO {

	protected $auth_url = 'http://auth-site.local/sample-page/';

	public function __construct() {
	}

	public function get_auth_url() {
		$parameters = array(
			'callback' => home_url( '/wp-admin/admin.php?page=kadence-blocks' ),
			'home_url' => home_url(),
			'hash'     => $this->get_hash(),
		);

		return $this->auth_url . '?' . http_build_query( $parameters );
	}

	public function get_hash() {
		$password = get_option( 'kadence_blocks_sso_password' );

		if ( $password === false || ( ! empty( $password['expire'] ) && $password['expire'] < time() ) ) {
			$password = $this->generate_password();
		}

		return wp_hash( get_current_user_id() . $password['password'] );
	}

	/**
	 * Generates new SSO password
	 *
	 * @return mixed
	 */
	private function generate_password() {
		$password = wp_generate_password( 16 );
		$expire   = time() + 1800;

		$password_array = array(
			'password' => $password,
			'expire'   => $expire,
		);

		update_option( 'kadence_blocks_sso_password', $password_array );

		return $password_array;
	}

	public function validate_hash( $provided_hash ) {
		return hash_equals( $this->get_hash(), $provided_hash );
	}
}
