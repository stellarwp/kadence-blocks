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
	public function testItReturnsNotFoundFromResolvedForAnUnknownSlug(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'does-not-exist' );

		$result = $this->controller->get_resolved( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testItDeniesAccessToUsersWithoutTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );

		// Both permission callbacks gate the routes (get_items for the collection, get_item for the single
		// document and resolved map), so both must deny a user without the capability.
		foreach ( [ 'get_items_permissions_check', 'get_item_permissions_check' ] as $check ) {
			$result = $this->controller->$check( $request );

			$this->assertInstanceOf( WP_Error::class, $result, "$check should deny the subscriber." );
			$this->assertSame( 'rest_forbidden', $result->get_error_code() );
		}
	}

	/**
	 * @return void
	 */
	public function testItRegistersTheWriteRoutes(): void {
		$namespace    = $this->controller_namespace();
		$base         = $this->controller_rest_base();
		$slug_route   = $this->controller_constant( 'SLUG_ROUTE' );
		$tokens_route = $this->controller_constant( 'TOKENS_ROUTE' );
		$path_route   = $this->controller_constant( 'PATH_ROUTE' );

		$collection = "/$namespace/$base";
		$item       = "/$namespace/$base/$slug_route";
		$tokens     = "/$namespace/$base/$slug_route/$tokens_route/$path_route";

		$this->assertContains( 'POST', $this->route_methods( $collection ) );

		foreach ( [ 'POST', 'PUT', 'PATCH', 'DELETE' ] as $method ) {
			$this->assertContains( $method, $this->route_methods( $item ), "Item route should accept $method." );
		}

		foreach ( [ 'POST', 'PUT', 'DELETE' ] as $method ) {
			$this->assertContains( $method, $this->route_methods( $tokens ), "Token route should accept $method." );
		}

		$options = $this->rest_server->get_route_options( $tokens );
		$this->assertArrayHasKey( 'schema', $options );
		$this->assertIsCallable( $options['schema'] );
	}

	/**
	 * @return void
	 */
	public function testPostAndPatchDeepMergeIntoStored(): void {
		$this->store->save_document( '{"primitive":{"color":{"a":{"$type":"color","$value":"#aaaaaa"}}}}' );

		// POST and PATCH share patch_item; the body's new path merges in beside the stored one.
		$response = $this->controller->patch_item(
			$this->write_request( 'POST', Token_Store::default_slug(), [ 'primitive' => [ 'color' => [ 'b' => [ '$type' => 'color', '$value' => '#bbbbbb' ] ] ] ] )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$document = $response->get_data()['document'];

		$this->assertSame( '#aaaaaa', $document['primitive']['color']['a']['$value'] );
		$this->assertSame( '#bbbbbb', $document['primitive']['color']['b']['$value'] );
	}

	/**
	 * @return void
	 */
	public function testPutReplacesTheWholeDocumentWholesale(): void {
		$this->store->save_document( '{"primitive":{"color":{"a":{"$type":"color","$value":"#aaaaaa"}}}}' );

		$response = $this->controller->update_item(
			$this->write_request( 'PUT', Token_Store::default_slug(), [ 'primitive' => [ 'color' => [ 'b' => [ '$type' => 'color', '$value' => '#bbbbbb' ] ] ] ] )
		);

		$document = $response->get_data()['document'];

		// The stored "a" is gone — PUT replaces rather than merges.
		$this->assertArrayNotHasKey( 'a', $document['primitive']['color'] );
		$this->assertArrayHasKey( 'b', $document['primitive']['color'] );
	}

	/**
	 * @return void
	 */
	public function testCollectionPostCreatesTheDefaultSetWith201(): void {
		$response = $this->controller->create_item(
			$this->write_request( 'POST', '', [ 'primitive' => [ 'color' => [ 'brand' => [ 'primary' => [ '$type' => 'color', '$value' => '#3182CE' ] ] ] ] ] )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status() );
		$this->assertSame( '#3182CE', $response->get_data()['document']['primitive']['color']['brand']['primary']['$value'] );
	}

	/**
	 * @return void
	 */
	public function testMergePreservesTheExtensionsLayer(): void {
		$this->store->save_document(
			'{"primitive":{"color":{"a":{"$type":"color","$value":"#aaaaaa"}}},'
			. '"$extensions":{"com.kadence.designTokens":{"variants":{"core/button":{"$default":"solid"}}}}}'
		);

		$response = $this->controller->patch_item(
			$this->write_request( 'POST', Token_Store::default_slug(), [ 'primitive' => [ 'color' => [ 'a' => [ '$type' => 'color', '$value' => '#000000' ] ] ] ] )
		);

		$document = $response->get_data()['document'];

		$this->assertArrayHasKey( '$extensions', $document );
		$this->assertSame( 'solid', $document['$extensions']['com.kadence.designTokens']['variants']['core/button']['$default'] );
	}

	/**
	 * @return void
	 */
	public function testSetTokenLandsALeafAndInfersItsType(): void {
		$this->store->save_document( '{"primitive":{"color":{"brand":{"primary":{"$type":"color","$value":"#000000"}}}}}' );

		// The body omits $type; it is inferred from the stored token.
		$response = $this->controller->set_token(
			$this->token_request( 'POST', Token_Store::default_slug(), 'primitive.color.brand.primary', [ '$value' => '#3182CE' ] )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$leaf = $response->get_data()['document']['primitive']['color']['brand']['primary'];

		$this->assertSame( '#3182CE', $leaf['$value'] );
		$this->assertSame( 'color', $leaf['$type'] );
	}

	/**
	 * @return void
	 */
	public function testSetTokenStoresSentinelsVerbatim(): void {
		// brand.accent is a baseline leaf nothing aliases, so disabling it cannot dangle another token.
		$response = $this->controller->set_token(
			$this->token_request( 'PUT', Token_Store::default_slug(), 'primitive.color.brand.accent', [ '$disabled' => true ] )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( [ '$disabled' => true ], $response->get_data()['document']['primitive']['color']['brand']['accent'] );
	}

	/**
	 * @return void
	 */
	public function testSetTokenRequiresATypeForANewToken(): void {
		$response = $this->controller->set_token(
			$this->token_request( 'PUT', Token_Store::default_slug(), 'primitive.color.brand-new-xyz', [ '$value' => '#123456' ] )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_type_required', $response->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $response->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testSetTokenRejectsAGroupPath(): void {
		// "primitive.color.brand" is a baseline group (primary/secondary/accent); writing one leaf there
		// would orphan every token under it, so it is rejected with a precise error.
		$response = $this->controller->set_token(
			$this->token_request( 'PUT', Token_Store::default_slug(), 'primitive.color.brand', [ '$type' => 'color', '$value' => '#3182CE' ] )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_not_a_token', $response->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $response->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testSetTokenRejectsNestingUnderAnExistingToken(): void {
		// "primitive.color.brand.primary" is a baseline leaf; a token cannot be written below it.
		$response = $this->controller->set_token(
			$this->token_request( 'PUT', Token_Store::default_slug(), 'primitive.color.brand.primary.deep', [ '$type' => 'color', '$value' => '#3182CE' ] )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_not_a_token', $response->get_error_code() );
	}

	/**
	 * @return void
	 */
	public function testBulkWriteThatBreaksAReferencedTokenReturns422(): void {
		// Replacing the brand group with a single leaf removes brand.primary, which baseline semantic
		// tokens alias. The dry-run resolver rejects the unresolvable result before it can be stored.
		$response = $this->controller->update_item(
			$this->write_request( 'PUT', Token_Store::default_slug(), [ 'primitive' => [ 'color' => [ 'brand' => [ '$type' => 'color', '$value' => '#3182CE' ] ] ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_unresolvable', $response->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $response->get_error_data()['status'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testDeleteTokenRemovesTheOverrideAndPrunesEmpties(): void {
		$this->store->save_document( '{"primitive":{"color":{"brand":{"primary":{"$type":"color","$value":"#3182CE"}}}}}' );

		$response = $this->controller->delete_token(
			$this->token_path_request( 'DELETE', Token_Store::default_slug(), 'primitive.color.brand.primary' )
		);

		$this->assertSame( WP_Http::OK, $response->get_status() );
		// The now-empty chain is pruned, so the set reverts entirely to baseline.
		$this->assertSame( [], $response->get_data()['document'] );
	}

	/**
	 * @return void
	 */
	public function testDeleteTokenIsAnIdempotentNoOpWhenAbsent(): void {
		$this->store->save_document( '{"primitive":{"color":{"brand":{"primary":{"$type":"color","$value":"#3182CE"}}}}}' );

		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$response = $this->controller->delete_token(
			$this->token_path_request( 'DELETE', Token_Store::default_slug(), 'primitive.color.brand.missing' )
		);

		$this->assertSame( WP_Http::OK, $response->get_status() );
		// Nothing was removed, so no write happened and the version is unchanged.
		$this->assertSame( $version_before, $this->store->get_version( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testDeleteItemResetsTheSetToBaseline(): void {
		$this->store->save_document( '{"primitive":{"color":{"brand":{"primary":{"$type":"color","$value":"#3182CE"}}}}}' );

		$request = new WP_REST_Request( WP_REST_Server::DELETABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$response = $this->controller->delete_item( $request );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( [], $response->get_data()['document'] );
	}

	/**
	 * @return void
	 */
	public function testWriteReturns422OnInvalidDtcg(): void {
		$response = $this->controller->update_item(
			$this->write_request( 'PUT', Token_Store::default_slug(), [ 'primitive' => [ 'color' => [ 'bad' => [ '$type' => 'bogus', '$value' => '#ffffff' ] ] ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_invalid', $response->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $response->get_error_data()['status'] );
		$this->assertNotEmpty( $response->get_error_data()['errors'] );
	}

	/**
	 * @return void
	 */
	public function testWriteReturns422OnAliasCycleAndPersistsNothing(): void {
		$response = $this->controller->update_item(
			$this->write_request(
				'PUT',
				Token_Store::default_slug(),
				[
					'primitive' => [
						'color' => [
							'cycle-a' => [ '$type' => 'color', '$value' => '{primitive.color.cycle-b}' ],
							'cycle-b' => [ '$type' => 'color', '$value' => '{primitive.color.cycle-a}' ],
						],
					],
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_unresolvable', $response->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $response->get_error_data()['status'] );
		// The dry-run rejected the write before commit, so the store is untouched.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testWriteReturns422OnDanglingAliasAndPersistsNothing(): void {
		$response = $this->controller->update_item(
			$this->write_request(
				'PUT',
				Token_Store::default_slug(),
				[ 'primitive' => [ 'color' => [ 'x' => [ '$type' => 'color', '$value' => '{primitive.color.does-not-exist-xyz}' ] ] ] ]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_unresolvable', $response->get_error_code() );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testCollectionPostRejectsANonDefaultSlug(): void {
		$response = $this->controller->create_item(
			$this->write_request( 'POST', 'other-brand', [ 'primitive' => [ 'color' => [ 'brand' => [ '$type' => 'color', '$value' => '#3182CE' ] ] ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_unsupported_slug', $response->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $response->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testValidateTokenPathRejectsANonLayerRoot(): void {
		$result = $this->controller->validate_token_path( '$extensions.foo', new WP_REST_Request( 'PUT' ), 'path' );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_invalid_param', $result->get_error_code() );
	}

	/**
	 * @return void
	 */
	public function testValidateTokenPathRejectsABareLayer(): void {
		$result = $this->controller->validate_token_path( 'primitive', new WP_REST_Request( 'PUT' ), 'path' );

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	/**
	 * @return void
	 */
	public function testWritesAreDeniedToUsersWithoutTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE );

		$this->assertInstanceOf( WP_Error::class, $this->controller->create_item_permissions_check( $request ) );
		$this->assertInstanceOf( WP_Error::class, $this->controller->update_item_permissions_check( $request ) );
		$this->assertInstanceOf( WP_Error::class, $this->controller->delete_item_permissions_check( $request ) );
	}

	/**
	 * @return void
	 */
	public function testAWriteBumpsTheVersion(): void {
		$this->store->save_document( '{"primitive":{"color":{"a":{"$type":"color","$value":"#aaaaaa"}}}}' );

		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$this->controller->update_item(
			$this->write_request( 'PUT', Token_Store::default_slug(), [ 'primitive' => [ 'color' => [ 'a' => [ '$type' => 'color', '$value' => '#bbbbbb' ] ] ] ] )
		);

		$this->assertNotSame( $version_before, $this->store->get_version( Token_Store::default_slug() ) );
	}

	/**
	 * Build a bulk-write request carrying the slug, document and optional title as parameters.
	 *
	 * @param string               $method   The HTTP method.
	 * @param string               $slug     The token set slug.
	 * @param array<string, mixed> $document The DTCG document body.
	 * @param string               $title    Optional label.
	 *
	 * @return WP_REST_Request
	 */
	private function write_request( string $method, string $slug, array $document, string $title = '' ): WP_REST_Request {
		$request = new WP_REST_Request( $method );
		$request->set_param( 'slug', $slug );
		$request->set_param( 'document', $document );

		if ( $title !== '' ) {
			$request->set_param( 'title', $title );
		}

		return $request;
	}

	/**
	 * Build a single-token write request: slug and path as params, the bare leaf as the JSON body.
	 *
	 * @param string               $method The HTTP method.
	 * @param string               $slug   The token set slug.
	 * @param string               $path   The token dot-path.
	 * @param array<string, mixed> $leaf   The DTCG leaf body.
	 *
	 * @return WP_REST_Request
	 */
	private function token_request( string $method, string $slug, string $path, array $leaf ): WP_REST_Request {
		$request = $this->token_path_request( $method, $slug, $path );
		$request->set_body( (string) wp_json_encode( $leaf ) );
		$request->set_header( 'Content-Type', 'application/json' );

		return $request;
	}

	/**
	 * Build a single-token request carrying just the slug and path (no body), for deletes.
	 *
	 * @param string $method The HTTP method.
	 * @param string $slug   The token set slug.
	 * @param string $path   The token dot-path.
	 *
	 * @return WP_REST_Request
	 */
	private function token_path_request( string $method, string $slug, string $path ): WP_REST_Request {
		$request = new WP_REST_Request( $method );
		$request->set_param( 'slug', $slug );
		$request->set_param( 'path', $path );

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
