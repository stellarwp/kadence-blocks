<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Preset_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Value_Normalizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Utils\Cast;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the Design Tokens presets resource.
 *
 * Exposes the raw read and write surface for a block's preset collection: the named presets and the
 * `$default` that live in the DTCG document under `$extensions.com.kadence.designTokens.presets.<block>`.
 * Reads are served from the baseline deep-merged with the stored overrides (via {@see Effective_Presets}),
 * so a preset authored through a write is visible on the next read. Resolved (CSS) preset values are out
 * of scope here — they are produced by the preset projectors, which own the resolver's override-merging.
 *
 * A block is addressable only when it has registered preset bindings ({@see Token_Registry::for_block()});
 * a block without preset bindings has no bindable surface, so a preset authored for it could never project. Reads and
 * writes for such a block are a 404.
 *
 * Writes assemble a partial overrides document carrying only the addressed presets node and deep-merge it
 * onto the stored presets, then run the shared pipeline: DTCG grammar validation (HTTP 422), a dry-run Resolver
 * pass that rejects alias cycles / dangling aliases in the token layers (HTTP 422), then a single
 * Token_Store::save_document() that bumps the version and fires the change action. The block name carries a
 * slash ("kadence/advancedbtn"), so it is routed as two path segments and reassembled.
 *
 * Every route operates on a single token library: the one named by the optional `library` request parameter
 * when it is a known library, otherwise the active library ({@see Active_Token_Library_Store::get()}, which
 * resolves to {@see Token_Store::default_slug()} when none is selected). So a read or write lands in
 * whichever library the editor has the block on, and the default library is used by default.
 *
 * @since TBD
 */
final class Presets_Controller extends Controller {

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
	 * The request parameter that carries a single preset slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRESET_PARAM = 'preset';

	/**
	 * The request parameter that carries a preset's human-readable label on a create.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LABEL_PARAM = 'label';

	/**
	 * The request parameter that carries a preset's property => alias-or-literal token map.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKENS_PARAM = 'tokens';

	/**
	 * The request parameter that carries the whole preset map on a replace (PUT).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRESETS_PARAM = 'presets';

	/**
	 * The request parameter that carries the default preset slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_PARAM = 'default';

	/**
	 * The request parameter that carries the token library slug a read/write targets.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LIBRARY_PARAM = 'library';

	/**
	 * The request parameter that carries the version the client last read, on the order sub-route.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VERSION_PARAM = 'version';

	/**
	 * The request parameter that carries the ordered list of preset slugs on an order write.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ORDER_PARAM = 'order';

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
	 * The single-preset path segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRESET_ROUTE = '(?P<' . self::PRESET_PARAM . '>[\w-]+)';

	/**
	 * The literal sub-route, relative to a block, that reads / sets the block's `$default`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_ROUTE = 'default';

	/**
	 * The literal sub-route, relative to a block, that sets / clears the block's stored preset
	 * display order. Registered before the single-preset route so the literal segment is not
	 * captured as a preset slug — the same trick DEFAULT_ROUTE relies on.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ORDER_ROUTE = 'order';

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
	 * Reads the effective (baseline-merged) presets section, so reads reflect writes.
	 *
	 * @since TBD
	 *
	 * @var Effective_Presets
	 */
	private Effective_Presets $presets;

	/**
	 * Declares which blocks accept presets. A block with no registered preset bindings is a 404.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Resolves the active token library when a request names none.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * Rewrites captured literal preset values into semantic aliases where one matches.
	 *
	 * @since TBD
	 *
	 * @var Preset_Value_Normalizer
	 */
	private Preset_Value_Normalizer $normalizer;

	/**
	 * Reads and writes the presetOrder per-block display-order map, applied at every read seam
	 * this controller serves.
	 *
	 * @since TBD
	 *
	 * @var Preset_Order_Index
	 */
	private Preset_Order_Index $order_index;

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
	 * @param Token_Store                $store       The sole gateway to the kb_design_tokens table.
	 * @param Mutator                    $mutator     Assembles the candidate overrides document.
	 * @param Token_Resolver             $resolver    Dry-runs a candidate's token layers before commit.
	 * @param Dtcg_Validator             $validator   Validates the DTCG grammar of a candidate document.
	 * @param Effective_Presets          $presets     Reads the baseline-merged presets section.
	 * @param Token_Registry             $registry    Declares which blocks accept presets.
	 * @param Active_Token_Library_Store $active      Resolves the active library when a request names none.
	 * @param Preset_Value_Normalizer    $normalizer  Rewrites captured literals into semantic aliases.
	 * @param Preset_Order_Index         $order_index Reads and writes the presetOrder display-order map.
	 */
	public function __construct(
		Token_Store $store,
		Mutator $mutator,
		Token_Resolver $resolver,
		Dtcg_Validator $validator,
		Effective_Presets $presets,
		Token_Registry $registry,
		Active_Token_Library_Store $active,
		Preset_Value_Normalizer $normalizer,
		Preset_Order_Index $order_index
	) {
		$this->store       = $store;
		$this->mutator     = $mutator;
		$this->resolver    = $resolver;
		$this->validator   = $validator;
		$this->presets     = $presets;
		$this->registry    = $registry;
		$this->active      = $active;
		$this->normalizer  = $normalizer;
		$this->order_index = $order_index;
		$this->rest_base   = 'presets';
	}

