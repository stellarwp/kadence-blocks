<?php declare( strict_types=1 );
// cspell:ignore advancedbtn advancedheading .

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Presets_Controller;
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
 * Covers the read and write surface of the Design Tokens presets controller: the registered routes, the
 * baseline-merged reads, and the per-block / per-preset / default writes against the real shipped baseline.
 */
final class PresetsControllerTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private const HEADING = 'kadence/advancedheading';

	private const IMAGE = 'kadence/image';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Presets_Controller
	 */
	private Presets_Controller $controller;

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
		$this->controller = $this->container->get( Presets_Controller::class );

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
		$preset_route  = $this->controller_constant( 'PRESET_ROUTE' );

		$collection = "/$namespace/$base";
		$block      = "/$namespace/$base/$block_route";
		$default    = "/$namespace/$base/$block_route/$default_route";
		$preset     = "/$namespace/$base/$block_route/$preset_route";

		foreach ( [ $collection, $block, $default, $preset ] as $route ) {
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

		$this->assertContains( 'DELETE', $this->route_methods( $preset ) );
		$this->assertContains( 'PUT', $this->route_methods( $default ) );
	}

	/**
	 * The item schema describes the `overridden` map each preset carries, so a schema-driven consumer
	 * can discover it rather than having to read the response to learn it exists.
	 *
	 * @return void
	 */
	public function testItemSchemaDescribesOverridden(): void {
		$schema = $this->controller->get_item_schema();
		$preset = $schema['properties']['presets']['additionalProperties'];

		$this->assertArrayHasKey( 'overridden', $preset['properties'] );
		$this->assertSame( 'object', $preset['properties']['overridden']['type'] );
		$this->assertSame( 'boolean', $preset['properties']['overridden']['additionalProperties']['type'] );
		$this->assertTrue( $preset['properties']['overridden']['readonly'] );
	}

	/**
	 * The item schema documents the `userCreated` property added to the GET item response.
	 *
	 * @return void
	 */
	public function testItemSchemaDescribesUserCreated(): void {
		$schema = $this->controller->get_item_schema();

		$this->assertArrayHasKey( 'userCreated', $schema['properties'] );
		$this->assertSame( 'array', $schema['properties']['userCreated']['type'] );
		$this->assertSame( 'string', $schema['properties']['userCreated']['items']['type'] );
	}

	/**
	 * @return void
	 */
	public function testItListsTheRegisteredPresetBlocks(): void {
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
	public function testGetItemReturnsTheBaselineMergedPresetCollection(): void {
		$response = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$data = $response->get_data();

		$this->assertSame( self::BUTTON, $data['block'] );
		$this->assertSame( 'primary', $data['default'] );
		$this->assertArrayHasKey( 'primary', $data['presets'] );
		$this->assertArrayHasKey( 'secondary', $data['presets'] );
	}

	/**
	 * @return void
	 */
	public function testGetItemReflectsAStoredOverride(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();

		$this->assertArrayHasKey( 'outline', $data['presets'] );
		$this->assertSame( 'Outline', $data['presets']['outline']['label'] );
	}

	/**
	 * A fresh library has no stored overrides, so every effective preset comes from the baseline and none is
	 * reported as user-created.
	 *
	 * @return void
	 */
	public function testGetItemOnAFreshLibraryReportsNoUserCreatedPresets(): void {
		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();

		$this->assertSame( [], $data['userCreated'] );
	}

	/**
	 * A baseline preset with nothing stored for it has no OWN overridden properties, even though its
	 * `tokens` resolves every bound property via the baseline merge — the client reads `overridden` to
	 * tell those two apart (bound to a genuine override vs. only inheriting the baseline's own value).
	 *
	 * @return void
	 */
	public function testGetItemReportsNoOverriddenPropertiesForAFreshBaselinePreset(): void {
		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();

		$this->assertSame( [], $data['presets']['secondary']['overridden'] );
		$this->assertNotEmpty( $data['presets']['secondary']['tokens'] );
	}

	/**
	 * Storing a partial override of a baseline preset surfaces ONLY that property in `overridden`,
	 * while `tokens` keeps resolving the rest from the baseline.
	 *
	 * @return void
	 */
	public function testGetItemReflectsAPartialStoredOverrideInOverridden(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"secondary":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();

		$this->assertSame( [ 'button-bg' => true ], $data['presets']['secondary']['overridden'] );
		$this->assertNotSame( '', $data['presets']['secondary']['tokens']['button-text'] );
	}

	/**
	 * @return void
	 */
	public function testGetItemReturns404ForABlockThatAcceptsNoPresets(): void {
		// kadence/spacer has no baseline preset data and no preset bindings registered for it.
		$result = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, 'kadence/spacer' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	/**
	 * A block's shipped "default" preset is editable, even though "default" is the literal the block's
	 * `/default` sub-route uses. Every block but the Button ships its baseline look under exactly that slug,
	 * so a site owner editing it is the ordinary case — refusing it would leave the one preset those blocks
	 * have permanently read-only.
	 *
	 * @return void
	 */
	public function testTheShippedDefaultPresetIsEditable(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				'kadence/single-icon',
				[
					'preset' => 'default',
					'label'  => 'Default',
					'tokens' => [ 'color' => '#ff0000' ],
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$data = $response->get_data();

		$this->assertArrayHasKey( 'default', $data['presets'] );
		$this->assertSame( '#ff0000', $data['presets']['default']['tokens']['color'] );
	}

	/**
	 * Minting a NEW preset under a reserved slug is still refused: the per-preset item route could never
	 * address it, so it would be undeletable. The Button ships no "default", so this is a creation.
	 *
	 * @return void
	 */
	public function testCreatingANewPresetUnderAReservedSlugIsRefused(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'default',
					'label'  => 'Default',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_reserved_slug', $response->get_error_code() );
	}

	/**
	 * "order" is reserved for every block: nothing ships a preset under it, so any write is a creation.
	 *
	 * @return void
	 */
	public function testCreatingAPresetNamedOrderIsRefused(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'order',
					'label'  => 'Order',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_reserved_slug', $response->get_error_code() );
	}

	/**
	 * A create deep-merges a single preset into the block's presets, leaving the baseline siblings and the default in
	 * place.
	 *
	 * @return void
	 */
	public function testCreateMergesASinglePresetPreservingSiblingsAndDefault(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'label'  => 'Outline',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		// First write to the library reports 201 Created.
		$this->assertSame( WP_Http::CREATED, $response->get_status() );

		$data = $response->get_data();

		// The new preset lands while the baseline siblings and the default survive.
		$this->assertArrayHasKey( 'outline', $data['presets'] );
		$this->assertArrayHasKey( 'primary', $data['presets'] );
		$this->assertArrayHasKey( 'secondary', $data['presets'] );
		$this->assertSame( 'primary', $data['default'] );
	}

	/**
	 * Creating a preset slug the baseline does not define adds it to the response's `userCreated` list, and a
	 * subsequent read agrees.
	 *
	 * @return void
	 */
	public function testCreatingANewPresetSlugAddsItToUserCreated(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'label'  => 'Outline',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$this->assertContains( 'outline', $response->get_data()['userCreated'] );

		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();
		$this->assertContains( 'outline', $data['userCreated'] );
	}

	/**
	 * A label-only merge onto a baseline slug (a "shadow") edits the baseline preset in place: it must not be
	 * reported as user-created, and the preset's existing tokens must still resolve after the label-only write
	 * — the merge must not have dropped them.
	 *
	 * @return void
	 */
	public function testALabelOnlyMergeOntoABaselineShadowLeavesUserCreatedEmpty(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'primary',
					'label'  => 'Renamed Primary',
				]
			)
		);

		$data = $response->get_data();

		$this->assertNotContains( 'primary', $data['userCreated'] );
		$this->assertSame( 'Renamed Primary', $data['presets']['primary']['label'] );
		$this->assertNotEmpty( $data['presets']['primary']['tokens'] );
	}

	/**
	 * A second create against the same preset, whose submitted token map omits a property the first
	 * write stored, removes that property rather than leaving it in place. The token map replaces
	 * wholesale, matching what the client (`presetSaveTokens()`) already computed as the complete
	 * desired set — a property-level merge would let an omitted (cleared) property silently survive.
	 *
	 * @return void
	 */
	public function testCreateRemovesATokenTheSecondWriteOmits(): void {
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'label'  => 'Outline',
					'tokens' => $this->button_tokens( [ 'button-padding' => '0.4em' ] ),
				]
			)
		);

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'label'  => 'Outline',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$tokens = $response->get_data()['presets']['outline']['tokens'];

		$this->assertArrayNotHasKey( 'button-padding', $tokens );
	}

	/**
	 * A write carrying a known `library` slug lands in that library and reports it, while the default
	 * library is left untouched — so a preset authored for a block on a non-default library does not leak
	 * into the default library.
	 *
	 * @return void
	 */
	public function testWritesTargetTheNamedLibraryLeavingDefaultUntouched(): void {
		// The target library must already exist for the `library` parameter to be honored.
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
					'preset'  => 'accent',
					'label'   => 'Accent',
					'tokens'  => $tokens,
					'library' => 'dark',
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( 'dark', $response->get_data()['slug'] );
		$this->assertArrayHasKey( 'accent', $response->get_data()['presets'] );

		// Reading the dark library sees the new preset.
		$dark = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON, [ 'library' => 'dark' ] ) );
		$this->assertArrayHasKey( 'accent', $dark->get_data()['presets'] );

		// The default library never saw the write.
		$default = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) );
		$this->assertArrayNotHasKey( 'accent', $default->get_data()['presets'] );
	}

	/**
	 * @return void
	 */
	public function testCreateRequiresAPresetSlug(): void {
		$result = $this->controller->create_item(
			$this->block_request( WP_REST_Server::CREATABLE, self::BUTTON, [ 'tokens' => [ 'button-bg' => 'transparent' ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::BAD_REQUEST, $result->get_error_data()['status'] );
	}

	/**
	 * A replace (PUT) stores exactly the submitted preset collection, dropping any override preset the body
	 * omits while the baseline presets remain visible.
	 *
	 * @return void
	 */
	public function testUpdateReplacesTheStoredPresetCollection(): void {
		// Seed two override-only presets, then PUT a replacement that keeps only one of them.
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'tokens' => $this->button_tokens(),
				]
			)
		);
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'dashed',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$response = $this->controller->update_item(
			$this->block_request(
				'PUT',
				self::BUTTON,
				[ 'presets' => [ 'outline' => [ 'tokens' => $this->button_tokens() ] ] ]
			)
		);

		$data = $response->get_data();

		// The override "dashed" is dropped; "outline" survives. Baseline presets always remain visible.
		$this->assertArrayNotHasKey( 'dashed', $data['presets'] );
		$this->assertArrayHasKey( 'outline', $data['presets'] );
		$this->assertArrayHasKey( 'primary', $data['presets'] );
	}

	/**
	 * Deleting the block resets it to baseline: the stored override preset is gone and the baseline presets
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
					'preset' => 'outline',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$response = $this->controller->delete_item( $this->block_request( WP_REST_Server::DELETABLE, self::BUTTON ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();

		// The override is gone; the block renders its baseline presets again.
		$this->assertArrayNotHasKey( 'outline', $data['presets'] );
		$this->assertArrayHasKey( 'primary', $data['presets'] );
	}

	/**
	 * Deleting a single override preset drops just that preset from the block's stored presets.
	 *
	 * @return void
	 */
	public function testDeletePresetRemovesAnOverridePreset(): void {
		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$response = $this->controller->delete_preset( $this->preset_request( self::BUTTON, 'outline' ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertArrayNotHasKey( 'outline', $response->get_data()['presets'] );
	}

	/**
	 * @return void
	 */
	public function testDeletePresetIsAnIdempotentNoOpWhenAbsent(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"outline":{"tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$response = $this->controller->delete_preset( $this->preset_request( self::BUTTON, 'never-stored' ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		// Nothing was removed, so no write happened and the version is unchanged.
		$this->assertSame( $version_before, $this->store->get_version( Token_Store::default_slug() ) );
	}

	/**
	 * Removing a preset the effective presets still default to is rejected before commit, so the default is
	 * never left dangling.
	 *
	 * @return void
	 */
	public function testDeletingTheDefaultPresetIsRejected(): void {
		// Make an override-only preset the default, then try to delete it out from under the default.
		$this->controller->update_item(
			$this->block_request(
				'PUT',
				self::BUTTON,
				[
					'presets' => [ 'outline' => [ 'tokens' => $this->button_tokens() ] ],
					'default' => 'outline',
				]
			)
		);

		$result = $this->controller->delete_preset( $this->preset_request( self::BUTTON, 'outline' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testSetDefaultToAnExistingPreset(): void {
		$response = $this->controller->set_default( $this->default_request( self::BUTTON, 'secondary' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( 'secondary', $response->get_data()['default'] );
	}

	/**
	 * @return void
	 */
	public function testSetDefaultToAMissingPresetIsRejected(): void {
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
	public function testAnInvalidPresetTokenValueReturns422(): void {
		// An empty-string token value is neither an alias nor a non-empty literal; the DTCG validator rejects it.
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'broken',
					'tokens' => $this->button_tokens( [ 'button-bg' => '' ] ),
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
	 * A dimension property accepts a per-corner slot list, so a button whose corners carry different
	 * radii can be saved as a preset without flattening to one value.
	 *
	 * @return void
	 */
	public function testASlotListOnADimensionPropertyIsAccepted(): void {
		$slots = [ '{primitive.dimension.radius.md}', '8px', '{primitive.dimension.radius.md}', '8px' ];

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'corners',
					'tokens' => $this->button_tokens( [ 'button-radius' => $slots ] ),
				]
			)
		);

		$this->assertNotInstanceOf( WP_Error::class, $response );

		$stored = json_decode( $this->store->get_document( Token_Store::default_slug() ), true );
		$tokens = $stored['$extensions']['com.kadence.designTokens']['presets'][ self::BUTTON ]['corners']['tokens'];

		$this->assertSame( $slots, $tokens['button-radius'] );
	}

	/**
	 * A slot list is meaningful only for a dimension property, so the registry-aware write guard rejects
	 * one written to a color property. The schema validator checks shape only and cannot see the kind.
	 *
	 * @return void
	 */
	public function testASlotListOnANonDimensionPropertyIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'broken',
					'tokens' => $this->button_tokens( [ 'button-bg' => [ '#ff0000', '#00ff00', '#0000ff', '#ffffff' ] ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( 'button-bg', $result->get_error_data()['property'] );
		// The write was rejected before commit.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * An alias inside a per-corner slot list is checked for resolvability like a scalar alias is, so a
	 * dangling reference is refused on write rather than silently dropping the property at projection.
	 *
	 * @return void
	 */
	public function testADanglingAliasInsideASlotListIsRejected(): void {
		$slots = [ '{semantic.radius.control}', '{primitive.dimension.radius.nope}', '8px', '8px' ];

		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'corners',
					'tokens' => $this->button_tokens( [ 'button-radius' => $slots ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unresolvable', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( 'button-radius', $result->get_error_data()['property'] );
		// The write was rejected before commit.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A dangling alias inside a per-breakpoint override is caught on write, exactly as one in the base
	 * value is — otherwise it would pass the guards and silently drop at projection.
	 *
	 * @return void
	 */
	public function testADanglingAliasInAResponsiveOverrideIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'hero',
					'tokens' => $this->button_tokens(
						[
							'button-radius' => $this->responsive_entry(
								'8px',
								[ 'mobile' => '{primitive.dimension.radius.nope}' ]
							),
						]
					),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unresolvable', $result->get_error_code() );
		$this->assertSame( 'button-radius', $result->get_error_data()['property'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A per-corner slot list inside a breakpoint override is gated on the property's kind exactly as the
	 * base value is, so a four-slot color cannot slip in through a breakpoint.
	 *
	 * @return void
	 */
	public function testASlotListInAResponsiveOverrideOnANonDimensionPropertyIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'hero',
					'tokens' => $this->button_tokens(
						[
							'button-bg' => $this->responsive_entry(
								'#3633e1',
								[ 'mobile' => [ '#ff0000', '#00ff00', '#0000ff', '#ffffff' ] ]
							),
						]
					),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( 'button-bg', $result->get_error_data()['property'] );
	}

	/**
	 * A base per-corner value has no cascade above it to inherit from, so every corner must be fully
	 * set. An empty slot in the base array is rejected, even though the same slot list shape is legal
	 * elsewhere.
	 *
	 * @return void
	 */
	public function testASlotListWithAGapInTheBaseValueIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'corners',
					'tokens' => $this->button_tokens(
						[ 'button-radius' => [ '{primitive.dimension.radius.md}', '', '8px', '8px' ] ]
					),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( 'button-radius', $result->get_error_data()['property'] );
		// The write was rejected before commit.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A gap in a per-corner value inside a responsive-override breakpoint means "this corner is not
	 * overridden here, keep inheriting" — the same shape that is illegal on the base is accepted here.
	 *
	 * @return void
	 */
	public function testASlotListWithAGapInAResponsiveOverrideIsAccepted(): void {
		$entry = $this->responsive_entry(
			[ '{primitive.dimension.radius.md}', '8px', '{primitive.dimension.radius.md}', '8px' ],
			[ 'mobile' => [ '{primitive.dimension.radius.full}', '', '', '' ] ]
		);

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'hero',
					'tokens' => $this->button_tokens( [ 'button-radius' => $entry ] ),
				]
			)
		);

		$this->assertNotInstanceOf( WP_Error::class, $response );

		$stored = json_decode( $this->store->get_document( Token_Store::default_slug() ), true );
		$tokens = $stored['$extensions']['com.kadence.designTokens']['presets'][ self::BUTTON ]['hero']['tokens'];

		$this->assertSame(
			[ '{primitive.dimension.radius.full}', '', '', '' ],
			$tokens['button-radius']['$extensions']['com.kadence.designTokens']['responsive']['mobile']
		);
	}

	/**
	 * A per-corner responsive override sitting under a SCALAR base is rejected: the base's canonical var
	 * is never composed of corner-var references, so a media rule redeclaring only the corner vars would
	 * have no visible effect — the projection layer relies on this write-time guarantee.
	 *
	 * @return void
	 */
	public function testADimensionResponsiveOverrideRequiresAPerCornerBase(): void {
		$entry = $this->responsive_entry(
			'8px',
			[ 'mobile' => [ '8px', '4px', '8px', '4px' ] ]
		);

		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'hero',
					'tokens' => $this->button_tokens( [ 'button-radius' => $entry ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( 'button-radius', $result->get_error_data()['property'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A dimension base value containing a space is rejected: `Css_Builder::slots_of()` tells a per-corner
	 * slot list apart from a scalar literal purely by counting `explode( ' ', $value )`'s parts, so a
	 * scalar like "8px 4px 8px 4px" would be misread as a genuine four-corner list.
	 *
	 * @return void
	 */
	public function testADimensionScalarBaseValueWithASpaceIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'broken',
					'tokens' => $this->button_tokens( [ 'button-radius' => '8px 4px 8px 4px' ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( 'button-radius', $result->get_error_data()['property'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A dimension responsive-override value containing a space is rejected for the same reason a base
	 * value is — the ambiguity with a genuine per-corner slot list exists at every level.
	 *
	 * @return void
	 */
	public function testADimensionResponsiveOverrideScalarValueWithASpaceIsRejected(): void {
		$entry = $this->responsive_entry(
			[ '{primitive.dimension.radius.md}', '8px', '{primitive.dimension.radius.md}', '8px' ],
			[ 'mobile' => '8px 4px' ]
		);

		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'hero',
					'tokens' => $this->button_tokens( [ 'button-radius' => $entry ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( 'button-radius', $result->get_error_data()['property'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * A well-formed responsive entry is stored intact, base and overrides together.
	 *
	 * @return void
	 */
	public function testAResponsivePresetEntryIsStored(): void {
		$entry = $this->responsive_entry( [ '8px', '4px', '8px', '4px' ], [ 'mobile' => '2px' ] );

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'hero',
					'tokens' => $this->button_tokens( [ 'button-radius' => $entry ] ),
				]
			)
		);

		$this->assertNotInstanceOf( WP_Error::class, $response );

		$stored = json_decode( $this->store->get_document( Token_Store::default_slug() ), true );
		$tokens = $stored['$extensions']['com.kadence.designTokens']['presets'][ self::BUTTON ]['hero']['tokens'];

		$this->assertSame( [ '8px', '4px', '8px', '4px' ], $tokens['button-radius']['$value'] );
		$this->assertSame(
			'2px',
			$tokens['button-radius']['$extensions']['com.kadence.designTokens']['responsive']['mobile']
		);
	}

	/**
	 * A preset that sets a property the block does not bind is rejected: an unbound property could never
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
					'preset' => 'accent',
					'tokens' => $this->button_tokens( [ 'not-a-bound-prop' => '#ff0000' ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unbound_property', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertContains( 'not-a-bound-prop', $result->get_error_data()['properties'] );
	}

	/**
	 * The button's border and shadow properties are bound (declarations.php), so `guard_surface()` accepts
	 * a preset that sets all four alongside the pre-existing surface — the same acceptance path
	 * `testAnUnboundPropertyIsRejected` proves rejects a name the block does not bind.
	 *
	 * @return void
	 */
	public function testTheButtonBorderAndShadowPropertiesAreAccepted(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'outline',
					'tokens' => $this->button_tokens(
						[
							'button-border-width' => '2px',
							'button-border-style' => 'solid',
							'button-border-color' => '#000000',
							'button-shadow'       => '{primitive.shadow.md}',
						]
					),
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status() );

		$tokens = $response->get_data()['presets']['outline']['tokens'];

		$this->assertSame( '2px', $tokens['button-border-width'] );
		$this->assertSame( 'solid', $tokens['button-border-style'] );
		$this->assertSame( '#000000', $tokens['button-border-color'] );
		$this->assertSame( '{primitive.shadow.md}', $tokens['button-shadow'] );
	}

	/**
	 * A preset may define a SUBSET of the block's bound surface: a preset that leaves a bound property
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
					'preset' => 'accent',
					'tokens' => $tokens,
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status() );

		// The preset is stored with only the properties it defined; button-radius is absent.
		$stored = $response->get_data()['presets']['accent']['tokens'];
		$this->assertArrayHasKey( 'button-bg', $stored );
		$this->assertArrayNotHasKey( 'button-radius', $stored );
	}

	/**
	 * A captured literal that matches a semantic is stored as that semantic's alias, so the preset re-joins
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
					'preset' => 'accent',
					// #3633e1 matches the primary button background semantic; the rgba value matches nothing.
					'tokens' => $this->button_tokens(
						[
							'button-bg'   => '#3633e1',
							'button-text' => 'rgba(1,2,3,0.42)',
						] 
					),
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$tokens = $response->get_data()['presets']['accent']['tokens'];

		$this->assertTrue( Alias::is_alias( $tokens['button-bg'] ) );
		$this->assertSame( 'rgba(1,2,3,0.42)', $tokens['button-text'] );
	}

	/**
	 * The Style Library's Custom shadow tab composes a map of sub-fields rather than a shorthand string,
	 * so the parts stay separately editable. That map has to survive the write intact.
	 *
	 * @return void
	 */
	public function testACompositeShadowOnAShadowPropertyIsAccepted(): void {
		$shadow = [
			'color'   => '#17171f',
			'offsetX' => '0px',
			'offsetY' => '2px',
			'blur'    => '8px',
			'spread'  => '0px',
		];

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::IMAGE,
				[
					'preset' => 'accent',
					'tokens' => [ 'shadow' => $shadow ],
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( $shadow, $response->get_data()['presets']['accent']['tokens']['shadow'] );
	}

	/**
	 * `inset` is optional and boolean, and a shadow carrying it must round-trip as readily as one
	 * without — it is the sub-field most easily dropped by a value pipeline built for strings.
	 *
	 * @return void
	 */
	public function testACompositeShadowWithInsetIsAccepted(): void {
		$shadow = [
			'color'   => '#17171f',
			'offsetX' => '0px',
			'offsetY' => '2px',
			'blur'    => '8px',
			'spread'  => '0px',
			'inset'   => true,
		];

		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::IMAGE,
				[
					'preset' => 'accent',
					'tokens' => [ 'shadow' => $shadow ],
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertTrue( $response->get_data()['presets']['accent']['tokens']['shadow']['inset'] );
	}

	/**
	 * Corners are a dimension idea. A four-slot list on a shadow reaches projection as something no
	 * renderer can compose, so it stays rejected even though an object now passes.
	 *
	 * @return void
	 */
	public function testASlotListOnAShadowPropertyIsRejected(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::IMAGE,
				[
					'preset' => 'accent',
					'tokens' => [ 'shadow' => [ '1px', '1px', '1px', '1px' ] ],
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_invalid', $response->get_error_code() );
		$this->assertSame( 'shadow', $response->get_error_data()['property'] );
	}

	/**
	 * A map missing a required sub-field is not a composite, so it is refused rather than stored as a
	 * shadow the renderer would later fail to compose.
	 *
	 * @return void
	 */
	public function testACompositeShadowMissingASubFieldIsRejected(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::IMAGE,
				[
					'preset' => 'accent',
					'tokens' => [
						'shadow' => [
							'color'   => '#17171f',
							'offsetX' => '0px',
							'offsetY' => '2px',
							'blur'    => '8px',
						],
					],
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $response );
	}

	/**
	 * A captured literal aliases to the semantic the property's own binding declares, not merely to some
	 * semantic that happens to resolve to the same literal. Four shipped semantics resolve to "0", so a
	 * heading radius written as 0 would otherwise be stored as an unrelated spacing token.
	 *
	 * @return void
	 */
	public function testCreateAliasesToTheSemanticTheBindingDeclares(): void {
		$response = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::HEADING,
				[
					'preset' => 'accent',
					'tokens' => [ 'borderRadius' => '0' ],
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$this->assertSame(
			'semantic.radius.heading',
			Alias::path_of( $response->get_data()['presets']['accent']['tokens']['borderRadius'] )
		);
	}

	/**
	 * The write response carries the same normalized token map a later read returns. The Style Library
	 * seeds its draft from this payload after a save, so a divergence here would leave the panel
	 * permanently dirty.
	 *
	 * @return void
	 */
	public function testCreateResponseCarriesTheNormalizedTokens(): void {
		$written = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::HEADING,
				[
					'preset' => 'accent',
					'tokens' => [ 'borderRadius' => '0' ],
				]
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $written );

		$read = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::HEADING ) );

		$this->assertInstanceOf( WP_REST_Response::class, $read );
		$this->assertSame(
			$written->get_data()['presets']['accent']['tokens'],
			$read->get_data()['presets']['accent']['tokens'],
			'A write response must match what a later read returns.'
		);
	}

	/**
	 * A hand-supplied preset alias that does not resolve to a token is rejected before commit, since a
	 * dangling preset alias lives under $extensions where the token dry-run never sees it.
	 *
	 * @return void
	 */
	public function testADanglingPresetAliasIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'accent',
					'tokens' => $this->button_tokens( [ 'button-bg' => '{semantic.color.does-not-exist}' ] ),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unresolvable', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * Creating a preset named "default" is rejected: the slug is reserved for the block's default sub-route
	 * and could never be deleted or set through the dedicated route.
	 *
	 * @return void
	 */
	public function testCreatingAPresetNamedDefaultIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'default',
					'tokens' => $this->button_tokens(),
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
	public function testAMalformedPresetShapeReturns422(): void {
		$result = $this->controller->update_item(
			$this->block_request( 'PUT', self::BUTTON, [ 'presets' => [ 'bad' => 'not-an-object' ] ] )
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * @return void
	 */
	public function testAnEmptyPresetSlugIsRejected(): void {
		// An empty key in the presets map would store a preset node keyed by "" — reject it, mirroring the
		// documents controller's empty dot-path-segment guard.
		$result = $this->controller->update_item(
			$this->block_request( 'PUT', self::BUTTON, [ 'presets' => [ '' => [ 'tokens' => [ 'button-bg' => 'transparent' ] ] ] ] )
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
	 * A committed write re-hashes the library version so downstream caches invalidate.
	 *
	 * @return void
	 */
	public function testAWriteBumpsTheVersion(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"outline":{"tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'dashed',
					'tokens' => $this->button_tokens(),
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

	// -------------------------------------------------------------------------
	// preset display order
	// -------------------------------------------------------------------------

	/**
	 * The order sub-route is registered with PUT and DELETE, alongside the rest of the block routes.
	 *
	 * @return void
	 */
	public function testTheOrderRouteIsRegistered(): void {
		$namespace   = $this->controller_namespace();
		$base        = $this->controller_rest_base();
		$block_route = $this->controller_constant( 'BLOCK_ROUTE' );
		$order_route = $this->controller_constant( 'ORDER_ROUTE' );

		$route = "/$namespace/$base/$block_route/$order_route";

		$this->assertArrayHasKey( $route, $this->rest_server->get_routes() );
		$this->assertContains( 'PUT', $this->route_methods( $route ) );
		$this->assertContains( 'DELETE', $this->route_methods( $route ) );
	}

	/**
	 * A PUT to the order sub-route persists a new order for two BASELINE preset slugs (primary and
	 * secondary) — the case fact 5 of the plan overview proves impossible through a PUT-the-collection
	 * "reorder", since `Effective_Presets` always reads baseline-defined slugs back in baseline order
	 * regardless of the order overrides were written in.
	 *
	 * @return void
	 */
	public function testSetOrderMovesBaselineSlugs(): void {
		$response = $this->controller->set_order( $this->order_request( self::BUTTON, [ 'secondary', 'primary' ] ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( [ 'secondary', 'primary' ], array_keys( $response->get_data()['presets'] ) );

		// The order survives a fresh read.
		$data = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();
		$this->assertSame( [ 'secondary', 'primary' ], array_keys( $data['presets'] ) );
	}

	/**
	 * A slug the block does not effectively define is pruned from the submitted order silently, rather
	 * than rejected — the order write is advisory, mirroring the documents controller's token-order route.
	 *
	 * @return void
	 */
	public function testSetOrderSilentlyPrunesAnUnknownSlug(): void {
		$response = $this->controller->set_order(
			$this->order_request( self::BUTTON, [ 'secondary', 'does-not-exist', 'primary' ] )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( [ 'secondary', 'primary' ], array_keys( $response->get_data()['presets'] ) );
	}

	/**
	 * A version that no longer matches the stored version is rejected with HTTP 409, so a client working
	 * from a stale read cannot silently clobber a concurrent write.
	 *
	 * @return void
	 */
	public function testSetOrderRejectsAStaleVersionWith409(): void {
		$result = $this->controller->set_order(
			$this->order_request( self::BUTTON, [ 'secondary', 'primary' ], 'a-stale-version' )
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_conflict', $result->get_error_code() );
		$this->assertSame( WP_Http::CONFLICT, $result->get_error_data()['status'] );
	}

	/**
	 * A block with no registered preset bindings is a 404, mirroring every other block sub-route.
	 *
	 * @return void
	 */
	public function testSetOrderReturns404ForABlockThatAcceptsNoPresets(): void {
		$result = $this->controller->set_order( $this->order_request( 'kadence/spacer', [ 'anything' ] ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
	}

	/**
	 * DELETE on the order sub-route reverts a stored order to merge (baseline) order.
	 *
	 * @return void
	 */
	public function testDeleteOrderRevertsToMergeOrder(): void {
		$this->controller->set_order( $this->order_request( self::BUTTON, [ 'secondary', 'primary' ] ) );

		$version  = $this->store->get_version( Token_Store::default_slug() );
		$response = $this->controller->delete_order( $this->order_request( self::BUTTON, [], $version ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( [ 'primary', 'secondary' ], array_keys( $response->get_data()['presets'] ) );
	}

	/**
	 * DELETE on the order sub-route is idempotent: a no-op, unchanged-version response when nothing is
	 * stored for the block.
	 *
	 * @return void
	 */
	public function testDeleteOrderIsAnIdempotentNoOpWhenAbsent(): void {
		$version_before = $this->store->get_version( Token_Store::default_slug() );

		$response = $this->controller->delete_order( $this->order_request( self::BUTTON, [], $version_before ) );

		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( $version_before, $this->store->get_version( Token_Store::default_slug() ) );
	}

	/**
	 * Creating a preset named "order" is rejected: the slug is reserved for the block's order sub-route and
	 * could never be reordered or deleted through the dedicated route.
	 *
	 * @return void
	 */
	public function testCreatingAPresetNamedOrderIsRejected(): void {
		$result = $this->controller->create_item(
			$this->block_request(
				WP_REST_Server::CREATABLE,
				self::BUTTON,
				[
					'preset' => 'order',
					'tokens' => $this->button_tokens(),
				]
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_reserved_slug', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	/**
	 * After a PUT reorders a block's presets, the controller's own read (prepare_item()) and the resolver's
	 * names() — the seam the admin feed and Preset_Nav consumers read through — agree on the new order, so
	 * the Style Library and the editor can never disagree.
	 *
	 * @return void
	 */
	public function testOrderedNamesAgreeBetweenTheControllerAndThePresetResolver(): void {
		$this->controller->set_order( $this->order_request( self::BUTTON, [ 'secondary', 'primary' ] ) );

		$data     = $this->controller->get_item( $this->block_request( WP_REST_Server::READABLE, self::BUTTON ) )->get_data();
		$resolver = $this->container->get( Preset_Resolver::class );

		$this->assertSame( [ 'secondary', 'primary' ], array_keys( $data['presets'] ) );
		$this->assertSame( [ 'secondary', 'primary' ], $resolver->names( self::BUTTON ) );
	}

	/**
	 * Build a request for a single block route, splitting the block name into its two path segments and
	 * carrying any extra body parameters.
	 *
	 * @param string               $method The HTTP method.
	 * @param string               $block  The block name, e.g. "kadence/singlebtn".
	 * @param array<string, mixed> $extra  Extra parameters (preset, label, tokens, presets, default).
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
	 * A preset token entry carrying per-breakpoint overrides, in the same envelope a responsive token leaf
	 * uses.
	 *
	 * @param mixed                $base       The entry's base value.
	 * @param array<string, mixed> $responsive Breakpoint => override value.
	 *
	 * @return array<string, mixed> The entry.
	 */
	private function responsive_entry( $base, array $responsive ): array {
		return [
			'$value'      => $base,
			'$extensions' => [
				'com.kadence.designTokens' => [
					'responsive' => $responsive,
				],
			],
		];
	}

	/**
	 * The button's full bound surface as literal values, so a written preset satisfies the full-surface
	 * guard. Individual properties can be overridden for a specific assertion.
	 *
	 * @param array<string, mixed> $overrides Property values to override on the base surface.
	 *
	 * @return array<string, mixed>
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
	 * Build a single-preset request: the block segments plus the preset slug.
	 *
	 * @param string $block   The block name.
	 * @param string $preset The preset slug.
	 *
	 * @return WP_REST_Request
	 */
	private function preset_request( string $block, string $preset ): WP_REST_Request {
		return $this->block_request( WP_REST_Server::DELETABLE, $block, [ 'preset' => $preset ] );
	}

	/**
	 * Build a set-default request: the block segments plus the default preset slug.
	 *
	 * @param string $block        The block name.
	 * @param string $default_slug The default preset slug.
	 *
	 * @return WP_REST_Request
	 */
	private function default_request( string $block, string $default_slug ): WP_REST_Request {
		return $this->block_request( 'PUT', $block, [ 'default' => $default_slug ] );
	}

	/**
	 * Build an order-route request: the block segments plus the ordered slug list and the version guard.
	 * The version defaults to the library's current stored version, so a call site only needs to pass one
	 * explicitly when deliberately exercising a mismatch.
	 *
	 * @param string   $block The block name.
	 * @param string[] $order The desired preset slug order.
	 * @param ?string  $version The version the client last read; defaults to the current stored version.
	 *
	 * @return WP_REST_Request
	 */
	private function order_request( string $block, array $order, ?string $version = null ): WP_REST_Request {
		$version ??= $this->store->get_version( Token_Store::default_slug() );

		return $this->block_request(
			'PUT',
			$block,
			[
				'order'   => $order,
				'version' => $version,
			] 
		);
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
