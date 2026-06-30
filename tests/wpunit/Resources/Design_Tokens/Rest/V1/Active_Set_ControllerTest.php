<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Active_Set_Controller;
use ReflectionClass;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the active-set pointer controller: reading the resolved pointer and pointing it at a set.
 */
final class Active_Set_ControllerTest extends TestCase {

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @var Active_Set_Controller
	 */
	private Active_Set_Controller $controller;

	/**
	 * @var WP_REST_Server
	 */
	private WP_REST_Server $rest_server;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store      = $this->container->get( Token_Store::class );
		$this->active     = $this->container->get( Active_Set_Store::class );
		$this->controller = $this->container->get( Active_Set_Controller::class );

		global $wp_rest_server;
		$this->rest_server = new WP_REST_Server();
		$wp_rest_server    = $this->rest_server;
		do_action( 'rest_api_init' );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		wp_set_current_user( 0 );

		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tearDown();
	}

	/**
	 * @return void
	 */
	public function testItRegistersTheReadAndWriteRoutesWithArgsAndSchema(): void {
		$namespace  = $this->controller_namespace();
		$base       = $this->controller_rest_base();
		$slug_route = $this->controller_constant( 'SLUG_ROUTE' );

		$read  = "/$namespace/$base";
		$write = "/$namespace/$base/$slug_route";

		$this->assertContains( 'GET', $this->route_methods( $read ) );
		$this->assertContains( 'PUT', $this->route_methods( $write ) );

		foreach ( [ $read, $write ] as $route ) {
			$options = $this->rest_server->get_route_options( $route );

			$this->assertArrayHasKey( 'schema', $options, "Route $route should expose a schema." );
			$this->assertIsCallable( $options['schema'] );
		}
	}

	/**
	 * @return void
	 */
	public function testGetItemReturnsTheDefaultSetInitially(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );

		$response = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( Token_Store::default_slug(), $response->get_data()['slug'] );
	}

	/**
	 * @return void
	 */
	public function testUpdateItemPointsTheActiveSetAtAKnownSet(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'slug', 'brand-b' );

		$response = $this->controller->update_item( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( 'brand-b', $response->get_data()['slug'] );

		// The pointer is persisted, not just echoed.
		$this->assertSame( 'brand-b', $this->active->get() );
	}

	/**
	 * @return void
	 */
	public function testUpdateItemAcceptsTheDefaultSetEvenWithNoRow(): void {
		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$response = $this->controller->update_item( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( Token_Store::default_slug(), $response->get_data()['slug'] );
	}

	/**
	 * @return void
	 */
	public function testUpdateItemReturnsNotFoundForAnUnknownSet(): void {
		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'slug', 'ghost' );

		$result = $this->controller->update_item( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );

		// A rejected write leaves the pointer at its default.
		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
	}

	/**
	 * @return void
	 */
	public function testItDeniesAccessToUsersWithoutTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );

		foreach ( [ 'get_item_permissions_check', 'update_item_permissions_check' ] as $check ) {
			$result = $this->controller->$check( $request );

			$this->assertInstanceOf( WP_Error::class, $result, "$check should deny the subscriber." );
			$this->assertSame( 'rest_forbidden', $result->get_error_code() );
		}
	}

	/**
	 * The methods registered for a route, flattened across its endpoints.
	 *
	 * @param string $route The full route path.
	 *
	 * @return string[]
	 */
	private function route_methods( string $route ): array {
		$methods = [];

		foreach ( $this->rest_server->get_routes()[ $route ] ?? [] as $endpoint ) {
			if ( isset( $endpoint['methods'] ) && is_array( $endpoint['methods'] ) ) {
				$methods = array_merge( $methods, array_keys( array_filter( $endpoint['methods'] ) ) );
			}
		}

		return $methods;
	}

	/**
	 * The REST namespace the controller registers under, read off the instance so the tests do not
	 * hardcode it.
	 *
	 * @return string
	 */
	private function controller_namespace(): string {
		return $this->controller_property( 'namespace' );
	}

	/**
	 * The rest base the controller registers under, read off the instance so the tests do not hardcode it.
	 *
	 * @return string
	 */
	private function controller_rest_base(): string {
		return $this->controller_property( 'rest_base' );
	}

	/**
	 * Read a protected property off the controller instance.
	 *
	 * @param string $property The property name.
	 *
	 * @return string
	 */
	private function controller_property( string $property ): string {
		$reflection = new ReflectionProperty( $this->controller, $property );
		$reflection->setAccessible( true );

		return (string) $reflection->getValue( $this->controller );
	}

	/**
	 * Read a class constant off the controller, so route segments are asserted from their single source.
	 *
	 * @param string $name The constant name.
	 *
	 * @return string
	 */
	private function controller_constant( string $name ): string {
		return (string) ( new ReflectionClass( $this->controller ) )->getConstant( $name );
	}
}
