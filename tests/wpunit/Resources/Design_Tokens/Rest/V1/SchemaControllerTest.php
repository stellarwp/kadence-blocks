<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Schema_Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Dtcg_Schema;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the schema controller, which serves the committed DTCG JSON Schema.
 */
final class SchemaControllerTest extends TestCase {

	/**
	 * @var Schema_Controller
	 */
	private Schema_Controller $controller;

	/**
	 * @var WP_REST_Server
	 */
	private WP_REST_Server $rest_server;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->controller = $this->container->get( Schema_Controller::class );

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
	public function testItRegistersTheSchemaRouteWithArgsAndSchema(): void {
		$routes = $this->rest_server->get_routes();
		$route  = '/' . $this->controller_namespace() . '/' . $this->controller_rest_base();

		$this->assertArrayHasKey( $route, $routes );
		$this->assertArrayHasKey( 'args', $routes[ $route ][0] );

		$options = $this->rest_server->get_route_options( $route );

		$this->assertArrayHasKey( 'schema', $options );
		$this->assertIsCallable( $options['schema'] );
	}

	/**
	 * @return void
	 */
	public function testItReturnsTheCommittedDtcgSchema(): void {
		$response = $this->controller->get_item( new WP_REST_Request( WP_REST_Server::READABLE ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		// The endpoint returns exactly what the schema accessor loads, with no transformation.
		$this->assertSame( $this->container->get( Dtcg_Schema::class )->document(), $response->get_data() );
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
}
