<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Feed_Assembler;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Utils\Cast;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the admin UI schema feed — the same payload shape
 * `Admin\Feed\Localizer` prints inline as `window.kadenceDesignTokens` on page load, addressable
 * per library over REST.
 *
 * Exists so the Style Library app can switch its active library in place: it calls
 * {@see Active_Token_Library_Controller::update_item()} to move the pointer, then re-reads the
 * feed here for the newly active slug instead of reloading the page. Both this controller and the
 * Localizer build their payload through {@see Feed_Assembler::for_slug()} — the one place that
 * decides what "the feed for a slug" means — so a switched library can never render differently
 * from a freshly loaded one.
 *
 * @since TBD
 */
final class Feed_Controller extends Controller {

	/**
	 * The request parameter that carries the token library slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_PARAM = 'slug';

	/**
	 * The slug path segment. Built from SLUG_PARAM so the named capture and the read parameter
	 * never drift apart.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_ROUTE = '(?P<' . self::SLUG_PARAM . '>[\w-]+)';

	/**
	 * The sole gateway to the kb_design_tokens table, used to validate the requested slug exists.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The shared pipeline that builds a feed payload for a slug.
	 *
	 * @since TBD
	 *
	 * @var Feed_Assembler
	 */
	private Feed_Assembler $assembler;

	/**
	 * Memoised item schema for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $item_schema = null;

	/**
	 * @since TBD
	 *
	 * @param Token_Store    $store     The sole gateway to the kb_design_tokens table.
	 * @param Feed_Assembler $assembler The shared pipeline that builds a feed payload for a slug.
	 */
	public function __construct( Token_Store $store, Feed_Assembler $assembler ) {
		$this->store     = $store;
		$this->assembler = $assembler;
		$this->rest_base = 'feed';
	}

	/**
	 * Register the read route for the feed resource.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::SLUG_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_slug_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Read the admin UI schema feed for one token library (GET /feed/{slug}).
	 *
	 * The default library is always known; any other slug must have a stored row, otherwise it is
	 * a 404 — mirroring the sibling document routes rather than silently falling back to a
	 * different library than the one requested.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( $slug !== Token_Store::default_slug() && ! $this->store->exists( $slug ) ) {
			return new WP_Error(
				'rest_design_tokens_not_found',
				__( 'Sorry, that design token library does not exist.', 'kadence-blocks' ),
				[
					'status'         => WP_Http::NOT_FOUND,
					self::SLUG_PARAM => $slug,
				]
			);
		}

		return new WP_REST_Response( $this->assembler->for_slug( $slug ), WP_Http::OK );
	}

	/**
	 * The JSON Schema for the feed payload.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_item_schema(): array {
		if ( $this->item_schema !== null ) {
			return $this->add_additional_fields_schema( $this->item_schema );
		}

		$this->item_schema = [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => 'design-token-feed',
			'type'       => 'object',
			'properties' => [
				'active'     => [
					'description' => __( 'Whether the design-token registry is active.', 'kadence-blocks' ),
					'type'        => 'boolean',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'resolved'   => [
					'description' => __( 'Whether the library resolved without a corrupt-store failure.', 'kadence-blocks' ),
					'type'        => 'boolean',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version'    => [
					'description' => __( 'The cache-busting version hash for the library, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'slug'       => [
					'description' => __( 'The token library slug the feed was assembled for.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'schema'     => [
					'description'          => __( 'The token structure, grouped for the UI.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'readonly'             => true,
					'additionalProperties' => true,
				],
				'values'     => [
					'description'          => __( 'Resolved CSS values keyed by token dot-path id.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'readonly'             => true,
					'additionalProperties' => [ 'type' => 'string' ],
				],
				'presets'    => [
					'description'          => __( 'Per-block preset structure and resolved preview values.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'readonly'             => true,
					'additionalProperties' => true,
				],
				'presetNav'  => [
					'description' => __( 'The nav-ready block-presets section, for labeled/picker-driven preset bindings only.', 'kadence-blocks' ),
					'type'        => 'array',
					'context'     => [ 'view' ],
					'readonly'    => true,
					'items'       => [ 'type' => 'object' ],
				],
				'responsive' => [
					'description'          => __( 'Authored responsive / clamp shape keyed by token dot-path id.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'readonly'             => true,
					'additionalProperties' => true,
				],
				'rest'       => [
					'description' => __( 'The REST descriptor (root, namespace, nonce) the app writes edits to.', 'kadence-blocks' ),
					'type'        => 'object',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}

	/**
	 * The arguments for the read route: the target slug path parameter.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_slug_params(): array {
		return [
			self::SLUG_PARAM => [
				'description'       => __( 'The token library slug to read the feed for.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
		];
	}
}
