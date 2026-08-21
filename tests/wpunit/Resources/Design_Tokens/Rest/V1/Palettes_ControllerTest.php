<?php declare( strict_types=1 );
// cspell:ignore designTokens colorPalettes .

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Palettes_Controller;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the palette REST controller: listing palettes, reading / creating / deleting a palette, getting /
 * setting the library's $current palette, and the write guards.
 */
final class Palettes_ControllerTest extends TestCase {

	/**
	 * @var Effective_Palettes
	 */
	private Effective_Palettes $palettes;

	/**
	 * @var Palettes_Controller
	 */
	private Palettes_Controller $controller;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->palettes   = $this->container->get( Effective_Palettes::class );
		$this->controller = $this->container->get( Palettes_Controller::class );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	/**
	 * The listing returns the library's $default / $current pointers and each palette's id + label — the shipped
	 * `default` plus a stored non-default palette.
	 *
	 * @return void
	 */
	public function testGetItemsListsThePalettes(): void {
		$this->create_custom_palette();

		$data = $this->controller->get_items( new WP_REST_Request( WP_REST_Server::READABLE ) )->get_data();

		$this->assertSame( 'default', $data['$default'] );
		$this->assertSame( 'default', $data['$current'] );

		$ids = array_column( $data['palettes'], 'id' );
		$this->assertContains( 'default', $ids );
		$this->assertContains( 'custom', $ids );
	}

	/**
	 * Reading a defined palette returns its label and groups; an unknown id is a 404.
	 *
	 * @return void
	 */
	public function testGetItemReturnsAPaletteAndUnknownIsNotFound(): void {
		$this->create_custom_palette();

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'id', 'custom' );

		$response = $this->controller->get_item( $request );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( 'Custom', $response->get_data()['label'] );

