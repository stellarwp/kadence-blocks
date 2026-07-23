<?php declare( strict_types=1 );
// cspell:ignore advancedbtn advancedheading .

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Variants_Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use ReflectionClass;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the read and write surface of the Design Tokens variants controller: the registered routes, the
 * baseline-merged reads, and the per-block / per-variant / default writes against the real shipped baseline.
 */
final class VariantsControllerTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

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
		$variant_route = $this->controller_constant( 'VARIANT_ROUTE' );

		$collection = "/$namespace/$base";
		$block      = "/$namespace/$base/$block_route";
		$default    = "/$namespace/$base/$block_route/$default_route";
		$variant    = "/$namespace/$base/$block_route/$variant_route";

		foreach ( [ $collection, $block, $default, $variant ] as $route ) {
			$this->assertArrayHasKey( $route, $this->rest_server->get_routes(), "Route $route should be registered." );

			$options = $this->rest_server->get_route_options( $route );
			$this->assertArrayHasKey( 'schema', $options, "Route $route should expose a schema." );
			$this->assertIsCallable( $options['schema'] );
		}

		// The block route declares both block path segments and accepts the full CRUD verb set.
		$this->assertArrayHasKey( $this->controller_constant( 'VENDOR_PARAM' ), $this->rest_server->get_routes()[ $block ][0]['args'] );
		$this->assertArrayHasKey( $this->controller_constant( 'BLOCK_NAME_PARAM' ), $this->rest_server->get_routes()[ $block ][0]['args'] );

		foreach ( [ 'GET', 'POST', 'PUT', 'DELETE' ] as $method ) {
			$this->assertContains( $method, $this->route_methods( $block ), "Block route should accept $method." );
		}

		$this->assertContains( 'DELETE', $this->route_methods( $variant ) );
		$this->assertContains( 'PUT', $this->route_methods( $default ) );
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
		$this->assertArrayHasKey( 'secondary', $data['variants'] );
	}

	/**
	 * @return void
	 */
	public function testGetItemReflectsAStoredOverride(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
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
		// kadence/spacer has no baseline variant data and no variant set registered for it.
		$result = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, 'kadence/spacer' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * A create deep-merges a single variant into the set, leaving the baseline siblings and the default in
	 * place.
	 *
	 * @return void
	 */
	public function testCreateMergesASingleVariantPreservingSiblingsAndDefault(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'outline',
					'label'   => 'Outline',
					'tokens'  => $this->button_tokens(),
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		// First write to the set reports 201 Created.
		$this->assertSame( WP_Http::CREATED, $response->get_status() );

		$data = $response->get_data();

		// The new variant lands while the baseline siblings and the default survive.
		$this->assertArrayHasKey( 'outline', $data['variants'] );
		$this->assertArrayHasKey( 'primary', $data['variants'] );
		$this->assertArrayHasKey( 'secondary', $data['variants'] );
		$this->assertSame( 'primary', $data['default'] );
	}

	/**
	 * A write carrying a known `set` slug lands in that set and reports it, while the default set is left
	 * untouched — so a variant authored for a block on a non-default set does not leak into the default set.
	 *
	 * @return void
	 */
	public function testWritesTargetTheNamedSetLeavingDefaultUntouched(): void {
		// The target set must already exist for the `set` parameter to be honored.
		$this->store->save_document( '', 'dark' );

		$tokens = [
			'button-bg'         => '#ff0000',
			'button-text'       => '#ffffff',
			'button-bg-hover'   => '#cc0000',
			'button-text-hover' => '#ffffff',
			'button-radius'     => '1rem',
		];

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'accent',
					'label'   => 'Accent',
					'tokens'  => $tokens,
					'set'     => 'dark',
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( 'dark', $response->get_data()['slug'] );
		$this->assertArrayHasKey( 'accent', $response->get_data()['variants'] );

		// Reading the dark set sees the new variant.
		$dark = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON, [ 'set' => 'dark' ] ) );
		$this->assertArrayHasKey( 'accent', $dark->get_data()['variants'] );

		// The default set never saw the write.
		$default = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) );
		$this->assertArrayNotHasKey( 'accent', $default->get_data()['variants'] );
	}

	/**
	 * @return void
	 */
	public function testCreateRequiresAVariantSlug(): void {
		$result = $this->controller->create_item(
			$this->block_request( WP_REST_Server::CREATABLE, self::BUTTON, [ 'tokens' => [ 'button-bg' => 'transparent' ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::BAD_REQUEST, $result->get_error_data()['status'] );
	}

	/**
	 * A replace (PUT) stores exactly the submitted variant set, dropping any override variant the body omits
	 * while the baseline variants remain visible.
	 *
	 * @return void
	 */
	public function testUpdateReplacesTheStoredVariantSet(): void {
		// Seed two override-only variants, then PUT a set that keeps only one of them.
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'outline',
					'tokens'  => $this->button_tokens(),
				]
			)
		);
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'dashed',
					'tokens'  => $this->button_tokens(),
				]
			)
		);

		$response = $this->controller->update_item(
			$this->block_request(
				'PUT',
				self::BUTTON,
				[ 'variants' => [ 'outline' => [ 'tokens' => $this->button_tokens() ] ] ]
			)
		);

		$data = $response->get_data();

		// The override "dashed" is dropped; "outline" survives. Baseline variants always remain visible.
		$this->assertArrayNotHasKey( 'dashed', $data['variants'] );
		$this->assertArrayHasKey( 'outline', $data['variants'] );
		$this->assertArrayHasKey( 'primary', $data['variants'] );
	}

	/**
	 * Deleting the block resets it to baseline: the stored override variant is gone and the baseline variants
	 * render again.
	 *
	 * @return void
	 */
	public function testDeleteItemResetsTheBlockToBaseline(): void {
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'outline',
					'tokens'  => $this->button_tokens(),
				]
			)
		);

		$response = $this->controller->delete_item( $this->block_request( WP_REST_Server::DELETABLE, self::BUTTON ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();

		// The override is gone; the block renders its baseline variants again.
		$this->assertArrayNotHasKey( 'outline', $data['variants'] );
		$this->assertArrayHasKey( 'primary', $data['variants'] );
	}

	/**
	 * Deleting a single override variant drops just that variant from the stored set.
	 *
	 * @return void
	 */
	public function testDeleteVariantRemovesAnOverrideVariant(): void {
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'outline',
					'tokens'  => $this->button_tokens(),
				]
			)
		);

		$response = $this->controller->delete_variant( $this->variant_request( self::BUTTON, 'outline' ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertArrayNotHasKey( 'outline', $response->get_data()['variants'] );
	}

	/**
	 * @return void
	 */
	public function testDeleteVariantIsAnIdempotentNoOpWhenAbsent(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
			. '"outline":{"tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$response = $this->controller->delete_variant( $this->variant_request( self::BUTTON, 'never-stored' ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		// Nothing was removed, so no write happened and the version is unchanged.
		$this->assertSame( $version_before, $this->store->get_version( Token_Store::default_slug() ) );
	}

	/**
	 * Removing a variant the effective set still defaults to is rejected before commit, so the default is
	 * never left dangling.
	 *
	 * @return void
	 */
	public function testDeletingTheDefaultVariantIsRejected(): void {
		// Make an override-only variant the default, then try to delete it out from under the default.
		$this->controller->update_item(
			$this->block_request(
				'PUT',
				self::BUTTON,
				[
					'variants' => [ 'outline' => [ 'tokens' => $this->button_tokens() ] ],
					'default'  => 'outline',
				]
			)
		);

		$result = $this->controller->delete_variant( $this->variant_request( self::BUTTON, 'outline' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testSetDefaultToAnExistingVariant(): void {
		$response = $this->controller->set_default( $this->default_request( self::BUTTON, 'secondary' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( 'secondary', $response->get_data()['default'] );
	}

	/**
	 * @return void
	 */
	public function testSetDefaultToAMissingVariantIsRejected(): void {
		$result = $this->controller->set_default( $this->default_request( self::BUTTON, 'does-not-exist' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
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
	 * A token value that is neither an alias nor a non-empty literal is rejected by the DTCG validator, even
	 * when the surface is otherwise complete.
	 *
	 * @return void
	 */
	public function testAnInvalidVariantTokenValueReturns422(): void {
		// An empty-string token value is neither an alias nor a non-empty literal; the DTCG validator rejects it.
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'broken',
					'tokens'  => $this->button_tokens( [ 'button-bg' => '' ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertNotEmpty( $result->get_error_data()['errors'] );
		// The write was rejected before commit.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A variant that sets a property the block does not bind is rejected: an unbound property could never
	 * project, so it must not be storable.
	 *
	 * @return void
	 */
	public function testAnUnboundPropertyIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'accent',
					'tokens'  => $this->button_tokens( [ 'not-a-bound-prop' => '#ff0000' ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unbound_property', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertContains( 'not-a-bound-prop', $result->get_error_data()['properties'] );
	}

	/**
	 * A variant may define a SUBSET of the block's bound surface: a variant that leaves a bound property
	 * unset is accepted and stored with exactly the properties it defines. The property it omits is inherited
	 * from the block $default through the cascade rather than being required here.
	 *
	 * @return void
	 */
	public function testAnIncompleteSurfaceIsAccepted(): void {
		$tokens = $this->button_tokens();
		unset( $tokens['button-radius'] );

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'accent',
					'tokens'  => $tokens,
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status() );

		// The variant is stored with only the properties it defined; button-radius is absent.
		$stored = $response->get_data()['variants']['accent']['tokens'];
		$this->assertArrayHasKey( 'button-bg', $stored );
		$this->assertArrayNotHasKey( 'button-radius', $stored );
	}

	/**
	 * A captured literal that matches a semantic is stored as that semantic's alias, so the variant re-joins
	 * the theming cascade, while a literal with no match is stored as-is.
	 *
	 * @return void
	 */
	public function testCreateAliasesAMatchingLiteral(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'accent',
					// #3633e1 matches the primary button background semantic; the rgba value matches nothing.
					'tokens'  => $this->button_tokens(
						[
							'button-bg'   => '#3633e1',
							'button-text' => 'rgba(1,2,3,0.42)',
						] 
					),
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$tokens = $response->get_data()['variants']['accent']['tokens'];

		$this->assertTrue( Alias::is_alias( $tokens['button-bg'] ) );
		$this->assertSame( 'rgba(1,2,3,0.42)', $tokens['button-text'] );
	}

	/**
	 * A hand-supplied variant alias that does not resolve to a token is rejected before commit, since a
	 * dangling variant alias lives under $extensions where the token dry-run never sees it.
	 *
	 * @return void
	 */
	public function testADanglingVariantAliasIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'accent',
					'tokens'  => $this->button_tokens( [ 'button-bg' => '{semantic.color.does-not-exist}' ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unresolvable', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * Creating a variant named "default" is rejected: the slug is reserved for the block's default sub-route
	 * and could never be deleted or set through the dedicated route.
	 *
	 * @return void
	 */
	public function testCreatingAVariantNamedDefaultIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'default',
					'tokens'  => $this->button_tokens(),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_reserved_slug', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testAMalformedVariantShapeReturns422(): void {
		$result = $this->controller->update_item(
			$this->block_request( 'PUT', self::BUTTON, [ 'variants' => [ 'bad' => 'not-an-object' ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testAnEmptyVariantSlugIsRejected(): void {
		// An empty key in the variants map would store a variant node keyed by "" — reject it, mirroring the
		// documents controller's empty dot-path-segment guard.
		$result = $this->controller->update_item(
			$this->block_request( 'PUT', self::BUTTON, [ 'variants' => [ '' => [ 'tokens' => [ 'button-bg' => 'transparent' ] ] ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
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
	 * A committed write re-hashes the set version so downstream caches invalidate.
	 *
	 * @return void
	 */
	public function testAWriteBumpsTheVersion(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
			. '"outline":{"tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'variant' => 'dashed',
					'tokens'  => $this->button_tokens(),
				]
			)
		);

		$this->assertNotSame( $version_before, $this->store->get_version( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testReadRoutesAreGatedByTheCapability(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );

		// Both read callbacks gate the routes (get_items for the collection, get_item for a single block and
		// its default), so both must deny a user without the capability and allow one that has it.
		$checks = [ 'get_items_permissions_check', 'get_item_permissions_check' ];

		// A logged-out user is denied.
		wp_set_current_user( 0 );

		foreach ( $checks as $check ) {
			$result = $this->controller->$check( $request );

			$this->assertInstanceOf( WP_Error::class, $result, "$check should deny a logged-out user." );
			$this->assertSame( 'rest_forbidden', $result->get_error_code() );
		}

		// An authenticated user without edit_theme_options is denied.
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		foreach ( $checks as $check ) {
			$result = $this->controller->$check( $request );

			$this->assertInstanceOf( WP_Error::class, $result, "$check should deny a subscriber." );
			$this->assertSame( 'rest_forbidden', $result->get_error_code() );
		}

		// An administrator (edit_theme_options) is allowed.
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );

		foreach ( $checks as $check ) {
			$this->assertTrue( $this->controller->$check( $request ), "$check should allow an administrator." );
		}
	}

	/**
	 * Build a request for a single block route, splitting the block name into its two path segments and
	 * carrying any extra body parameters.
	 *
	 * @param string               $method The HTTP method.
	 * @param string               $block  The block name, e.g. "kadence/singlebtn".
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
	 * The button's full bound surface as literal values, so a written variant satisfies the full-surface
	 * guard. Individual properties can be overridden for a specific assertion.
	 *
	 * @param array<string, string> $overrides Property values to override on the base surface.
	 *
	 * @return array<string, string>
	 */
	private function button_tokens( array $overrides = [] ): array {
		return array_merge(
			[
				'button-bg'         => 'transparent',
				'button-text'       => '#ffffff',
				'button-bg-hover'   => 'transparent',
				'button-text-hover' => '#ffffff',
				'button-radius'     => '0.5rem',
			],
			$overrides
		);
	}

	/**
	 * Build a single-variant request: the block segments plus the variant slug.
	 *
	 * @param string $block   The block name.
	 * @param string $variant The variant slug.
	 *
	 * @return WP_REST_Request
	 */
	private function variant_request( string $block, string $variant ): WP_REST_Request {
		return $this->block_request( WP_REST_Server::DELETABLE, $block, [ 'variant' => $variant ] );
	}

	/**
	 * Build a set-default request: the block segments plus the default variant slug.
	 *
	 * @param string $block        The block name.
	 * @param string $default_slug The default variant slug.
	 *
	 * @return WP_REST_Request
	 */
	private function default_request( string $block, string $default_slug ): WP_REST_Request {
		return $this->block_request( 'PUT', $block, [ 'default' => $default_slug ] );
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
