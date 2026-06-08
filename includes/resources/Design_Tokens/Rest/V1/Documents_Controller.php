<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the Design Tokens document resource.
 *
 * Exposes the read surface for a token set: the raw overrides-only DTCG document (get_items /
 * get_item) and the resolved/flattened token map for previews (get_resolved). The write callbacks
 * (create/update/delete) land later in this same class, since WP_REST_Controller houses a resource's
 * read and write routes together.
 *
 * A single token set ships under Token_Store::default_slug(); the slug parameter and the collection
 * are modelled now so the surface does not change when multi-set support arrives.
 *
 * @since TBD
 */
final class Documents_Controller extends Controller {

	/**
	 * The request parameter that carries the token set slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_PARAM = 'slug';

	/**
	 * The slug path segment shared by the single-set routes. Built from SLUG_PARAM so the named capture
	 * and the read parameter never drift apart.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_ROUTE = '(?P<' . self::SLUG_PARAM . '>[\w-]+)';

	/**
	 * The sub-route, relative to a single set, that returns the resolved/flattened token map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const RESOLVED_ROUTE = 'resolved';

	/**
	 * The sole gateway to the kb_design_tokens table.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Flattens a stored token set into the ready-to-emit maps.
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Memoised item schema for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $item_schema = null;

	/**
	 * Memoised resolved-map schema for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $resolved_schema = null;

	/**
	 * @since TBD
	 *
	 * @param Token_Store    $store    The sole gateway to the kb_design_tokens table.
	 * @param Token_Resolver $resolver Flattens a stored token set into the ready-to-emit maps.
	 */
	public function __construct( Token_Store $store, Token_Resolver $resolver ) {
		$this->store     = $store;
		$this->resolver  = $resolver;
		$this->rest_base = 'documents';
	}

	/**
	 * Register the read routes for the document resource.
	 *
	 * Only the readable routes are registered for now; the writable routes join this same registration
	 * when the write endpoints land. Every route carries both its args and its schema so the MCP layer
	 * can introspect the request and response shapes.
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
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

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

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::SLUG_ROUTE . '/' . self::RESOLVED_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_resolved' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_slug_params(),
				],
				'schema' => [ $this, 'get_resolved_schema' ],
			]
		);
	}

	/**
	 * Read the collection of token-set documents.
	 *
	 * Only a single set ships under Token_Store::default_slug() and the store exposes no listing method,
	 * so the collection is the one default set. Enumerating multiple sets awaits a future
	 * Token_Store::list_stores() that lands with multi-brand support.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$items = [ $this->prepare_item( Token_Store::default_slug() ) ];

		return new WP_REST_Response( $items, WP_Http::OK );
	}

	/**
	 * Read a single token-set document by slug.
	 *
	 * Only the default set exists, so any other slug is unknown. Validating arbitrary slugs against the
	 * stored sets awaits a future Token_Store::list_stores() that lands with multi-brand support.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( $slug !== Token_Store::default_slug() ) {
			return $this->not_found( $slug );
		}

		return new WP_REST_Response( $this->prepare_item( $slug ), WP_Http::OK );
	}

	/**
	 * Read the resolved/flattened token map for a set, for previews.
	 *
	 * An unknown slug is a 404, mirroring get_item(). The resolver follows aliases and renders each leaf
	 * to its CSS value; a stored set carrying an alias cycle or a dangling alias cannot be flattened, so it
	 * is surfaced as HTTP 422 rather than a fatal.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_resolved( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( $slug !== Token_Store::default_slug() ) {
			return $this->not_found( $slug );
		}

		try {
			$resolved = $this->resolver->resolve( $slug );
		} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
			return new WP_Error(
				'rest_design_tokens_unresolvable',
				$e->getMessage(),
				[
					'status' => WP_Http::UNPROCESSABLE_ENTITY,
					'slug'   => $slug,
				]
			);
		}

		return new WP_REST_Response(
			[
				'slug'    => $slug,
				'version' => $this->store->get_version( $slug ),
				'by_id'   => $resolved->by_id(),
				'by_var'  => $resolved->by_var(),
			],
			WP_Http::OK
		);
	}

	/**
	 * The JSON Schema for a token-set document item.
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
			'title'      => 'design-token-document',
			'type'       => 'object',
			'properties' => [
				'slug'     => [
					'description' => __( 'The token set slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version'  => [
					'description' => __( 'The cache-busting version hash for the set, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'document' => [
					'description'          => __( 'The raw overrides-only DTCG document, empty when the set renders entirely from baseline.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'additionalProperties' => true,
					'readonly'             => true,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}

	/**
	 * The JSON Schema for the resolved/flattened token map response.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_resolved_schema(): array {
		if ( $this->resolved_schema !== null ) {
			return $this->add_additional_fields_schema( $this->resolved_schema );
		}

		$css_value_map = [
			'type'                 => 'object',
			'context'              => [ 'view' ],
			'readonly'             => true,
			'additionalProperties' => [ 'type' => 'string' ],
		];

		$this->resolved_schema = [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => 'design-token-resolved-map',
			'type'       => 'object',
			'properties' => [
				'slug'    => [
					'description' => __( 'The token set slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version' => [
					'description' => __( 'The cache-busting version hash for the set, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'by_id'   => array_merge(
					[ 'description' => __( 'Resolved CSS values keyed by token dot-path id.', 'kadence-blocks' ) ],
					$css_value_map
				),
				'by_var'  => array_merge(
					[ 'description' => __( 'Resolved CSS values keyed by CSS custom-property name.', 'kadence-blocks' ) ],
					$css_value_map
				),
			],
		];

		return $this->add_additional_fields_schema( $this->resolved_schema );
	}

	/**
	 * The query parameters accepted by the collection route.
	 *
	 * No collection parameters are accepted yet; the definition is declared explicitly so the surface
	 * documents itself and gains parameters without changing shape.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_collection_params(): array {
		return [];
	}

	/**
	 * The arguments shared by the single-set routes: the slug path parameter.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_slug_params(): array {
		return [
			self::SLUG_PARAM => [
				'description'       => __( 'The token set slug.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
		];
	}

	/**
	 * Build the response payload for a single token-set document.
	 *
	 * Reads the raw overrides-only DTCG document for the set. An absent or empty row yields an empty
	 * document, since the set then renders entirely from baseline.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>
	 */
	private function prepare_item( string $slug ): array {
		$raw     = $this->store->get_document( $slug );
		$decoded = $raw === '' ? [] : json_decode( $raw, true );

		return [
			'slug'     => $slug,
			'version'  => $this->store->get_version( $slug ),
			'document' => is_array( $decoded ) ? $decoded : [],
		];
	}

	/**
	 * The error returned when a slug does not name a known token set.
	 *
	 * @since TBD
	 *
	 * @param string $slug The unknown slug.
	 *
	 * @return WP_Error
	 */
	private function not_found( string $slug ): WP_Error {
		return new WP_Error(
			'rest_design_tokens_not_found',
			__( 'Sorry, that design token set does not exist.', 'kadence-blocks' ),
			[
				'status' => WP_Http::NOT_FOUND,
				'slug'   => $slug,
			]
		);
	}
}
