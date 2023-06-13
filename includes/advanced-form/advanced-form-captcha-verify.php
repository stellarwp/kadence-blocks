<?php

/**
 * Class for verifying captcha submissions from advanced form block.
 */
class Kadence_Blocks_Form_Captcha_Verify {

	/**
	 * @var Kadence_Blocks_Form_Captcha_Settings
	 */
	private $captcha_settings;

	public function __construct( $captcha_settings ) {
		$this->captcha_settings = $captcha_settings;
	}

	public function verify_google( $token ) {
		return $this->verify_generic( $token, 'https://www.google.com/recaptcha/api/siteverify' );
	}

	public function verify_turnstile( $token = '' ) {
		return $this->verify_generic( $token, 'https://challenges.cloudflare.com/turnstile/v0/siteverify' );
	}

	public function verify_hcaptcha( $token ) {
		return $this->verify_generic( $token, 'https://api.hcaptcha.com/siteverify' );
	}

	/**
	 * Check Recaptcha
	 *
	 * @param string $token Recaptcha token.
	 * @param string $url   API endpoint for verification.
	 *
	 * @return bool
	 */
	private function verify_generic( $token, $url ) {
		$secret = $this->captcha_settings->secret_key;

		$args           = array(
			'body' => array(
				'secret'   => $secret,
				'response' => $token,
				'remoteip' => $_SERVER['REMOTE_ADDR']
			),
		);
		$verify_request = wp_remote_post( $url, $args );
		if ( is_wp_error( $verify_request ) ) {
			return false;
		}
		$response = wp_remote_retrieve_body( $verify_request );
		if ( is_wp_error( $response ) ) {
			return false;
		}
		$response = json_decode( $response, true );

		return isset( $response['success'] ) ? $response['success'] : false;
	}
}
