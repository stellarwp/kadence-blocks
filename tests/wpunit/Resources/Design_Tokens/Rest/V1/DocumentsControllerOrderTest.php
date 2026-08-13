<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\User_Primitive_Registrar;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Documents_Controller;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the per-group token sort-order sub-route: PUT/DELETE /documents/{slug}/order/{group},
 * its narrowed write path, the never-hides-a-token merge guarantee, and the version-conditional
 * guard.
 *
 * @since TBD
 */
final class DocumentsControllerOrderTest extends TestCase {

	/**
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @var Documents_Controller
	 */
	private Documents_Controller $controller;

	/**
	 * @since TBD
	 *
	 * @var Token_Order_Index
	 */
	private Token_Order_Index $order_index;

	/**
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The full ordered id list registered under self::GROUP, discovered fresh per test so the
	 * fixture stays correct regardless of which baseline tokens actually declare that group.
	 *
	 * @since TBD
	 *
	 * @var list<string>
	 */
	private array $group_ids;

	/**
	 * Build the controller and its collaborators fresh before each test, and discover a real
	 * registered group carrying at least two tokens to reorder.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store       = $this->container->get( Token_Store::class );
		$this->controller  = $this->container->get( Documents_Controller::class );
		$this->order_index = $this->container->get( Token_Order_Index::class );
		$this->registry    = $this->container->get( Token_Registry::class );

		$schema = $this->registry->to_ui_schema();
		$groups = array_filter( $schema['groups'], fn( array $rows ): bool => count( $rows ) >= 2 );

		$this->assertNotEmpty( $groups, 'At least one registered group must carry two or more tokens.' );

		$this->group_ids = array_column( reset( $groups ), 'id' );

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init' );
	}

	/**
	 * Reset the current user and the global REST server after each test.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		wp_set_current_user( 0 );

		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tearDown();
	}

	/**
	 * The group this fixture's tests target, discovered in setUp() (the constant is only a
	 * documentation hint — the real group is whichever one has enough tokens).
	 *
	 * @return string
	 */
	private function group(): string {
		$schema = $this->registry->to_ui_schema();

		foreach ( $schema['groups'] as $group => $rows ) {
			if ( array_column( $rows, 'id' ) === $this->group_ids ) {
				return $group;
			}
		}

		$this->fail( 'The fixture group could not be re-derived.' );
	}

	/**
	 * A PUT stores the order, and the feed's group comes back in stored sequence with unmentioned
	 * tokens appended in declaration order.
	 *
	 * @return void
	 */
	public function testPutStoresTheOrderAndFeedReflectsItWithUnmentionedTokensAppended(): void {
		$slug    = Token_Store::default_slug();
		$group   = $this->group();
		$reverse = array_reverse( $this->group_ids );
		$partial = [ $reverse[0] ];

		$response = $this->controller->set_order( $this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), $partial ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status() );

		$expected = array_merge( $partial, array_diff( $this->group_ids, $partial ) );

