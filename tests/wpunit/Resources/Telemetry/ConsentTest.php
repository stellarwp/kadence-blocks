<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Telemetry;

use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Opt_In_Template;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Status;
use KadenceWP\KadenceBlocks\Telemetry\Consent;
use RuntimeException;
use Tests\Support\Classes\TestCase;
use WPDieException;

final class ConsentTest extends TestCase {

	private Consent $consent;
	private Status $status;
	private string $slug;

	protected function setUp(): void {
		parent::setUp();

		$this->consent = $this->container->get( Consent::class );
		$this->status  = $this->container->get( Status::class );
		$this->slug    = Config::get_stellar_slug();

		// Opting in registers the site with the telemetry server, so keep it offline.
		add_filter(
			'pre_http_request',
			static function (): array {
				return [
					'response' => [ 'code' => 200 ],
					'body'     => '{}',
				];
			}
		);

		// Abort before the handler's exit.
		add_filter(
			'wp_redirect',
			static function (): void {
				throw new RuntimeException( 'redirected' );
			}
		);
	}

	protected function tearDown(): void {
		unset( $_POST[ Consent::get_field() ], $_REQUEST['_wpnonce'] );

		parent::tearDown();
	}

	/**
	 * Disabling after an opt-in turns the plugin's consent off and leaves the site inactive.
	 *
	 * @return void
	 */
	public function testItWithdrawsConsentAfterOptIn(): void {
		$this->status->set_status( true, $this->slug );

		$this->assertTrue( $this->consent->is_enabled() );

		$this->consent->disable();

		$this->assertFalse( $this->consent->is_enabled() );
		$this->assertSame( Status::STATUS_INACTIVE, $this->status->get() );
	}

	/**
	 * Enabling after a withdrawal turns the plugin's consent back on.
	 *
	 * @return void
	 */
	public function testItReEnablesSharingAfterWithdrawal(): void {
		$this->status->set_status( false, $this->slug );

		$this->assertFalse( $this->consent->is_enabled() );

		$this->consent->enable();

		$this->assertTrue( $this->consent->is_enabled() );
	}

	/**
	 * Enabling marks the opt-in prompt as already answered so it is not shown again.
	 *
	 * @return void
	 */
	public function testEnablingHidesTheOptInModal(): void {
		$option_name = $this->container->get( Opt_In_Template::class )->get_option_name( $this->slug );

		update_option( $option_name, '1' );

		$this->consent->enable();

		$this->assertSame( '0', get_option( $option_name ) );
	}

	/**
	 * An administrator submitting the form without the checkbox withdraws consent.
	 *
	 * @return void
	 */
	public function testAdminRequestWithoutTheFieldWithdrawsConsent(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->status->set_status( true, $this->slug );
		$_REQUEST['_wpnonce'] = wp_create_nonce( Consent::get_action() );

		try {
			$this->consent->handle_request();
			$this->fail( 'Expected a redirect.' );
		} catch ( RuntimeException $e ) {
			$this->assertSame( 'redirected', $e->getMessage() );
		}

		$this->assertFalse( $this->consent->is_enabled() );
	}

	/**
	 * An administrator submitting the form with the checkbox ticked enables sharing.
	 *
	 * @return void
	 */
	public function testAdminRequestWithTheFieldEnablesSharing(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->status->set_status( false, $this->slug );
		$_REQUEST['_wpnonce']          = wp_create_nonce( Consent::get_action() );
		$_POST[ Consent::get_field() ] = '1';

		try {
			$this->consent->handle_request();
			$this->fail( 'Expected a redirect.' );
		} catch ( RuntimeException $e ) {
			$this->assertSame( 'redirected', $e->getMessage() );
		}

		$this->assertTrue( $this->consent->is_enabled() );
	}

	/**
	 * An administrator submitting a field value other than '1' withdraws consent.
	 *
	 * @return void
	 */
	public function testAdminRequestWithAnUnexpectedFieldValueWithdrawsConsent(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->status->set_status( true, $this->slug );
		$_REQUEST['_wpnonce']          = wp_create_nonce( Consent::get_action() );
		$_POST[ Consent::get_field() ] = '';

		try {
			$this->consent->handle_request();
			$this->fail( 'Expected a redirect.' );
		} catch ( RuntimeException $e ) {
			$this->assertSame( 'redirected', $e->getMessage() );
		}

		$this->assertFalse( $this->consent->is_enabled() );
	}

	/**
	 * A user without manage_options is rejected and the stored consent is untouched.
	 *
	 * @return void
	 */
	public function testRequestWithoutManageOptionsChangesNothing(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'editor' ] ) );
		$this->status->set_status( true, $this->slug );
		$_REQUEST['_wpnonce'] = wp_create_nonce( Consent::get_action() );

		try {
			$this->consent->handle_request();
			$this->fail( 'Expected wp_die().' );
		} catch ( WPDieException $e ) {
			$this->assertTrue( $this->consent->is_enabled() );
		}
	}

	/**
	 * A request with an invalid nonce is rejected and the stored consent is untouched.
	 *
	 * @return void
	 */
	public function testRequestWithABadNonceChangesNothing(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->status->set_status( true, $this->slug );
		$_REQUEST['_wpnonce'] = 'invalid';

		try {
			$this->consent->handle_request();
			$this->fail( 'Expected wp_die().' );
		} catch ( WPDieException $e ) {
			$this->assertTrue( $this->consent->is_enabled() );
		}
	}
}
