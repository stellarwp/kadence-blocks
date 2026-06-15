<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the Design Tokens variants resource.
 *
 * Exposes the raw read and write surface for a block's variant set: the named variants and the `$default`
 * that live in the DTCG document under `$extensions.com.kadence.designTokens.variants.<block>`. Reads are
 * served from the baseline deep-merged with the stored overrides (via {@see Effective_Variants}), so a
 * variant authored through a write is visible on the next read. Resolved (CSS) variant values are out of
 * scope here — they are produced by the variant projectors, which own the resolver's override-merging.
 *
 * A block is addressable only when it has a registered variant set ({@see Token_Registry::for_block()}); a
 * block with no set has no bindings, so a variant authored for it could never project. Reads and writes for
 * such a block are a 404.
 *
 * Writes assemble a partial overrides document carrying only the addressed variants node and deep-merge it
 * onto the stored set, then run the shared pipeline: DTCG grammar validation (HTTP 422), a dry-run Resolver
 * pass that rejects alias cycles / dangling aliases in the token layers (HTTP 422), then a single
 * Token_Store::save_document() that bumps the version and fires the change action. The block name carries a
 * slash ("kadence/advancedbtn"), so it is routed as two path segments and reassembled.
 *
 * v1 ships a single token set under Token_Store::default_slug(); every route operates on it.
 *
 * @since TBD
 */
final class Variants_Controller extends Controller {

	/**
	 * The request parameter that carries the block's vendor segment, e.g. "kadence".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VENDOR_PARAM = 'vendor';

	/**
	 * The request parameter that carries the block's name segment, e.g. "advancedbtn".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_NAME_PARAM = 'block_name';

	/**
	 * The request parameter that carries a single variant slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VARIANT_PARAM = 'variant';

	/**
	 * The request parameter that carries a variant's human-readable label on a create.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LABEL_PARAM = 'label';

	/**
	 * The request parameter that carries a variant's property => alias-or-literal token map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKENS_PARAM = 'tokens';

	/**
	 * The request parameter that carries the whole variant map on a replace (PUT).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VARIANTS_PARAM = 'variants';

	/**
	 * The request parameter that carries the default variant slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_PARAM = 'default';

	/**
	 * The block vendor path segment. A slug-safe class with no slash; the block name is the second segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VENDOR_ROUTE = '(?P<' . self::VENDOR_PARAM . '>[a-z][a-z0-9-]*)';

	/**
	 * The block name path segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_NAME_ROUTE = '(?P<' . self::BLOCK_NAME_PARAM . '>[a-z0-9][a-z0-9-]*)';

	/**
	 * The full block path: vendor + "/" + name, reassembled into "vendor/name" in each handler. A block
	 * name carries a slash, so it is captured as two slug-free segments rather than one encoded segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_ROUTE = self::VENDOR_ROUTE . '/' . self::BLOCK_NAME_ROUTE;

	/**
	 * The single-variant path segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VARIANT_ROUTE = '(?P<' . self::VARIANT_PARAM . '>[\w-]+)';

	/**
	 * The literal sub-route, relative to a block, that reads / sets the block's `$default`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_ROUTE = 'default';

	/**
	 * The sole gateway to the kb_design_tokens table.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Pure merge transform used to assemble the candidate overrides document.
	 *
	 * @since TBD
	 *
	 * @var Mutator
	 */
	private Mutator $mutator;

	/**
	 * Dry-runs a candidate's token layers to reject alias cycles / dangling aliases before commit.
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
	 * Reads the effective (baseline-merged) variants section, so reads reflect writes.
	 *
	 * @since TBD
	 *
	 * @var Effective_Variants
	 */
	private Effective_Variants $variants;

	/**
	 * Declares which blocks accept variants. A block with no registered set is a 404.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

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
	 * @param Token_Store        $store     The sole gateway to the kb_design_tokens table.
	 * @param Mutator            $mutator   Assembles the candidate overrides document.
	 * @param Token_Resolver     $resolver  Dry-runs a candidate's token layers before commit.
	 * @param Dtcg_Validator     $validator Validates the DTCG grammar of a candidate document.
	 * @param Effective_Variants $variants  Reads the baseline-merged variants section.
	 * @param Token_Registry     $registry  Declares which blocks accept variants.
	 */
	public function __construct(
		Token_Store $store,
		Mutator $mutator,
		Token_Resolver $resolver,
		Dtcg_Validator $validator,
		Effective_Variants $variants,
		Token_Registry $registry
	) {
		$this->store     = $store;
		$this->mutator   = $mutator;
		$this->resolver  = $resolver;
		$this->validator = $validator;
		$this->variants  = $variants;
		$this->registry  = $registry;
		$this->rest_base = 'variants';
	}

