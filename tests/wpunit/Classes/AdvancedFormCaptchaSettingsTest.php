<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Form_Captcha_Settings;
use Tests\wpunit\KadenceBlocksTestCase;

class AdvancedFormCaptchaSettingsTest extends KadenceBlocksTestCase {
	protected $classInstance;

	protected function _before()
	{
	}

	protected function _after()
	{
	}

	public function testIsUsingKadenceCaptchaSettings() {
		$attributes = [ 'useKcSettings' => null ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertFalse($captchaSettings->using_kadence_captcha);

		$attributes = [ 'useKcSettings' => true ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertTrue($captchaSettings->using_kadence_captcha);
	}

	public function testIsUsingKadenceBlocksSettings() {
		$attributes = [];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertTrue($captchaSettings->using_kadence_blocks_settings);

		$attributes = [ 'useKbSettings' => true ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertTrue($captchaSettings->using_kadence_blocks_settings);

		$attributes = [ 'useKbSettings' => false ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertFalse($captchaSettings->using_kadence_blocks_settings);
	}

	public function testBlankDefaults() {
		$attributes = [];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals('googlev2', $captchaSettings->service);
	}

	public function testGetCaptchaService() {
		// Default to googlev2
		$attributes = [ 'type' => '' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals('googlev2', $captchaSettings->service);

		// Test turnstile
		$attributes = [ 'type' => 'turnstile' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals('turnstile', $captchaSettings->service);

		// Test googlev3
		$attributes = [ 'type' => 'googlev3' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals('googlev3', $captchaSettings->service);

	}

	public function testGetPublicKey () {
		// Using Block settings
		$attributes = [ 'type' => '', 'useKbSettings' => false, 'recaptchaSiteKey' => 'my_recaptchaSiteKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_recaptchaSiteKey', $captchaSettings->public_key);

		$attributes = [ 'type' => 'turnstile', 'useKbSettings' => false, 'turnstileSiteKey' => 'my_turnstileSiteKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_turnstileSiteKey', $captchaSettings->public_key);

		$attributes = [ 'type' => 'hcaptcha', 'useKbSettings' => false, 'hCaptchaSiteKey' => 'hCaptchaSiteKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'hCaptchaSiteKey', $captchaSettings->public_key);

		// Using using_kadence_blocks_settings settings
		add_option( 'kadence_blocks_recaptcha_site_key', 'my_option_recaptchaSiteKey' );
		$attributes = [ 'type' => 'googlev3', 'useKbSettings' => true, 'recaptchaSiteKey' => 'my_recaptchaSiteKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_option_recaptchaSiteKey', $captchaSettings->public_key);

		update_option( 'kadence_blocks_turnstile_site_key', 'my_option_turnstileSiteKey' );

		$attributes = [ 'type' => 'turnstile', 'useKbSettings' => true ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_option_turnstileSiteKey', $captchaSettings->public_key);

		update_option( 'kadence_blocks_hcaptcha_site_key', 'my_option_hcaptchaSiteKey' );

		$attributes = [ 'type' => 'hcaptcha', 'useKbSettings' => true ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_option_hcaptchaSiteKey', $captchaSettings->public_key);
	}

	public function testGetPrivateKey () {
		// Using Block settings
		$attributes = [ 'type' => '',  'useKbSettings' => false, 'recaptchaSecretKey' => 'my_recaptchaSecretKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_recaptchaSecretKey', $captchaSettings->secret_key);

		$attributes = [ 'type' => 'turnstile',  'useKbSettings' => false, 'turnstileSecretKey' => 'my_turnstileSecretKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_turnstileSecretKey', $captchaSettings->secret_key);

		$attributes = [ 'type' => 'hcaptcha', 'useKbSettings' => false, 'hCaptchaSecretKey' => 'hCaptchaSecretKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'hCaptchaSecretKey', $captchaSettings->secret_key);

		// Using using_kadence_blocks_settings settings
		add_option( 'kadence_blocks_recaptcha_secret_key', 'my_option_recaptchaSecretKey' );
		$attributes = [ 'type' => 'googlev3', 'useKbSettings' => true, 'recaptchaSecretKey' => 'my_recaptchaSecretKey' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_option_recaptchaSecretKey', $captchaSettings->secret_key);

		update_option( 'kadence_blocks_turnstile_secret_key', 'my_option_turnstileSecretKey' );

		$attributes = [ 'type' => 'turnstile', 'useKbSettings' => true ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_option_turnstileSecretKey', $captchaSettings->secret_key);

		update_option( 'kadence_blocks_hcaptcha_secret_key', 'my_option_hcaptchaSecretKey' );

		$attributes = [ 'type' => 'hcaptcha', 'useKbSettings' => true ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'my_option_hcaptchaSecretKey', $captchaSettings->secret_key);
	}

	public function testGetLanguage() {
		// Using Block settings
		$attributes = [ 'type' => '', 'recaptchaLanguage' => 'fr' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'fr', $captchaSettings->language);

		// Using global settings
		add_option( 'kadence_blocks_recaptcha_language', 'es' );
		$attributes = [ 'type' => 'googlev3', 'useKbSettings' => true, 'recaptchaLanguage' => 'fr' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'es', $captchaSettings->language);
	}

	public function testGetStyles() {
		$attributes = [ 'theme' => '', 'size' => '' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'normal', $captchaSettings->size);
		$this->assertEquals( 'light', $captchaSettings->theme);

		$attributes = [ 'theme' => 'dark', 'size' => 'lg' ];
		$captchaSettings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->assertEquals( 'lg', $captchaSettings->size);
		$this->assertEquals( 'dark', $captchaSettings->theme);
	}

}
