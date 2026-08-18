<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Notice;

use KadenceWP\KadenceBlocks\Notice\Notice_Provider;
use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\CoreUpdateNotice;
use Tests\Support\Classes\TestCase;

/**
 * Covers this plugin's integration with stellarwp/core-update-notice: that the notice is limited to
 * this plugin's own admin screens, and that the shared dismissal state is honoured.
 */
final class CoreUpdateNoticeTest extends TestCase {

	private Notice_Provider $provider;

	protected function setUp(): void {
		parent::setUp();

		require_once ABSPATH . 'wp-admin/includes/update.php';
		require_once ABSPATH . 'wp-admin/includes/screen.php';

		$this->provider = new Notice_Provider( $this->container );
	}

	protected function tearDown(): void {
		delete_option( CoreUpdateNotice::DISMISSED_OPTION );
		delete_site_transient( 'update_core' );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	/**
	 * @dataProvider plugin_screen_provider
	 */
	public function test_it_identifies_this_plugins_screens( string $screen_id, string $post_type ): void {
		$this->set_screen( $screen_id, $post_type );

		$this->assertTrue( $this->provider->is_plugin_admin_screen() );
	}

	/**
	 * @return array<string, array{string, string}>
	 */
	public function plugin_screen_provider(): array {
		return [
			'settings page' => [ 'toplevel_page_kadence-blocks', '' ],
			'home page'     => [ 'kadence_page_kadence-blocks-home', '' ],
			'forms list'    => [ 'edit-kadence_form', 'kadence_form' ],
			'form editor'   => [ 'kadence_form', 'kadence_form' ],
			'navigation'    => [ 'edit-kadence_navigation', 'kadence_navigation' ],
			'header editor' => [ 'kadence_header', 'kadence_header' ],
		];
	}

	/**
	 * @dataProvider foreign_screen_provider
	 */
	public function test_it_rejects_screens_it_does_not_own( string $screen_id, string $post_type ): void {
		$this->set_screen( $screen_id, $post_type );

		$this->assertFalse( $this->provider->is_plugin_admin_screen() );
	}

	/**
	 * @return array<string, array{string, string}>
	 */
	public function foreign_screen_provider(): array {
		return [
			'dashboard'                => [ 'dashboard', '' ],
			'plugins'                  => [ 'plugins', '' ],
			'posts list'               => [ 'edit-post', 'post' ],
			'another plugin settings'  => [ 'toplevel_page_some-other-plugin', '' ],
			// Registered with show_in_menu false, so not a screen the Kadence menu links to.
			'lottie, hidden from menu' => [ 'edit-kadence_lottie', 'kadence_lottie' ],
			'vector, hidden from menu' => [ 'kadence_vector', 'kadence_vector' ],
		];
	}

	public function test_it_reports_a_front_end_request_as_not_ours(): void {
		set_current_screen( 'front' );

		$this->assertFalse( $this->provider->is_plugin_admin_screen() );
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
	 * WordPress derives post_type from these screen IDs on its own, verified against core, so the
	 * expected value is asserted rather than forced.
	 */
	private function set_screen( string $screen_id, string $post_type ): void {
		set_current_screen( $screen_id );

		$this->assertSame( $post_type, get_current_screen()->post_type );
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
