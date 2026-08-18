<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Notice;

use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\CoreUpdateNotice;
use Tests\Support\Classes\TestCase;

/**
 * Covers this plugin's integration with stellarwp/core-update-notice: that the container hands back
 * the notice carrying this plugin's copy, and that the shared dismissal state is honoured.
 */
final class CoreUpdateNoticeTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();

		require_once ABSPATH . 'wp-admin/includes/update.php';
	}

	protected function tearDown(): void {
		delete_option( CoreUpdateNotice::DISMISSED_OPTION );
		delete_site_transient( 'update_core' );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function test_the_container_builds_the_notice_with_this_plugins_copy(): void {
		$notice = $this->container->get( CoreUpdateNotice::class );

		$this->assertInstanceOf( CoreUpdateNotice::class, $notice );
		$this->assertSame( $notice, $this->container->get( CoreUpdateNotice::class ) );

		$copy = new \ReflectionProperty( CoreUpdateNotice::class, 'copy' );
		$copy->setAccessible( true );

		$this->assertSame(
			__( 'Keep your site protected. Update to the latest version of WordPress.', 'kadence-blocks' ),
			$copy->getValue( $notice )['heading']
		);
	}

	public function test_the_notice_displays_while_an_update_is_offered_and_not_dismissed(): void {
		$this->set_core_update_response( 'upgrade', '9.9' );

		$this->assertTrue( ( new CoreUpdateNotice() )->shouldDisplay() );
	}

	public function test_the_notice_does_not_display_when_core_is_current(): void {
		$this->set_core_update_response( 'latest', '9.9' );

		$this->assertFalse( ( new CoreUpdateNotice() )->shouldDisplay() );
	}

	/**
	 * The dismissal set is shared with the other plugins carrying this package, so a value written
	 * by any of them suppresses it here as well.
	 */
	public function test_it_honours_a_dismissal_written_by_another_plugin(): void {
		$this->set_core_update_response( 'upgrade', '9.9' );

		update_option( CoreUpdateNotice::DISMISSED_OPTION, [ '9.9' => true ], false );

		$this->assertFalse( ( new CoreUpdateNotice() )->shouldDisplay() );
	}

	/**
	 * Dismissals are keyed per version, so silencing one release must not silence another.
	 */
	public function test_a_dismissal_for_one_release_does_not_hide_another(): void {
		update_option( CoreUpdateNotice::DISMISSED_OPTION, [ '9.9' => true ], false );

		$this->set_core_update_response( 'upgrade', '9.8.1' );

		$this->assertTrue( ( new CoreUpdateNotice() )->shouldDisplay() );
	}

	/**
	 * Store the offer WordPress caches for the installed version. Only the properties
	 * get_core_updates() reads are set.
	 */
	private function set_core_update_response( string $response, string $offered ): void {
		set_site_transient(
			'update_core',
			(object) [
				'updates' => [
					(object) [
						'response' => $response,
						'locale'   => 'en_US',
						'current'  => $offered,
					],
				],
			]
		);
	}
}