	/**
	 * Register the read and write routes for the presets resource.
	 *
	 * Verb semantics follow the WordPress REST convention: POST creates or merges a single preset, PUT
	 * replaces the block's whole preset collection, DELETE on a block resets it to baseline, and DELETE on a
	 * preset removes that one preset. The `$default` and the display order are each read/set through their
	 * own dedicated sub-route.
	 *
	 * The `default` and `order` sub-routes are registered before the single-preset route so their literal
	 * segments are not captured as a preset slug.
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
					// POST = create-or-merge a single preset, leaving siblings and $default intact.
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_create_params(),
				],
				[
					// PUT replaces the block's whole preset collection, dropping any preset absent from the body.
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
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE . '/' . self::ORDER_ROUTE,
			[
				[
					// PUT only: the endpoint replaces the block's whole display order, so there is no
					// partial-update verb to distinguish from PUT — the labels/order sub-route pattern.
					'methods'             => 'PUT',
					'callback'            => [ $this, 'set_order' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_order_params(),
				],
				[
					// DELETE uses the same capability as PUT — clearing a stored order is an update to
					// the document, not a resource removal, so the two verbs of one operation cannot
					// diverge on permission.
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_order' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_order_delete_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE . '/' . self::PRESET_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_preset' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_preset_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * List the blocks that accept presets, each with its default and named preset slugs.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$slug     = $this->slug( $request );
		$section  = $this->presets->section( $slug );
		$document = $this->stored_document( $slug );
		$blocks   = [];

		foreach ( array_keys( $this->registry->all_preset_bindings() ) as $block ) {
			$node = $this->set_node( $section, $block );

			$blocks[] = [
				'block'   => $block,
				'default' => $this->default_of( $node ),
				'names'   => $this->order_index->apply( $document, $block, $this->preset_names( $node ) ),
			];
		}

		return new WP_REST_Response( [ 'blocks' => $blocks ], WP_Http::OK );
	}

	/**
	 * Read a single block's effective preset collection.
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

		return new WP_REST_Response( $this->prepare_item( $block, $this->slug( $request ) ), WP_Http::OK );
	}

	/**
	 * Create or merge a single preset (POST /presets/{block}).
	 *
	 * The body carries the preset slug, an optional label and its property => value token map. The preset
	 * is deep-merged into the stored library, so sibling presets and the `$default` are left intact.
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

		$preset = Cast::to_string( $request->get_param( self::PRESET_PARAM ) );

		if ( $preset === '' ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'A preset slug is required.', 'kadence-blocks' ),
				[
					'status' => WP_Http::BAD_REQUEST,
					'block'  => $block,
				]
			);
		}

		$block_node = [ $preset => $this->preset_definition( $request ) ];

		$error = $this->guard_preset_shape( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_reserved_slugs( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_slot_arrays( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$slug       = $this->slug( $request );
		$block_node = $this->normalize_block_node( $block_node, $slug );
		$stored     = $this->stored_document( $slug );

		// The token map replaces wholesale rather than merging property by property: the client
		// (presetSaveTokens()) already carries every untouched property forward from what it read, so
		// the submitted map is already the complete desired set. A property-level merge on top would
		// let a stored property the client omitted — a value the user cleared — silently survive
		// instead of being removed, since an absent key in a merge partial means "leave alone," not
		// "delete." Gated on the RAW request param, not `$block_node`'s synthesized shape:
		// `preset_definition()` always sets a `tokens` key (defaulting to `[]`) even when the request
		// carries none, so checking the built node would wipe every stored token on a label-only rename.
		if ( $request->has_param( self::TOKENS_PARAM ) ) {
			$stored = $this->mutator->remove_by_keys(
				$stored,
				array_merge( $this->node_path( $block ), [ $preset, Extensions::get_tokens_key() ] )
			);
		}

		$candidate = $this->mutator->merge( $stored, $this->partial( $block, $block_node ) );

		$error = $this->guard_surface( $candidate, $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_aliases_resolve( $block_node, $block, $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * Replace a block's whole preset collection (PUT /presets/{block}).
	 *
	 * The stored presets for the block are dropped first, then the body's preset map (and optional
	 * default) is written, so a preset absent from the body no longer applies.
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

		$presets    = $request->get_param( self::PRESETS_PARAM );
		$block_node = is_array( $presets ) ? $presets : [];

		$default = Cast::to_string( $request->get_param( self::DEFAULT_PARAM ) );

		if ( $default !== '' ) {
			$block_node[ Extensions::get_default_key() ] = $default;
		}

		$error = $this->guard_preset_shape( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_reserved_slugs( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_slot_arrays( $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$slug       = $this->slug( $request );
		$block_node = $this->normalize_block_node( $block_node, $slug );

		// Replace, not merge: drop the stored block node first so a preset the body omits does not survive.
		$stored    = $this->unset_block( $this->stored_document( $slug ), $block );
		$candidate = $this->mutator->merge( $stored, $this->partial( $block, $block_node ) );

		$error = $this->guard_default_present( $candidate, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_surface( $candidate, $block_node, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$error = $this->guard_aliases_resolve( $block_node, $block, $slug );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * Reset a block's preset collection to baseline (DELETE /presets/{block}).
	 *
	 * Removes the whole stored `presets.<block>` node, so the block renders its baseline presets. A no-op
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

		$slug      = $this->slug( $request );
		$stored    = $this->stored_document( $slug );
		$candidate = $this->unset_block( $stored, $block );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $block, $slug ), WP_Http::OK );
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * Remove a single preset from a block (DELETE /presets/{block}/{preset}).
	 *
	 * Drops the stored override for that preset; a preset that also exists in the baseline reverts to its
	 * baseline definition. Idempotent: a no-op when nothing is stored for the preset. The `$default` is
	 * managed through the dedicated sub-route, so deleting "default" here is rejected; and removing a
	 * preset the effective library still defaults to is rejected (HTTP 422) before commit.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_preset( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$preset = Cast::to_string( $request->get_param( self::PRESET_PARAM ) );

		if ( $preset === self::DEFAULT_ROUTE ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'The default preset is managed through the default sub-route.', 'kadence-blocks' ),
				[
					'status' => WP_Http::BAD_REQUEST,
					'block'  => $block,
				]
			);
		}

		$slug      = $this->slug( $request );
		$stored    = $this->stored_document( $slug );
		$candidate = $this->unset_preset( $stored, $block, $preset );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $block, $slug ), WP_Http::OK );
		}

		$error = $this->guard_default_present( $candidate, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * Read a block's default preset slug (GET /presets/{block}/default).
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

		$node = $this->set_node( $this->presets->section( $this->slug( $request ) ), $block );

		return new WP_REST_Response(
			[
				'block'   => $block,
				'default' => $this->default_of( $node ),
			],
			WP_Http::OK
		);
	}

	/**
	 * Set a block's default preset slug (PUT /presets/{block}/default).
	 *
	 * The default must name a preset the effective library defines, otherwise the write is rejected (HTTP 422)
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

		$slug      = $this->slug( $request );
		$candidate = $this->mutator->merge(
			$this->stored_document( $slug ),
			$this->partial( $block, [ Extensions::get_default_key() => $default ] )
		);

		$error = $this->guard_default_present( $candidate, $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * Store a block's preset display order wholesale (PUT /presets/{block}/order).
	 *
	 * The submitted slugs are pruned to the block's effective preset names, first occurrence wins on
	 * duplicates — silent by design, mirroring the documents controller's token-order route: the stored
	 * order is advisory, and a client racing a preset deletion must not fail its whole reorder over one
	 * vanished slug. Pruning to an empty list clears the stored order entirely, so "no preference" has one
	 * spelling.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function set_order( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$slug  = $this->slug( $request );
		$error = $this->guard_client_version( $slug, Cast::to_string( $request->get_param( self::VERSION_PARAM ) ) );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$node  = $this->set_node( $this->presets->section( $slug ), $block );
		$names = $this->preset_names( $node );

		$submitted = array_map( [ Cast::class, 'to_string' ], (array) $request->get_param( self::ORDER_PARAM ) );
		$slugs     = array_values( array_unique( array_intersect( $submitted, $names ) ) );

		$stored    = $this->stored_document( $slug );
		$candidate = $slugs === []
			? $this->order_index->remove_block( $stored, $block )
			: $this->order_index->set_block( $stored, $block, $slugs );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $block, $slug ), WP_Http::OK );
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * Clear a block's stored preset display order (DELETE /presets/{block}/order), reverting it to merge
	 * order. Idempotent: a no-op when nothing is stored for the block.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_order( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$slug  = $this->slug( $request );
		$error = $this->guard_client_version( $slug, Cast::to_string( $request->get_param( self::VERSION_PARAM ) ) );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$stored    = $this->stored_document( $slug );
		$candidate = $this->order_index->remove_block( $stored, $block );

		if ( $candidate === $stored ) {
			return new WP_REST_Response( $this->prepare_item( $block, $slug ), WP_Http::OK );
		}

		return $this->validate_and_save( $candidate, $block, $slug );
	}

	/**
	 * The JSON Schema for a block's preset collection.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_item_schema(): array {
		if ( $this->item_schema !== null ) {
			return $this->add_additional_fields_schema( $this->item_schema );
		}

		$preset_schema = [
			'type'       => 'object',
			'properties' => [
				Extensions::get_label_key()  => [
					'description' => __( 'The preset\'s human-readable label.', 'kadence-blocks' ),
					'type'        => 'string',
				],
				Extensions::get_tokens_key() => [
					'description'          => __( 'The preset\'s property => value map: an alias or literal, a per-corner list, or a responsive envelope.', 'kadence-blocks' ),
					'type'                 => 'object',
					// A value is not always scalar. A dimension property can hold a per-corner list, or a
					// responsive envelope carrying its base value plus per-breakpoint overrides, so the
					// documented shape has to admit both — the write routes already accept them, and a
					// schema that says otherwise misleads anything generated from it.
					'additionalProperties' => [ 'type' => [ 'string', 'number', 'array', 'object' ] ],
				],
			],
		];

		$this->item_schema = [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => 'design-token-presets',
			'type'       => 'object',
			'properties' => [
				'block'       => [
					'description' => __( 'The block name the preset collection belongs to.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'slug'        => [
					'description' => __( 'The token library slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version'     => [
					'description' => __( 'The cache-busting version hash for the library, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'default'     => [
					'description' => __( 'The default preset slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
				],
				'userCreated' => [
					'description' => __( 'The preset slugs the library defines beyond the baseline. Deleting one removes it; deleting anything else at most reverts an override.', 'kadence-blocks' ),
					'type'        => 'array',
					'items'       => [ 'type' => 'string' ],
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'presets'     => [
					'description'          => __( 'The named presets, keyed by slug.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'additionalProperties' => $preset_schema,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}

	/**
	 * The query parameters accepted by the collection route.
	 *
	 * The list is scoped to a single token library via the optional `library` parameter, defaulting to the
	 * active library.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_collection_params(): array {
		return [
			self::LIBRARY_PARAM => $this->library_param(),
		];
	}

	/**
	 * Run the shared write pipeline against a candidate document, then commit it.
	 *
	 * Validates the DTCG grammar (HTTP 422 on failure), dry-runs the Resolver to reject alias cycles /
	 * dangling aliases in the token layers before commit (HTTP 422), then persists. An empty candidate
	 * clears the overrides, so the library renders from baseline, and needs no validation.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The full candidate overrides document to validate and store.
	 * @param string               $block     The block being written, for error context.
	 * @param string               $slug      The token library slug being written.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function validate_and_save( array $candidate, string $block, string $slug ) {
		// A brand-new library has no version yet; report 201 Created rather than 200 OK on first write.
		$status = $this->store->get_version( $slug ) !== '' ? WP_Http::OK : WP_Http::CREATED;

		if ( $candidate === [] ) {
			return $this->persist( '', $block, $status, $slug );
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

		// Guard the encode: a false return cast to "" would clear the whole library on persist instead of storing it.
		if ( $encoded === false ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token library could not be encoded.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'block'  => $block,
				]
			);
		}

		return $this->persist( $encoded, $block, $status, $slug );
	}

	/**
	 * Commit a raw document string to a library and build the response, mapping a write failure to 500.
	 *
	 * @since TBD
	 *
	 * @param string $document The raw overrides-only DTCG JSON (empty string clears the library).
	 * @param string $block    The block being written.
	 * @param int    $status   The success status code.
	 * @param string $slug     The token library slug being written.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function persist( string $document, string $block, int $status, string $slug ) {
		try {
			$this->store->save_document( $document, $slug );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token library could not be saved.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'block'  => $block,
				]
			);
		}

		return new WP_REST_Response( $this->prepare_item( $block, $slug ), $status );
	}

	/**
	 * Reject a request for a block that has no registered preset bindings.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return WP_Error|null A WP_Error when the block accepts no presets, null otherwise.
	 */
	private function guard_block( string $block ): ?WP_Error {
		if ( $this->registry->for_block( $block ) !== null ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_not_found',
			__( 'Sorry, that block does not accept presets.', 'kadence-blocks' ),
			[
				'status' => WP_Http::NOT_FOUND,
				'block'  => $block,
			]
		);
	}

