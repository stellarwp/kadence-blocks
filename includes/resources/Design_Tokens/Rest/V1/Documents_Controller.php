<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the Design Tokens document resource.
 *
 * Exposes the full read and write surface for a token set: the raw overrides-only DTCG document
 * (get_items / get_item), the resolved/flattened token map for previews (get_resolved), bulk
 * create / merge / replace / reset of the whole document, and set / delete of a single token by
 * dot-path. WP_REST_Controller houses a resource's read and write routes together.
 *
 * Every write runs the same pipeline: DTCG grammar validation, then a dry-run Resolver pass that
 * rejects alias cycles and dangling aliases (HTTP 422) before anything is committed, then a single
 * Token_Store::save_document() that bumps the version and fires the change action.
 *
 * A single token set ships under Token_Store::default_slug(); the slug parameter and the collection
 * are modelled now so the surface does not change when multi-set support arrives. Until then a
 * non-default slug is rejected: reads return 404 (no such set), writes return 422 (multi-set authoring
 * is unsupported).
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
	 * The request parameter that carries a single token's dot-path.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PATH_PARAM = 'path';

	/**
	 * The request parameter that carries the raw DTCG document on a bulk write.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DOCUMENT_PARAM = 'document';

	/**
	 * The request parameter that carries an optional human-readable label for the set.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TITLE_PARAM = 'title';

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
	 * The sub-route, relative to a single set, that collects the single-token endpoints.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKENS_ROUTE = 'tokens';

	/**
	 * The dot-path path segment for the single-token routes. The character class matches the alias
	 * grammar (a dot-path) minus the braces, so a token is addressable as a sub-resource of its set.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PATH_ROUTE = '(?P<' . self::PATH_PARAM . '>[\w.-]+)';

	/**
	 * The sole gateway to the kb_design_tokens table.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Flattens a stored token set into the ready-to-emit maps, and dry-runs candidate overrides.
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Validates the DTCG grammar of a candidate document before it is committed.
	 *
	 * @since TBD
	 *
	 * @var Dtcg_Validator
	 */
	private Dtcg_Validator $validator;

	/**
	 * Pure merge / set / remove transforms used to assemble the candidate overrides document.
	 *
	 * @since TBD
	 *
	 * @var Document_Mutator
	 */
	private Document_Mutator $mutator;

	/**
	 * Builds the baseline-merged effective document, used to infer a token's $type on a single-token write.
	 *
	 * @since TBD
	 *
	 * @var Effective_Document
	 */
	private Effective_Document $effective;

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
	 * @param Token_Store        $store     The sole gateway to the kb_design_tokens table.
	 * @param Token_Resolver     $resolver  Flattens a stored token set and dry-runs candidate overrides.
	 * @param Dtcg_Validator     $validator Validates the DTCG grammar of a candidate document.
	 * @param Document_Mutator   $mutator   Assembles the candidate overrides document.
	 * @param Effective_Document $effective Builds the effective document for $type inference.
	 */
	public function __construct(
		Token_Store $store,
		Token_Resolver $resolver,
		Dtcg_Validator $validator,
		Document_Mutator $mutator,
		Effective_Document $effective
	) {
		$this->store     = $store;
		$this->resolver  = $resolver;
		$this->validator = $validator;
		$this->mutator   = $mutator;
		$this->effective = $effective;
		$this->rest_base = 'documents';
	}

	/**
	 * Register the read and write routes for the document resource.
	 *
	 * Every route carries both its args and its schema so the MCP layer can introspect the request and
	 * response shapes.
	 *
	 * Verb semantics follow the WordPress REST convention. POST is a partial update: the provided
	 * document is deep-merged into the stored overrides, leaving untouched paths intact (identical to
	 * PATCH). PUT is the full replace. This matches core controllers, where POST to a resource updates
	 * only the fields provided.
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
				[
					// POST = create-or-merge the set (partial update, per WP convention).
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_collection_write_params(),
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
				[
					// POST and PATCH both deep-merge the provided document into what is stored.
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'patch_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_document_write_params(),
				],
				[
					'methods'             => 'PATCH',
					'callback'            => [ $this, 'patch_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_document_write_params(),
				],
				[
					// PUT replaces the whole overrides document, dropping any stored path not in the body.
					'methods'             => 'PUT',
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_document_write_params(),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
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

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::SLUG_ROUTE . '/' . self::TOKENS_ROUTE . '/' . self::PATH_ROUTE,
			[
				[
					// For a single addressed leaf, POST and PUT are identical — there is no
					// merge-vs-replace distinction when exactly one token is written.
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'set_token' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_token_path_params(),
				],
				[
					'methods'             => 'PUT',
					'callback'            => [ $this, 'set_token' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_token_path_params(),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_token' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_token_path_params(),
				],
				'schema' => [ $this, 'get_token_schema' ],
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
	 * Create-or-merge the default set from the collection route (POST /documents).
	 *
	 * Per the WordPress partial-update convention, the provided document is deep-merged into whatever is
	 * stored; merging into an empty set simply creates it. v1 ships a single set, so an explicit
	 * non-default slug is rejected as unsupported.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function create_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( $slug === '' ) {
			$slug = Token_Store::default_slug();
		}

		$candidate = $this->mutator->merge( $this->read_stored_document( $slug ), $this->read_document_param( $request ) );

		return $this->validate_and_save( $candidate, $slug, Cast::to_string( $request->get_param( self::TITLE_PARAM ) ) );
	}

	/**
	 * Deep-merge a partial document into the stored set (POST or PATCH /documents/{slug}).
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function patch_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		$candidate = $this->mutator->merge( $this->read_stored_document( $slug ), $this->read_document_param( $request ) );

		return $this->validate_and_save( $candidate, $slug, Cast::to_string( $request->get_param( self::TITLE_PARAM ) ) );
	}

	/**
	 * Replace the whole overrides document for the set (PUT /documents/{slug}).
	 *
	 * Unlike POST/PATCH, this drops any stored path absent from the body.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		return $this->validate_and_save(
			$this->read_document_param( $request ),
			$slug,
			Cast::to_string( $request->get_param( self::TITLE_PARAM ) )
		);
	}

	/**
	 * Reset the whole set to baseline (DELETE /documents/{slug}).
	 *
	 * Stores an empty overrides document, so the set then renders entirely from baseline.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		$error = $this->guard_slug( $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->persist( '', $slug, '', WP_Http::OK );
	}

	/**
	 * Set a single token leaf by dot-path (POST or PUT /documents/{slug}/tokens/{path}).
	 *
	 * The dot-path is in the URL and the request body is the bare DTCG leaf, so the common case is a
	 * one-field body. When the leaf omits $type, it is inferred from the token already at that path in the
	 * effective document; $type is required only when creating a brand-new token. Sentinels
	 * ("$value": null reset, "$disabled": true) carry no $type and are stored as-is.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function set_token( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );
		$path = Cast::to_string( $request->get_param( self::PATH_PARAM ) );

		$error = $this->guard_slug( $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		// The leaf is the whole JSON body. Decode the raw body directly rather than via
		// get_json_params(), which is populated only once WordPress parses the request during dispatch.
		$leaf = json_decode( (string) $request->get_body(), true );

		if ( ! is_array( $leaf ) ) {
			$leaf = [];
		}

		$stored    = $this->read_stored_document( $slug );
		$effective = $this->effective->build( $stored );

		// Refuse to write a single token over a token group or to nest one under another token. Both would
		// silently restructure the document and orphan every token under the addressed path; the
		// single-token endpoint only ever writes a leaf. Bulk PUT/PATCH is the place to restructure.
		$error = $this->guard_leaf_target( $effective, $path, $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$is_sentinel = Sentinels::is_reset( $leaf ) || Sentinels::has_disabled( $leaf );

		if ( ! $is_sentinel && ! array_key_exists( Token_Type::get_type_key(), $leaf ) ) {
			$existing  = $this->node_at( $effective, $path );
			$node_type = is_array( $existing ) ? ( $existing[ Token_Type::get_type_key() ] ?? null ) : null;

			if ( ! is_string( $node_type ) ) {
				return new WP_Error(
					'rest_design_tokens_type_required',
					__( 'A $type is required to create a new token.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
						'path'   => $path,
					]
				);
			}

			$leaf[ Token_Type::get_type_key() ] = $node_type;
		}

		$candidate = $this->mutator->set( $stored, $path, $leaf );

		return $this->validate_and_save( $candidate, $slug, '' );
	}

	/**
	 * Remove a single token override by dot-path (DELETE /documents/{slug}/tokens/{path}).
	 *
	 * Dropping the override reverts that token to its baseline value. Idempotent: when nothing is stored
	 * at the path, the set is returned unchanged without a write.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_token( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		$error = $this->guard_slug( $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$path      = Cast::to_string( $request->get_param( self::PATH_PARAM ) );
		$stored    = $this->read_stored_document( $slug );
		$candidate = $this->mutator->remove( $stored, $path );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $slug ), WP_Http::OK );
		}

		return $this->persist( $candidate === [] ? '' : (string) wp_json_encode( $candidate ), $slug, '', WP_Http::OK );
	}

	/**
	 * Validate that the token dot-path begins with a real token layer and names a token below it.
	 *
	 * Used as the path argument's validate_callback so a path into "$extensions" (or any non-layer root,
	 * or a bare layer with no token) is rejected as a 400 before a handler runs.
	 *
	 * @since TBD
	 *
	 * @param mixed           $value   The submitted path.
	 * @param WP_REST_Request $request Full details about the request.
	 * @param string          $key     The parameter name.
	 *
	 * @return true|WP_Error
	 */
	public function validate_token_path( $value, $request, $key ) {
		$segments = explode( '.', Cast::to_string( $value ) );

		if ( count( $segments ) < 2 || ! in_array( $segments[0], Layers::token_layers(), true ) ) {
			return new WP_Error(
				'rest_invalid_param',
				sprintf(
					/* translators: %s: comma-separated list of valid token layers. */
					__( 'The token path must begin with a valid layer (%s) and name a token below it.', 'kadence-blocks' ),
					implode( ', ', Layers::token_layers() )
				),
				[ 'status' => WP_Http::BAD_REQUEST ]
			);
		}

		return true;
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
	 * The JSON Schema for a single-token response. A single-token write returns the full document item, so
	 * the document schema describes its shape.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_token_schema(): array {
		return $this->get_item_schema();
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
	 * Run the shared write pipeline against a candidate document, then commit it.
	 *
	 * Rejects a non-default slug as unsupported, then: validates the DTCG grammar (HTTP 422 on failure),
	 * dry-runs the Resolver to reject alias cycles / dangling aliases before commit (HTTP 422), and
	 * finally persists. An empty candidate clears the overrides (the set renders from baseline) and needs
	 * no validation or dry-run, since an empty document cannot carry an alias cycle.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The full candidate overrides document to validate and store.
	 * @param string               $slug      The token set slug.
	 * @param string               $title     Optional label; left untouched on update when empty.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function validate_and_save( array $candidate, string $slug, string $title ) {
		$error = $this->guard_slug( $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		// A brand-new set has no version yet; report 201 Created rather than 200 OK on first write.
		$status = $this->store->get_version( $slug ) !== '' ? WP_Http::OK : WP_Http::CREATED;

		if ( $candidate === [] ) {
			return $this->persist( '', $slug, $title, $status );
		}

		$result = $this->validator->validate( $candidate, Dtcg_Validator::get_context_overrides() );

		if ( ! $result->is_valid() ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'The design token document failed validation.', 'kadence-blocks' ),
				[
					'status' => WP_Http::UNPROCESSABLE_ENTITY,
					'slug'   => $slug,
					'errors' => $result->to_array(),
				]
			);
		}

		try {
			$this->resolver->resolve_overrides( $candidate );
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

		return $this->persist( (string) wp_json_encode( $candidate ), $slug, $title, $status );
	}

	/**
	 * Commit a raw document string to the store and build the response, mapping a write failure to 500.
	 *
	 * @since TBD
	 *
	 * @param string $document The raw overrides-only DTCG JSON (empty string clears the set).
	 * @param string $slug     The token set slug.
	 * @param string $title    Optional label; left untouched on update when empty.
	 * @param int    $status   The success status code.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function persist( string $document, string $slug, string $title, int $status ) {
		try {
			$this->store->save_document( $document, $slug, $title );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token set could not be saved.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'slug'   => $slug,
				]
			);
		}

		return new WP_REST_Response( $this->prepare_item( $slug ), $status );
	}

	/**
	 * Reject a write to any set other than the default one. v1 ships a single set; multi-set support lands
	 * later, so writing another slug is unsupported rather than a silent miss.
	 *
	 * @since TBD
	 *
	 * @param string $slug The requested slug.
	 *
	 * @return WP_Error|null A WP_Error when the slug is unsupported, null when it is the default set.
	 */
	private function guard_slug( string $slug ): ?WP_Error {
		if ( $slug === Token_Store::default_slug() ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_unsupported_slug',
			__( 'Only the default design token set can be written in this version.', 'kadence-blocks' ),
			[
				'status' => WP_Http::UNPROCESSABLE_ENTITY,
				'slug'   => $slug,
			]
		);
	}

	/**
	 * Refuse a single-token write whose path does not address a leaf.
	 *
	 * Walks the effective document along the dot-path: every intermediate segment must be a token group
	 * (writing below a token is impossible), and the terminal segment must be an existing leaf or absent
	 * (overwriting a whole group with one leaf would orphan every token under it). Either violation is an
	 * explicit, addressed error rather than the confusing downstream dangling-alias failure it would
	 * otherwise become.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $effective The baseline-merged effective document.
	 * @param string               $path      The token dot-path.
	 * @param string               $slug      The token set slug.
	 *
	 * @return WP_Error|null A WP_Error when the path does not address a leaf, null otherwise.
	 */
	private function guard_leaf_target( array $effective, string $path, string $slug ): ?WP_Error {
		$segments = explode( '.', $path );
		$last     = count( $segments ) - 1;
		$node     = $effective;
		$walked   = [];

		foreach ( $segments as $index => $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				// The path is new from here down: there is nothing existing to orphan.
				return null;
			}

			$node     = $node[ $segment ];
			$walked[] = $segment;

			if ( ! is_array( $node ) ) {
				return null;
			}

			if ( $index === $last ) {
				if ( $this->is_leaf_node( $node ) ) {
					return null;
				}

				return new WP_Error(
					'rest_design_tokens_not_a_token',
					sprintf(
						/* translators: %s: the token dot-path. */
						__( '"%s" is a token group, not a single token. Write a token below it instead.', 'kadence-blocks' ),
						$path
					),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
						'path'   => $path,
					]
				);
			}

			if ( $this->is_leaf_node( $node ) ) {
				return new WP_Error(
					'rest_design_tokens_not_a_token',
					sprintf(
						/* translators: 1: the ancestor dot-path that is a token, 2: the requested dot-path. */
						__( '"%1$s" is a token, not a group, so "%2$s" cannot be written below it.', 'kadence-blocks' ),
						implode( '.', $walked ),
						$path
					),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
						'path'   => $path,
					]
				);
			}
		}

		return null;
	}

	/**
	 * Find the node at a dot-path within a document, or null when the path is absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The document to walk.
	 * @param string               $path     The dot-path to look up.
	 *
	 * @return array<string, mixed>|null
	 */
	private function node_at( array $document, string $path ): ?array {
		$node = $document;

		foreach ( explode( '.', $path ) as $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				return null;
			}

			$node = $node[ $segment ];
		}

		return is_array( $node ) ? $node : null;
	}

	/**
	 * Whether a node in the effective document is a token leaf rather than a group of child tokens.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The decoded node.
	 *
	 * @return bool
	 */
	private function is_leaf_node( array $node ): bool {
		return array_key_exists( Sentinels::get_value_key(), $node )
			|| array_key_exists( Sentinels::get_disabled_key(), $node )
			|| array_key_exists( Token_Type::get_type_key(), $node );
	}

	/**
	 * Read and decode the stored overrides-only document for a set.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed> The decoded document, empty when absent or unreadable.
	 */
	private function read_stored_document( string $slug ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * Read the document body parameter as an array, coercing any non-array to an empty document.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return array<string, mixed>
	 */
	private function read_document_param( WP_REST_Request $request ): array {
		$document = $request->get_param( self::DOCUMENT_PARAM );

		return is_array( $document ) ? $document : [];
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
	 * The arguments accepted by the bulk write routes on a single set: the slug, the DTCG document and an
	 * optional title. The document is validated for its DTCG grammar by Dtcg_Validator, so the arg only
	 * asserts it is an object.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_document_write_params(): array {
		return array_merge(
			$this->get_slug_params(),
			$this->get_document_body_params()
		);
	}

	/**
	 * The arguments accepted by the collection create route: the DTCG document, an optional title and an
	 * optional slug (defaulting to the default set, since the collection route has no slug path segment).
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_collection_write_params(): array {
		return array_merge(
			[
				self::SLUG_PARAM => [
					'description'       => __( 'The token set slug to write. Defaults to the default set.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => false,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
			],
			$this->get_document_body_params()
		);
	}

	/**
	 * The document and title body parameters shared by the bulk write routes.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_document_body_params(): array {
		return [
			self::DOCUMENT_PARAM => [
				'description'          => __( 'The overrides-only DTCG document to store.', 'kadence-blocks' ),
				'type'                 => 'object',
				'required'             => true,
				'additionalProperties' => true,
			],
			self::TITLE_PARAM    => [
				'description'       => __( 'Optional human-readable label for the token set.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => false,
				'sanitize_callback' => 'sanitize_text_field',
			],
		];
	}

	/**
	 * The arguments shared by the single-token routes: the slug and the validated token dot-path. The leaf
	 * itself is read from the raw JSON body, since DTCG's "$"-prefixed keys do not map onto named args.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_token_path_params(): array {
		return array_merge(
			$this->get_slug_params(),
			[
				self::PATH_PARAM => [
					'description'       => __( 'The token dot-path, e.g. primitive.color.brand.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w.-]+$',
					'validate_callback' => [ $this, 'validate_token_path' ],
				],
			]
		);
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
		return [
			'slug'     => $slug,
			'version'  => $this->store->get_version( $slug ),
			'document' => $this->read_stored_document( $slug ),
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
