<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Notice;

use KadenceWP\KadenceBlocks\Notice\Is_Plugin_Admin_Screen;
use Tests\Support\Classes\TestCase;

/**
 * The core update notice is limited to this plugin's own screens, so this decides where it appears.
 */
final class IsPluginAdminScreenTest extends TestCase {

	private Is_Plugin_Admin_Screen $is_plugin_admin_screen;

	protected function setUp(): void {
		parent::setUp();

		require_once ABSPATH . 'wp-admin/includes/screen.php';

		$this->is_plugin_admin_screen = $this->container->get( Is_Plugin_Admin_Screen::class );
	}

	/**
	 * @dataProvider plugin_screen_provider
	 */
	public function test_it_identifies_this_plugins_screens( string $screen_id, string $post_type ): void {
		$this->set_screen( $screen_id, $post_type );

		$this->assertTrue( ( $this->is_plugin_admin_screen )() );
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

		$this->assertFalse( ( $this->is_plugin_admin_screen )() );
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

		$this->assertFalse( ( $this->is_plugin_admin_screen )() );
	}

	/**
	 * WordPress derives post_type from these screen IDs on its own, verified against core, so the
	 * expected value is asserted rather than forced.
	 */
	private function set_screen( string $screen_id, string $post_type ): void {
		set_current_screen( $screen_id );

		$this->assertSame( $post_type, get_current_screen()->post_type );
	}
}
