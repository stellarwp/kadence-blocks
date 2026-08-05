<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Responsive_Feed;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Path;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Reserved_Namespace;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Reference_Policy;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Document_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Utils\Cast;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the Design Tokens document resource.
 *
 * Exposes the full read and write surface for a token library: the raw overrides-only DTCG document
 * (get_items / get_item), the resolved/flattened token map for previews (get_resolved), bulk
 * create / merge / replace / reset of the whole document, and set / delete of a single token by
 * dot-path. WP_REST_Controller houses a resource's read and write routes together.
 *
 * Every write runs the same pipeline: DTCG grammar validation, then a dry-run Resolver pass that
 * rejects alias cycles and dangling aliases (HTTP 422) before anything is committed, then a single
 * Token_Store::save_document() that bumps the version and fires the change action.
 *
 * The module holds any number of named token libraries, each keyed by slug. The default library under
 * Token_Store::default_slug() is the always-present canonical library; writing an arbitrary valid slug
 * creates or updates that library, and reading or resolving an unknown slug returns 404. The default
 * library cannot be deleted — a DELETE against it resets it to baseline, while a DELETE against any
 * other library removes it entirely.
 *
 * @since TBD
 */
final class Documents_Controller extends Controller {

	/**
	 * The request parameter that carries the token library slug.
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
	 * The request parameter that carries an optional human-readable label for the library.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TITLE_PARAM = 'title';

	/**
	 * The slug path segment shared by the single-library routes. Built from SLUG_PARAM so the named capture
	 * and the read parameter never drift apart.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_ROUTE = '(?P<' . self::SLUG_PARAM . '>[\w-]+)';

	/**
	 * The sub-route, relative to a single library, that returns the resolved/flattened token map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const RESOLVED_ROUTE = 'resolved';

	/**
	 * The sub-route, relative to a single library, that collects the single-token endpoints.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKENS_ROUTE = 'tokens';

	/**
	 * The dot-path path segment for the single-token routes. The character class matches the alias
	 * grammar (a dot-path) minus the braces, so a token is addressable as a sub-resource of its library.
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
	 * Flattens a stored token library into the ready-to-emit maps, and dry-runs candidate overrides.
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
	 * @var Mutator
	 */
	private Mutator $mutator;

	/**
	 * Builds the baseline-merged effective document, used to infer a token's $type on a single-token write.
	 *
	 * @since TBD
	 *
	 * @var Effective_Document
	 */
	private Effective_Document $effective;

	/**
	 * Inspects documents for the presence of user-created primitives.
	 *
	 * @since TBD
	 *
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $user_primitive_index;

	/**
	 * Enforces the user-primitive document invariant on every write.
	 *
	 * @since TBD
	 *
	 * @var User_Primitive_Document_Validator
	 */
	private User_Primitive_Document_Validator $user_primitive_validator;

	/**
	 * Scans a candidate document for alias references to a user primitive.
	 *
	 * @since TBD
	 *
	 * @var Token_Reference_Policy
	 */
	private Token_Reference_Policy $reference_policy;

	/**
	 * Extracts the authored responsive / clamp shape per token, so a read of the resolved map can carry the
	 * per-breakpoint steps the flat by_id map flattens away.
	 *
	 * @since TBD
	 *
	 * @var Responsive_Feed
	 */
	private Responsive_Feed $responsive_feed;