	/**
	 * Register the read and write routes for the variants resource.
	 *
	 * Verb semantics follow the WordPress REST convention: POST creates or merges a single variant, PUT
	 * replaces the block's whole variant set, DELETE on a block resets it to baseline, and DELETE on a
	 * variant removes that one variant. The `$default` is read and set through a dedicated sub-route.
	 *
	 * The `default` sub-route is registered before the single-variant route so the literal segment is not
	 * captured as a variant slug.
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
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_block_params(),
				],
				[
					// POST = create-or-merge a single variant, leaving siblings and $default intact.
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_create_params(),
				],
				[
					// PUT replaces the block's whole variant set, dropping any variant absent from the body.
					'methods'             => 'PUT',
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_replace_params(),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_block_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE . '/' . self::DEFAULT_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_default' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_block_params(),
				],
				[
					'methods'             => 'PUT',
					'callback'            => [ $this, 'set_default' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_default_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE . '/' . self::VARIANT_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_variant' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_variant_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * List the blocks that accept variants, each with its default and named variant slugs.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$slug    = Token_Store::default_slug();
		$section = $this->variants->section( $slug );
		$blocks  = [];

		foreach ( $this->registry->variant_blocks() as $block ) {
			$node = isset( $section[ $block ] ) && is_array( $section[ $block ] ) ? $section[ $block ] : [];

			$blocks[] = [
				'block'   => $block,
				'default' => $this->default_of( $node ),
				'names'   => $this->variant_names( $node ),
			];
		}

		return new WP_REST_Response( [ 'blocks' => $blocks ], WP_Http::OK );
	}

	/**
	 * Read a single block's effective variant set.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return new WP_REST_Response( $this->prepare_item( $block ), WP_Http::OK );
	}

	/**
	 * Create or merge a single variant (POST /variants/{block}).
	 *
	 * The body carries the variant slug, an optional label and its property => value token map. The variant
	 * is deep-merged into the stored set, so sibling variants and the `$default` are left intact.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function create_item( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$variant = Cast::to_string( $request->get_param( self::VARIANT_PARAM ) );

		if ( $variant === '' ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'A variant slug is required.', 'kadence-blocks' ),
				[
					'status' => WP_Http::BAD_REQUEST,
					'block'  => $block,
				]
			);
		}

		$block_node = [ $variant => $this->variant_definition( $request ) ];

		$error = $this->guard_variant_shape( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$candidate = $this->mutator->merge( $this->stored_document(), $this->partial( $block, $block_node ) );

		return $this->validate_and_save( $candidate, $block );
	}

	/**
	 * Replace a block's whole variant set (PUT /variants/{block}).
	 *
	 * The stored variants for the block are dropped first, then the body's variant map (and optional
	 * default) is written, so a variant absent from the body no longer applies.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_item( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$variants   = $request->get_param( self::VARIANTS_PARAM );
		$block_node = is_array( $variants ) ? $variants : [];

		$default = Cast::to_string( $request->get_param( self::DEFAULT_PARAM ) );

		if ( $default !== '' ) {
			$block_node[ Extensions::get_default_key() ] = $default;
		}

		$error = $this->guard_variant_shape( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		// Replace, not merge: drop the stored block node first so a variant the body omits does not survive.
		$stored    = $this->unset_block( $this->stored_document(), $block );
		$candidate = $this->mutator->merge( $stored, $this->partial( $block, $block_node ) );

		$error = $this->guard_default_present( $candidate, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block );
	}

	/**
	 * Reset a block's variant set to baseline (DELETE /variants/{block}).
	 *
	 * Removes the whole stored `variants.<block>` node, so the block renders its baseline variants. A no-op
	 * when nothing is stored for the block.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_item( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$stored    = $this->stored_document();
		$candidate = $this->unset_block( $stored, $block );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $block ), WP_Http::OK );
		}

		return $this->validate_and_save( $candidate, $block );
	}

	/**
	 * Remove a single variant from a block (DELETE /variants/{block}/{variant}).
	 *
	 * Drops the stored override for that variant; a variant that also exists in the baseline reverts to its
	 * baseline definition. Idempotent: a no-op when nothing is stored for the variant. The `$default` is
	 * managed through the dedicated sub-route, so deleting "default" here is rejected; and removing a
	 * variant the effective set still defaults to is rejected (HTTP 422) before commit.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_variant( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$variant = Cast::to_string( $request->get_param( self::VARIANT_PARAM ) );

		if ( $variant === self::DEFAULT_ROUTE ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'The default variant is managed through the default sub-route.', 'kadence-blocks' ),
				[
					'status' => WP_Http::BAD_REQUEST,
					'block'  => $block,
				]
			);
		}

		$stored    = $this->stored_document();
		$candidate = $this->unset_variant( $stored, $block, $variant );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $block ), WP_Http::OK );
		}

		$error = $this->guard_default_present( $candidate, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block );
	}

	/**
	 * Read a block's default variant slug (GET /variants/{block}/default).
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_default( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$node = $this->variants->block( $block, Token_Store::default_slug() ) ?? [];

		return new WP_REST_Response(
			[
				'block'   => $block,
				'default' => $this->default_of( $node ),
			],
			WP_Http::OK
		);
	}

	/**
	 * Set a block's default variant slug (PUT /variants/{block}/default).
	 *
	 * The default must name a variant the effective set defines, otherwise the write is rejected (HTTP 422)
	 * before commit.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function set_default( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$default = Cast::to_string( $request->get_param( self::DEFAULT_PARAM ) );

		$candidate = $this->mutator->merge(
			$this->stored_document(),
			$this->partial( $block, [ Extensions::get_default_key() => $default ] )
		);

		$error = $this->guard_default_present( $candidate, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block );
	}

	/**
	 * The JSON Schema for a block's variant set.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_item_schema(): array {
		if ( $this->item_schema !== null ) {
			return $this->add_additional_fields_schema( $this->item_schema );
		}

		$variant_schema = [
			'type'       => 'object',
			'properties' => [
				Extensions::get_label_key()  => [
					'description' => __( 'The variant\'s human-readable label.', 'kadence-blocks' ),
					'type'        => 'string',
				],
				Extensions::get_tokens_key() => [
					'description'          => __( 'The variant\'s property => alias-or-literal token map.', 'kadence-blocks' ),
					'type'                 => 'object',
					'additionalProperties' => [ 'type' => [ 'string', 'number' ] ],
				],
			],
		];

		$this->item_schema = [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => 'design-token-variant-set',
			'type'       => 'object',
			'properties' => [
				'block'    => [
					'description' => __( 'The block name the variant set belongs to.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
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
				'default'  => [
					'description' => __( 'The default variant slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
				],
				'variants' => [
					'description'          => __( 'The named variants, keyed by slug.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'additionalProperties' => $variant_schema,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
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
	 * dangling aliases in the token layers before commit (HTTP 422), then persists. An empty candidate
	 * clears the overrides, so the set renders from baseline, and needs no validation.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The full candidate overrides document to validate and store.
	 * @param string               $block     The block being written, for error context.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function validate_and_save( array $candidate, string $block ) {
		$slug = Token_Store::default_slug();

		// A brand-new set has no version yet; report 201 Created rather than 200 OK on first write.
		$status = $this->store->get_version( $slug ) !== '' ? WP_Http::OK : WP_Http::CREATED;

		if ( $candidate === [] ) {
			return $this->persist( '', $block, $status );
		}

		$result = $this->validator->validate( $candidate, Dtcg_Validator::get_context_overrides() );

		if ( ! $result->is_valid() ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'The design token document failed validation.', 'kadence-blocks' ),
				[
					'status' => WP_Http::UNPROCESSABLE_ENTITY,
					'block'  => $block,
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
					'block'  => $block,
				]
			);
		}

		$encoded = wp_json_encode( $candidate );

		// Guard the encode: a false return cast to "" would clear the whole set on persist instead of storing it.
		if ( $encoded === false ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token set could not be encoded.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'block'  => $block,
				]
			);
		}

		return $this->persist( $encoded, $block, $status );
	}

	/**
	 * Commit a raw document string to the store and build the response, mapping a write failure to 500.
	 *
	 * @since TBD
	 *
	 * @param string $document The raw overrides-only DTCG JSON (empty string clears the set).
	 * @param string $block    The block being written.
	 * @param int    $status   The success status code.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function persist( string $document, string $block, int $status ) {
		try {
			$this->store->save_document( $document, Token_Store::default_slug() );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token set could not be saved.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'block'  => $block,
				]
			);
		}

		return new WP_REST_Response( $this->prepare_item( $block ), $status );
	}

	/**
	 * Reject a request for a block that has no registered variant set.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return WP_Error|null A WP_Error when the block accepts no variants, null otherwise.
	 */
	private function guard_block( string $block ): ?WP_Error {
		if ( $this->registry->for_block( $block ) !== null ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_not_found',
			__( 'Sorry, that block does not accept variants.', 'kadence-blocks' ),
			[
				'status' => WP_Http::NOT_FOUND,
				'block'  => $block,
			]
		);
	}

