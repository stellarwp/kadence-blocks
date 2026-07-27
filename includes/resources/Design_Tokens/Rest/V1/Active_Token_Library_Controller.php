<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Utils\Cast;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the active token set pointer.
 *
 * Exposes which set the module treats as canonical: a read of the resolved pointer (get_item) and a
 * write that points it at a named set (update_item). The pointer is the analog of the design-system
 * addon's activePaletteId — a single selection, distinct from the per-set document surface that
 * Documents_Controller owns.
 *
 * The read always returns a valid set: Active_Token_Library_Store falls back to the default set when the pointer
 * was never set or now names a deleted set. A write to an unknown set is a 404; a write to a known set
 * persists the pointer and fires Active_Token_Library_Store::changed_action() so caches and projectors can react.
 *
 * @since TBD
 */
final class Active_Set_Controller extends Controller {

	/**
	 * The request parameter that carries the token set slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_PARAM = 'slug';

	/**
	 * The slug path segment for the write route. Built from SLUG_PARAM so the named capture and the read
	 * parameter never drift apart.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_ROUTE = '(?P<' . self::SLUG_PARAM . '>[\w-]+)';

	/**
	 * Owns the active-set pointer.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The sole gateway to the kb_design_tokens table, used to validate a write target exists.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

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
	 * @param Active_Token_Library_Store $active Owns the active-set pointer.
	 * @param Token_Store                $store  The sole gateway to the kb_design_tokens table.
	 */
	public function __construct( Active_Token_Library_Store $active, Token_Store $store ) {
		$this->active    = $active;
		$this->store     = $store;
		$this->rest_base = 'active-set';
	}

	/**
	 * Register the read and write routes for the active-set pointer.
	 *
	 * The read is a singleton resource at the base; the write carries the target slug in the path,
	 * mirroring the {slug} routing on the documents resource. Both carry their args and schema so the
	 * MCP layer can introspect the request and response shapes.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			"/$this->rest_base",
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::SLUG_ROUTE,
			[
				[
					'methods'             => 'PUT',
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_slug_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Read the active token set pointer.
	 *
	 * Returns the resolved slug, which always names a readable set: the store falls back to the default
	 * set when the stored pointer is empty or dangling.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_item( $request ) {
		return new WP_REST_Response( [ self::SLUG_PARAM => $this->active->get() ], WP_Http::OK );
	}

	/**
	 * Point the active set at a named set (PUT /active-set/{slug}).
	 *
	 * The target must name a known set — the default set is always known, any other slug once it has a
	 * stored row — otherwise it is a 404. On success the pointer is persisted and the resolved active
	 * slug is returned.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( $slug !== Token_Store::default_slug() && ! $this->store->exists( $slug ) ) {
			return new WP_Error(
				'rest_design_tokens_not_found',
				__( 'Sorry, that design token set does not exist.', 'kadence-blocks' ),
				[
					'status'         => WP_Http::NOT_FOUND,
					self::SLUG_PARAM => $slug,
				]
			);
		}

		$this->active->set( $slug );

		return new WP_REST_Response( [ self::SLUG_PARAM => $this->active->get() ], WP_Http::OK );
	}

	/**
	 * The JSON Schema for the active-set pointer.
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
			'title'      => 'design-token-active-set',
			'type'       => 'object',
			'properties' => [
				self::SLUG_PARAM => [
					'description' => __( 'The active token set slug, always resolved to an existing set.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}

	/**
	 * The arguments for the write route: the target slug path parameter.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_slug_params(): array {
		return [
			self::SLUG_PARAM => [
				'description'       => __( 'The token set slug to make active.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
		];
	}
}
