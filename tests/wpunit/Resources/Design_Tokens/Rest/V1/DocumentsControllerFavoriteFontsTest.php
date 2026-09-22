<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Feed_Assembler;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Font_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Favorite_Font_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Documents_Controller;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the favorite-fonts sub-route: PUT/DELETE /documents/{slug}/favorite-fonts/{family}, its
 * catalog membership gate, its narrowed write path, and the version-conditional guard.
 *
 * @since TBD
 */
final class DocumentsControllerFavoriteFontsTest extends TestCase {

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
	 * @var Favorite_Font_Index
	 */
	private Favorite_Font_Index $index;

	/**
	 * Two real catalog family names, discovered fresh per test so the fixture stays correct
	 * regardless of what the generated Google names file happens to ship.
	 *
	 * @since TBD
	 *
	 * @var list<string>
	 */
	private array $families;

	/**
	 * Build the controller and its collaborators fresh before each test, and discover two real
	 * catalog families to favorite.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store      = $this->container->get( Token_Store::class );
		$this->controller = $this->container->get( Documents_Controller::class );
		$this->index      = $this->container->get( Favorite_Font_Index::class );

		$catalog = $this->container->get( Font_Catalog::class )->all();
		$names   = array_merge( $catalog['google'], $catalog['custom'] );

		$this->assertGreaterThanOrEqual( 2, count( $names ), 'The font catalog must carry at least two families.' );

		$this->families = [ $names[0], $names[1] ];

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
	 * A PUT stores the family, and the feed carries it under favoriteFonts.
	 *
	 * @return void
	 */
	public function testPutStoresTheFamilyAndTheFeedReflectsIt(): void {
		$slug = Token_Store::default_slug();

		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, $this->families[0], $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status() );
		$this->assertSame( [ $this->families[0] ], $this->stored_favorites( $slug ) );
		$this->assertSame( [ $this->families[0] ], $this->feed_favorites( $slug ) );
	}

	/**
	 * Favorites keep their insertion order, which is the order every picker renders them in.
	 *
	 * @return void
	 */
	public function testFavoritesKeepTheirInsertionOrder(): void {
		$slug = Token_Store::default_slug();

		$this->favorite( $slug, $this->families[0] );
		$this->favorite( $slug, $this->families[1] );

		$this->assertSame( $this->families, $this->stored_favorites( $slug ) );
	}

	/**
	 * Re-adding a family already in the list is idempotent: no write happens, so the store
	 * version is unchanged and the family keeps its existing position rather than moving to the end.
	 *
	 * @return void
	 */
	public function testRepeatedPutIsIdempotentAndPreservesPosition(): void {
		$slug = Token_Store::default_slug();

		$this->favorite( $slug, $this->families[0] );
		$this->favorite( $slug, $this->families[1] );

		$version_before = $this->store->get_version( $slug );

		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, $this->families[0], $version_before )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( $version_before, $this->store->get_version( $slug ) );
		$this->assertSame( $this->families, $this->stored_favorites( $slug ) );
	}

	/**
	 * A catalog family matches case-insensitively, so a client need not reproduce the catalog's
	 * own casing byte for byte.
	 *
	 * @return void
	 */
	public function testCatalogMatchIsCaseInsensitive(): void {
		$slug = Token_Store::default_slug();

		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, strtoupper( $this->families[0] ), $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( [ strtoupper( $this->families[0] ) ], $this->stored_favorites( $slug ) );
	}

	/**
	 * A DELETE removes the family, leaving its siblings intact, and a second DELETE is idempotent.
	 *
	 * @return void
	 */
	public function testDeleteRemovesTheFamilyAndASecondDeleteIsIdempotent(): void {
		$slug = Token_Store::default_slug();

		$this->favorite( $slug, $this->families[0] );
		$this->favorite( $slug, $this->families[1] );

		$response = $this->controller->delete_favorite_font(
			$this->favorite_request( 'DELETE', $slug, $this->families[0], $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( [ $this->families[1] ], $this->stored_favorites( $slug ) );

		$version_after_first_delete = $this->store->get_version( $slug );

		$second = $this->controller->delete_favorite_font(
			$this->favorite_request( 'DELETE', $slug, $this->families[0], $version_after_first_delete )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $second );
		$this->assertSame( WP_Http::OK, $second->get_status() );
		$this->assertSame( $version_after_first_delete, $this->store->get_version( $slug ) );
	}

	/**
	 * A favorite whose family the catalog no longer carries can still be removed. That is the
	 * whole reason DELETE does not gate on the catalog: a theme switch strands the favorite, and
	 * gating removal would leave no way to clear it from the UI.
	 *
	 * @return void
	 */
	public function testDeleteRemovesAFamilyTheCatalogNoLongerCarries(): void {
		$slug     = Token_Store::default_slug();
		$stranded = 'A Font No Catalog Carries';

		$document = (string) wp_json_encode( $this->index->add( [], $stranded ) );
		$this->store->save_document( $document );

		$response = $this->controller->delete_favorite_font(
			$this->favorite_request( 'DELETE', $slug, $stranded, $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertSame( [], $this->stored_favorites( $slug ) );
	}

	/**
	 * A family the site's catalog does not carry is refused on PUT, so a typo cannot accumulate as
	 * a favorite every picker lists and no browser resolves.
	 *
	 * @return void
	 */
	public function testUnknownFamilyReturns404OnPut(): void {
		$slug = Token_Store::default_slug();

		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, 'Not A Real Font Family', $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_unknown_font_family', $response->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $response->get_error_data()['status'] );
	}

	/**
	 * An unknown library slug is a 404, on both PUT and DELETE.
	 *
	 * @return void
	 */
	public function testUnknownSlugReturns404(): void {
		$put = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', 'does-not-exist', $this->families[0], '' )
		);

		$this->assertInstanceOf( WP_Error::class, $put );
		$this->assertSame( 'rest_design_tokens_not_found', $put->get_error_code() );

		$delete = $this->controller->delete_favorite_font(
			$this->favorite_request( 'DELETE', 'does-not-exist', $this->families[0], '' )
		);

		$this->assertInstanceOf( WP_Error::class, $delete );
		$this->assertSame( 'rest_design_tokens_not_found', $delete->get_error_code() );
	}

	/**
	 * A stale client version is rejected with 409, and the document is left unchanged.
	 *
	 * @return void
	 */
	public function testStaleVersionReturns409AndDocumentIsUnchanged(): void {
		$slug = Token_Store::default_slug();

		$this->favorite( $slug, $this->families[0] );

		$stored_before = $this->store->get_document( $slug );

		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, $this->families[1], 'stale-version' )
		);

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertSame( 'rest_design_tokens_conflict', $response->get_error_code() );
		$this->assertSame( WP_Http::CONFLICT, $response->get_error_data()['status'] );
		$this->assertSame( $stored_before, $this->store->get_document( $slug ) );
	}

	/**
	 * A family name containing a space is reachable through the actual WP REST dispatch layer,
	 * with the family segment built the way a real client must build it: percent-encoded via
	 * `rawurlencode()`. Every other test in this suite calls the controller method directly, which
	 * never exercises `register_routes()`'s regex, the `family` arg's `pattern`/`sanitize_callback`,
	 * or WP's own URL routing — this is the one test that dispatches a real request on a path built
	 * the way a browser `fetch()` would build it, so both a route character class that excludes
	 * spaces and a handler that fails to decode the percent-escapes would fail here rather than
	 * shipping unnoticed. Most Google families are multi-word, so this is the common case.
	 *
	 * @return void
	 */
	public function testMultiWordFamilyIsReachableThroughRealRestDispatch(): void {
		$slug   = Token_Store::default_slug();
		$family = null;

		foreach ( $this->container->get( Font_Catalog::class )->all()['google'] as $candidate ) {
			if ( str_contains( $candidate, ' ' ) ) {
				$family = $candidate;
				break;
			}
		}

		$this->assertNotNull( $family, 'The Google catalog must carry at least one multi-word family.' );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );

		$request = new WP_REST_Request( 'PUT', '/kb-design-tokens/v1/documents/' . $slug . '/favorite-fonts/' . rawurlencode( $family ) );
		$request->set_param( 'version', $this->store->get_version( $slug ) );

		global $wp_rest_server;
		$response = $wp_rest_server->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::CREATED, $response->get_status(), 'The family route must match a percent-encoded multi-word family rather than 404 at the routing layer.' );
		$this->assertSame( [ $family ], $this->stored_favorites( $slug ) );
	}

	/**
	 * The narrowed write path lets a favorite succeed even in a library whose stored document
	 * currently fails full DTCG validation, and leaves the invalid remainder untouched.
	 *
	 * @return void
	 */
	public function testNarrowedPathAllowsAFavoriteInALibraryThatFailsFullValidation(): void {
		$slug    = Token_Store::default_slug();
		$invalid = '{"primitive":{"color":{"x":{"$type":"color","$value":"not-a-color"}}}}';

		$this->store->save_document( $invalid );

		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, $this->families[0], $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );

		$stored = json_decode( $this->store->get_document( $slug ), true );

		$this->assertSame( [ $this->families[0] ], $this->index->all( $stored ) );
		$this->assertSame( 'not-a-color', $stored['primitive']['color']['x']['$value'], 'The pre-existing invalid remainder must be left untouched.' );
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * Favorite a family through the controller, asserting the write succeeded.
	 *
	 * @param string $slug   The token library slug.
	 * @param string $family The family to favorite.
	 *
	 * @return void
	 */
	private function favorite( string $slug, string $family ): void {
		$response = $this->controller->set_favorite_font(
			$this->favorite_request( 'PUT', $slug, $family, $this->store->get_version( $slug ) )
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * The favorites currently stored in a library's document.
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return list<string>
	 */
	private function stored_favorites( string $slug ): array {
		return $this->index->all( $this->store->get_decoded_document( $slug ) );
	}

	/**
	 * The favorites the assembled feed carries for a library.
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return list<string>
	 */
	private function feed_favorites( string $slug ): array {
		return $this->container->get( Feed_Assembler::class )->for_slug( $slug )['favoriteFonts'];
	}

	/**
	 * Build a favorite-fonts request with the params both handlers read.
	 *
	 * @param string $method  The HTTP method.
	 * @param string $slug    The token library slug.
	 * @param string $family  The font family name.
	 * @param string $version The client's last-read version.
	 *
	 * @return WP_REST_Request
	 */
	private function favorite_request( string $method, string $slug, string $family, string $version ): WP_REST_Request {
		$request = new WP_REST_Request( $method );
		$request->set_param( 'slug', $slug );
		$request->set_param( 'family', $family );
		$request->set_param( 'version', $version );

		return $request;
	}
}