	/**
	 * Memoized item schema for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $item_schema = null;

	/**
	 * Memoized resolved-map schema for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $resolved_schema = null;

	/**
	 * @since TBD
	 *
	 * @param Token_Store                       $store                 The sole gateway to the kb_design_tokens table.
	 * @param Token_Resolver                    $resolver              Flattens a stored token library and dry-runs candidate overrides.
	 * @param Dtcg_Validator                    $validator             Validates the DTCG grammar of a candidate document.
	 * @param Mutator                           $mutator               Assembles the candidate overrides document.
	 * @param Effective_Document                $effective             Builds the effective document for $type inference.
	 * @param User_Primitive_Index              $user_primitive_index  Inspects documents for user-created primitives.
	 * @param User_Primitive_Document_Validator $user_primitive_validator Enforces the user-primitive document invariant.
	 * @param Token_Reference_Policy            $reference_policy      Scans for alias references to a user primitive.
	 * @param Responsive_Feed                   $responsive_feed       Extracts the authored responsive / clamp shape per token.
	 */
	public function __construct(
		Token_Store $store,
		Token_Resolver $resolver,
		Dtcg_Validator $validator,
		Mutator $mutator,
		Effective_Document $effective,
		User_Primitive_Index $user_primitive_index,
		User_Primitive_Document_Validator $user_primitive_validator,
		Token_Reference_Policy $reference_policy,
		Responsive_Feed $responsive_feed
	) {
		$this->store                    = $store;
		$this->resolver                 = $resolver;
		$this->validator                = $validator;
		$this->mutator                  = $mutator;
		$this->effective                = $effective;
		$this->user_primitive_index     = $user_primitive_index;
		$this->user_primitive_validator = $user_primitive_validator;
		$this->reference_policy         = $reference_policy;
		$this->responsive_feed          = $responsive_feed;
		$this->rest_base                = 'documents';
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
					// POST = create-or-merge the library (partial update, per WP convention).
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
	 * Read the collection of token-library documents.
	 *
	 * Lists every stored library. The default library is always included even before it has a row, since
	 * it renders from baseline and must always be addressable; a stored default is not duplicated. The
	 * titles come from this one list_stores() call rather than a per-item lookup, so surfacing title
	 * alongside slug/version costs no additional query over the whole collection.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		// Keyed by slug so title is a single, already-fetched lookup per item below — not a fresh
		// query per library.
		$titles_by_slug = array_column( $this->store->list_stores(), 'title', 'slug' );
		$slugs          = array_keys( $titles_by_slug );

		// The default library is always addressable, even with no row yet (it renders from baseline), so
		// surface it whether or not the store has persisted it.
		if ( ! in_array( Token_Store::default_slug(), $slugs, true ) ) {
			array_unshift( $slugs, Token_Store::default_slug() );
		}

		$items = array_map(
			fn( string $slug ): array => $this->prepare_item( $slug, $titles_by_slug[ $slug ] ?? '' ),
			$slugs
		);

		return new WP_REST_Response( array_values( $items ), WP_Http::OK );
	}

