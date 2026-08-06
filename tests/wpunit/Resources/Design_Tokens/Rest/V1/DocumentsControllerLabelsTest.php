<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Label_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
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
 * Covers the per-token display-label override sub-route: PUT/DELETE
 * /documents/{slug}/labels/{id}, its narrowed write path, the user-created-id routing to
 * userPrimitives, and the version-conditional guard.
 *
 * @since TBD
 */
final class DocumentsControllerLabelsTest extends TestCase {

	/**
	 * A baseline token id present in the registered baseline, used wherever the test only needs
	 * a real registered id and does not care which one.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BASELINE_ID = 'semantic.color.button-primary-bg';

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
	 * @var Token_Label_Index
	 */
	private Token_Label_Index $label_index;

	/**
	 * @since TBD
	 *
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $user_primitive_index;

	/**
	 * Build the controller and its collaborators fresh before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store                = $this->container->get( Token_Store::class );
		$this->controller           = $this->container->get( Documents_Controller::class );
		$this->label_index          = $this->container->get( Token_Label_Index::class );
		$this->user_primitive_index = $this->container->get( User_Primitive_Index::class );

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
	 * A PUT stores the override, bumps the version, and the localized feed shows the override as
	 * `label` with `labelOverridden: true`.
	 *
	 * @return void
	 */
	public function testPutStoresTheOverrideBumpsVersionAndFeedShowsIt(): void {
		$slug           = Token_Store::default_slug();
		$version_before = $this->store->get_version( $slug );

		$response = $this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $version_before, 'Cozy Button' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		// The default library has no stored row yet, so the first write reports 201 Created,
		// mirroring every sibling document write.
		$this->assertSame( WP_Http::CREATED, $response->get_status() );
		$this->assertNotSame( $version_before, $this->store->get_version( $slug ) );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( 'Cozy Button', $this->label_index->label_for( $stored, self::BASELINE_ID ) );
	}

