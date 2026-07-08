<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Reference;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\User_Primitives_Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the references preview endpoint on User_Primitives_Controller (Phase 9).
 */
final class User_Primitives_ControllerTest extends TestCase {

	/**
	 * @var User_Primitives_Controller
	 */
	private User_Primitives_Controller $controller;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var WP_REST_Server
	 */
	private WP_REST_Server $rest_server;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->controller = $this->container->get( User_Primitives_Controller::class );
		$this->store      = $this->container->get( Token_Store::class );

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

	// -------------------------------------------------------------------------
	// Route registration
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testItRegistersTheReferencesRouteWithArgsAndSchema(): void {
		$routes    = $this->rest_server->get_routes();
		$namespace = 'kb-design-tokens/v1';
		$pattern   = '#^/' . preg_quote( $namespace, '#' ) . '/documents/\(\?P<slug>#';
		$found     = false;

		foreach ( array_keys( $routes ) as $route ) {
			if ( preg_match( $pattern, $route ) && str_contains( $route, 'references' ) ) {
				$found = true;
				$opts  = $this->rest_server->get_route_options( $route );
				$this->assertArrayHasKey( 'schema', $opts );
				$this->assertIsCallable( $opts['schema'] );
				break;
			}
		}

		$this->assertTrue( $found, 'The references route must be registered.' );
	}

	// -------------------------------------------------------------------------
	// get_references — happy path: no references
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testItReturnsEmptyReferencesAndDeletableTrueWhenNothingReferencesThePrimitive(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.my-brand';

		$this->store->save_document( wp_json_encode( $this->doc_with_primitive( $id, 'My Brand' ) ) );

		$response = $this->controller->get_references( $this->make_request( $slug, $id ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();

		$this->assertSame( $id, $data['id'] );
		$this->assertSame( 'My Brand', $data['label'] );
		$this->assertTrue( $data['deletable'] );
		$this->assertSame( [], $data['references'] );
	}

	// -------------------------------------------------------------------------
	// get_references — version is included
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testResponseIncludesCurrentDocumentVersion(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.my-brand';

		$this->store->save_document( wp_json_encode( $this->doc_with_primitive( $id, 'My Brand' ) ) );

		$version = $this->store->get_version( $slug );

		$data = $this->controller->get_references( $this->make_request( $slug, $id ) )->get_data();

		$this->assertSame( $version, $data['version'] );
		$this->assertNotSame( '', $data['version'] );
	}

	// -------------------------------------------------------------------------
	// get_references — semantic override reference
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testItReturnsSemanticOverrideReferenceAsSupportedWithRevertAction(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.brand';
		$doc  = $this->doc_with_primitive( $id, 'Brand' );

		$doc['semantic'] = [
			'color' => [
				'primary' => [
					'$type'  => 'color',
					'$value' => '{' . $id . '}',
				],
			],
		];

		$this->store->save_document( wp_json_encode( $doc ) );

		$data = $this->controller->get_references( $this->make_request( $slug, $id ) )->get_data();

		$this->assertTrue( $data['deletable'] );
		$this->assertCount( 1, $data['references'] );

		$ref = $data['references'][0];

		$this->assertSame( Token_Reference::get_kind_semantic_override(), $ref['kind'] );
		$this->assertTrue( $ref['supported'] );
		$this->assertSame( 'revert_to_baseline', $ref['action'] );
	}

	// -------------------------------------------------------------------------
	// get_references — composite field reference (unsupported)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testCompositeFieldReferenceIsUnsupportedAndBlocksDeletion(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.shadow-color';
		$doc  = $this->doc_with_primitive( $id, 'Shadow Color' );

		$doc['primitive'] = array_merge(
			$doc['primitive'] ?? [],
			[
				'shadow' => [
					'soft' => [
						'$type'  => 'shadow',
						'$value' => [
							'color'   => '{' . $id . '}',
							'offsetX' => '0',
							'offsetY' => '2px',
							'blur'    => '4px',
							'spread'  => '0',
						],
					],
				],
			] 
		);

		$this->store->save_document( wp_json_encode( $doc ) );

		$data = $this->controller->get_references( $this->make_request( $slug, $id ) )->get_data();

		$this->assertFalse( $data['deletable'] );
		$this->assertCount( 1, $data['references'] );

		$ref = $data['references'][0];

		$this->assertFalse( $ref['supported'] );
		$this->assertSame( 'unsupported', $ref['action'] );
		$this->assertSame( Token_Reference::get_kind_composite_field(), $ref['kind'] );
	}

	// -------------------------------------------------------------------------
	// get_references — extension section reference (unsupported)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testExtensionSectionReferenceIsUnsupportedAndBlocksDeletion(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.ext-color';
		$doc  = $this->doc_with_primitive( $id, 'Ext Color' );

		$doc[ Extensions::get_extensions_key() ][ Extensions::get_namespace() ][ Extensions::get_section_foundation_presets() ] = [
			'color' => [
				'my-preset' => [
					Extensions::get_tokens_key() => [
						'semantic.color.accent' => '{' . $id . '}',
					],
				],
			],
		];

		$this->store->save_document( wp_json_encode( $doc ) );

		$data = $this->controller->get_references( $this->make_request( $slug, $id ) )->get_data();

		$this->assertFalse( $data['deletable'] );

		$unsupported = array_filter( $data['references'], static fn( array $r ): bool => ! $r['supported'] );
		$this->assertNotEmpty( $unsupported );
	}

