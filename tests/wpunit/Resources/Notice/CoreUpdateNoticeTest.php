<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Notice;

use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\CoreUpdateNotice;
use Tests\Support\Classes\TestCase;

/**
 * Covers this plugin's integration with stellarwp/core-update-notice: that the shared dismissal
 * flag is honoured, that the notice is gated on the update_core capability, and that the copy
 * passed in from Notice_Provider reaches the output.
 */
final class CoreUpdateNoticeTest extends TestCase {

	private CoreUpdateNotice $notice;

	protected function setUp(): void {
		parent::setUp();

		require_once ABSPATH . 'wp-admin/includes/update.php';

		$this->notice = new CoreUpdateNotice();
	}

	protected function tearDown(): void {
		delete_option( CoreUpdateNotice::DISMISSED_OPTION );
		delete_site_transient( 'update_core' );
		unset( $GLOBALS['nx_wp_core_update_notice_rendered'] );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function test_it_displays_when_a_core_update_is_available(): void {
		$this->set_core_update_response( 'upgrade' );

		$this->assertTrue( $this->notice->shouldDisplay() );
	}

	public function test_it_does_not_display_when_core_is_up_to_date(): void {
		$this->set_core_update_response( 'latest' );

		$this->assertFalse( $this->notice->shouldDisplay() );
	}

	public function test_it_does_not_display_when_core_update_data_is_missing(): void {
		$this->assertFalse( $this->notice->shouldDisplay() );
	}

	/**
	 * The dismissal flag is shared with the other plugins carrying this notice, so a value written
	 * by any of them suppresses it here as well.
	 */
	public function test_it_does_not_display_once_the_shared_dismissal_flag_is_set(): void {
		$this->set_core_update_response( 'upgrade' );

		update_option( CoreUpdateNotice::DISMISSED_OPTION, true, false );

		$this->assertFalse( $this->notice->shouldDisplay() );
	}

	public function test_it_renders_the_copy_and_a_dismiss_link(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->set_core_update_response( 'upgrade' );

		$output = $this->render();

		$this->assertStringContainsString(
			'Keep your site protected. Update to the latest version of WordPress.',
			$output
		);
		$this->assertStringContainsString( CoreUpdateNotice::DISMISS_ACTION, $output );
		$this->assertStringContainsString( '_wpnonce', $output );
	}

	public function test_it_renders_nothing_without_the_update_core_capability(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'editor' ] ) );

		$this->set_core_update_response( 'upgrade' );

		$this->assertSame( '', $this->render() );
	}

	/**
	 * Two plugins bundling the library must not print the notice twice.
	 */
	public function test_it_renders_only_once_per_request(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->set_core_update_response( 'upgrade' );

		$this->assertNotSame( '', $this->render() );

		ob_start();
		( new CoreUpdateNotice() )->render();

		$this->assertSame( '', (string) ob_get_clean() );
	}

	private function render(): string {
		ob_start();
		$this->notice->render();

		return (string) ob_get_clean();
	}

	/**
	 * Store the offer WordPress caches for the installed version. Only the properties
	 * get_core_updates() reads are set.
	 *
	 * @param string $response The update response WordPress reports for the installed version.
	 */
	private function set_core_update_response( string $response ): void {
		set_site_transient(
			'update_core',
			(object) [
				'updates' => [
					(object) [
						'response' => $response,
						'locale'   => 'en_US',
						'current'  => get_bloginfo( 'version' ),
					],
				],
			]
		);
	}
}
