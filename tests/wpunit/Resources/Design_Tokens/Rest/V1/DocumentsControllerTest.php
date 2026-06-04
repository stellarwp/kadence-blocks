<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Documents_Controller;
use ReflectionClass;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the read surface of the Design Tokens documents controller: the raw DTCG document collection
 * and item, and the resolved/flattened preview map.
 */
final class DocumentsControllerTest extends TestCase {

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Documents_Controller
	 */
	private Documents_Controller $controller;

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
		$this->controller = $this->container->get( Documents_Controller::class );

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
	public function testItRegistersEveryReadRouteWithArgsAndSchema(): void {
		$routes         = $this->rest_server->get_routes();
		$namespace      = $this->controller_namespace();
		$base           = $this->controller_rest_base();
		$slug_route     = $this->controller_constant( 'SLUG_ROUTE' );
		$resolved_route = $this->controller_constant( 'RESOLVED_ROUTE' );
		$slug_param     = $this->controller_constant( 'SLUG_PARAM' );

		$collection = "/$namespace/$base";
		$item       = "/$namespace/$base/$slug_route";
		$resolved   = "/$namespace/$base/$slug_route/$resolved_route";

		$this->assertArrayHasKey( $collection, $routes );
		$this->assertArrayHasKey( $item, $routes );
		$this->assertArrayHasKey( $resolved, $routes );

		// Every route exposes a schema so the MCP layer can introspect the response shape.
		foreach ( [ $collection, $item, $resolved ] as $route ) {
			$options = $this->rest_server->get_route_options( $route );

			$this->assertArrayHasKey( 'schema', $options, "Route $route should expose a schema." );
			$this->assertIsCallable( $options['schema'] );
		}

		// The single-set routes declare the slug argument.
		$this->assertArrayHasKey( $slug_param, $routes[ $item ][0]['args'] );
		$this->assertArrayHasKey( $slug_param, $routes[ $resolved ][0]['args'] );
	}

	/**
	 * @return void
	 */
	public function testItReturnsTheDefaultSetAsTheCollection(): void {
		$response = $this->controller->get_items( new WP_REST_Request( WP_REST_Server::READABLE ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();

		$this->assertCount( 1, $data );
		$this->assertSame( Token_Store::default_slug(), $data[0]['slug'] );
	}

	/**
	 * @return void
	 */
	public function testItReturnsTheRawStoredDocumentForTheDefaultSet(): void {
		$document = '{"primitive":{"color":{"brand":{"$type":"color","$value":"#336699"}}}}';

		$this->store->save_document( $document );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$response = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$data = $response->get_data();

		$this->assertSame( Token_Store::default_slug(), $data['slug'] );
		$this->assertSame( json_decode( $document, true ), $data['document'] );
	}

	/**
	 * @return void
	 */
	public function testItReturnsAnEmptyDocumentWhenNothingIsStored(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertSame( [], $data['document'] );
		$this->assertSame( '', $data['version'] );
	}

	/**
	 * @return void
	 */
	public function testItReturnsNotFoundForAnUnknownSlug(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'does-not-exist' );

		$result = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testItResolvesAStoredDocumentIntoFlattenedMaps(): void {
		$this->store->save_document( '{"primitive":{"color":{"test":{"$type":"color","$value":"#336699"}}}}' );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$response = $this->controller->get_resolved( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$data = $response->get_data();

		$this->assertArrayHasKey( 'primitive.color.test', $data['by_id'] );
		$this->assertSame( '#336699', $data['by_id']['primitive.color.test'] );
		$this->assertArrayHasKey( '--kb-token--primitive--color--test', $data['by_var'] );
		$this->assertSame( '#336699', $data['by_var']['--kb-token--primitive--color--test'] );
	}

	/**
	 * @return void
	 */
	public function testItReturns422WhenAStoredDocumentHasAnAliasCycle(): void {
		$this->store->save_document(
			'{"primitive":{"color":{'
			. '"cycle-a":{"$type":"color","$value":"{primitive.color.cycle-b}"},'
			. '"cycle-b":{"$type":"color","$value":"{primitive.color.cycle-a}"}'
			. '}}}'
		);

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$result = $this->controller->get_resolved( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unresolvable', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testItDeniesAccessToUsersWithoutTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$result = $this->controller->get_items_permissions_check( new WP_REST_Request( WP_REST_Server::READABLE ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_forbidden', $result->get_error_code() );
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
