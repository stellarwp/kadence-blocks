<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Localizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\User_Primitive_Registrar;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Feed_Controller;
use ReflectionClass;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the feed endpoint: it must return exactly the payload shape the page-load Localizer
 * prints, for a named library and for the default library, and must gate on capability and
 * refuse an unknown slug.
 */
final class Feed_ControllerTest extends TestCase {

	private const DASHBOARD_HANDLE = 'admin-kadence-home';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @var Feed_Controller
	 */
	private Feed_Controller $controller;

	/**
	 * @var WP_REST_Server
	 */
	private WP_REST_Server $rest_server;

	/**
	 * Boots the container-resolved stores and controller, and a fresh REST server, before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store      = $this->container->get( Token_Store::class );
		$this->active     = $this->container->get( Active_Token_Library_Store::class );
		$this->controller = $this->container->get( Feed_Controller::class );

		global $wp_rest_server;
		$this->rest_server = new WP_REST_Server();
		$wp_rest_server    = $this->rest_server;
		do_action( 'rest_api_init' );
	}

	/**
	 * Resets the current user, the active-library pointer, and the global REST server after each
	 * test, and clears the resolver memo so values resolved here do not leak into later test
	 * classes.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		wp_set_current_user( 0 );
		$this->active->set( Token_Store::default_slug() );

		global $wp_rest_server;
		$wp_rest_server = null;

		if ( wp_script_is( self::DASHBOARD_HANDLE, 'registered' ) ) {
			wp_dequeue_script( self::DASHBOARD_HANDLE );
			wp_deregister_script( self::DASHBOARD_HANDLE );
		}

		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		parent::tearDown();
	}

	/**
	 * The controller registers a readable route with the slug segment, exposing a callable schema.
	 *
	 * @return void
	 */
	public function testItRegistersTheReadRouteWithArgsAndSchema(): void {
		$namespace  = $this->controller_property( 'namespace' );
		$base       = $this->controller_property( 'rest_base' );
		$slug_route = $this->controller_constant( 'SLUG_ROUTE' );

		$route = "/$namespace/$base/$slug_route";

		$this->assertContains( 'GET', $this->route_methods( $route ) );

		$options = $this->rest_server->get_route_options( $route );
		$this->assertArrayHasKey( 'schema', $options );
		$this->assertIsCallable( $options['schema'] );
	}

	/**
	 * The default library's feed carries every key the Builder emits.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheFullPayloadForTheDefaultLibrary(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$response = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();

		foreach ( [ 'active', 'resolved', 'version', 'slug', 'schema', 'values', 'presets', 'presetNav', 'responsive', 'rest' ] as $key ) {
			$this->assertArrayHasKey( $key, $data, "Feed payload should carry \"$key\"." );
		}

		$this->assertTrue( $data['active'] );
		$this->assertTrue( $data['resolved'] );
		$this->assertSame( Token_Store::default_slug(), $data['slug'] );
		$this->assertSame( '#3633e1', $data['values']['semantic.color.button-primary-bg'] );
	}

	/**
	 * A named, non-default library's feed reports its own slug and values, distinct from the
	 * default library.
	 *
	 * @return void
	 */
	public function testGetItemReturnsThePayloadForANamedLibrary(): void {
		$doc = (string) wp_json_encode(
			[
				'semantic' => [
					'color' => [
						'button-primary-bg' => [
							'$type'  => 'color',
							'$value' => '#0f7a3d',
						],
					],
				],
			]
		);

		$this->store->save_document( $doc, 'brand-b' );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'brand-b' );

