<?php

abstract class Stellar_License_SSO {

	/**
	 * URL on commerce site where authentication is handled
	 * Example: https://kadencewp.com/license
	 *
	 * @var string
	 */
	protected $auth_url;

	/**
	 * Where are redirected once authenticated on commerce site
	 * Example: /wp-admin/admin.php?page=kadence-blocks
	 *
	 * @var string
	 */
	protected $callback_path;

	/**
	 * @var string Product name
	 */
	protected $product_name;

	/**
	 * What key to use for storing generated password/expiration in options table
	 *
	 * @var string
	 */
	protected $password_option_name = 'stellarwp_sso_password';

	/**
	 * How long a generated password is valid
	 *
	 * @var int
	 */
	protected $password_expiration = 1800;

	/**
	 * How long before expiration to generate a new password.
	 * This is to account for password resets or other slowdowns the user
	 * encounters when authenticating on the commerce site.
	 *
	 * @var int
	 */
	protected $password_expiration_buffer = 300;

	/**
	 * Plugin specific method to save license key, perform actions, etc.
	 *
	 * @param $key
	 *
	 * @return boolean
	 */
	abstract protected function save_license_key( $key );

	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init() {
		if ( is_admin() ) {
			$this->auth_callback();
		}
	}

	public function get_auth_url() {
		$callback_url = home_url( add_query_arg( 'stellar_product', $this->product_name, add_query_arg( 'hash', $this->get_hash(), $this->callback_path ) ) );

		$parameters = array(
			'callback' => $callback_url,
			'home_url' => home_url(),
			'hash'     => $this->get_hash()
		);

		return $this->auth_url . '?' . http_build_query( $parameters );
	}

	public function invalid_hash() {
		$message = __( 'Unable to license site. Invalid hash.', 'kadence-blocks' );
		printf( '<div class="notice notice-error"><p>%1$s</p></div>', esc_html( $message ) );
	}

	public function invalid_license_key() {
		$message = __( 'Unable to license site. Invalid license key.', 'kadence-blocks' );
		printf( '<div class="notice notice-error"><p>%1$s</p></div>', esc_html( $message ) );
	}

	public function license_successful() {
		$message = __( 'Site licensed successfully!', 'kadence-blocks' );
		printf( '<div class="notice notice-success"><p>%1$s</p></div>', esc_html( $message ) );
	}

	/**
	 * Check if license key and hash were returned. Pass this license key to
	 *
	 * @return void
	 */
	private function auth_callback() {
		$hash         = ! empty( $_GET['hash'] ) ? $_GET['hash'] : '';
		$license_key  = ! empty( $_GET['license_key'] ) ? $_GET['license_key'] : '';
		$product_name = ! empty( $_GET['stellar_product'] ) ? $_GET['stellar_product'] : '';

		if ( empty( $product_name ) || $this->product_name !== $product_name || empty( $hash ) || empty( $license_key ) ) {
			return;
		}

		if ( ! $this->validate_hash( $hash ) ) {
			add_action( 'admin_notices', array( $this, 'invalid_hash' ) );

			return;
		}

		/* Save license key */
		if ( $this->save_license_key( $license_key, $product_name ) ) {

			add_action( 'admin_notices', array( $this, 'license_successful' ) );
			delete_option( $this->password_option_name );
		} else {
			add_action( 'admin_notices', array( $this, 'invalid_license_key' ) );
		}
	}

	/**
	 * @param $hash
	 *
	 * @return bool
	 */
	private function validate_hash( $hash ) {
		return hash_equals( $this->get_hash( false ), $hash );
	}

	/**
	 * Get the current hash
	 *
	 * @param $allow_refresh boolean Allow refreshing the password, if expired
	 *
	 * @return string
	 */
	private function get_hash( $allow_refresh = true ) {
		$password = get_option( $this->password_option_name, '' );

		/* If not set or expires within next 5 minutes, regenerate password */
		if ( $allow_refresh && ( $password === '' || ( ! empty( $password['expire'] ) && $password['expire'] < ( time() - $this->password_expiration_buffer ) ) ) ) {
			$password = $this->generate_password();
		}

		return wp_hash( get_current_user_id() . $password['password'] );
	}

	/**
	 * Generates new SSO password
	 *
	 * @return array
	 */
	private function generate_password() {
		$password = wp_generate_password( 16 );
		$expire   = time() + $this->password_expiration;

		$password_array = array(
			'password' => $password,
			'expire'   => $expire,
		);

		update_option( $this->password_option_name, $password_array );

		return $password_array;
	}
}
