<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Notice;

use KadenceWP\KadenceBlocks\Notice\Core_Update_Notice;
use Tests\Support\Classes\TestCase;

final class CoreUpdateNoticeTest extends TestCase {

	private Core_Update_Notice $notice;

	protected function setUp(): void {
		parent::setUp();

		require_once ABSPATH . 'wp-admin/includes/update.php';

		$this->notice = $this->container->get( Core_Update_Notice::class );
	}

	protected function tearDown(): void {
		delete_option( Core_Update_Notice::DISMISSED_OPTION );
		delete_site_transient( 'update_core' );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function test_it_displays_when_a_core_update_is_available(): void {
		$this->set_core_update_response( 'upgrade' );

		$this->assertTrue( $this->notice->should_display() );
	}

	public function test_it_does_not_display_when_core_is_up_to_date(): void {
		$this->set_core_update_response( 'latest' );

		$this->assertFalse( $this->notice->should_display() );
	}

	public function test_it_does_not_display_when_core_update_data_is_missing(): void {
		$this->assertFalse( $this->notice->should_display() );
	}

	/**
	 * The dismissal flag is shared with the other StellarWP plugins, so a value written by any of
	 * them suppresses the notice here as well.
	 */
	public function test_it_does_not_display_once_the_shared_dismissal_flag_is_set(): void {
		$this->set_core_update_response( 'upgrade' );

		update_option( Core_Update_Notice::DISMISSED_OPTION, true, false );

		$this->assertFalse( $this->notice->should_display() );
	}

	public function test_it_renders_the_copy_and_a_dismiss_link(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->set_core_update_response( 'upgrade' );

		ob_start();
		$this->notice->render();
		$output = (string) ob_get_clean();

		$this->assertStringContainsString(
			'Keep your site protected. Update to the latest version of WordPress.',
			$output
		);
		$this->assertStringContainsString( Core_Update_Notice::DISMISS_ACTION, $output );
		$this->assertStringContainsString( '_wpnonce', $output );
	}

	public function test_it_renders_nothing_without_the_update_core_capability(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'editor' ] ) );

		$this->set_core_update_response( 'upgrade' );

		ob_start();
		$this->notice->render();

		$this->assertSame( '', (string) ob_get_clean() );
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