		$response = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();
		$this->assertSame( 'brand-b', $data['slug'] );
		$this->assertSame( '#0f7a3d', $data['values']['semantic.color.button-primary-bg'] );
	}

	/**
	 * The feed carries the library's stored label, so a client can name the library it is showing
	 * from the page-load payload alone instead of waiting on the separate libraries request.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheStoredTitle(): void {
		$this->store->save_document( '{}', 'brand-b', 'Winter 2026' );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'brand-b' );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertSame( 'Winter 2026', $data['title'] );
	}

	/**
	 * A library with no stored label reports an empty title rather than its slug or any other
	 * synthesized value, leaving the client to decide how to name an untitled library.
	 *
	 * @return void
	 */
	public function testGetItemReturnsAnEmptyTitleForAnUntitledLibrary(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'brand-b' );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertSame( '', $data['title'] );
	}

	/**
	 * A stored tokenLabels override surfaces directly through this endpoint's schema, independent
	 * of the Localizer — proving the override reaches the REST feed specifically, not merely that
	 * the two callers happen to agree with each other.
	 *
	 * @return void
	 */
	public function testGetItemReturnsStoredTokenLabelOverrides(): void {
		$doc = (string) wp_json_encode(
			[
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenLabels' => [
							'semantic.color.button-primary-bg' => 'Cozy Button',
						],
					],
				],
			]
		);

		$this->store->save_document( $doc );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$found = null;

		foreach ( $data['schema']['groups'] as $entries ) {
			foreach ( $entries as $entry ) {
				if ( ( $entry['id'] ?? '' ) === 'semantic.color.button-primary-bg' ) {
					$found = $entry;
					break 2;
				}
			}
		}

		$this->assertNotNull( $found, 'The overridden token must appear in the REST feed schema.' );
		$this->assertSame( 'Cozy Button', $found['label'] );
		$this->assertTrue( $found['labelOverridden'] );
	}

	/**
	 * The declared border-radius scale surfaces as its own feed group, in declaration order, with
	 * every step's value resolved — the Border Radius screen's data source end to end.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheBorderRadiusScaleGroup(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertArrayHasKey( 'Border Radius', $data['schema']['groups'] );

		$ids = array_column( $data['schema']['groups']['Border Radius'], 'id' );
		$this->assertSame(
			[
				'primitive.dimension.radius.none',
				'primitive.dimension.radius.xs',
				'primitive.dimension.radius.sm',
				'primitive.dimension.radius.md',
				'primitive.dimension.radius.lg',
				'primitive.dimension.radius.xl',
				'primitive.dimension.radius.full',
			],
			$ids
		);

		$this->assertSame( '0', $data['values']['primitive.dimension.radius.none'] );
		$this->assertSame( '0.125rem', $data['values']['primitive.dimension.radius.xs'] );
		$this->assertSame( '0.1875rem', $data['values']['primitive.dimension.radius.sm'] );
		$this->assertSame( '0.375rem', $data['values']['primitive.dimension.radius.md'] );
		$this->assertSame( '0.5rem', $data['values']['primitive.dimension.radius.lg'] );
		$this->assertSame( '1rem', $data['values']['primitive.dimension.radius.xl'] );
		$this->assertSame( '9999px', $data['values']['primitive.dimension.radius.full'] );
	}

	/**
	 * The declared border-width scale surfaces as its own feed group, in declaration order, with
	 * every step's value resolved and no projections — the Border Width screen's data source end
	 * to end.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheBorderWidthScaleGroup(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertArrayHasKey( 'Border Width', $data['schema']['groups'] );

		$ids = array_column( $data['schema']['groups']['Border Width'], 'id' );
		$this->assertSame(
			[
				'primitive.dimension.border-width.sm',
				'primitive.dimension.border-width.md',
				'primitive.dimension.border-width.lg',
			],
			$ids
		);

		foreach ( $data['schema']['groups']['Border Width'] as $entry ) {
			$this->assertSame( [], $entry['projections'], 'The declared border-width scale carries no projections of its own.' );
		}

		$this->assertSame( '1px', $data['values']['primitive.dimension.border-width.sm'] );
		$this->assertSame( '2px', $data['values']['primitive.dimension.border-width.md'] );
		$this->assertSame( '4px', $data['values']['primitive.dimension.border-width.lg'] );
	}

	/**
	 * `semantic.border-width.default` keeps resolving through the "sm" primitive after the scale is
	 * declared — declaring the primitives for the Style Library screen must not disturb the alias
	 * that already projects into the image block.
	 *
	 * @return void
	 */
	public function testSemanticBorderWidthDefaultStillResolvesThroughTheSmPrimitive(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertSame(
			$data['values']['primitive.dimension.border-width.sm'],
			$data['values']['semantic.border-width.default']
		);
	}

	/**
	 * A user-created token minted into the border-width group (the stable key, decision 3 of the
	 * shared scale-screen contract) surfaces inside the declared "Border Width" UI-schema group and
	 * is flagged `userCreated`, exercising the shared group-key backend against this screen's own
	 * key. Asserted against `Token_Registry::to_ui_schema()` directly — the same surface
	 * `DocumentsControllerOrderTest::testOrderIncludesAGroupedCustomToken` checks for the sibling
	 * border-radius group — rather than through the REST controller, whose resolved dependency
	 * chain can be constructed once and cached earlier in a suite run.
	 *
	 * @return void
	 */
	public function testUserPrimitiveGroupedIntoBorderWidthSurfacesInItsFeedGroupAsUserCreated(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.border-width-2';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'dimension' => [
						'custom' => [
							'border-width-2' => [
								'$type'  => 'dimension',
								'$value' => '3px',
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'New Border Width',
								'group' => 'border-width',
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

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$schema   = $registry->to_ui_schema();

		$this->assertArrayHasKey( 'Border Width', $schema['groups'] );

		$found = null;

		foreach ( $schema['groups']['Border Width'] as $entry ) {
			if ( $id === $entry['id'] ) {
				$found = $entry;
				break;
			}
		}

		$this->assertNotNull( $found, 'The grouped custom token must appear in the declared "Border Width" UI-schema group.' );
		$this->assertTrue( $found['userCreated'] );
	}

	/**
	 * A user-created token minted into the spacing group (the stable key this ticket adds as
	 * `group_key` on the already-declared spacing scale) surfaces inside the declared "Spacing"
	 * UI-schema group and is flagged `userCreated`, exercising the shared group-key backend
	 * against a pre-existing declaration rather than a newly declared one. Asserted against
	 * `Token_Registry::to_ui_schema()` directly — the same surface
	 * `DocumentsControllerOrderTest::testOrderIncludesAGroupedCustomToken` checks for the sibling
	 * border-radius group — rather than through the REST controller, whose resolved dependency
	 * chain can be constructed once and cached earlier in a suite run.
	 *
	 * @return void
	 */
	public function testUserPrimitiveGroupedIntoSpacingSurfacesInItsFeedGroupAsUserCreated(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.spacing-2';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'dimension' => [
						'custom' => [
							'spacing-2' => [
								'$type'  => 'dimension',
								'$value' => '2.5rem',
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'New Spacing',
								'group' => 'spacing',
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

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$schema   = $registry->to_ui_schema();

		$this->assertArrayHasKey( 'Spacing', $schema['groups'] );

		$found = null;

		foreach ( $schema['groups']['Spacing'] as $entry ) {
			if ( $id === $entry['id'] ) {
				$found = $entry;
				break;
			}
		}

		$this->assertNotNull( $found, 'The grouped custom token must appear in the declared "Spacing" UI-schema group.' );
		$this->assertTrue( $found['userCreated'] );
	}

	/**
	 * The declared icon-size scale surfaces as its own feed group, in declaration order, with every
	 * step's value resolved and no projections — the Icon Sizes screen's data source end to end.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheIconSizesScaleGroup(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertArrayHasKey( 'Icon Sizes', $data['schema']['groups'] );

		$ids = array_column( $data['schema']['groups']['Icon Sizes'], 'id' );
		$this->assertSame(
			[
				'primitive.dimension.icon-size.sm',
				'primitive.dimension.icon-size.md',
				'primitive.dimension.icon-size.lg',
			],
			$ids
		);

		foreach ( $data['schema']['groups']['Icon Sizes'] as $entry ) {
			$this->assertSame( [], $entry['projections'], 'The declared icon-size scale carries no projections of its own.' );
		}

		$this->assertSame( '1rem', $data['values']['primitive.dimension.icon-size.sm'] );
		$this->assertSame( '1.5rem', $data['values']['primitive.dimension.icon-size.md'] );
		$this->assertSame( '2.25rem', $data['values']['primitive.dimension.icon-size.lg'] );
	}

	/**
	 * `semantic.icon-size.default` keeps resolving through the "md" primitive after the scale is
	 * declared — declaring the primitives for the Style Library screen must not disturb the alias
	 * that already projects into the icon block and the button's icon size.
	 *
	 * @return void
	 */
	public function testSemanticIconSizeDefaultStillResolvesThroughTheMdPrimitive(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertSame(
			$data['values']['primitive.dimension.icon-size.md'],
			$data['values']['semantic.icon-size.default']
		);
	}

	/**
	 * A user-created token minted into the icon-sizes group (the stable key this ticket declares as
	 * `group_key` alongside the newly declared icon-size scale) surfaces inside the declared
	 * "Icon Sizes" UI-schema group and is flagged `userCreated`, exercising the shared group-key
	 * backend against this screen's own key. Asserted against `Token_Registry::to_ui_schema()`
	 * directly — the same surface `DocumentsControllerOrderTest::testOrderIncludesAGroupedCustomToken`
	 * checks for the sibling border-radius group — rather than through the REST controller, whose
	 * resolved dependency chain can be constructed once and cached earlier in a suite run.
	 *
	 * @return void
	 */
	public function testUserPrimitiveGroupedIntoIconSizesSurfacesInItsFeedGroupAsUserCreated(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.icon-size-2';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'dimension' => [
						'custom' => [
							'icon-size-2' => [
								'$type'  => 'dimension',
								'$value' => '3rem',
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'New Icon Size',
								'group' => 'icon-sizes',
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

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$schema   = $registry->to_ui_schema();

		$this->assertArrayHasKey( 'Icon Sizes', $schema['groups'] );

		$found = null;

		foreach ( $schema['groups']['Icon Sizes'] as $entry ) {
			if ( $id === $entry['id'] ) {
				$found = $entry;
				break;
			}
		}

		$this->assertNotNull( $found, 'The grouped custom token must appear in the declared "Icon Sizes" UI-schema group.' );
		$this->assertTrue( $found['userCreated'] );
	}

	/**
	 * A slug naming no known library is rejected with a 404, mirroring Documents_Controller and
	 * Active_Token_Library_Controller rather than silently substituting a different library's
	 * data for the one requested.
	 *
	 * @return void
	 */
	public function testGetItemReturnsNotFoundForAnUnknownLibrary(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'ghost' );

		$result = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * A user without the capability is denied the read permission check.
	 *
	 * @return void
	 */
	public function testItDeniesAccessToUsersWithoutTheCapability(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$result  = $this->controller->get_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_forbidden', $result->get_error_code() );
	}

	/**
	 * The guarantee that matters most: the endpoint and the page-load Localizer both build their
	 * payload through Feed_Assembler, so switching the active library and re-reading this endpoint
	 * must return exactly what a fresh page load would have printed for that same library. Proven
	 * behaviorally, not just by construction — attach the Localizer's inline feed for a non-default
	 * active library, then call this controller for the same slug, and assert the two payloads are
	 * identical.
	 *
	 * @return void
	 */
	public function testEndpointPayloadMatchesTheLocalizerPayloadForTheSameLibrary(): void {
		$doc = (string) wp_json_encode(
			[
				'semantic' => [
					'color' => [
						'button-primary-bg' => [
							'$type'  => 'color',
							'$value' => '#0f7a3d',
						],
					],
				],
			]
		);

		$this->store->save_document( $doc, 'brand-b' );
		$this->active->set( 'brand-b' );

		wp_register_script( self::DASHBOARD_HANDLE, 'https://example.test/admin-kadence-home.js', [], '1', true );
		wp_enqueue_script( self::DASHBOARD_HANDLE );

		/** @var Localizer $localizer */
		$localizer = $this->container->get( Localizer::class );
		$localizer->localize();

		$localized_feed = $this->attached_feed();
		$this->assertNotNull( $localized_feed, 'The Localizer should have attached a feed.' );

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', 'brand-b' );

		$response = $this->controller->get_item( $request );
		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$this->assertSame( $localized_feed, $response->get_data(), 'The endpoint payload must match the localized page-load payload exactly.' );
	}

	/**
	 * The decoded feed attached to the dashboard handle, or null when none was attached.
	 *
	 * @return array<string, mixed>|null
	 */
	private function attached_feed(): ?array {
		$data = wp_scripts()->get_data( self::DASHBOARD_HANDLE, 'before' );

		if ( ! is_array( $data ) ) {
			return null;
		}

		$inline = implode( "\n", array_filter( $data, 'is_string' ) );

		if ( strpos( $inline, 'window.kadenceDesignTokens' ) === false ) {
			return null;
		}

		$json    = (string) preg_replace( '/^.*?window\.kadenceDesignTokens\s*=\s*(.*);\s*$/s', '$1', $inline );
		$decoded = json_decode( $json, true );

		return is_array( $decoded ) ? $decoded : null;
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
	 * Read a class constant off the controller, so route segments are asserted from their single
	 * source.
	 *
	 * @param string $name The constant name.
	 *
	 * @return string
	 */
	private function controller_constant( string $name ): string {
		return (string) ( new ReflectionClass( $this->controller ) )->getConstant( $name );
	}
}
