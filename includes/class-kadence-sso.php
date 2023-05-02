<?php

require( 'stellar-license-sso.php' );

class Kadence_License_SSO extends Stellar_License_SSO {

	protected $auth_url = 'http://auth-site.local/license';

	protected $callback_path = '/wp-admin/admin.php?page=kadence-blocks';

	protected $password_option_name = 'kadence_blocks_sso_password';

	protected $product_name = 'kadence-blocks';

	public function save_license_key( $key ) {

		/* Plugin specific code to save license key, activate items, etc. */

		return true;
	}

	public function invalid_hash() {
		$message = __( 'Unable to license site. Invalid Hash.', 'kadence-blocks' );
		printf( '<div class="notice notice-error"><p>%1$s</p></div>', esc_html( $message ) );
	}

	public function license_successful() {
		$message = __( 'Site licensed successfully!', 'kadence-blocks' );
		printf( '<div class="notice notice-success"><p>%1$s</p></div>', esc_html( $message ) );
	}


}