		$this->assertSame( $expected, $this->assembled_group_ids( $slug, $group ) );
	}

	/**
	 * The merged group always contains exactly the registered row set, as an id set regardless of
	 * sequence, when the stored order is partial — the never-hides-a-token pin.
	 *
	 * @return void
	 */
	public function testTheMergedGroupPreservesTheFullRowSetForAPartialOrder(): void {
		$this->assertMergedGroupPreservesFullRowSet( [ $this->group_ids[0] ] );
	}

	/**
	 * The merged group always contains exactly the registered row set when the stored order is
	 * full of ids that name no registered token — the never-hides-a-token pin.
	 *
	 * @return void
	 */
	public function testTheMergedGroupPreservesTheFullRowSetForAnOrderFullOfStaleIds(): void {
		$this->assertMergedGroupPreservesFullRowSet( [ 'semantic.color.does-not-exist', 'semantic.color.also-missing' ] );
	}

	/**
	 * The merged group always contains exactly the registered row set when the submitted order
	 * carries a duplicated id — the never-hides-a-token pin.
	 *
	 * @return void
	 */
	public function testTheMergedGroupPreservesTheFullRowSetForADuplicatedId(): void {
		$this->assertMergedGroupPreservesFullRowSet( [ $this->group_ids[0], $this->group_ids[0] ] );
	}

	/**
	 * The merged group always contains exactly the registered row set when pruning leaves an empty
	 * result (the whole submitted order was stale) — the never-hides-a-token pin.
	 *
	 * @return void
	 */
	public function testTheMergedGroupPreservesTheFullRowSetAfterPruningToEmpty(): void {
		$this->assertMergedGroupPreservesFullRowSet( [ 'semantic.color.does-not-exist' ] );
	}

	/**
	 * PUT the given submitted order for the fixture group, then assert the assembled feed still
	 * carries exactly the registered id set for that group, regardless of sequence.
	 *
	 * @param list<string> $submitted The ids submitted on the PUT.
	 *
	 * @return void
	 */
	private function assertMergedGroupPreservesFullRowSet( array $submitted ): void {
		$slug  = Token_Store::default_slug();
		$group = $this->group();

		$this->controller->set_order( $this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), $submitted ) );

		$this->assertEqualsCanonicalizing( $this->group_ids, $this->assembled_group_ids( $slug, $group ) );
	}

	/**
	 * Ids not registered in the group are pruned from what is stored, and an order pruned to []
	 * stores no entry at all.
	 *
	 * @return void
	 */
	public function testUnregisteredIdsArePrunedFromWhatIsStoredAndEmptyResultStoresNoEntry(): void {
		$slug  = Token_Store::default_slug();
		$group = $this->group();

		$this->controller->set_order(
			$this->order_request(
				'PUT',
				$slug,
				$group,
				$this->store->get_version( $slug ),
				[ $this->group_ids[0], 'semantic.color.does-not-exist' ]
			)
		);

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( [ $this->group_ids[0] ], $this->order_index->all( $stored ) );

		// A follow-up PUT that prunes to nothing removes the stored entry entirely.
		$this->controller->set_order(
			$this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), [ 'semantic.color.does-not-exist' ] )
		);

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( [], $this->order_index->all( $stored ) );
	}

	/**
	 * DELETE removes the stored order and the feed returns to declaration order; a second DELETE
	 * is an idempotent 200 with no version bump.
	 *
	 * @return void
	 */
	public function testDeleteRemovesTheOrderAndASecondDeleteIsIdempotent(): void {
		$slug  = Token_Store::default_slug();
		$group = $this->group();

		$this->controller->set_order(
			$this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), array_reverse( $this->group_ids ) )
		);

		$response = $this->controller->delete_order( $this->order_request( 'DELETE', $slug, $group, $this->store->get_version( $slug ) ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( $this->group_ids, $this->assembled_group_ids( $slug, $group ) );

		$version_after_first_delete = $this->store->get_version( $slug );

		$second = $this->controller->delete_order( $this->order_request( 'DELETE', $slug, $group, $version_after_first_delete ) );

		$this->assertInstanceOf( WP_REST_Response::class, $second );
		$this->assertSame( WP_Http::OK, $second->get_status() );
		$this->assertSame( $version_after_first_delete, $this->store->get_version( $slug ) );
	}

	/**
	 * An unknown library slug is a 404, on both PUT and DELETE.
	 *
	 * @return void
	 */
	public function testUnknownSlugReturns404(): void {
		$put = $this->controller->set_order( $this->order_request( 'PUT', 'does-not-exist', $this->group(), '', [ 'x' ] ) );

		$this->assertInstanceOf( WP_Error::class, $put );
		$this->assertSame( 'rest_design_tokens_not_found', $put->get_error_code() );

		$delete = $this->controller->delete_order( $this->order_request( 'DELETE', 'does-not-exist', $this->group(), '' ) );

		$this->assertInstanceOf( WP_Error::class, $delete );
		$this->assertSame( 'rest_design_tokens_not_found', $delete->get_error_code() );
	}

	/**
	 * A group that names no UI-schema group is a 404, on both PUT and DELETE.
	 *
	 * @return void
	 */
	public function testUnknownGroupReturns404(): void {
		$slug    = Token_Store::default_slug();
		$version = $this->store->get_version( $slug );

		$put = $this->controller->set_order( $this->order_request( 'PUT', $slug, 'does-not-exist', $version, [ 'x' ] ) );

		$this->assertInstanceOf( WP_Error::class, $put );
		$this->assertSame( 'rest_design_tokens_unknown_group', $put->get_error_code() );

		$delete = $this->controller->delete_order( $this->order_request( 'DELETE', $slug, 'does-not-exist', $version ) );

		$this->assertInstanceOf( WP_Error::class, $delete );
		$this->assertSame( 'rest_design_tokens_unknown_group', $delete->get_error_code() );
	}

	/**
	 * A real declared UI-schema group whose label contains a space (e.g. "Font Size") is
	 * reachable through the actual WP REST dispatch layer, with the group segment built the way a
	 * real client must build it: percent-encoded via `rawurlencode()`. Every other test in this
	 * suite calls the controller method directly, which never exercises `register_routes()`'s
	 * regex, the `group` arg's `pattern`/`sanitize_callback`, or WP's own URL routing — this is
	 * the one test that dispatches a real request through `$wp_rest_server` on a path built the
	 * way `WP_REST_Request::from_url()`/a browser `fetch()` would build it, so both a route
	 * character class that excludes spaces and a handler that fails to decode the percent-escapes
	 * (as it once did — a raw, unencoded path segment is not a request shape any real client can
	 * send) would fail this test with a 404 instead of shipping unnoticed.
	 *
	 * @return void
	 */
	public function testGroupNameWithASpaceIsReachableThroughRealRestDispatch(): void {
		$slug   = Token_Store::default_slug();
		$schema = $this->registry->to_ui_schema();

		$group = null;

		foreach ( array_keys( $schema['groups'] ) as $candidate ) {
			if ( str_contains( $candidate, ' ' ) ) {
				$group = $candidate;
				break;
			}
		}

		$this->assertNotNull( $group, 'At least one declared UI-schema group must contain a space (e.g. "Font Size").' );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );

		$request = new WP_REST_Request( 'DELETE', '/kb-design-tokens/v1/documents/' . $slug . '/order/' . rawurlencode( $group ) );
		$request->set_param( 'version', $this->store->get_version( $slug ) );

		global $wp_rest_server;
		$response = $wp_rest_server->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status(), 'The group route must match a percent-encoded multi-word label rather than 404 at the routing layer.' );
	}

	/**
	 * A stale client version is rejected with 409, and the document is left unchanged.
	 *
	 * @return void
	 */
	public function testStaleVersionReturns409AndDocumentIsUnchanged(): void {
		$slug  = Token_Store::default_slug();
		$group = $this->group();

		$this->controller->set_order(
			$this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), array_reverse( $this->group_ids ) )
		);

		$stored_before = $this->store->get_document( $slug );

		$response = $this->controller->set_order( $this->order_request( 'PUT', $slug, $group, 'stale-version', $this->group_ids ) );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_conflict', $response->get_error_code() );
		$this->assertSame( WP_Http::CONFLICT, $response->get_error_data()['status'] );
		$this->assertSame( $stored_before, $this->store->get_document( $slug ) );
	}

	/**
	 * The narrowed write path lets a reorder succeed even in a library whose stored document
	 * currently fails full DTCG validation, and leaves the invalid remainder untouched.
	 *
	 * @return void
	 */
	public function testNarrowedPathAllowsAReorderInALibraryThatFailsFullValidation(): void {
		$slug    = Token_Store::default_slug();
		$group   = $this->group();
		$invalid = '{"primitive":{"color":{"x":{"$type":"color","$value":"not-a-color"}}}}';

		$this->store->save_document( $invalid );

		$response = $this->controller->set_order(
			$this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), array_reverse( $this->group_ids ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( array_reverse( $this->group_ids ), $this->order_index->all( $stored ) );
		$this->assertSame( 'not-a-color', $stored['primitive']['color']['x']['$value'], 'The pre-existing invalid remainder must be left untouched.' );
	}

	/**
	 * Order applies to a user-created token exactly like a baseline token: mint one, order it
	 * first, and confirm the feed sequence reflects it.
	 *
	 * @return void
	 */
	public function testOrderAppliesToAUserCreatedTokenLikeABaselineToken(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.brand-blue';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'color' => [
						'custom' => [
							'brand-blue' => [
								'$type'  => 'color',
								'$value' => '#1a56db',
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [ 'label' => 'Brand Blue' ],
						],
					],
				],
			]
		);

		$this->store->save_document( $document, $slug );

		/** @var User_Primitive_Registrar $registrar */
		$registrar = $this->container->get( User_Primitive_Registrar::class );
		$registrar->sync();

		$schema = $this->registry->to_ui_schema();
		$group  = null;

		foreach ( $schema['groups'] as $candidate => $rows ) {
			if ( in_array( $id, array_column( $rows, 'id' ), true ) ) {
				$group = $candidate;
				break;
			}
		}

		$this->assertNotNull( $group, 'The newly created primitive must appear in some UI-schema group.' );

		$response = $this->controller->set_order( $this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), [ $id ] ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$this->assertSame( $id, $this->assembled_group_ids( $slug, $group )[0] );
	}

	/**
	 * A user-created token minted into a declared group (the border-radius scale, decision 3)
	 * is addressable through that group's order route exactly like its baseline siblings — the
	 * grouping is not merely cosmetic, it participates in persisted sort order.
	 *
	 * @return void
	 */
	public function testOrderIncludesAGroupedCustomToken(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.radius-md';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'dimension' => [
						'custom' => [
							'radius-md' => [
								'$type'  => 'dimension',
								'$value' => '0.75rem',
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'Radius MD',
								'group' => 'border-radius',
							],
						],
					],
				],
			]
		);

		$this->store->save_document( $document, $slug );

		/** @var User_Primitive_Registrar $registrar */
		$registrar = $this->container->get( User_Primitive_Registrar::class );
		$registrar->sync();

		$schema = $this->registry->to_ui_schema();
		$this->assertArrayHasKey( 'Border Radius', $schema['groups'] );

		$group_ids = array_column( $schema['groups']['Border Radius'], 'id' );
		$this->assertContains( $id, $group_ids, 'The grouped custom token must appear in the declared feed group.' );

		$response = $this->controller->set_order(
			$this->order_request( 'PUT', $slug, 'Border Radius', $this->store->get_version( $slug ), [ $id ] )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( $id, $this->assembled_group_ids( $slug, 'Border Radius' )[0] );
	}

	/**
	 * Both routes enforce the sibling document routes' capability filter: an unauthenticated
	 * request and a subscriber are both refused.
	 *
	 * @return void
	 */
	public function testPermissionsRefuseUnauthenticatedAndSubscriberRequests(): void {
		$request = new WP_REST_Request( 'PUT' );

		$this->assertInstanceOf( WP_Error::class, $this->controller->update_item_permissions_check( $request ) );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$this->assertInstanceOf( WP_Error::class, $this->controller->update_item_permissions_check( $request ) );
	}

	/**
	 * A stored order never reaches the effective (rendering) document — $extensions is stripped
	 * there, so order can never leak into projected CSS.
	 *
	 * @return void
	 */
	public function testTheOrderNeverReachesTheEffectiveDocument(): void {
		$slug  = Token_Store::default_slug();
		$group = $this->group();

		$this->controller->set_order(
			$this->order_request( 'PUT', $slug, $group, $this->store->get_version( $slug ), array_reverse( $this->group_ids ) )
		);

		$stored = json_decode( $this->store->get_document( $slug ), true );

		/** @var Effective_Document $effective */
		$effective = $this->container->get( Effective_Document::class );

		$this->assertArrayNotHasKey( '$extensions', $effective->build( $stored ) );
	}

	/**
	 * Read back the assembled feed's ordered id list for one group.
	 *
	 * @param string $slug  The token library slug.
	 * @param string $group The UI-schema group name.
	 *
	 * @return list<string>
	 */
	private function assembled_group_ids( string $slug, string $group ): array {
		$response = $this->controller->get_item( $this->slug_request( $slug ) );
		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$document = $response->get_data()['document'];
		$order    = $this->order_index->all( $document );
		$schema   = $this->registry->to_ui_schema()['groups'][ $group ];

		$rows_by_id = array_column( $schema, null, 'id' );
		$sorted     = [];

		foreach ( $order as $id ) {
			if ( isset( $rows_by_id[ $id ] ) ) {
				$sorted[ $id ] = $rows_by_id[ $id ];
			}
		}

		return array_column( array_values( $sorted + $rows_by_id ), 'id' );
	}

	/**
	 * Build a bare slug-only request, for get_item().
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return WP_REST_Request
	 */
	private function slug_request( string $slug ): WP_REST_Request {
		$request = new WP_REST_Request( 'GET' );
		$request->set_param( 'slug', $slug );

		return $request;
	}

	/**
	 * Build an order sub-route request carrying the slug, group, version and (for PUT) the
	 * submitted id list.
	 *
	 * @param string        $method  The HTTP method.
	 * @param string        $slug    The token library slug.
	 * @param string        $group   The UI-schema group name.
	 * @param string        $version The client's last-read version.
	 * @param list<string>|null $order The submitted ordered id list, for PUT requests only.
	 *
	 * @return WP_REST_Request
	 */
	private function order_request( string $method, string $slug, string $group, string $version, ?array $order = null ): WP_REST_Request {
		$request = new WP_REST_Request( $method );
		$request->set_param( 'slug', $slug );
		$request->set_param( 'group', $group );
		$request->set_param( 'version', $version );

		if ( $order !== null ) {
			$request->set_param( 'order', $order );
		}

		return $request;
	}
}