		$missing = new WP_REST_Request( WP_REST_Server::READABLE );
		$missing->set_param( 'id', 'nope' );
		$this->assertSame( WP_Http::NOT_FOUND, $this->status_of( $this->controller->get_item( $missing ) ) );
	}

	/**
	 * Setting $current to a defined palette persists the pointer; an unknown palette is a 422.
	 *
	 * @return void
	 */
	public function testSetCurrentPersistsAndRejectsUnknown(): void {
		$this->create_custom_palette();

		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'current', 'custom' );

		$response = $this->controller->set_current( $request );
		$this->assertNotInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'custom', $this->palettes->current() );

		$bad = new WP_REST_Request( 'PUT' );
		$bad->set_param( 'current', 'nope' );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $this->status_of( $this->controller->set_current( $bad ) ) );
	}

	/**
	 * Creating a well-formed palette persists it so a later read and the effective reader both see it.
	 *
	 * @return void
	 */
	public function testUpdateItemCreatesAPalette(): void {
		$response = $this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertContains( $response->get_status(), [ WP_Http::OK, WP_Http::CREATED ] );

		$this->assertContains( 'ocean', $this->palettes->palette_ids() );
		$this->assertSame( '#0000ff', $this->palettes->swatch_values( 'ocean' )['primitive.color.brand.primary'] );
	}

	/**
	 * Reading a partial palette returns the effective view: the full default field set, with the palette's
	 * own deltas flagged overridden and everything else inherited from the default.
	 *
	 * @return void
	 */
	public function testGetItemReturnsTheEffectiveViewWithInheritedValues(): void {
		$this->create_custom_palette();

		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'id', 'custom' );

		$data     = $this->controller->get_item( $request )->get_data();
		$swatches = [];

		foreach ( $data['groups'] as $group ) {
			foreach ( $group['swatches'] as $swatch ) {
				$swatches[ $swatch['token'] ] = $swatch;
			}
		}

		// A custom-palette delta is overridden and carries the custom palette's value.
		$this->assertTrue( $swatches['primitive.color.brand.primary']['overridden'] );
		$this->assertSame( '#DD6B20', $swatches['primitive.color.brand.primary']['$value'] );

		// A token the custom palette omits is present but inherited from the default palette's value.
		$this->assertFalse( $swatches['primitive.color.neutral.900']['overridden'] );
		$this->assertSame( '#1A202C', $swatches['primitive.color.neutral.900']['$value'] );
	}

	/**
	 * Every swatch the shipped palette defines is flagged `baseline`, so the editor can tell a permanent row
	 * (which it offers to reset) from a user-added one (which it offers to delete).
	 *
	 * @return void
	 */
	public function testGetItemMarksBaselineSwatches(): void {
		// primitive.color.neutral.600 is a registered color the shipped palette lists no swatch for, so it stands
		// in for a user-added color without needing a minted primitive.
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.neutral.600', '#4A5568' )
		);

		$swatches = $this->view_swatches( 'default' );

		$this->assertTrue( $swatches['primitive.color.brand.button']['baseline'] );
		$this->assertFalse( $swatches['primitive.color.neutral.600']['baseline'] );
	}

	/**
	 * On the DEFAULT palette `overridden` means "differs from the shipped value", not "the palette stores it" —
	 * the default stores every swatch, so the latter would mark them all overridden and leave the editor unable
	 * to tell an edited color from an untouched one.
	 *
	 * @return void
	 */
	public function testGetItemMarksOnlyEditedSwatchesOverriddenOnTheDefaultPalette(): void {
		$untouched = $this->view_swatches( 'default' );

		$this->assertFalse( $untouched['primitive.color.brand.primary']['overridden'] );
		$this->assertFalse( $untouched['primitive.color.brand.button']['overridden'] );

		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.primary', '#0000ff' )
		);

		$edited = $this->view_swatches( 'default' );

		$this->assertTrue( $edited['primitive.color.brand.primary']['overridden'] );
		$this->assertFalse( $edited['primitive.color.brand.button']['overridden'], 'Only the edited swatch is overridden.' );
	}

	/**
	 * Reverting an edited default swatch clears its `overridden` flag, so the editor's Reset affordance turns
	 * itself off again.
	 *
	 * @return void
	 */
	public function testRevertingADefaultSwatchClearsItsOverriddenFlag(): void {
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.primary', '#0000ff' )
		);
		$this->assertTrue( $this->view_swatches( 'default' )['primitive.color.brand.primary']['overridden'] );

		$this->controller->delete_swatch(
			$this->swatch_request( 'DELETE', 'default', 'primitive.color.brand.primary' )
		);

		$this->assertFalse( $this->view_swatches( 'default' )['primitive.color.brand.primary']['overridden'] );
	}

	/**
	 * Writing a non-default palette persists only the swatches that differ from the default; a swatch equal
	 * to the default is inherited, not stored.
	 *
	 * @return void
	 */
	public function testUpdateItemStoresOnlyDeltas(): void {
		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'id', 'ocean' );
		$request->set_param( 'label', 'Ocean' );
		$request->set_param(
			'groups',
			[
				[
					'id'       => 'accent',
					'label'    => 'Accent',
					'swatches' => [
						// A real delta.
						[
							'token'  => 'primitive.color.brand.primary',
							'label'  => 'Main 1',
							'$value' => '#0000ff',
						],
						// Equal to the default palette value — should NOT be stored.
						[
							'token'  => 'primitive.color.brand.secondary',
							'label'  => 'Main 2',
							'$value' => '#2B6CB0',
						],
					],
				],
			]
		);

		$this->controller->update_item( $request );

		$stored = $this->palettes->swatch_values( 'ocean' );

		$this->assertArrayHasKey( 'primitive.color.brand.primary', $stored );
		$this->assertSame( '#0000ff', $stored['primitive.color.brand.primary'] );
		$this->assertArrayNotHasKey( 'primitive.color.brand.secondary', $stored );
	}

	/**
	 * Re-saving an existing non-default palette replaces its stored node wholesale: a swatch reverted to the
	 * default value in a follow-up write drops out of the deltas instead of lingering because the shorter delta
	 * list was positionally merged over the previously stored, longer one.
	 *
	 * @return void
	 */
	public function testUpdateItemReplacesTheStoredNodeWhenAPaletteShrinks(): void {
		$first = new WP_REST_Request( 'PUT' );
		$first->set_param( 'id', 'ocean' );
		$first->set_param( 'label', 'Ocean' );
		$first->set_param(
			'groups',
			[
				[
					'id'       => 'accent',
					'label'    => 'Accent',
					'swatches' => [
						[
							'token'  => 'primitive.color.brand.secondary',
							'label'  => 'Main 2',
							'$value' => '#111111',
						],
						[
							'token'  => 'primitive.color.neutral.900',
							'label'  => 'Neutral 900',
							'$value' => '#222222',
						],
					],
				],
			]
		);

		$this->controller->update_item( $first );

		$stored = $this->palettes->swatch_values( 'ocean' );
		$this->assertSame( '#111111', $stored['primitive.color.brand.secondary'] );
		$this->assertSame( '#222222', $stored['primitive.color.neutral.900'] );

		// Re-save with the neutral swatch reverted to the default value, so it drops out of the deltas and the
		// stored groups list is shorter than the one already persisted.
		$second = new WP_REST_Request( 'PUT' );
		$second->set_param( 'id', 'ocean' );
		$second->set_param( 'label', 'Ocean' );
		$second->set_param(
			'groups',
			[
				[
					'id'       => 'accent',
					'label'    => 'Accent',
					'swatches' => [
						[
							'token'  => 'primitive.color.brand.secondary',
							'label'  => 'Main 2',
							'$value' => '#111111',
						],
						[
							'token'  => 'primitive.color.neutral.900',
							'label'  => 'Neutral 900',
							'$value' => '#1A202C',
						],
					],
				],
			]
		);

		$this->controller->update_item( $second );

		$stored = $this->palettes->swatch_values( 'ocean' );
		$this->assertSame( '#111111', $stored['primitive.color.brand.secondary'] );
		$this->assertArrayNotHasKey(
			'primitive.color.neutral.900',
			$stored,
			'A swatch reverted to the default must not linger in the stored deltas.'
		);
	}

	/**
	 * Both POST and PUT are registered for the palette write route, sharing the create-or-replace handler.
	 *
	 * @return void
	 */
	public function testTheWriteRouteAcceptsPostAndPut(): void {
		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init' );

		$endpoints = $wp_rest_server->get_routes()['/kb-design-tokens/v1/palettes/(?P<id>[\w-]+)'] ?? [];

		$methods = [];
		foreach ( $endpoints as $endpoint ) {
			foreach ( array_keys( array_filter( $endpoint['methods'] ?? [] ) ) as $method ) {
				$methods[ $method ] = true;
			}
		}

		$wp_rest_server = null;

		$this->assertArrayHasKey( 'POST', $methods, 'POST should be registered on the palette write route.' );
		$this->assertArrayHasKey( 'PUT', $methods, 'PUT should be registered on the palette write route.' );
	}

	/**
	 * A swatch whose token targets a non-color token is rejected with a 422.
	 *
	 * @return void
	 */
	public function testUpdateItemRejectsANonColorSwatchToken(): void {
		$request = $this->write_request( 'bad', 'Bad', '#0000ff' );
		$request->set_param(
			'groups',
			[
				[
					'id'       => 'accent',
					'label'    => 'Accent',
					'swatches' => [
						[
							'token'  => 'primitive.dimension.spacing.md',
							'label'  => 'Nope',
							'$value' => '#0000ff',
						],
					],
				],
			]
		);

		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $this->status_of( $this->controller->update_item( $request ) ) );
	}

	/**
	 * A palette that repeats the same token across its swatches is rejected with a 422.
	 *
	 * @return void
	 */
	public function testUpdateItemRejectsADuplicateToken(): void {
		$request = $this->write_request( 'dup', 'Dup', '#0000ff' );
		$request->set_param(
			'groups',
			[
				[
					'id'       => 'accent',
					'label'    => 'Accent',
					'swatches' => [
						[
							'token'  => 'primitive.color.brand.primary',
							'label'  => 'One',
							'$value' => '#0000ff',
						],
						[
							'token'  => 'primitive.color.brand.primary',
							'label'  => 'Two',
							'$value' => '#00ff00',
						],
					],
				],
			]
		);

		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $this->status_of( $this->controller->update_item( $request ) ) );
	}

	/**
	 * A malformed swatch value (empty) is rejected by the DTCG validator with a 422.
	 *
	 * @return void
	 */
	public function testUpdateItemRejectsAMalformedSwatchValue(): void {
		$this->assertSame(
			WP_Http::UNPROCESSABLE_ENTITY,
			$this->status_of( $this->controller->update_item( $this->write_request( 'empty', 'Empty', '' ) ) )
		);
	}

	/**
	 * Deleting a user-created palette removes it; deleting the default palette is a 400.
	 *
	 * @return void
	 */
	public function testDeleteItemRemovesAUserPalette(): void {
		$this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );
		$this->assertContains( 'ocean', $this->palettes->palette_ids() );

		$delete = new WP_REST_Request( 'DELETE' );
		$delete->set_param( 'id', 'ocean' );
		$this->controller->delete_item( $delete );

		$this->assertNotContains( 'ocean', $this->palettes->palette_ids() );
	}

	/**
	 * Deleting the default palette drops its stored overrides and resets it to the shipped definition rather
	 * than removing it: it is a baseline palette, so it stays in the listing, rendering from baseline.
	 *
	 * @return void
	 */
	public function testDeleteItemResetsTheDefaultPaletteToBaseline(): void {
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.primary', '#0000ff' )
		);
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.button', '#00ff00' )
		);

		$delete = new WP_REST_Request( 'DELETE' );
		$delete->set_param( 'id', 'default' );

		$result = $this->controller->delete_item( $delete );

		$this->assertNotInstanceOf( WP_Error::class, $result );
		$this->assertContains( 'default', $this->palettes->palette_ids(), 'A baseline palette is reset, never removed.' );
		$this->assertSame( $this->palettes->baseline_swatch_values(), $this->palettes->swatch_values( 'default' ) );
	}

	/**
	 * Resetting the default palette with nothing stored for it changes nothing, so the reset is safe to repeat.
	 *
	 * @return void
	 */
	public function testDeleteItemOnAnUneditedDefaultPaletteIsANoOp(): void {
		$delete = new WP_REST_Request( 'DELETE' );
		$delete->set_param( 'id', 'default' );

		$this->assertNotInstanceOf( WP_Error::class, $this->controller->delete_item( $delete ) );
		$this->assertSame( $this->palettes->baseline_swatch_values(), $this->palettes->swatch_values( 'default' ) );
	}

	/**
	 * Deleting a palette the library does not define at all is a 404.
	 *
	 * @return void
	 */
	public function testDeleteItemOnAnUnknownPaletteIsNotFound(): void {
		$delete = new WP_REST_Request( 'DELETE' );
		$delete->set_param( 'id', 'nope' );

		$this->assertSame( WP_Http::NOT_FOUND, $this->status_of( $this->controller->delete_item( $delete ) ) );
	}

	/**
	 * The write route is capability-gated: denied for a user without the design-tokens capability.
	 *
	 * @return void
	 */
	public function testTheWriteRouteIsCapabilityGated(): void {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->controller->update_item_permissions_check( new WP_REST_Request( 'PUT' ) )
		);
	}

	/**
	 * Setting one swatch through the sub-route stores just that token and leaves the palette's other swatches
	 * intact — the caller never sends the full palette, and an untouched token is unaffected.
	 *
	 * @return void
	 */
	public function testUpdateSwatchSetsOneTokenWithoutTheFullPalette(): void {
		$this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );

		$response = $this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'ocean', 'primitive.color.brand.secondary', '#00ff00' )
		);

		$this->assertNotInstanceOf( WP_Error::class, $response );

		$stored = $this->palettes->swatch_values( 'ocean' );
		$this->assertSame( '#00ff00', $stored['primitive.color.brand.secondary'], 'The set swatch is stored.' );
		$this->assertSame( '#0000ff', $stored['primitive.color.brand.primary'], 'The untouched swatch is intact.' );
	}

	/**
	 * Setting an existing swatch through the sub-route updates its value in place.
	 *
	 * @return void
	 */
	public function testUpdateSwatchUpdatesAnExistingToken(): void {
		$this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );

		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'ocean', 'primitive.color.brand.primary', '#123456' )
		);

		$this->assertSame( '#123456', $this->palettes->swatch_values( 'ocean' )['primitive.color.brand.primary'] );
	}

	/**
	 * A swatch write whose token targets a non-color token is rejected with a 422, without needing the rest of
	 * the palette in the request.
	 *
	 * @return void
	 */
	public function testUpdateSwatchRejectsANonColorToken(): void {
		$this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );

		$this->assertSame(
			WP_Http::UNPROCESSABLE_ENTITY,
			$this->status_of(
				$this->controller->update_swatch(
					$this->swatch_request( 'PUT', 'ocean', 'primitive.dimension.spacing.md', '#0000ff' )
				) 
			)
		);
	}

	/**
	 * A swatch write to a palette the library does not define is a 404.
	 *
	 * @return void
	 */
	public function testUpdateSwatchOnAnUnknownPaletteIsNotFound(): void {
		$this->assertSame(
			WP_Http::NOT_FOUND,
			$this->status_of(
				$this->controller->update_swatch(
					$this->swatch_request( 'PUT', 'nope', 'primitive.color.brand.primary', '#0000ff' )
				) 
			)
		);
	}

	/**
	 * Deleting a swatch through the sub-route drops the palette's own value for that token, reverting it to
	 * inherited-from-default.
	 *
	 * @return void
	 */
	public function testDeleteSwatchRevertsATokenToInherited(): void {
		$this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );
		$this->assertArrayHasKey( 'primitive.color.brand.primary', $this->palettes->swatch_values( 'ocean' ) );

		$this->controller->delete_swatch(
			$this->swatch_request( 'DELETE', 'ocean', 'primitive.color.brand.primary' )
		);

		$this->assertArrayNotHasKey( 'primitive.color.brand.primary', $this->palettes->swatch_values( 'ocean' ) );

		// Inherited, not gone: the palette now resolves the token to the default palette's value, and the
		// default palette itself is untouched.
		$this->assertSame( '#3182CE', $this->palettes->effective_swatch_values( 'ocean' )['primitive.color.brand.primary'] );
		$this->assertSame( '#3182CE', $this->palettes->swatch_values( 'default' )['primitive.color.brand.primary'] );
	}

	/**
	 * Deleting a baseline swatch on the default palette restores its shipped color instead of removing the row:
	 * the default palette has nothing to inherit from, and the row itself is permanent.
	 *
	 * @return void
	 */
	public function testDeleteSwatchOnTheDefaultPaletteRevertsToBaseline(): void {
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.primary', '#0000ff' )
		);
		$this->assertSame( '#0000ff', $this->palettes->swatch_values( 'default' )['primitive.color.brand.primary'] );

		$result = $this->controller->delete_swatch(
			$this->swatch_request( 'DELETE', 'default', 'primitive.color.brand.primary' )
		);

		$this->assertNotInstanceOf( WP_Error::class, $result );
		$this->assertSame( '#3182CE', $this->palettes->swatch_values( 'default' )['primitive.color.brand.primary'] );
	}

	/**
	 * Reverting one baseline swatch on the default palette leaves the palette's other edits alone.
	 *
	 * @return void
	 */
	public function testDeleteSwatchOnTheDefaultPaletteLeavesSiblingSwatchesAlone(): void {
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.primary', '#0000ff' )
		);
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.brand.button', '#00ff00' )
		);

		$this->controller->delete_swatch(
			$this->swatch_request( 'DELETE', 'default', 'primitive.color.brand.primary' )
		);

		$values = $this->palettes->swatch_values( 'default' );

		$this->assertSame( '#3182CE', $values['primitive.color.brand.primary'] );
		$this->assertSame( '#00ff00', $values['primitive.color.brand.button'], 'Only the reverted swatch may change.' );
	}

	/**
	 * A swatch the baseline does NOT define has no shipped value to fall back to, so deleting it on the default
	 * palette removes the row outright — the true delete of a user-added color.
	 *
	 * @return void
	 */
	public function testDeleteSwatchRemovesANonBaselineSwatchFromTheDefaultPalette(): void {
		// primitive.color.neutral.600 is a registered color the shipped palette lists no swatch for, so it stands
		// in for a user-added color without needing a minted primitive.
		$this->controller->update_swatch(
			$this->swatch_request( 'PUT', 'default', 'primitive.color.neutral.600', '#4A5568' )
		);
		$this->assertArrayHasKey( 'primitive.color.neutral.600', $this->palettes->swatch_values( 'default' ) );

		$this->controller->delete_swatch(
			$this->swatch_request( 'DELETE', 'default', 'primitive.color.neutral.600' )
		);

		$this->assertArrayNotHasKey( 'primitive.color.neutral.600', $this->palettes->swatch_values( 'default' ) );
	}

	/**
	 * Reverting a swatch a palette never set changes nothing, so a repeated delete is safe.
	 *
	 * @dataProvider idempotentDeleteProvider
	 *
	 * @param string $id    The palette id to delete the swatch on.
	 * @param string $token The swatch token dot-path.
	 *
	 * @return void
	 */
	public function testDeleteSwatchIsIdempotent( string $id, string $token ): void {
		$this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#0000ff' ) );

		$before = $this->palettes->swatch_values( $id );

		$this->controller->delete_swatch( $this->swatch_request( 'DELETE', $id, $token ) );
		$this->controller->delete_swatch( $this->swatch_request( 'DELETE', $id, $token ) );

		$this->assertSame( $before, $this->palettes->swatch_values( $id ) );
	}

	/**
	 * @return Generator
	 */
	public function idempotentDeleteProvider(): Generator {
		yield 'a delta the non-default palette never set' => [
			'id'    => 'ocean',
			'token' => 'primitive.color.neutral.900',
		];

		yield 'an unedited baseline swatch on the default palette' => [
			'id'    => 'default',
			'token' => 'primitive.color.brand.accent',
		];

		yield 'a token no palette carries' => [
			'id'    => 'default',
			'token' => 'primitive.color.neutral.600',
		];
	}

	/**
	 * POST, PUT, and DELETE are all registered for the single-swatch sub-route.
	 *
	 * @return void
	 */
	public function testTheSwatchRouteAcceptsPostPutAndDelete(): void {
		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init' );

		$endpoints = $wp_rest_server->get_routes()['/kb-design-tokens/v1/palettes/(?P<id>[\w-]+)/swatches/(?P<token>[\w.-]+)'] ?? [];

		$methods = [];
		foreach ( $endpoints as $endpoint ) {
			foreach ( array_keys( array_filter( $endpoint['methods'] ?? [] ) ) as $method ) {
				$methods[ $method ] = true;
			}
		}

		$wp_rest_server = null;

		$this->assertArrayHasKey( 'POST', $methods );
		$this->assertArrayHasKey( 'PUT', $methods );
		$this->assertArrayHasKey( 'DELETE', $methods );
	}

	/**
	 * A write against the default palette that drops a swatch the shipped baseline defines is refused: the
	 * default palette is the structure template every other palette is projected from, so removing a row there
	 * would take that color out of every palette at once.
	 *
	 * @return void
	 */
	public function testUpdateItemRejectsADefaultPaletteMissingABaselineSwatch(): void {
		$result = $this->controller->update_item( $this->default_palette_request( 'primitive.color.brand.button' ) );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_locked', $result->get_error_code() );
		$this->assertSame( WP_Http::FORBIDDEN, $this->status_of( $result ) );
		$this->assertSame( 'primitive.color.brand.button', $result->get_error_data()['token'] );

		// The refusal is total: nothing about the palette was persisted.
		$this->assertSame( '#3633e1', $this->palettes->swatch_values( 'default' )['primitive.color.brand.button'] );
	}

	/**
	 * A default-palette write that keeps every baseline swatch is accepted, so an ordinary recolor still saves.
	 *
	 * @return void
	 */
	public function testUpdateItemAcceptsADefaultPaletteThatKeepsEveryBaselineSwatch(): void {
		$request = $this->default_palette_request();
		$groups  = $request->get_param( 'groups' );

		$groups[0]['swatches'][3]['$value'] = '#abcdef';
		$request->set_param( 'groups', $groups );

		$result = $this->controller->update_item( $request );

		$this->assertNotInstanceOf( WP_Error::class, $result );
		$this->assertSame( '#abcdef', $this->palettes->swatch_values( 'default' )['primitive.color.brand.button'] );
	}

	/**
	 * The default palette may still drop a swatch the baseline does NOT define — a user-added color is deletable,
	 * which is the whole point of scoping the lock to the shipped set.
	 *
	 * @return void
	 */
	public function testUpdateItemAllowsANonBaselineSwatchToBeDroppedFromTheDefaultPalette(): void {
		// Built before anything is stored, so it carries the shipped structure without the extra group the next
		// request adds — the helper reads the EFFECTIVE palette, which would otherwise include it by then.
		$without = $this->default_palette_request();

		// primitive.color.neutral.600 is a registered color the shipped palette lists no swatch for, so it stands
		// in for a user-added color without needing a minted primitive.
		$added  = $this->default_palette_request();
		$groups = $added->get_param( 'groups' );

		$groups[] = [
			'id'       => 'extras',
			'label'    => 'Extras',
			'swatches' => [
				[
					'token'  => 'primitive.color.neutral.600',
					'label'  => 'Neutral 600',
					'$value' => '#4A5568',
				],
			],
		];

		$added->set_param( 'groups', $groups );

		$this->assertNotInstanceOf( WP_Error::class, $this->controller->update_item( $added ) );
		$this->assertArrayHasKey( 'primitive.color.neutral.600', $this->palettes->swatch_values( 'default' ) );

		// Now save the palette back without it: the lock does not apply, so the row goes away for good.
		$this->assertNotInstanceOf( WP_Error::class, $this->controller->update_item( $without ) );
		$this->assertArrayNotHasKey( 'primitive.color.neutral.600', $this->palettes->swatch_values( 'default' ) );
	}

	/**
	 * The lock is scoped to the default palette: a non-default palette is stored as deltas, so it omits nearly
	 * every baseline swatch by design and must still save.
	 *
	 * @return void
	 */
	public function testUpdateItemAllowsANonDefaultPaletteToOmitBaselineSwatches(): void {
		$result = $this->controller->update_item( $this->write_request( 'ocean', 'Ocean', '#DD6B20' ) );

		$this->assertNotInstanceOf( WP_Error::class, $result );
		$this->assertSame( [ 'primitive.color.brand.primary' => '#DD6B20' ], $this->palettes->swatch_values( 'ocean' ) );
	}

	/**
	 * A palette's effective view flattened to `{ token => swatch }`, so a case can assert on one swatch's flags
	 * without walking the group structure.
	 *
	 * @param string $id The palette id to read.
	 *
	 * @return array<string, array<string, mixed>> The view's swatches, keyed by token dot-path.
	 */
	private function view_swatches( string $id ): array {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );
		$request->set_param( 'id', $id );

		$swatches = [];

		foreach ( $this->controller->get_item( $request )->get_data()['groups'] as $group ) {
			foreach ( $group['swatches'] as $swatch ) {
				$swatches[ $swatch['token'] ] = $swatch;
			}
		}

		return $swatches;
	}

	/**
	 * A write request carrying the default palette's full baseline structure, optionally with one swatch removed
	 * — the shape the Style Library sends when it saves the palette it is editing.
	 *
	 * @param string|null $omit_token A swatch token dot-path to leave out, or null to send the structure intact.
	 *
	 * @return WP_REST_Request
	 */
	private function default_palette_request( ?string $omit_token = null ): WP_REST_Request {
		$node   = $this->palettes->palette( 'default' ) ?? [];
		$groups = [];

		foreach ( $node['groups'] ?? [] as $group ) {
			$swatches = [];

			foreach ( $group['swatches'] ?? [] as $swatch ) {
				if ( $swatch['token'] !== $omit_token ) {
					$swatches[] = $swatch;
				}
			}

			$group['swatches'] = $swatches;
			$groups[]          = $group;
		}

		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'id', 'default' );
		$request->set_param( 'label', $node['label'] ?? 'Default' );
		$request->set_param( 'groups', $groups );

		return $request;
	}

	/**
	 * Create a non-default "custom" palette (a single brand-primary delta of #DD6B20, labelled "Custom") through
	 * the controller's own write path, without pointing `$current` at it. The baseline no longer ships a
	 * non-default palette, so the list / read / $current cases own the one they exercise — and creating it inactive
	 * keeps the library `$current` on `default` until a test sets it explicitly.
	 *
	 * @return void
	 */
	private function create_custom_palette(): void {
		$this->controller->update_item( $this->write_request( 'custom', 'Custom', '#DD6B20' ) );
	}

	/**
	 * A single-swatch request for the sub-route: the palette id, the token dot-path, and (for a write) the value.
	 *
	 * @param string      $method The HTTP method.
	 * @param string      $id     The palette id.
	 * @param string      $token  The swatch token dot-path.
	 * @param string|null $value  The swatch value, for a write.
	 *
	 * @return WP_REST_Request
	 */
	private function swatch_request( string $method, string $id, string $token, ?string $value = null ): WP_REST_Request {
		$request = new WP_REST_Request( $method );
		$request->set_param( 'id', $id );
		$request->set_param( 'token', $token );

		if ( $value !== null ) {
			$request->set_param( '$value', $value );
		}

		return $request;
	}

	/**
	 * A palette write request with a single one-swatch Accent group.
	 *
	 * @param string $id    The palette id.
	 * @param string $label The palette label.
	 * @param string $value The single swatch's $value.
	 *
	 * @return WP_REST_Request
	 */
	private function write_request( string $id, string $label, string $value ): WP_REST_Request {
		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'id', $id );
		$request->set_param( 'label', $label );
		$request->set_param(
			'groups',
			[
				[
					'id'       => 'accent',
					'label'    => 'Accent',
					'swatches' => [
						[
							'token'  => 'primitive.color.brand.primary',
							'label'  => 'Main 1',
							'$value' => $value,
						],
					],
				],
			]
		);

		return $request;
	}

	/**
	 * The HTTP status of a controller return value, whether a WP_Error or a WP_REST_Response.
	 *
	 * @param WP_REST_Response|WP_Error $result The controller return value.
	 *
	 * @return int
	 */
	private function status_of( $result ): int {
		if ( $result instanceof WP_Error ) {
			return (int) $result->get_error_data()['status'];
		}

		return $result->get_status();
	}
}