	// -------------------------------------------------------------------------
	// get_references — error cases
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testItReturns404ForAnUnknownSlug(): void {
		$result = $this->controller->get_references( $this->make_request( 'does-not-exist', 'primitive.color.custom.x' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testItReturns404WhenIdIsValidFormatButNotInEnvelope(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.ghost';

		$this->store->save_document( wp_json_encode( $this->doc_with_primitive( 'primitive.color.custom.other', 'Other' ) ) );

		$result = $this->controller->get_references( $this->make_request( $slug, $id ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testItReturns400ForAnInvalidCanonicalIdFormat(): void {
		$slug = Token_Store::default_slug();

		$this->store->save_document( '{}' );

		$result = $this->controller->get_references( $this->make_request( $slug, 'primitive.color.foo' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_invalid_param', $result->get_error_code() );
		$this->assertSame( WP_Http::BAD_REQUEST, $result->get_error_data()['status'] );
	}

	// -------------------------------------------------------------------------
	// get_references — does not modify the stored document
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testGetReferencesDoesNotModifyTheStoredDocument(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.safe';
		$doc  = $this->doc_with_primitive( $id, 'Safe' );

		$this->store->save_document( wp_json_encode( $doc ) );

		$before = $this->store->get_document( $slug );

		$this->controller->get_references( $this->make_request( $slug, $id ) );

		$after = $this->store->get_document( $slug );

		$this->assertSame( $before, $after );
	}

	// -------------------------------------------------------------------------
	// Helpers
	// -------------------------------------------------------------------------

	/**
	 * Build a minimal overrides document with one user primitive registered in the index.
	 *
	 * @param string $id    The canonical dot-path id.
	 * @param string $label The label to store in the provenance map.
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_primitive( string $id, string $label ): array {
		$segments = explode( '.', $id );
		$slug     = end( $segments );

		return [
			'primitive'                      => [
				'color' => [
					'custom' => [
						$slug => [
							'$type'  => 'color',
							'$value' => '#336699',
						],
					],
				],
			],
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_user_primitives() => [
						$id => [ 'label' => $label ],
					],
				],
			],
		];
	}

	/**
	 * Build a GET request for the references endpoint.
	 *
	 * @param string $slug The token set slug.
	 * @param string $id   The user-primitive canonical id.
	 *
	 * @return WP_REST_Request
	 */
	private function make_request( string $slug, string $id ): WP_REST_Request {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', $slug );
		$request->set_param( 'id', $id );

		return $request;
	}
}
