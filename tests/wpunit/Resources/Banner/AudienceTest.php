<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Banner;

use Kadence_Blocks;
use KadenceWP\KadenceBlocks\Banner\Audience;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Register;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Resources\Collection;
use Tests\Support\Classes\TestCase;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_container;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_resource;

final class AudienceTest extends TestCase {

	/**
	 * Uplink resources the test registered.
	 *
	 * @var string[]
	 */
	private array $registered = [];

	/**
	 * HTTP requests made while checking the audience.
	 */
	private int $requests = 0;

	/**
	 * Post types the test registered.
	 *
	 * @var string[]
	 */
	private array $post_types = [];

	private ?string $plugin_page;

	private ?string $pagenow;

	protected function setUp(): void {
		parent::setUp();

		$this->plugin_page = $GLOBALS['plugin_page'] ?? null;
		$this->pagenow     = $GLOBALS['pagenow'] ?? null;

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->on_page( 'kadence-blocks', 'toplevel_page_kadence-blocks' );
	}

	protected function tearDown(): void {
		foreach ( $this->registered as $slug ) {
			get_container()->get( Collection::class )->offsetUnset( $slug );
		}

		foreach ( $this->post_types as $post_type ) {
			unregister_post_type( $post_type );
		}

		if ( function_exists( 'uopz_unset_return' ) ) {
			uopz_unset_return( 'lw_harbor_is_product_license_active' );
		}

		$GLOBALS['plugin_page'] = $this->plugin_page;
		$GLOBALS['pagenow']     = $this->pagenow;
		set_current_screen( 'front' );

		parent::tearDown();
	}

	public function test_it_hides_the_banner_without_a_license(): void {
		$this->assertFalse( $this->audience()->should_display() );
	}

	public function test_it_shows_the_banner_with_a_nexcess_license(): void {
		$this->set_harbor_license( true );

		$this->assertTrue( $this->audience()->should_display() );
	}

	/**
	 * @dataProvider paid_plugins
	 */
	public function test_it_shows_the_banner_with_a_valid_paid_plugin_license( string $slug ): void {
		$this->store_license_status( $slug, 'valid' );

		$this->assertTrue( $this->audience()->should_display() );
	}

	/**
	 * @return array<string, string[]>
	 */
	public function paid_plugins(): array {
		return [
			'Blocks Pro'   => [ 'kadence-blocks-pro' ],
			'Creative Kit' => [ 'kadence-creative-kit' ],
		];
	}

	public function test_it_hides_the_banner_with_an_invalid_paid_plugin_license(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'invalid' );

