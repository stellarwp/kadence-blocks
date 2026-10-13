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

	private ?string $plugin_page;

	protected function setUp(): void {
		parent::setUp();

		$this->plugin_page = $GLOBALS['plugin_page'] ?? null;

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->on_page( 'kadence-blocks', 'toplevel_page_kadence-blocks' );
	}

	protected function tearDown(): void {
		foreach ( $this->registered as $slug ) {
			get_container()->get( Collection::class )->offsetUnset( $slug );
		}

		if ( function_exists( 'uopz_unset_return' ) ) {
			uopz_unset_return( 'lw_harbor_is_product_license_active' );
		}

		$GLOBALS['plugin_page'] = $this->plugin_page;
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

	public function test_it_shows_the_banner_on_the_home_page(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( 'kadence-blocks-home', 'kadence_page_kadence-blocks-home' );

		$this->assertTrue( $this->audience()->should_display() );
	}

	/**
	 * @dataProvider post_types
	 */
	public function test_it_shows_the_banner_on_post_type_lists( string $post_type ): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( null, "edit-{$post_type}" );

		$this->assertTrue( $this->audience()->should_display() );
	}

	/**
	 * @dataProvider post_types
	 */
	public function test_it_hides_the_banner_in_the_editor( string $post_type ): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( null, $post_type );

		$this->assertFalse( $this->audience()->should_display() );
	}

	/**
	 * @return array<string, string[]>
	 */
	public function post_types(): array {
		return [
			'Forms'       => [ 'kadence_form' ],
			'Headers'     => [ 'kadence_header' ],
			'Navigations' => [ 'kadence_navigation' ],
		];
	}

	public function test_it_shows_the_banner_on_the_licensing_page(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		$this->on_page( 'lw-software-manager', 'settings_page_lw-software-manager' );

		$this->assertTrue( $this->audience()->should_display() );
	}

	public function test_it_hides_the_banner_on_other_admin_pages(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );

		$this->on_page( null, 'dashboard' );
		$this->assertFalse( $this->audience()->should_display(), 'Dashboard' );

		$this->on_page( null, 'edit-post' );
		$this->assertFalse( $this->audience()->should_display(), 'Posts' );

		$this->on_page( 'another-plugin', 'toplevel_page_another-plugin' );
		$this->assertFalse( $this->audience()->should_display(), 'Another plugin' );
	}

	public function test_it_shows_the_banner_to_editors(): void {
		$this->store_license_status( 'kadence-blocks-pro', 'valid' );
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'editor' ] ) );

		$this->assertTrue( $this->audience()->should_display() );
	}

	private function audience(): Audience {
		return $this->container->get( Audience::class );
	}

	private function on_page( ?string $plugin_page, string $screen ): void {
		$GLOBALS['plugin_page'] = $plugin_page;
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
