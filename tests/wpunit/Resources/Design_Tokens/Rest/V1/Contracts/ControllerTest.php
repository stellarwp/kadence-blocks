<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1\Contracts;

use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use Tests\Support\Classes\TestCase;
use ReflectionProperty;
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Exercises the shared behavior of the abstract Design Tokens REST controller
 * through a minimal concrete subclass. Endpoint-specific behavior is covered by
 * the controllers that add routes.
 */
final class ControllerTest extends TestCase {

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		remove_all_filters( 'kadence_blocks_design_tokens_capability' );
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	/**
	 * @return void
	 */
	public function testItUsesTheSharedNamespace(): void {
		$namespace = new ReflectionProperty( Controller::class, 'namespace' );
		$namespace->setAccessible( true );

		$this->assertSame( 'kb-design-tokens/v1', $namespace->getValue( $this->make_controller() ) );
	}

	/**
	 * @return void
	 */
	public function testItDefaultsToTheThemeOptionsCapability(): void {
		$this->assertSame( 'edit_theme_options', $this->make_controller()->get_capability() );
	}

	/**
	 * @return void
	 */
	public function testItHonorsTheCapabilityFilter(): void {
		add_filter( 'kadence_blocks_design_tokens_capability', static fn(): string => 'manage_options' );

		$this->assertSame( 'manage_options', $this->make_controller()->get_capability() );
	}

	/**
	 * @return void
	 */
	public function testTheCapabilityFilterReceivesTheRequest(): void {
		add_filter(
			'kadence_blocks_design_tokens_capability',
			static function ( string $capability, ?WP_REST_Request $request ): string {
				return $request && WP_REST_Server::CREATABLE === $request->get_method() ? 'manage_options' : $capability;
			},
			10,
			2
		);

		$controller = $this->make_controller();

		$this->assertSame(
			'manage_options',
			$controller->get_capability( new WP_REST_Request( WP_REST_Server::CREATABLE ) ),
			'Writes should be able to require a higher capability.'
		);
		$this->assertSame(
			'edit_theme_options',
			$controller->get_capability( new WP_REST_Request( WP_REST_Server::READABLE ) ),
			'Reads should fall back to the default capability.'
		);
	}

	/**
	 * @return void
	 */
	public function testItGrantsAccessToUsersWithTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );

		$controller = $this->make_controller();
		$request    = new WP_REST_Request( WP_REST_Server::READABLE );

		$this->assertTrue( $controller->get_items_permissions_check( $request ) );
		$this->assertTrue( $controller->create_item_permissions_check( $request ) );
	}

	/**
	 * @return void
	 */
	public function testItDeniesAccessToUsersWithoutTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$result = $this->make_controller()->get_items_permissions_check( new WP_REST_Request( WP_REST_Server::READABLE ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_forbidden', $result->get_error_code() );

		$data = $result->get_error_data();

		$this->assertIsArray( $data );
		$this->assertSame( rest_authorization_required_code(), $data['status'] );
	}

	/**
	 * A minimal concrete controller used only to exercise the abstract base.
	 *
	 * @return Controller
	 */
	private function make_controller(): Controller {
		return new class() extends Controller {

			/**
			 * @inheritDoc
			 *
			 * @return void
			 */
			public function register_routes(): void {}
		};
	}
}