		$this->assertFalse( $this->audience()->should_display() );
	}

	public function test_it_does_not_count_the_free_plugin_license(): void {
		$this->store_license_status( 'kadence-blocks', 'valid' );

		$this->assertFalse( $this->audience()->should_display() );
	}

	public function test_it_does_not_validate_a_license_remotely(): void {
		$this->register_resource( 'kadence-blocks-pro' );
		update_option( 'stellarwp_uplink_license_key_kadence-blocks-pro', 'a-key-with-no-stored-status' );

		add_filter( 'pre_http_request', [ $this, 'count_request' ] );

		$this->assertFalse( $this->audience()->should_display() );
		$this->assertSame( 0, $this->requests );

		remove_filter( 'pre_http_request', [ $this, 'count_request' ] );
	}

	/**
	 * Counts an HTTP request, and lets it through.
	 *
	 * @param mixed $response The short-circuited response, or false.
	 *
	 * @return mixed
	 */
	public function count_request( $response ) {
		++$this->requests;

		return $response;
	}

	/**
	 * @dataProvider pages
	 */
	public function test_it_shows_the_banner_on_kadence_menu_pages( string $page, string $screen ): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( $page, $screen );

		$this->assertTrue( $this->audience()->should_display() );
	}

	/**
	 * @return array<string, string[]>
	 */
	public function pages(): array {
		return [
			'Home'           => [ 'kadence-blocks-home', 'kadence_page_kadence-blocks-home' ],
			'Form Entries'   => [ 'kadence-blocks-entries', 'kadence_page_kadence-blocks-entries' ],
			'Form Analytics' => [ 'kadence-form-analytics', 'admin_page_kadence-form-analytics' ],
		];
	}

	/**
	 * @dataProvider post_types
	 */
	public function test_it_shows_the_banner_on_post_type_lists( string $post_type ): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->register_post_type( $post_type );
		$this->on_page( null, "edit-{$post_type}", 'edit.php' );

		$this->assertTrue( $this->audience()->should_display() );
	}

	/**
	 * @dataProvider post_types
	 */
	public function test_it_hides_the_banner_in_the_editor( string $post_type ): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->register_post_type( $post_type );
		$this->on_page( null, $post_type, 'post.php' );

		$this->assertFalse( $this->audience()->should_display() );
	}

	/**
	 * @return array<string, string[]>
	 */
	public function post_types(): array {
		return [
			'Forms'        => [ 'kadence_form' ],
			'Headers'      => [ 'kadence_header' ],
			'Navigations'  => [ 'kadence_navigation' ],
			'Queries'      => [ 'kadence_query' ],
			'Query Cards'  => [ 'kadence_query_card' ],
			'Custom Icons' => [ 'kb_icon' ],
		];
	}

	public function test_it_shows_the_banner_on_the_licensing_page(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( 'lw-software-manager', 'settings_page_lw-software-manager', 'options-general.php' );

		$this->assertTrue( $this->audience()->should_display() );
	}

	public function test_it_hides_the_banner_on_other_admin_pages(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );

		$this->on_page( null, 'dashboard', 'index.php' );
		$this->assertFalse( $this->audience()->should_display(), 'Dashboard' );

		$this->on_page( null, 'edit-post', 'edit.php' );
		$this->assertFalse( $this->audience()->should_display(), 'Posts' );

		$this->on_page( 'another-plugin', 'toplevel_page_another-plugin' );
		$this->assertFalse( $this->audience()->should_display(), 'Another plugin' );
	}

	public function test_it_hides_the_banner_when_another_admin_url_names_a_kadence_page(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( 'kadence-blocks', 'dashboard', 'index.php' );

		$this->assertFalse( $this->audience()->should_display() );
	}

	public function test_it_shows_the_banner_to_editors(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'editor' ] ) );

		$this->assertTrue( $this->audience()->should_display() );
	}

	private function audience(): Audience {
		return $this->container->get( Audience::class );
	}

	/**
	 * Registers a post type Kadence Blocks Pro adds, which the test site doesn't have.
	 */
	private function register_post_type( string $post_type ): void {
		if ( post_type_exists( $post_type ) ) {
			return;
		}

		$this->post_types[] = $post_type;
		register_post_type( $post_type, [ 'show_ui' => true ] );
	}

	private function on_page( ?string $plugin_page, string $screen, string $pagenow = 'admin.php' ): void {
		$GLOBALS['plugin_page'] = $plugin_page;
		$GLOBALS['pagenow']     = $pagenow;
		set_current_screen( $screen );
	}

	private function set_harbor_license( bool $active ): void {
		if ( ! function_exists( 'uopz_set_return' ) ) {
			$this->markTestSkipped( 'Needs uopz to stand in for Harbor.' );
		}

		uopz_set_return( 'lw_harbor_is_product_license_active', $active );
	}

	private function store_license_status( string $slug, string $status ): void {
		$resource = get_resource( $slug ) ?? $this->register_resource( $slug );

		update_option( $resource->get_license_object()->get_key_status_option_name(), $status );
	}

	/**
	 * @return \KadenceWP\KadenceBlocks\StellarWP\Uplink\Resources\Resource
	 */
	private function register_resource( string $slug ) {
		$this->registered[] = $slug;

		return Register::plugin( $slug, $slug, '1.0.0', "{$slug}/{$slug}.php", Kadence_Blocks::class );
	}
}