	/**
	 * Client-conditional guard for the order sub-route: the stored version must equal what the client last
	 * read (both '' for a first write), mirroring the documents controller's identical guard for its own
	 * order route.
	 *
	 * @since TBD
	 *
	 * @param string $slug           The token library slug.
	 * @param string $client_version The version the client last read. Empty only for a first write.
	 *
	 * @return WP_Error|null
	 */
	private function guard_client_version( string $slug, string $client_version ): ?WP_Error {
		if ( $this->store->get_version( $slug ) === $client_version ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_conflict',
			__( 'The token library was modified since you last read it. Reload and try again.', 'kadence-blocks' ),
			[
				'status' => WP_Http::CONFLICT,
				'slug'   => $slug,
			]
		);
	}

	/**
	 * Reject a preset map whose entries are not well-formed: each named preset must have a non-empty
	 * slug and be an object, its label (when present) a string and its tokens (when present) an object. The
	 * alias-or-literal grammar of the token values is left to the DTCG validator.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $block_node The block's preset node being written.
	 * @param string               $block      The block name, for error context.
	 *
	 * @return WP_Error|null A WP_Error when a preset entry is malformed, null otherwise.
	 */
	private function guard_preset_shape( array $block_node, string $block ): ?WP_Error {
		foreach ( $block_node as $slug => $preset ) {
			// $default and any other "$"-prefixed metadata key is not a named preset.
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			// An empty slug would create a preset keyed by "" — a malformed node, the preset analogue of
			// the empty dot-path segment the documents controller rejects. Refuse it before it is stored.
			if ( (string) $slug === '' ) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'A preset slug cannot be empty.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'block'  => $block,
					]
				);
			}

			$label_key  = Extensions::get_label_key();
			$tokens_key = Extensions::get_tokens_key();

			if (
				! is_array( $preset )
				|| ( isset( $preset[ $label_key ] ) && ! is_string( $preset[ $label_key ] ) )
				|| ( isset( $preset[ $tokens_key ] ) && ! is_array( $preset[ $tokens_key ] ) )
			) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'Each preset must be an object with an optional string label and a token map.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'block'  => $block,
						'preset' => (string) $slug,
					]
				);
			}
		}

		return null;
	}

	/**
	 * Reject a preset whose slug is reserved. "default" is the literal used by the block's `/default`
	 * sub-route and by `delete_preset`, and "order" is the literal used by the block's `/order` sub-route, so
	 * a preset named either could never be deleted or set through its dedicated route; refuse to create one.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $block_node The block's preset node being written.
	 * @param string               $block      The block name, for error context.
	 *
	 * @return WP_Error|null A WP_Error when a reserved slug is used, null otherwise.
	 */
	private function guard_reserved_slugs( array $block_node, string $block ): ?WP_Error {
		$reserved = [ self::DEFAULT_ROUTE, self::ORDER_ROUTE ];

		foreach ( array_keys( $block_node ) as $slug ) {
			// $default and any other "$"-prefixed metadata key is not a named preset.
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			if ( in_array( (string) $slug, $reserved, true ) ) {
				return new WP_Error(
					'rest_design_tokens_reserved_slug',
					__( 'That preset slug is reserved.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'block'  => $block,
						'preset' => (string) $slug,
					]
				);
			}
		}

		return null;
	}

	/**
	 * Every value a preset token entry carries: its base, plus one entry per breakpoint override.
	 *
	 * A property that varies by breakpoint stores an envelope rather than a bare value, so a guard that
	 * inspected the raw entry would both miss the overrides and mistake the envelope itself for a slot
	 * list. Unwrapping here keeps each guard's own rule unchanged — it just runs over every value the
	 * entry actually contributes.
	 *
	 * @since TBD
	 *
	 * @param mixed $entry The preset token entry.
	 *
	 * @return array<int, mixed> The base value followed by each breakpoint override.
	 */
	private function preset_entry_values( $entry ): array {
		return array_merge(
			[ Extensions::preset_value_of( $entry ) ],
			array_values( Extensions::preset_responsive_of( $entry ) )
		);
	}

	/**
	 * Reject a per-corner slot list written to a property that is not a dimension.
	 *
	 * A slot list expresses the four sides of a measure control, so it is meaningful only where the bound
	 * property is a dimension — a four-slot color says nothing. The DTCG validator cannot make this call:
	 * it validates a preset token map by shape alone and never resolves the bound property's kind (the key
	 * it walks is a property name like "button-radius", not a token id). The registry does know, so the
	 * check lives here, alongside the other registry-aware guards.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $block_node The block's preset node being written.
	 * @param string               $block      The block name, for error context.
	 *
	 * @return WP_Error|null A WP_Error when a slot list sits on a non-dimension property, null otherwise.
	 */
	private function guard_slot_arrays( array $block_node, string $block ): ?WP_Error {
		$bindings = $this->registry->for_block( $block );

		// An unregistered block is guard_block()'s error to report; nothing to check here.
		if ( $bindings === null ) {
			return null;
		}

		$tokens_key = Extensions::get_tokens_key();

		foreach ( $block_node as $preset_slug => $preset ) {
			if ( is_string( $preset_slug ) && strpos( $preset_slug, '$' ) === 0 ) {
				continue;
			}

			$tokens = is_array( $preset ) && isset( $preset[ $tokens_key ] ) && is_array( $preset[ $tokens_key ] ) ? $preset[ $tokens_key ] : [];

			foreach ( $tokens as $property => $entry ) {
				if ( $bindings->kind( (string) $property ) === Preset_Bindings::get_kind_dimension() ) {
					$error = $this->guard_base_slot_gap( $entry, $block, (string) $preset_slug, (string) $property );

					if ( $error instanceof WP_Error ) {
						return $error;
					}

					$error = $this->guard_dimension_value_shape( $entry, $block, (string) $preset_slug, (string) $property );

					if ( $error instanceof WP_Error ) {
						return $error;
					}

					continue;
				}

				// Check the base and every breakpoint override. Each is unwrapped first, so what remains is
				// a scalar, an alias or a slot list — an array here is therefore a slot list, never the
				// responsive envelope (which is legal on any kind).
				foreach ( $this->preset_entry_values( $entry ) as $value ) {
					if ( ! is_array( $value ) ) {
						continue;
					}

					return new WP_Error(
						'rest_design_tokens_invalid',
						__( 'A per-corner value is only valid for a dimension property.', 'kadence-blocks' ),
						[
							'status'   => WP_Http::UNPROCESSABLE_ENTITY,
							'block'    => $block,
							'preset'   => (string) $preset_slug,
							'property' => (string) $property,
						]
					);
				}
			}
		}

		return null;
	}

	/**
	 * Reject a base per-corner value that leaves any corner unset.
	 *
	 * A base (desktop) value has no cascade above it to inherit from, so every corner must be fully set.
	 * The same empty-slot sentinel is legal inside a responsive-override breakpoint, where it means "this
	 * corner is not overridden here, keep inheriting" — this guard only inspects the base, read through
	 * {@see Extensions::preset_value_of()} so a responsive envelope's overrides are never mistaken for it.
	 *
	 * @since TBD
	 *
	 * @param mixed  $entry    The preset token entry.
	 * @param string $block    The block name, for error context.
	 * @param string $preset   The preset slug, for error context.
	 * @param string $property The property name, for error context.
	 *
	 * @return WP_Error|null A WP_Error when the base slot list carries a gap, null otherwise.
	 */
	private function guard_base_slot_gap( $entry, string $block, string $preset, string $property ): ?WP_Error {
		$base = Extensions::preset_value_of( $entry );

		if ( ! is_array( $base ) || ! in_array( '', $base, true ) ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_invalid',
			__( 'A per-corner base value must set every corner; a gap is only valid inside a responsive override.', 'kadence-blocks' ),
			[
				'status'   => WP_Http::UNPROCESSABLE_ENTITY,
				'block'    => $block,
				'preset'   => $preset,
				'property' => $property,
			]
		);
	}

	/**
	 * Reject a dimension property whose scalar-vs-per-corner shape is ambiguous or inconsistent.
	 *
	 * Two write-time invariants the projection layer relies on but nothing else enforces:
	 *
	 * - **A per-corner breakpoint override requires a per-corner base.** `Css_Builder` only composes the
	 *   canonical preset var out of `var()` references to four corner-specific vars when the BASE value is
	 *   itself a four-slot array; a scalar base emits the canonical var directly, with no corner vars for a
	 *   later `@media` block to hook into. A per-corner override sitting under a scalar base would redeclare
	 *   corner vars nothing reads — the media rule would have no visible effect.
	 * - **No scalar dimension literal may contain a space.** `Preset_Resolver::project()` joins a per-corner
	 *   slot list with a bare space, and `Css_Builder::slots_of()` tells a slot list apart from a scalar
	 *   literal purely by counting `explode( ' ', $value )`'s parts. A scalar literal like `"8px 4px 8px
	 *   4px"` would count as four parts and be misread as a genuine four-corner list, corrupting a value
	 *   that was only ever meant to be one opaque literal.
	 *
	 * @since TBD
	 *
	 * @param mixed  $entry    The preset token entry.
	 * @param string $block    The block name, for error context.
	 * @param string $preset   The preset slug, for error context.
	 * @param string $property The property name, for error context.
	 *
	 * @return WP_Error|null A WP_Error when either invariant is violated, null otherwise.
	 */
	private function guard_dimension_value_shape( $entry, string $block, string $preset, string $property ): ?WP_Error {
		$base          = Extensions::preset_value_of( $entry );
		$base_is_slots = is_array( $base );

		foreach ( $this->preset_entry_values( $entry ) as $value ) {
			if ( is_string( $value ) && strpos( $value, ' ' ) !== false ) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'A dimension value must not contain a space; compound literals (e.g. calc(), clamp()) are not supported.', 'kadence-blocks' ),
					[
						'status'   => WP_Http::UNPROCESSABLE_ENTITY,
						'block'    => $block,
						'preset'   => $preset,
						'property' => $property,
					]
				);
			}

			if ( is_array( $value ) && ! $base_is_slots ) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'A per-corner responsive override requires a per-corner base value for the same property.', 'kadence-blocks' ),
					[
						'status'   => WP_Http::UNPROCESSABLE_ENTITY,
						'block'    => $block,
						'preset'   => $preset,
						'property' => $property,
					]
				);
			}
		}

		return null;
	}

	/**
	 * Reject a candidate whose effective `$default` does not name a present preset.
	 *
	 * Evaluated against the post-merge effective library (baseline merged with the candidate), so a default that
	 * resolves to a baseline preset is accepted and one left dangling by a removal is rejected.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The candidate overrides document.
	 * @param string               $block     The block name.
	 *
	 * @return WP_Error|null A WP_Error when the default is dangling, null otherwise.
	 */
	private function guard_default_present( array $candidate, string $block ): ?WP_Error {
		$node    = $this->set_node( $this->presets->for_overrides( $candidate ), $block );
		$default = $this->default_of( $node );

		if ( $default === '' || in_array( $default, $this->preset_names( $node ), true ) ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_invalid',
			__( 'The default preset must name an existing preset.', 'kadence-blocks' ),
			[
				'status'  => WP_Http::UNPROCESSABLE_ENTITY,
				'block'   => $block,
				'default' => $default,
			]
		);
	}

	/**
	 * Reject a written preset that sets a property the block does not bind.
	 *
	 * A preset may define any subset of the block's bound surface — different presets may define
	 * different subsets, and a property a preset omits is inherited from the block `$default` through the
	 * cascade — so an incomplete surface is allowed. But a property with no binding (unbound) is still
	 * rejected: it could never project. Only the presets carried by the request are checked, each against
	 * its post-merge token library, so a partial edit is validated while the baseline presets are left alone.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate  The post-merge candidate overrides document.
	 * @param array<string, mixed> $block_node The block's preset node from the request.
	 * @param string               $block      The block name.
	 *
	 * @return WP_Error|null A WP_Error when a written preset sets an unbound property, null otherwise.
	 */
	private function guard_surface( array $candidate, array $block_node, string $block ): ?WP_Error {
		$bindings = $this->registry->for_block( $block );

		if ( $bindings === null ) {
			return null;
		}

		$effective  = $this->set_node( $this->presets->for_overrides( $candidate ), $block );
		$tokens_key = Extensions::get_tokens_key();

		foreach ( array_keys( $block_node ) as $slug ) {
			// $default and any other "$"-prefixed metadata key is not a named preset with a surface.
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			$preset = isset( $effective[ $slug ] ) && is_array( $effective[ $slug ] ) ? $effective[ $slug ] : [];
			$tokens = isset( $preset[ $tokens_key ] ) && is_array( $preset[ $tokens_key ] ) ? $preset[ $tokens_key ] : [];
			$report = $bindings->consistency( array_keys( $tokens ) );

			if ( $report['unbound'] !== [] ) {
				return new WP_Error(
					'rest_design_tokens_unbound_property',
					__( 'A preset can only set properties the block binds.', 'kadence-blocks' ),
					[
						'status'     => WP_Http::UNPROCESSABLE_ENTITY,
						'block'      => $block,
						'preset'     => (string) $slug,
						'properties' => $report['unbound'],
					]
				);
			}
		}

		return null;
	}

	/**
	 * Rewrite each named preset's captured literal values into semantic aliases where one matches the
	 * library, so a value captured off a block instance re-joins the theming cascade rather than freezing
	 * as a literal.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $block_node The block's preset node from the request.
	 * @param string               $slug       The token library the values are matched against.
	 *
	 * @return array<string, mixed> The preset node with literals aliased where a semantic matches.
	 */
	private function normalize_block_node( array $block_node, string $slug ): array {
		$tokens_key = Extensions::get_tokens_key();

		foreach ( $block_node as $preset_slug => $preset ) {
			// $default and any other "$"-prefixed metadata key carries no token map to normalize.
			if ( is_string( $preset_slug ) && strpos( $preset_slug, '$' ) === 0 ) {
				continue;
			}

			if ( ! is_array( $preset ) || ! isset( $preset[ $tokens_key ] ) || ! is_array( $preset[ $tokens_key ] ) ) {
				continue;
			}

			$preset[ $tokens_key ]      = $this->normalizer->normalize( $preset[ $tokens_key ], $slug );
			$block_node[ $preset_slug ] = $preset;
		}

		return $block_node;
	}

	/**
	 * Reject a written preset whose token map carries an alias that does not resolve in the target library.
	 *
	 * Preset token values live under `$extensions`, which the Resolver's dry-run (which walks only the token
	 * layers) never sees, so a dangling preset alias would otherwise slip past validation and fail silently
	 * at projection. Normalizer-minted aliases resolve by construction; this only catches a hand-supplied or
	 * stale alias. Only the aliases the request carries are checked.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $block_node The block's preset node from the request.
	 * @param string               $block      The block name, for error context.
	 * @param string               $slug       The token library the aliases resolve against.
	 *
	 * @return WP_Error|null A WP_Error when an alias does not resolve, null otherwise.
	 */
	private function guard_aliases_resolve( array $block_node, string $block, string $slug ): ?WP_Error {
		$resolved   = $this->resolver->resolve( $slug );
		$tokens_key = Extensions::get_tokens_key();

		foreach ( $block_node as $preset_slug => $preset ) {
			if ( is_string( $preset_slug ) && strpos( $preset_slug, '$' ) === 0 ) {
				continue;
			}

			$tokens = is_array( $preset ) && isset( $preset[ $tokens_key ] ) && is_array( $preset[ $tokens_key ] ) ? $preset[ $tokens_key ] : [];

			foreach ( $tokens as $property => $entry ) {
				// Flatten the entry to every value it carries — its base, each breakpoint override, and each
				// corner of any slot list among them — so a dangling alias anywhere is caught on write rather
				// than silently dropping its property (or breakpoint) at projection.
				$candidates = [];

				foreach ( $this->preset_entry_values( $entry ) as $value ) {
					$candidates = array_merge( $candidates, is_array( $value ) ? array_values( $value ) : [ $value ] );
				}

				foreach ( $candidates as $candidate ) {
					if ( ! Alias::is_alias( $candidate ) || $resolved->value( Alias::path_of( $candidate ) ) !== null ) {
						continue;
					}

					return new WP_Error(
						'rest_design_tokens_unresolvable',
						__( 'A preset alias does not resolve to a token.', 'kadence-blocks' ),
						[
							'status'   => WP_Http::UNPROCESSABLE_ENTITY,
							'block'    => $block,
							'preset'   => (string) $preset_slug,
							'property' => (string) $property,
							'alias'    => $candidate,
						]
					);
				}
			}
		}

		return null;
	}

	/**
	 * Build the response payload for a block's preset collection, read from the effective (baseline-merged) presets.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token library slug being read.
	 *
	 * @return array<string, mixed> The item payload, including the `userCreated` preset slugs (those
	 *                              the library defines beyond the baseline).
	 */
	private function prepare_item( string $block, string $slug ): array {
		$node    = $this->set_node( $this->presets->section( $slug ), $block );
		$ordered = $this->order_index->apply( $this->stored_document( $slug ), $block, $this->preset_names( $node ) );

		return [
			'block'       => $block,
			'slug'        => $slug,
			'version'     => $this->store->get_version( $slug ),
			'default'     => $this->default_of( $node ),
			'userCreated' => $this->presets->user_created( $block, $slug ),
			'presets'     => $this->ordered_presets( $this->named_presets( $node ), $ordered ),
		];
	}

	/**
	 * Reorder a slug => preset map to a given slug order. A slug the map does not carry (a stale ordered id
	 * that has since been removed) is skipped rather than inserted as a hole.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $presets The named presets, keyed by slug.
	 * @param string[]             $order   The desired slug order.
	 *
	 * @return array<string, mixed>
	 */
	private function ordered_presets( array $presets, array $order ): array {
		$ordered = [];

		foreach ( $order as $slug ) {
			if ( array_key_exists( $slug, $presets ) ) {
				$ordered[ $slug ] = $presets[ $slug ];
			}
		}

		return $ordered;
	}

	/**
	 * Assemble the preset definition for a create from the request: an optional label plus the token map.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return array<string, mixed>
	 */
	private function preset_definition( WP_REST_Request $request ): array {
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
	 * Build a partial overrides document carrying only the given preset node for one block's preset bindings.
	 *
	 * @since TBD
	 *
	 * @param string               $block      The block name.
	 * @param array<string, mixed> $block_node The block's preset node.
	 *
	 * @return array<string, mixed>
	 */
	private function partial( string $block, array $block_node ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_presets() => [
						$block => $block_node,
					],
				],
			],
		];
	}

	/**
	 * Remove the stored preset-collection node (`presets.<block>`), pruning any ancestor emptied by the removal.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The stored overrides document.
	 * @param string               $block    The block name.
	 *
	 * @return array<string, mixed>
	 */
	private function unset_block( array $document, string $block ): array {
		return $this->mutator->remove_by_keys( $document, $this->node_path( $block ) );
	}

	/**
	 * Remove one stored preset (`presets.<block>.<preset>`), pruning any ancestor emptied by the removal.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The stored overrides document.
	 * @param string               $block    The block name.
	 * @param string               $preset  The preset slug.
	 *
	 * @return array<string, mixed>
	 */
	private function unset_preset( array $document, string $block, string $preset ): array {
		return $this->mutator->remove_by_keys( $document, array_merge( $this->node_path( $block ), [ $preset ] ) );
	}

	/**
	 * The literal key path to the presets section.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function presets_path(): array {
		return Extensions::get_presets_path();
	}

	/**
	 * The document key-path to a block's preset node: `presets.<block>`.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return string[]
	 */
	private function node_path( string $block ): array {
		return array_merge( $this->presets_path(), [ $block ] );
	}

	/**
	 * The preset-bearing node for a block within a presets section — its `{ $default, <preset> }` map — or
	 * an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section The presets section.
	 * @param string               $block   The block name.
	 *
	 * @return array<string, mixed>
	 */
	private function set_node( array $section, string $block ): array {
		return isset( $section[ $block ] ) && is_array( $section[ $block ] ) ? $section[ $block ] : [];
	}

	/**
	 * The `$default` slug of a preset node, or an empty string when none is set.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's preset node.
	 *
	 * @return string
	 */
	private function default_of( array $node ): string {
		return Cast::to_string( $node[ Extensions::get_default_key() ] ?? '' );
	}

	/**
	 * The named preset slugs of a preset node, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's preset node.
	 *
	 * @return string[]
	 */
	private function preset_names( array $node ): array {
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
	 * The named presets of a preset node, keyed by slug, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's preset node.
	 *
	 * @return array<string, mixed>
	 */
	private function named_presets( array $node ): array {
		$presets = [];

		foreach ( $node as $slug => $preset ) {
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			$presets[ (string) $slug ] = $preset;
		}

		return $presets;
	}

	/**
	 * Decode the stored overrides-only document for a library.
	 *
	 * Reuses the reader's single decode seam ({@see Effective_Presets::raw()}) so the controller does not
	 * decode the store itself.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed> The decoded document, empty when absent or unreadable.
	 */
	private function stored_document( string $slug ): array {
		return $this->presets->raw( $slug );
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
	 * The token library a request targets: the `library` parameter when it names a known library, otherwise
	 * the active library. An unknown or absent `library` falls back rather than 404ing, so a stale editor
	 * pointer degrades to the active library instead of failing the write.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return string
	 */
	private function slug( WP_REST_Request $request ): string {
		$library = Cast::to_string( $request->get_param( self::LIBRARY_PARAM ) );

		if ( $library !== '' && $this->is_known_library( $library ) ) {
			return $library;
		}

		return $this->active->get();
	}

	/**
	 * Whether a slug names a library that exists. The default library is always known even before it has a
	 * stored row, mirroring the documents controller.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return bool
	 */
	private function is_known_library( string $slug ): bool {
		return $slug === Token_Store::default_slug() || $this->store->exists( $slug );
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
			self::LIBRARY_PARAM    => $this->library_param(),
		];
	}

	/**
	 * The optional token-library argument shared by every route: names the library a read/write targets,
	 * defaulting to the active library when absent or unknown.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function library_param(): array {
		return [
			'description'       => __( 'Optional token library slug to target; defaults to the active library.', 'kadence-blocks' ),
			'type'              => 'string',
			'required'          => false,
			'pattern'           => '^[\w-]+$',
			'sanitize_callback' => 'sanitize_key',
		];
	}

	/**
	 * The arguments accepted by the single-preset route: the block segments plus the preset slug.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_preset_params(): array {
		return array_merge(
			$this->get_block_params(),
			[
				self::PRESET_PARAM => [
					'description'       => __( 'The preset slug.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
			]
		);
	}

	/**
	 * The arguments accepted by the create route: the block segments plus a preset slug, optional label and
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
				self::PRESET_PARAM => [
					'description'       => __( 'The preset slug to create or merge.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
				self::LABEL_PARAM  => [
					'description'       => __( 'Optional human-readable label for the preset.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
				],
				self::TOKENS_PARAM => [
					'description'          => __( 'The preset\'s property => alias-or-literal token map.', 'kadence-blocks' ),
					'type'                 => 'object',
					'required'             => false,
					'additionalProperties' => true,
				],
			]
		);
	}

	/**
	 * The arguments accepted by the replace route: the block segments plus the whole preset map and an
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
				self::PRESETS_PARAM => [
					'description'          => __( 'The presets to store, keyed by slug.', 'kadence-blocks' ),
					'type'                 => 'object',
					'required'             => true,
					'additionalProperties' => true,
				],
				self::DEFAULT_PARAM => [
					'description'       => __( 'Optional default preset slug.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_key',
				],
			]
		);
	}

	/**
	 * The arguments accepted by the set-default route: the block segments plus the default preset slug.
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
					'description'       => __( 'The default preset slug.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w-]+$',
					'sanitize_callback' => 'sanitize_key',
				],
			]
		);
	}

	/**
	 * The arguments accepted by the order-route PUT: the block segments, the ordered slug list and the
	 * version-conditional guard.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_order_params(): array {
		return array_merge(
			$this->get_order_delete_params(),
			[
				self::ORDER_PARAM => [
					'description'          => __( 'The preset slugs in their new display order.', 'kadence-blocks' ),
					'type'                 => 'array',
					'required'             => true,
					'items'                => [ 'type' => 'string' ],
					'additionalProperties' => false,
				],
			]
		);
	}

	/**
	 * The arguments accepted by the order-route DELETE: the block segments plus the version-conditional guard.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_order_delete_params(): array {
		return array_merge(
			$this->get_block_params(),
			[
				self::VERSION_PARAM => [
					'description'       => __( 'The version the client last read; empty for a first write. A mismatch is rejected with HTTP 409.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				],
			]
		);
	}
}