	/**
	 * Read a single token-library document by slug.
	 *
	 * The default library is always known; any other slug must have a stored row, otherwise it is a 404.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( ! $this->is_known_library( $slug ) ) {
			return $this->not_found( $slug );
		}

		return new WP_REST_Response( $this->prepare_item( $slug ), WP_Http::OK );
	}

	/**
	 * Read the resolved/flattened token map for a library, for previews.
	 *
	 * An unknown slug is a 404, mirroring get_item(). The resolver follows aliases and renders each leaf
	 * to its CSS value; a stored library carrying an alias cycle or a dangling alias cannot be flattened,
	 * so it is surfaced as HTTP 422 rather than a fatal.
	 *
	 * Alongside the flat by_id / by_var maps, the response carries the authored responsive / clamp shape per
	 * token (empty for a library with no responsive tokens). The flat maps lose the per-breakpoint steps, so a
	 * client that re-reads this endpoint after a write — the Style Library token editor does, to keep its
	 * per-breakpoint inputs fresh — would otherwise fall back to a stale bootstrap of the responsive shape.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_resolved( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( ! $this->is_known_library( $slug ) ) {
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

		$responsive = $this->responsive_feed->from_document( $this->resolver->effective_document( $slug ) );

		return new WP_REST_Response(
			[
				'slug'       => $slug,
				'version'    => $this->store->get_version( $slug ),
				'by_id'      => $resolved->by_id(),
				'by_var'     => $resolved->by_var(),
				// An empty PHP array JSON-encodes as [] rather than {}; cast the empty case to an object so
				// the responsive map keeps a stable object wire type whether or not a token carries the shape.
				'responsive' => empty( $responsive ) ? (object) [] : $responsive,
			],
			WP_Http::OK
		);
	}

	/**
	 * Create-or-merge a library from the collection route (POST /documents).
	 *
	 * Per the WordPress partial-update convention, the provided document is deep-merged into whatever is
	 * stored; merging into an empty (or not-yet-existing) library simply creates it. The slug defaults to
	 * the default library when omitted, since the collection route carries no slug path segment.
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
	 * Deep-merge a partial document into the stored library (POST or PATCH /documents/{slug}).
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function patch_item( $request ) {
		$slug    = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );
		$partial = $this->read_document_param( $request );

		$error = $this->guard_reserved_in_partial( $partial, $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$candidate = $this->mutator->merge( $this->read_stored_document( $slug ), $partial );

		return $this->validate_and_save( $candidate, $slug, Cast::to_string( $request->get_param( self::TITLE_PARAM ) ) );
	}

	/**
	 * Replace the whole overrides document for the library (PUT /documents/{slug}).
	 *
	 * Unlike POST/PATCH, this drops any stored path absent from the body. Rejected with HTTP 409 while the
	 * stored document has any user-created primitive, since a full replace has no way to express
	 * "preserve these" — delete them first or use PATCH instead.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_item( $request ) {
		$slug   = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );
		$stored = $this->read_stored_document( $slug );

		if ( ! empty( $this->user_primitive_index->all( $stored ) ) ) {
			return new WP_Error(
				'rest_design_tokens_put_not_allowed',
				__( 'Bulk replace is not allowed while user-created primitives exist. Delete them first or use PATCH.', 'kadence-blocks' ),
				[
					'status' => WP_Http::CONFLICT,
					'slug'   => $slug,
				]
			);
		}

		return $this->validate_and_save(
			$this->read_document_param( $request ),
			$slug,
			Cast::to_string( $request->get_param( self::TITLE_PARAM ) )
		);
	}

	/**
	 * Delete a token library (DELETE /documents/{slug}).
	 *
	 * Delegates to Token_Store::delete(), which owns the rule that the default library is never removed
	 * (deleting it clears its overrides to baseline) while any other library is dropped outright. An
	 * unknown non-default library is a 404. The prior state is captured before the delete and returned as
	 * the deleted resource, following the WordPress delete-response shape.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_item( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );

		if ( ! $this->is_known_library( $slug ) ) {
			return $this->not_found( $slug );
		}

		$previous = $this->prepare_item( $slug );

		try {
			$this->store->delete( $slug );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_delete_failed',
				__( 'The design token library could not be deleted.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'slug'   => $slug,
				]
			);
		}

		return new WP_REST_Response(
			[
				'deleted'  => true,
				'previous' => $previous,
			],
			WP_Http::OK
		);
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

		// The leaf is the whole JSON body. Decode the raw body directly rather than via
		// get_json_params(), which is populated only once WordPress parses the request during dispatch.
		$leaf = json_decode( (string) $request->get_body(), true );

		if ( ! is_array( $leaf ) ) {
			$leaf = [];
		}

		$stored = $this->read_stored_document( $slug );

		// Build the inspection view with disabled tokens kept (apply_disabled = false): authoring over a
		// token that an override currently disables must still read its baseline $type and group shape,
		// which the rendering view would have stripped away.
		$effective = $this->effective->build( $stored, false );

		// Refuse to write a single token over a token group or to nest one under another token. Both would
		// silently restructure the document and orphan every token under the addressed path; the
		// single-token endpoint only ever writes a leaf. Bulk PUT/PATCH is the place to restructure.
		$error = $this->guard_leaf_target( $effective, $path, $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$is_sentinel = Sentinels::is_reset( $leaf ) || Sentinels::has_disabled( $leaf );

		if ( ! $is_sentinel && ! array_key_exists( Token_Type::get_type_key(), $leaf ) ) {
			$existing  = Document_Path::node_at( $effective, $path );
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
	 * Dropping the override reverts that token to its baseline value. Idempotent for any non-reserved path:
	 * when nothing is stored there, the library is returned unchanged without a write. A path inside
	 * primitive.*.custom.* is not idempotent — it is always rejected with HTTP 403, whether or not anything
	 * is stored there, since deleting a custom primitive must go through the user-primitives endpoint. The
	 * resulting document runs the same write pipeline as every other write, so a delete that would leave
	 * another override aliasing the removed token is rejected (HTTP 422) before commit rather than
	 * persisting a dangling alias.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_token( $request ) {
		$slug = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );
		$path = Cast::to_string( $request->get_param( self::PATH_PARAM ) );

		if ( Reserved_Namespace::contains_reserved_path( $path ) ) {
			return new WP_Error(
				'rest_design_tokens_reserved_path',
				__( 'Use the user-primitives endpoint to delete a custom primitive.', 'kadence-blocks' ),
				[
					'status' => WP_Http::FORBIDDEN,
					'path'   => $path,
				]
			);
		}

		$stored    = $this->read_stored_document( $slug );
		$candidate = $this->mutator->remove( $stored, $path );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $slug ), WP_Http::OK );
		}

		return $this->validate_and_save( $candidate, $slug, '' );
	}

	/**
	 * Validate that the token dot-path begins with a real token layer and names a token below it.
	 *
	 * Used as the path argument's validate_callback so a path into "$extensions" (any non-layer root), a
	 * bare layer with no token, or one with an empty segment (the pattern allows runs of dots, e.g.
	 * "primitive..brand" or a trailing dot) is rejected as a 400 before a handler runs.
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

		// An empty segment ("primitive..brand", "primitive.color.") would create a node keyed by "" and a
		// malformed dot-path/CSS var, so reject it alongside a too-short path or a non-layer first segment.
		$has_empty_segment = in_array( '', $segments, true );

		if ( count( $segments ) < 2 || $has_empty_segment || ! in_array( $segments[0], Layers::token_layers(), true ) ) {
			return new WP_Error(
				'rest_invalid_param',
				sprintf(
					/* translators: %s: comma-separated list of valid token layers. */
					__( 'The token path must begin with a valid layer (%s) and name a token below it, with no empty segments.', 'kadence-blocks' ),
					implode( ', ', Layers::token_layers() )
				),
				[ 'status' => WP_Http::BAD_REQUEST ]
			);
		}

		return true;
	}

	/**
	 * The JSON Schema for a token-library document item.
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
					'description' => __( 'The token library slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'title'    => [
					'description' => __( 'The human-readable label for the library, empty when none is stored.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version'  => [
					'description' => __( 'The cache-busting version hash for the library, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'document' => [
					'description'          => __( 'The raw overrides-only DTCG document, empty when the library renders entirely from baseline.', 'kadence-blocks' ),
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
				'slug'       => [
					'description' => __( 'The token library slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version'    => [
					'description' => __( 'The cache-busting version hash for the library, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'by_id'      => array_merge(
					[ 'description' => __( 'Resolved CSS values keyed by token dot-path id.', 'kadence-blocks' ) ],
					$css_value_map
				),
				'by_var'     => array_merge(
					[ 'description' => __( 'Resolved CSS values keyed by CSS custom-property name.', 'kadence-blocks' ) ],
					$css_value_map
				),
				'responsive' => [
					'description'          => __( 'Authored responsive / clamp shape keyed by token dot-path id; present only for tokens that carry a shape.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'readonly'             => true,
					'additionalProperties' => [ 'type' => 'object' ],
				],
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
	 * Validates the DTCG grammar (HTTP 422 on failure), dry-runs the Resolver to reject alias cycles /
	 * dangling aliases before commit (HTTP 422), and finally persists. Writing a slug with no row yet
	 * creates that library. An empty candidate clears the overrides (the library renders from baseline)
	 * and needs no validation or dry-run, since an empty document cannot carry an alias cycle.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The full candidate overrides document to validate and store.
	 * @param string               $slug      The token library slug.
	 * @param string               $title     Optional label; left untouched on update when empty.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function validate_and_save( array $candidate, string $slug, string $title ) {
		$expected_version = $this->store->get_version( $slug );

		// A brand-new library has no version yet; report 201 Created rather than 200 OK on first write.
		$status = $expected_version !== '' ? WP_Http::OK : WP_Http::CREATED;

		if ( $candidate === [] ) {
			return $this->persist( '', $slug, $title, $status, $expected_version );
		}

		$invariant_errors = $this->user_primitive_validator->validate( $candidate );

		if ( ! empty( $invariant_errors ) ) {
			return new WP_Error(
				'rest_design_tokens_user_primitive_invalid',
				__( 'The user primitive document invariant failed.', 'kadence-blocks' ),
				[
					'status' => WP_Http::UNPROCESSABLE_ENTITY,
					'slug'   => $slug,
					'errors' => array_map(
						static fn( $error ): array => [
							'id'      => $error->get_id(),
							'message' => $error->get_message(),
						],
						$invariant_errors
					),
				]
			);
		}

		foreach ( array_keys( $this->user_primitive_index->all( $candidate ) ) as $user_primitive_id ) {
			$references = $this->reference_policy->find( $candidate, (string) $user_primitive_id );

			if ( ! $this->reference_policy->all_semantic_overrides( $references ) ) {
				return new WP_Error(
					'rest_design_tokens_user_primitive_reference_unsupported',
					__( 'The document contains an unsupported reference to a user primitive.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
					]
				);
			}
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

		$encoded = wp_json_encode( $candidate );

		// Guard the encode: a false return cast to "" would clear the whole library on persist instead of storing it.
		if ( $encoded === false ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token document could not be encoded.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'slug'   => $slug,
				]
			);
		}

		return $this->persist( $encoded, $slug, $title, $status, $expected_version );
	}

	/**
	 * Commit a raw document string to the store and build the response, mapping a write failure to 500 and a
	 * version mismatch to 409.
	 *
	 * @since TBD
	 *
	 * @param string $document         The raw overrides-only DTCG JSON (empty string clears the library).
	 * @param string $slug             The token library slug.
	 * @param string $title            Optional label; left untouched on update when empty.
	 * @param int    $status           The success status code.
	 * @param string $expected_version The version read at the start of this write; empty only for a first write.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function persist( string $document, string $slug, string $title, int $status, string $expected_version ) {
		try {
			$saved = $this->store->save_document_conditional( $document, $expected_version, $slug, $title );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token library could not be saved.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'slug'   => $slug,
				]
			);
		}

		if ( ! $saved ) {
			return new WP_Error(
				'rest_design_tokens_conflict',
				__( 'The token library was modified since you last read it. Reload and try again.', 'kadence-blocks' ),
				[
					'status' => WP_Http::CONFLICT,
					'slug'   => $slug,
				]
			);
		}

		return new WP_REST_Response( $this->prepare_item( $slug ), $status );
	}

	/**
	 * Whether a slug names a readable token library.
	 *
	 * The default library is always known — it renders from baseline even before it has a row — and any
	 * other slug is known once it has a stored row.
	 *
	 * @since TBD
	 *
	 * @param string $slug The requested slug.
	 *
	 * @return bool
	 */
	private function is_known_library( string $slug ): bool {
		return $slug === Token_Store::default_slug() || $this->store->exists( $slug );
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
	 * @param string               $slug      The token library slug.
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
	 * Read and decode the stored overrides-only document for a library.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
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
	 * The arguments shared by the single-library routes: the slug path parameter.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_slug_params(): array {
		return [
			self::SLUG_PARAM => [
				'description'       => __( 'The token library slug.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
		];
	}

	/**
	 * The arguments accepted by the bulk write routes on a single library: the slug, the DTCG document and an
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
	 * optional slug (defaulting to the default library, since the collection route has no slug path segment).
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_collection_write_params(): array {
		return array_merge(
			[
				self::SLUG_PARAM => [
					'description'       => __( 'The token library slug to write. Defaults to the default library.', 'kadence-blocks' ),
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
				'description'       => __( 'Optional human-readable label for the token library.', 'kadence-blocks' ),
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
	 * Build the response payload for a single token-library document.
	 *
	 * Reads the raw overrides-only DTCG document for the library. An absent or empty row yields an empty
	 * document, since the library then renders entirely from baseline. Empty is likewise the title of a
	 * library that has none stored (e.g. the default library before it is ever renamed) — never the slug
	 * or any other synthesized value, so the client can tell "no title" from "a title happens to look
	 * like the slug".
	 *
	 * @since TBD
	 *
	 * @param string      $slug  The token library slug.
	 * @param string|null $title The library's title when the caller already has it (the collection route
	 *                           reads every title in one list_stores() call and passes it through here so
	 *                           this method does not re-query per item); null to look it up here for a
	 *                           single-library call.
	 *
	 * @return array<string, mixed>
	 */
	private function prepare_item( string $slug, ?string $title = null ): array {
		return [
			'slug'     => $slug,
			'title'    => $title ?? $this->store->get_title( $slug ),
			'version'  => $this->store->get_version( $slug ),
			'document' => $this->read_stored_document( $slug ),
		];
	}

	/**
	 * Reject a partial document that writes into reserved namespaces.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $partial The incoming partial (not the merged candidate).
	 * @param string               $slug
	 *
	 * @return WP_Error|null
	 */
	private function guard_reserved_in_partial( array $partial, string $slug ): ?WP_Error {
		$primitive = $partial['primitive'] ?? null;
		/** @var array<string, mixed> $primitive_node */
		$primitive_node = is_array( $primitive ) ? $primitive : [];
		$paths          = Reserved_Namespace::find_in( $primitive_node, 'primitive' );

		if ( empty( $paths ) && ! $this->has_reserved_extension( $partial ) && ! $this->has_unsupported_reserved_alias( $partial ) ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_reserved_path',
			__( 'The primitive.*.custom.* namespace is reserved for user-created primitives. Use the user-primitives endpoint.', 'kadence-blocks' ),
			[
				'status' => WP_Http::FORBIDDEN,
				'slug'   => $slug,
				'paths'  => $paths,
			]
		);
	}

	/**
	 * Whether the partial contains an alias pointing into the reserved custom-primitive namespace from
	 * anywhere other than a direct semantic-layer override.
	 *
	 * Reuses Token_Reference_Policy::find(), the same classifier the delete-reference-preview endpoint
	 * uses, rather than re-implementing alias-location parsing here. Uses `all_semantic_overrides()`
	 * rather than `all_supported()`: a primitive-layer direct alias is rewritable by the rename cascade,
	 * but this guard is about a brand-new write introducing the reference, which only the semantic
	 * layer may legitimately do.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $partial The incoming partial (not the merged candidate).
	 *
	 * @return bool
	 */
	private function has_unsupported_reserved_alias( array $partial ): bool {
		$encoded = wp_json_encode( $partial );

		if ( ! is_string( $encoded ) ) {
			return false;
		}

		if ( ! preg_match_all( '/\{([a-z0-9.-]+)\}/', $encoded, $matches ) ) {
			return false;
		}

		foreach ( array_unique( $matches[1] ) as $referenced_id ) {
			if ( ! Reserved_Namespace::is_reserved_id( $referenced_id ) ) {
				continue;
			}

			if ( ! $this->reference_policy->all_semantic_overrides( $this->reference_policy->find( $partial, $referenced_id ) ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether the partial writes into the userPrimitives extension section.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $partial
	 *
	 * @return bool
	 */
	private function has_reserved_extension( array $partial ): bool {
		$ext_data = $partial[ Extensions::get_extensions_key() ] ?? null;

		if ( ! is_array( $ext_data ) ) {
			return false;
		}

		$ns_data = $ext_data[ Extensions::get_namespace() ] ?? null;

		if ( ! is_array( $ns_data ) ) {
			return false;
		}

		return array_key_exists( Extensions::get_section_user_primitives(), $ns_data );
	}

	/**
	 * The error returned when a slug does not name a known token library.
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
			__( 'Sorry, that design token library does not exist.', 'kadence-blocks' ),
			[
				'status' => WP_Http::NOT_FOUND,
				'slug'   => $slug,
			]
		);
	}
}
