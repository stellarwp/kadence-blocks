<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Localizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\User_Primitive_Registrar;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Feed_Controller;
use KadenceWP\KadenceBlocks\Utils\Cast;
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
		$this->assertSame( '#3633e1', $data['values']['semantic.color.button-bg'] );
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
						'button-bg' => [
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
		$this->assertSame( '#0f7a3d', $data['values']['semantic.color.button-bg'] );
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
							'semantic.color.button-bg' => 'Cozy Button',
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
				if ( ( $entry['id'] ?? '' ) === 'semantic.color.button-bg' ) {
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
				'primitive.dimension.radius.xs',
				'primitive.dimension.radius.sm',
				'primitive.dimension.radius.md',
				'primitive.dimension.radius.lg',
				'primitive.dimension.radius.xl',
				'primitive.dimension.radius.2xl',
				'primitive.dimension.radius.3xl',
				'primitive.dimension.radius.full',
			],
			$ids
		);

		$this->assertSame( '0.125rem', $data['values']['primitive.dimension.radius.xs'] );
		$this->assertSame( '0.25rem', $data['values']['primitive.dimension.radius.sm'] );
		$this->assertSame( '0.375rem', $data['values']['primitive.dimension.radius.md'] );
		$this->assertSame( '0.5rem', $data['values']['primitive.dimension.radius.lg'] );
		$this->assertSame( '0.75rem', $data['values']['primitive.dimension.radius.xl'] );
		$this->assertSame( '1rem', $data['values']['primitive.dimension.radius.2xl'] );
		$this->assertSame( '1.5rem', $data['values']['primitive.dimension.radius.3xl'] );
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
								'group' => 'icon-size',
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
	 * The declared shadow scale surfaces as its own feed group, in declaration order, with every
	 * step's value resolved to the `Css_Renderer` shorthand and no projections — the Shadow
	 * screen's data source end to end.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheShadowScaleGroup(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertArrayHasKey( 'Shadow', $data['schema']['groups'] );

		$ids = array_column( $data['schema']['groups']['Shadow'], 'id' );
		$this->assertSame(
			[
				'primitive.shadow.xs',
				'primitive.shadow.sm',
				'primitive.shadow.md',
			],
			$ids
		);

		foreach ( $data['schema']['groups']['Shadow'] as $entry ) {
			$this->assertSame( [], $entry['projections'], 'The declared shadow scale carries no projections of its own.' );
		}

		$this->assertSame( '0px 1px 2px 0px #1717171f', $data['values']['primitive.shadow.xs'] );
		$this->assertSame( '0px 2px 4px 0px #1717171f', $data['values']['primitive.shadow.sm'] );
		$this->assertSame( '0px 2px 8px 0px #1717171f', $data['values']['primitive.shadow.md'] );
	}

	/**
	 * `semantic.shadow.card` keeps resolving through its own curated, palette-linked value after
	 * the shadow primitive scale is declared — declaring the scale for the Style Library screen
	 * must not disturb the semantic's existing alias.
	 *
	 * @return void
	 */
	public function testSemanticShadowCardIsUnaffectedByTheDeclaredScale(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertNotSame(
			$data['values']['primitive.shadow.md'],
			$data['values']['semantic.shadow.card'],
			'semantic.shadow.card must keep its own curated value, not follow the new scale.'
		);
	}

	/**
	 * A user-created token minted into the shadow group (the stable key this ticket declares as
	 * `group_key` alongside the newly declared shadow scale) surfaces inside the declared "Shadow"
	 * UI-schema group and is flagged `userCreated`, and a stored `inset` sub-field round-trips into
	 * the resolved value with the `inset ` prefix `Css_Renderer::shadow()` emits.
	 *
	 * @return void
	 */
	public function testUserPrimitiveGroupedIntoShadowSurfacesInItsFeedGroupWithInsetResolved(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.shadow.custom.shadow-2';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'shadow' => [
						'custom' => [
							'shadow-2' => [
								'$type'  => 'shadow',
								'$value' => [
									'color'   => '#171717',
									'offsetX' => '0px',
									'offsetY' => '4px',
									'blur'    => '12px',
									'spread'  => '0px',
									'inset'   => true,
								],
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'Elevated',
								'group' => 'shadow',
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

		$this->assertArrayHasKey( 'Shadow', $schema['groups'] );

		$found = null;

		foreach ( $schema['groups']['Shadow'] as $entry ) {
			if ( $id === $entry['id'] ) {
				$found = $entry;
				break;
			}
		}

		$this->assertNotNull( $found, 'The grouped custom token must appear in the declared "Shadow" UI-schema group.' );
		$this->assertTrue( $found['userCreated'] );

		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		$resolved = $resolver->resolve( $slug );

		$this->assertSame( 'inset 0px 4px 12px 0px #171717', $resolved->value( $id ) );
	}

	/**
	 * Font family is no longer a token family: the feed carries no `Font Family` group and no
	 * font-family token at any layer. A family is a favorite, which rides the feed's own
	 * `favoriteFonts` section instead and resolves through nothing.
	 *
	 * @return void
	 */
	public function testTheFeedCarriesNoFontFamilyTokens(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$this->assertArrayNotHasKey( 'Font Family', $data['schema']['groups'] );

		foreach ( array_keys( $data['values'] ) as $id ) {
			$this->assertStringNotContainsString( 'font-family', Cast::to_string( $id ) );
		}
	}

	/**
	 * The declared `Font Size` scale still lists its six steps in declaration order, and the group's
	 * newly declared `group_key` resolves back to the group's translated label — the mechanism
	 * "+ Add Size" mints custom tokens through.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheFontSizeScaleGroupWithItsGroupKey(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'slug', Token_Store::default_slug() );

		$data = $this->controller->get_item( $request )->get_data();

		$ids = array_column( $data['schema']['groups']['Font Size'], 'id' );
		$this->assertSame(
			[
				'primitive.dimension.font-size.sm',
				'primitive.dimension.font-size.md',
				'primitive.dimension.font-size.lg',
				'primitive.dimension.font-size.xl',
				'primitive.dimension.font-size.xxl',
				'primitive.dimension.font-size.xxxl',
			],
			$ids
		);

		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$this->assertSame( 'Font Size', $registry->group_label_for( 'font-size' ) );
	}

	/**
	 * A user-created dimension primitive minted into the font-size group (the stable key this
	 * ticket declares as `group_key` alongside the `Font Size` scale) surfaces inside the declared
	 * "Font Size" UI-schema group and is flagged `userCreated` — "+ Add Size"'s data path end to
	 * end.
	 *
	 * @return void
	 */
	public function testUserPrimitiveGroupedIntoFontSizeSurfacesInItsFeedGroup(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.dimension.custom.font-size';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'dimension' => [
						'custom' => [
							'font-size' => [
								'$type'  => 'dimension',
								'$value' => '1rem',
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'New Font Size',
								'group' => 'font-size',
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

		$this->assertArrayHasKey( 'Font Size', $schema['groups'] );

		$found = null;

		foreach ( $schema['groups']['Font Size'] as $entry ) {
			if ( $id === $entry['id'] ) {
				$found = $entry;
				break;
			}
		}

		$this->assertNotNull( $found, 'The grouped custom token must appear in the declared "Font Size" UI-schema group.' );
		$this->assertTrue( $found['userCreated'] );
	}

	/**
	 * Writing a plain scalar leaf over a clamp-carrying `Font Size` step resolves to that scalar,
	 * with no residual `clamp(...)` — the Typography screen's SIZE field can only ever write a
	 * fixed value, and the step converting from fluid to fixed on an explicit edit is a documented
	 * choice, not an accident.
	 *
	 * @return void
	 */
	public function testExplicitScalarWriteConvertsAClampedFontSizeStepToFixed(): void {
		$slug = Token_Store::default_slug();

		$document = (string) wp_json_encode(
			[
				'primitive' => [
					'dimension' => [
						'font-size' => [
							'sm' => [
								'$type'  => 'dimension',
								'$value' => '1.5rem',
							],
						],
					],
				],
			]
		);

		$this->store->save_document( $document, $slug );

		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		$resolved = $resolver->resolve( $slug );

		$this->assertSame( '1.5rem', $resolved->value( 'primitive.dimension.font-size.sm' ) );
		$this->assertStringNotContainsString( 'clamp(', $resolved->value( 'primitive.dimension.font-size.sm' ) );
	}

	/**
	 * A `fontFamily` user primitive left in a stored document from before font family stopped being
	 * a token family still registers and still resolves — `fontFamily` remains a valid DTCG $type,
	 * so an existing document keeps validating rather than failing on its next write. What it no longer
	 * does is surface on a screen: with no declared "Font Family" group left to resolve its group key
	 * against, the registrar's fail-soft files it UNGROUPED — the same path a downgrade or a removed
	 * group already took — so it keeps its value but has no home screen, and nothing can mint another
	 * (the create route 404s the group). Its single-family stack still resolves with the spaced name
	 * quoted, exercising `Css_Renderer::font_family()` end to end through a stored token.
	 *
	 * @return void
	 */
	public function testAStoredFontFamilyUserPrimitiveStillResolvesButSurfacesInNoGroup(): void {
		$slug = Token_Store::default_slug();
		$id   = 'primitive.font-family.custom.abril-fatface';

		$document = (string) wp_json_encode(
			[
				'primitive'   => [
					'font-family' => [
						'custom' => [
							'abril-fatface' => [
								'$type'  => 'fontFamily',
								'$value' => [ 'Abril Fatface' ],
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [
								'label' => 'Abril Fatface',
								'group' => 'font-family',
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

		$this->assertArrayNotHasKey( 'Font Family', $schema['groups'] );

		foreach ( $schema['groups'] as $group => $rows ) {
			if ( '' === $group ) {
				continue;
			}

			$this->assertNotContains( $id, array_column( $rows, 'id' ), 'A stored font primitive must not join another screen\'s group.' );
		}

		$this->assertContains( $id, array_column( $schema['groups'][''] ?? [], 'id' ), 'It lands in the ungrouped bucket no screen renders.' );

		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		$resolved = $resolver->resolve( $slug );

		$this->assertSame( '"Abril Fatface"', $resolved->value( $id ) );
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
						'button-bg' => [
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
	 * The Localizer attaches TWO separate inline scripts to the handle (the feed, and — as its own
	 * global, never folded into the feed payload — the page-load-only font catalog), each its own
	 * entry in the 'before' data array. This walks the entries rather than imploding the whole array and running one
	 * regular expression over it, so the catalog entry (whose global name is a superset string,
	 * "window.kadenceDesignTokensFontCatalog") can never be mistaken for the feed entry.
	 *
	 * @return array<string, mixed>|null
	 */
	private function attached_feed(): ?array {
		$data = wp_scripts()->get_data( self::DASHBOARD_HANDLE, 'before' );

		if ( ! is_array( $data ) ) {
			return null;
		}

		foreach ( array_filter( $data, 'is_string' ) as $entry ) {
			if ( strpos( $entry, 'window.kadenceDesignTokens =' ) === false ) {
				continue;
			}

			$json    = (string) preg_replace( '/^.*?window\.kadenceDesignTokens\s*=\s*(.*);\s*$/s', '$1', $entry );
			$decoded = json_decode( $json, true );

			return is_array( $decoded ) ? $decoded : null;
		}

		return null;
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
