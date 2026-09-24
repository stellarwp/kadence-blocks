<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\ClassicFeatures;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Header_Block;
use Kadence_Blocks_Header_CPT_Controller;
use Kadence_Blocks_Post_Rest_Controller;
use ReflectionMethod;
use WP_Admin_Bar;
use WP_REST_Request;

/**
 * Covers the plugin's use of Kadence theme settings: the per-post transparent
 * header, the Customizer header choice and the archive category colors. They
 * have no Global Styles replacement, so the plugin uses them in both modes.
 */
final class ThemeSettingsTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testClassicReadsThePostTransparentHeaderSetting(): void {
		$post_id = $this->post_with_transparent_header();

		$this->assertSame( 'enable', $this->transparent_postmeta_setting( $post_id ) );
	}

	public function testFseModeReadsThePostTransparentHeaderSetting(): void {
		$post_id = $this->post_with_transparent_header();
		$this->tester->enable_fse_mode();

		$this->assertSame( 'enable', $this->transparent_postmeta_setting( $post_id ) );
	}

	public function testClassicLabelsTheCustomizerHeader(): void {
		$header = $this->customizer_header();

		$states = Kadence_Blocks_Header_CPT_Controller::get_instance()->add_display_post_states( [], $header );

		$this->assertArrayHasKey( 'kb_post_for_header', $states );
	}

	public function testFseModeLabelsTheCustomizerHeader(): void {
		$header = $this->customizer_header();
		$this->tester->enable_fse_mode();

		$states = Kadence_Blocks_Header_CPT_Controller::get_instance()->add_display_post_states( [], $header );

		$this->assertArrayHasKey( 'kb_post_for_header', $states );
	}

	public function testClassicAdminBarShowsTheCustomizerHeader(): void {
		$this->customizer_header();

		$this->assertNotNull( $this->headers_admin_bar()->get_node( 'kadence-header-current' ) );
	}

	public function testFseModeAdminBarShowsTheCustomizerHeader(): void {
		$this->customizer_header();
		$this->tester->enable_fse_mode();

		$this->assertNotNull( $this->headers_admin_bar()->get_node( 'kadence-header-current' ) );
	}

	public function testClassicPostsResponseCarriesTheArchiveCategoryColors(): void {
		$data = $this->posts_response_item();

		$this->assertArrayHasKey( 'kt_archive_item_category_color', $data );
		$this->assertSame( '#a1b2c3', $data['category_info'][0]->archive_category_color );
	}

	public function testFseModePostsResponseCarriesTheArchiveCategoryColors(): void {
		$this->tester->enable_fse_mode();

		$data = $this->posts_response_item();

		$this->assertArrayHasKey( 'kt_archive_item_category_color', $data );
		$this->assertSame( '#a1b2c3', $data['category_info'][0]->archive_category_color );
	}

	private function post_with_transparent_header(): int {
		$post_id = self::factory()->post->create();
		update_post_meta( $post_id, '_kad_post_transparent', 'enable' );

		return $post_id;
	}

	private function transparent_postmeta_setting( int $post_id ): ?string {
		$method = new ReflectionMethod( Kadence_Blocks_Header_Block::class, 'transparent_postmeta_setting' );
		$method->setAccessible( true );

		return $method->invoke( Kadence_Blocks_Header_Block::get_instance(), [ 'inheritPostTransparent' => true ], $post_id );
	}

	/**
	 * Creates a header post and selects it as the theme header in the Customizer.
	 *
	 * @return \WP_Post
	 */
	private function customizer_header(): \WP_Post {
		$header = self::factory()->post->create_and_get( [ 'post_type' => 'kadence_header' ] );
		set_theme_mod( 'blocks_header', true );
		set_theme_mod( 'blocks_header_id', $header->ID );

		return $header;
	}

	private function headers_admin_bar(): WP_Admin_Bar {
		require_once ABSPATH . WPINC . '/class-wp-admin-bar.php';
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		update_option( 'kadence_blocks_admin_bar_settings', [ 'show_headers_in_admin_bar' => 'true' ] );
		$admin_bar = new WP_Admin_Bar();

		Kadence_Blocks_Header_CPT_Controller::get_instance()->top_headers_admin_bar( $admin_bar );

		return $admin_bar;
	}

	/**
	 * The posts endpoint's data for a post in a category with a theme archive color.
	 *
	 * @return array<string, mixed>
	 */
	private function posts_response_item(): array {
		$category_id = self::factory()->category->create();
		update_term_meta( $category_id, 'archive_category_color', '#a1b2c3' );
		$post = self::factory()->post->create_and_get( [ 'post_category' => [ $category_id ] ] );

		return ( new Kadence_Blocks_Post_Rest_Controller() )->prepare_query_item_for_response( $post, new WP_REST_Request() );
	}
}