	/**
	 * Reject a variant map whose entries are not well-formed: each named variant must have a non-empty
	 * slug and be an object, its label (when present) a string and its tokens (when present) an object. The
	 * alias-or-literal grammar of the token values is left to the DTCG validator.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $block_node The block's variant node being written.
	 * @param string               $block      The block name, for error context.
	 *
	 * @return WP_Error|null A WP_Error when a variant entry is malformed, null otherwise.
	 */
	private function guard_variant_shape( array $block_node, string $block ): ?WP_Error {
		foreach ( $block_node as $slug => $variant ) {
			// $default and any other "$"-prefixed metadata key is not a named variant.
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			// An empty slug would create a variant keyed by "" — a malformed node, the variant analogue of
			// the empty dot-path segment the documents controller rejects. Refuse it before it is stored.
			if ( (string) $slug === '' ) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'A variant slug cannot be empty.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'block'  => $block,
					]
				);
			}

			$label_key  = Extensions::get_label_key();
			$tokens_key = Extensions::get_tokens_key();

			if (
				! is_array( $variant )
				|| ( isset( $variant[ $label_key ] ) && ! is_string( $variant[ $label_key ] ) )
				|| ( isset( $variant[ $tokens_key ] ) && ! is_array( $variant[ $tokens_key ] ) )
			) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'Each variant must be an object with an optional string label and a token map.', 'kadence-blocks' ),
					[
						'status'  => WP_Http::UNPROCESSABLE_ENTITY,
						'block'   => $block,
						'variant' => (string) $slug,
					]
				);
			}
		}

		return null;
	}

	/**
	 * Reject a candidate whose effective `$default` does not name a present variant.
	 *
	 * Evaluated against the post-merge effective set (baseline merged with the candidate), so a default that
	 * resolves to a baseline variant is accepted and one left dangling by a removal is rejected.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The candidate overrides document.
	 * @param string               $block     The block name.
	 *
	 * @return WP_Error|null A WP_Error when the default is dangling, null otherwise.
	 */
	private function guard_default_present( array $candidate, string $block ): ?WP_Error {
		$node    = $this->variants->for_overrides( $candidate )[ $block ] ?? [];
		$default = $this->default_of( is_array( $node ) ? $node : [] );

		if ( $default === '' || in_array( $default, $this->variant_names( is_array( $node ) ? $node : [] ), true ) ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_invalid',
			__( 'The default variant must name an existing variant.', 'kadence-blocks' ),
			[
				'status'  => WP_Http::UNPROCESSABLE_ENTITY,
				'block'   => $block,
				'default' => $default,
			]
		);
	}

	/**
	 * Build the response payload for a block's variant set, read from the effective (baseline-merged) set.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return array<string, mixed>
	 */
	private function prepare_item( string $block ): array {
		$slug = Token_Store::default_slug();
		$node = $this->variants->block( $block, $slug ) ?? [];

		return [
			'block'    => $block,
			'slug'     => $slug,
			'version'  => $this->store->get_version( $slug ),
			'default'  => $this->default_of( $node ),
			'variants' => $this->named_variants( $node ),
		];
	}

	/**
	 * Assemble the variant definition for a create from the request: an optional label plus the token map.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return array<string, mixed>
	 */
	private function variant_definition( WP_REST_Request $request ): array {
		$definition = [];

		$label = Cast::to_string( $request->get_param( self::LABEL_PARAM ) );

		if ( $label !== '' ) {
			$definition[ Extensions::get_label_key() ] = $label;
		}

		$tokens = $request->get_param( self::TOKENS_PARAM );

		$definition[ Extensions::get_tokens_key() ] = is_array( $tokens ) ? $tokens : [];

		return $definition;
	}

	/**
	 * Build a partial overrides document carrying only the given variant node for one block.
	 *
	 * @since TBD
	 *
	 * @param string               $block      The block name.
	 * @param array<string, mixed> $block_node The block's variant node.
	 *
	 * @return array<string, mixed>
	 */
	private function partial( string $block, array $block_node ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_variants() => [
						$block => $block_node,
					],
				],
			],
		];
	}

	/**
	 * Remove the stored `variants.<block>` node, pruning any ancestor emptied by the removal.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The stored overrides document.
	 * @param string               $block    The block name.
	 *
	 * @return array<string, mixed>
	 */
	private function unset_block( array $document, string $block ): array {
		return $this->mutator->remove_by_keys( $document, array_merge( $this->variants_path(), [ $block ] ) );
	}

	/**
	 * Remove the stored `variants.<block>.<variant>` node, pruning any ancestor emptied by the removal.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The stored overrides document.
	 * @param string               $block    The block name.
	 * @param string               $variant  The variant slug.
	 *
	 * @return array<string, mixed>
	 */
	private function unset_variant( array $document, string $block, string $variant ): array {
		return $this->mutator->remove_by_keys( $document, array_merge( $this->variants_path(), [ $block, $variant ] ) );
	}

	/**
	 * The literal key path to the variants section.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function variants_path(): array {
		return Extensions::get_variants_path();
	}

	/**
	 * The `$default` slug of a variant node, or an empty string when none is set.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return string
	 */
	private function default_of( array $node ): string {
		return Cast::to_string( $node[ Extensions::get_default_key() ] ?? '' );
	}

	/**
	 * The named variant slugs of a variant node, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return string[]
	 */
	private function variant_names( array $node ): array {
		$names = [];

		foreach ( array_keys( $node ) as $key ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * The named variants of a variant node, keyed by slug, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return array<string, mixed>
	 */
	private function named_variants( array $node ): array {
		$variants = [];

		foreach ( $node as $slug => $variant ) {
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			$variants[ (string) $slug ] = $variant;
		}

		return $variants;
	}

	/**
	 * Decode the stored overrides-only document for the default set.
	 *
	 * Reuses the reader's single decode seam ({@see Effective_Variants::raw()}) so the controller does not
	 * decode the store itself.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed> The decoded document, empty when absent or unreadable.
	 */
	private function stored_document(): array {
		return $this->variants->raw( Token_Store::default_slug() );
	}

	/**
	 * Reassemble the block name from its two captured path segments.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return string
	 */
	private function block_from( WP_REST_Request $request ): string {
		return Cast::to_string( $request->get_param( self::VENDOR_PARAM ) )
			. '/'
			. Cast::to_string( $request->get_param( self::BLOCK_NAME_PARAM ) );
	}

	/**
	 * The block path segment arguments shared by every single-block route.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_block_params(): array {
		return [
			self::VENDOR_PARAM     => [
				'description'       => __( 'The block vendor segment, e.g. kadence.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[a-z][a-z0-9-]*$',
				'sanitize_callback' => 'sanitize_key',
			],
			self::BLOCK_NAME_PARAM => [
				'description'       => __( 'The block name segment, e.g. advancedbtn.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[a-z0-9][a-z0-9-]*$',
				'sanitize_callback' => 'sanitize_key',
			],
		];
	}

	/**
	 * The arguments accepted by the single-variant route: the block segments plus the variant slug.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_variant_params(): array {
		return array_merge(
			$this->get_block_params(),
			[
				self::VARIANT_PARAM => [
					'description'       => __( 'The variant slug.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
			]
		);
	}

	/**
	 * The arguments accepted by the create route: the block segments plus a variant slug, optional label and
	 * its token map.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_create_params(): array {
		return array_merge(
			$this->get_block_params(),
			[
				self::VARIANT_PARAM => [
					'description'       => __( 'The variant slug to create or merge.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
				self::LABEL_PARAM   => [
					'description'       => __( 'Optional human-readable label for the variant.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
				],
				self::TOKENS_PARAM  => [
					'description'          => __( 'The variant\'s property => alias-or-literal token map.', 'kadence-blocks' ),
					'type'                 => 'object',
					'required'             => false,
					'additionalProperties' => true,
				],
			]
		);
	}

	/**
	 * The arguments accepted by the replace route: the block segments plus the whole variant map and an
	 * optional default.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_replace_params(): array {
		return array_merge(
			$this->get_block_params(),
			[
				self::VARIANTS_PARAM => [
					'description'          => __( 'The variants to store, keyed by slug.', 'kadence-blocks' ),
					'type'                 => 'object',
					'required'             => true,
					'additionalProperties' => true,
				],
				self::DEFAULT_PARAM  => [
					'description'       => __( 'Optional default variant slug.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_key',
				],
			]
		);
	}

	/**
	 * The arguments accepted by the set-default route: the block segments plus the default variant slug.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_default_params(): array {
		return array_merge(
			$this->get_block_params(),
			[
				self::DEFAULT_PARAM => [
					'description'       => __( 'The default variant slug.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
			]
		);
	}
}
