<?php declare( strict_types=1 );
// cspell:ignore advancedbtn advancedheading .

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Variants_Controller;
use ReflectionClass;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the read surface of the Design Tokens variants controller: the registered read routes and the
 * baseline-merged reads against the real shipped baseline.
 */
final class VariantsControllerTest extends TestCase {

	private const BUTTON = 'kadence/advancedbtn';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Variants_Controller
	 */
	private Variants_Controller $controller;

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
		$this->controller = $this->container->get( Variants_Controller::class );

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
	public function testItRegistersEveryRouteWithASchema(): void {
		$namespace     = $this->controller_namespace();
		$base          = $this->controller_rest_base();
		$block_route   = $this->controller_constant( 'BLOCK_ROUTE' );
		$default_route = $this->controller_constant( 'DEFAULT_ROUTE' );

		$collection = "/$namespace/$base";
		$block      = "/$namespace/$base/$block_route";
		$default    = "/$namespace/$base/$block_route/$default_route";

		foreach ( [ $collection, $block, $default ] as $route ) {
			$this->assertArrayHasKey( $route, $this->rest_server->get_routes(), "Route $route should be registered." );

			$options = $this->rest_server->get_route_options( $route );
			$this->assertArrayHasKey( 'schema', $options, "Route $route should expose a schema." );
			$this->assertIsCallable( $options['schema'] );
		}

		// The block route declares both block path segments.
		$this->assertArrayHasKey( $this->controller_constant( 'VENDOR_PARAM' ), $this->rest_server->get_routes()[ $block ][0]['args'] );
		$this->assertArrayHasKey( $this->controller_constant( 'BLOCK_NAME_PARAM' ), $this->rest_server->get_routes()[ $block ][0]['args'] );

		// Every read route is reachable through GET.
		foreach ( [ $collection, $block, $default ] as $route ) {
			$this->assertContains( 'GET', $this->route_methods( $route ), "Route $route should accept GET." );
		}
	}

	/**
	 * @return void
	 */
	public function testItListsTheRegisteredVariantBlocks(): void {
		$response = $this->controller->get_items( new WP_REST_Request( WP_REST_Server::READABLE ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$blocks = wp_list_pluck( $response->get_data()['blocks'], 'default', 'block' );

		$this->assertArrayHasKey( self::BUTTON, $blocks );
		$this->assertSame( 'primary', $blocks[ self::BUTTON ] );
	}

	/**
	 * @return void
	 */
	public function testGetItemReturnsTheBaselineMergedVariantSet(): void {
		$response = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$data = $response->get_data();

		$this->assertSame( self::BUTTON, $data['block'] );
		$this->assertSame( 'primary', $data['default'] );
		$this->assertArrayHasKey( 'primary', $data['variants'] );
		$this->assertArrayHasKey( 'ghost', $data['variants'] );
	}

	/**
	 * @return void
	 */
	public function testGetItemReflectsAStoredOverride(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/advancedbtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();

		$this->assertArrayHasKey( 'outline', $data['variants'] );
		$this->assertSame( 'Outline', $data['variants']['outline']['label'] );
	}

	/**
	 * @return void
	 */
	public function testGetItemReturns404ForABlockThatAcceptsNoVariants(): void {
		// The baseline ships variant data for advancedheading, but no variant set is registered for it.
		$result = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, 'kadence/advancedheading' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testGetDefaultReadsTheDefault(): void {
		$data = $this->controller->get_default( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();

		$this->assertSame( self::BUTTON, $data['block'] );
		$this->assertSame( 'primary', $data['default'] );
	}

	/**
	 * Build a request for a single block route, splitting the block name into its two path segments and
	 * carrying any extra body parameters.
	 *
	 * @param string               $method The HTTP method.
	 * @param string               $block  The block name, e.g. "kadence/advancedbtn".
	 * @param array<string, mixed> $extra  Extra parameters (variant, label, tokens, variants, default).
	 *
	 * @return WP_REST_Request
	 */
	private function block_request( string $method, string $block, array $extra = [] ): WP_REST_Request {
		[ $vendor, $name ] = explode( '/', $block, 2 );

		$request = new WP_REST_Request( $method );
		$request->set_param( 'vendor', $vendor );
		$request->set_param( 'block_name', $name );

		foreach ( $extra as $key => $value ) {
			$request->set_param( $key, $value );
		}

		return $request;
	}

	/**
	 * Collect every HTTP method a registered route accepts across all of its endpoints.
	 *
	 * @param string $route The registered route pattern.
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