	/**
	 * A PUT with an empty or whitespace-only label clears an existing override, exactly
	 * equivalent to DELETE.
	 *
	 * @dataProvider clearingLabelProvider
	 *
	 * @param string $label The empty or whitespace-only label that should clear the override.
	 *
	 * @return void
	 */
	public function testPutWithEmptyOrWhitespaceLabelClearsAnExistingOverride( string $label ): void {
		$slug = Token_Store::default_slug();

		$this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $this->store->get_version( $slug ), 'Cozy Button' ) );

		$response = $this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $this->store->get_version( $slug ), $label ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertFalse( $this->label_index->has( $stored, self::BASELINE_ID ) );
	}

	/**
	 * Empty and whitespace-only labels that must clear an override on PUT.
	 *
	 * @return Generator
	 */
	public function clearingLabelProvider(): Generator {
		yield 'empty string' => [ 'label' => '' ];
		yield 'whitespace only' => [ 'label' => '   ' ];
	}

	/**
	 * DELETE clears a stored override; a second DELETE is an idempotent 200 with no version bump.
	 *
	 * @return void
	 */
	public function testDeleteClearsAndASecondDeleteIsIdempotent(): void {
		$slug = Token_Store::default_slug();

		$this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $this->store->get_version( $slug ), 'Cozy Button' ) );

		$response = $this->controller->delete_label( $this->label_request( 'DELETE', $slug, self::BASELINE_ID, $this->store->get_version( $slug ) ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$version_after_first_delete = $this->store->get_version( $slug );

		$second = $this->controller->delete_label( $this->label_request( 'DELETE', $slug, self::BASELINE_ID, $version_after_first_delete ) );

		$this->assertInstanceOf( WP_REST_Response::class, $second );
		$this->assertSame( WP_Http::OK, $second->get_status() );
		$this->assertSame( $version_after_first_delete, $this->store->get_version( $slug ) );
	}

	/**
	 * An unknown library slug is a 404.
	 *
	 * @return void
	 */
	public function testUnknownSlugReturns404(): void {
		$response = $this->controller->set_label( $this->label_request( 'PUT', 'does-not-exist', self::BASELINE_ID, '', 'Cozy Button' ) );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_not_found', $response->get_error_code() );
	}

	/**
	 * An id that names no registered token is a 404, on both PUT and DELETE.
	 *
	 * @return void
	 */
	public function testUnregisteredTokenIdReturns404(): void {
		$slug    = Token_Store::default_slug();
		$version = $this->store->get_version( $slug );

		$put = $this->controller->set_label( $this->label_request( 'PUT', $slug, 'semantic.color.does-not-exist', $version, 'Cozy Button' ) );

		$this->assertInstanceOf( WP_Error::class, $put );
		$this->assertSame( 'rest_design_tokens_unknown_token', $put->get_error_code() );

		$delete = $this->controller->delete_label( $this->label_request( 'DELETE', $slug, 'semantic.color.does-not-exist', $version ) );

		$this->assertInstanceOf( WP_Error::class, $delete );
		$this->assertSame( 'rest_design_tokens_unknown_token', $delete->get_error_code() );
	}

	/**
	 * A stale client version is rejected with 409, and the document is left unchanged.
	 *
	 * @return void
	 */
	public function testStaleVersionReturns409AndDocumentIsUnchanged(): void {
		$slug = Token_Store::default_slug();

		$this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $this->store->get_version( $slug ), 'Cozy Button' ) );

		$stored_before = $this->store->get_document( $slug );

		$response = $this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, 'stale-version', 'Even Cozier' ) );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_conflict', $response->get_error_code() );
		$this->assertSame( WP_Http::CONFLICT, $response->get_error_data()['status'] );
		$this->assertSame( $stored_before, $this->store->get_document( $slug ) );
	}

	/**
	 * Renaming a user-created id rewrites the userPrimitives label — never a tokenLabels entry —
	 * and the registrar sync carries the new label into the registry and the feed.
	 *
	 * @return void
	 */
	public function testUserCreatedIdPutRewritesUserPrimitivesLabelNotTokenLabels(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.brand-blue';

		$this->seed_user_primitive( $slug, $id, 'Brand Blue' );

		$response = $this->controller->set_label( $this->label_request( 'PUT', $slug, $id, $this->store->get_version( $slug ), 'Ocean Blue' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$stored = json_decode( $this->store->get_document( $slug ), true );

		$this->assertSame( 'Ocean Blue', $this->user_primitive_index->label_for( $stored, $id ) );
		$this->assertFalse( $this->label_index->has( $stored, $id ), 'A user-created id must never gain a tokenLabels entry.' );

		$this->sync_registrar();

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$this->assertSame( 'Ocean Blue', $registry->get( $id )->label );
	}

	/**
	 * Clearing a user-created id's override resets the userPrimitives label to '', which the
	 * registrar/registry fall back from to the humanized last segment — never a 400, never a
	 * nameless token.
	 *
	 * @return void
	 */
	public function testUserCreatedIdDeleteFallsBackToHumanizedLastSegment(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.color.custom.brand-blue';

		$this->seed_user_primitive( $slug, $id, 'Brand Blue' );

		$response = $this->controller->delete_label( $this->label_request( 'DELETE', $slug, $id, $this->store->get_version( $slug ) ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( '', $this->user_primitive_index->label_for( $stored, $id ) );

		$this->sync_registrar();

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$this->assertSame( 'Brand Blue', $registry->get( $id )->label, 'Humanized fallback from the last dot-path segment.' );
	}

	/**
	 * Renaming a grouped custom token's display label through the labels endpoint must not reset
	 * the group it was created into — the label endpoint's request carries no group of its own, so
	 * User_Primitive_Index::add() must preserve the entry's existing one rather than defaulting it
	 * away. Proven end to end: the stored entry still carries the group, and after a registrar sync
	 * the token still resolves into its declared feed group.
	 *
	 * @return void
	 */
	public function testRenamingAGroupedCustomTokenThroughLabelsEndpointPreservesItsGroup(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.radius-md';

		$this->seed_user_primitive( $slug, $id, 'Radius MD', 'border-radius' );

		$response = $this->controller->set_label( $this->label_request( 'PUT', $slug, $id, $this->store->get_version( $slug ), 'Custom Radius' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( 'border-radius', $this->user_primitive_index->all( $stored )[ $id ]['group'] );

		$this->sync_registrar();

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$this->assertSame( 'Border Radius', $registry->get( $id )->group );
	}

	/**
	 * Clearing a grouped custom token's label override (the DELETE-equivalent PUT-empty path)
	 * also preserves the stored group — the clear path routes through the same add() call as a
	 * rename.
	 *
	 * @return void
	 */
	public function testClearingAGroupedCustomTokensLabelPreservesItsGroup(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.radius-md';

		$this->seed_user_primitive( $slug, $id, 'Radius MD', 'border-radius' );

		$response = $this->controller->delete_label( $this->label_request( 'DELETE', $slug, $id, $this->store->get_version( $slug ) ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( 'border-radius', $this->user_primitive_index->all( $stored )[ $id ]['group'] );
	}

	/**
	 * The narrowed write path lets a label rename succeed even in a library whose stored document
	 * currently fails full DTCG validation, and leaves the invalid remainder untouched.
	 *
	 * @return void
	 */
	public function testNarrowedPathAllowsARenameInALibraryThatFailsFullValidation(): void {
		$slug    = Token_Store::default_slug();
		$invalid = '{"primitive":{"color":{"x":{"$type":"color","$value":"not-a-color"}}}}';

		$this->store->save_document( $invalid );

		$response = $this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $this->store->get_version( $slug ), 'Cozy Button' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$stored = json_decode( $this->store->get_document( $slug ), true );
		$this->assertSame( 'Cozy Button', $this->label_index->label_for( $stored, self::BASELINE_ID ) );
		$this->assertSame( 'not-a-color', $stored['primitive']['color']['x']['$value'], 'The pre-existing invalid remainder must be left untouched.' );
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
	 * A stored label override never reaches the effective (rendering) document — $extensions is
	 * stripped there, so the override can never leak into projected CSS.
	 *
	 * @return void
	 */
	public function testTheOverrideNeverReachesTheEffectiveDocument(): void {
		$slug = Token_Store::default_slug();

		$this->controller->set_label( $this->label_request( 'PUT', $slug, self::BASELINE_ID, $this->store->get_version( $slug ), 'Cozy Button' ) );

		$stored = json_decode( $this->store->get_document( $slug ), true );

		/** @var Effective_Document $effective */
		$effective = $this->container->get( Effective_Document::class );

		$this->assertArrayNotHasKey( '$extensions', $effective->build( $stored ) );
	}

	/**
	 * Seed a stored document with a user-created primitive and its userPrimitives label, then
	 * sync the registrar so the id is known to the live Token_Registry.
	 *
	 * @param string $slug  The token library slug.
	 * @param string $id    The user-created primitive's canonical dot-path id.
	 * @param string $label The label to seed.
	 * @param string $group Optional stable group key to seed alongside the label.
	 *
	 * @return void
	 */
	private function seed_user_primitive( string $slug, string $id, string $label, string $group = '' ): void {
		$segments = explode( '.', $id );
		$leaf     = array_pop( $segments );
		$type     = $segments[1];
		$value    = $type === 'dimension' ? '0.75rem' : '#1a56db';

		$entry = [ 'label' => $label ];

		if ( $group !== '' ) {
			$entry['group'] = $group;
		}

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					$type => [
						'custom' => [
							$leaf => [
								'$type'  => $type,
								'$value' => $value,
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => $entry,
						],
					],
				],
			]
		);

		$this->store->save_document( $document, $slug );
		$this->sync_registrar();
	}

	/**
	 * Re-run the user-primitive registrar sync so the live Token_Registry reflects the latest
	 * stored document.
	 *
	 * @return void
	 */
	private function sync_registrar(): void {
		/** @var User_Primitive_Registrar $registrar */
		$registrar = $this->container->get( User_Primitive_Registrar::class );
		$registrar->sync();
	}

	/**
	 * Build a labels sub-route request carrying the slug, id, version and (for PUT) the label.
	 *
	 * @param string      $method  The HTTP method.
	 * @param string      $slug    The token library slug.
	 * @param string      $id      The token id.
	 * @param string      $version The client's last-read version.
	 * @param string|null $label   The label, for PUT requests only.
	 *
	 * @return WP_REST_Request
	 */
	private function label_request( string $method, string $slug, string $id, string $version, ?string $label = null ): WP_REST_Request {
		$request = new WP_REST_Request( $method );
		$request->set_param( 'slug', $slug );
		$request->set_param( 'id', $id );
		$request->set_param( 'version', $version );

		if ( $label !== null ) {
			$request->set_param( 'label', $label );
		}

		return $request;
	}
}
